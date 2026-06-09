const Action = require("../models/Action");
const User = require("../models/User");
const achievementService = require("../services/achievementService");
const axios = require("axios");
const labelToCategoryMap = require("../data/materialMapping");

const barcodeDB = {
  7897322709376: { itemType: "Plástico", description: "Produto Teste Scanner" },
  7894900011517: {
    itemType: "Metal",
    description: "Lata de Refrigerante 350ml",
  },
  7891010902105: { itemType: "Plástico", description: "Garrafa de Água 500ml" },
};

const actionController = {
  async registerScan(req, res) {
    try {
      const { itemType, description } = req.body;

      if (!itemType) {
        return res
          .status(400)
          .json({ message: "O tipo de item é obrigatório." });
      }

      let pointsEarned = 0;
      switch (itemType) {
        case "Plástico":
          pointsEarned = 10;
          break;
        case "Papel":
          pointsEarned = 5;
          break;
        case "Vidro":
          pointsEarned = 15;
          break;
        case "Metal":
          pointsEarned = 20;
          break;
        case "Eletrônico":
          pointsEarned = 50;
          break;
        case "Orgânico":
          pointsEarned = 5;
          break;
        default:
          pointsEarned = 2;
          break;
      }

      const action = await Action.create({
        user: req.user._id,
        itemType,
        pointsEarned,
        description: description || `Reciclagem de ${itemType}`,
      });

      const user = await User.findById(req.user._id);

      user.points += pointsEarned;
      user.xp += pointsEarned;

      let levelUpMessage = null;
      const xpNeededForNextLevel = user.level * 100;

      if (user.xp >= xpNeededForNextLevel) {
        user.level += 1;
        user.xp = user.xp - xpNeededForNextLevel;
        levelUpMessage = `Parabéns! Você alcançou o Nível ${user.level}!`;
      }

      await user.save();

      const unlockedAchievements = await achievementService.checkAchievements(
        req.user._id,
        itemType,
        user.points,
        user.level,
      );

      res.status(201).json({
        message: "Ação registrada com sucesso!",
        pointsEarned,
        levelUpMessage,
        newlyUnlockedAchievements: unlockedAchievements,
        userProgress: {
          points: user.points,
          level: user.level,
          xp: user.xp,
          nextLevelXp: user.level * 100,
        },
        action,
      });
    } catch (error) {
      console.error("Erro ao registrar ação:", error);
      res
        .status(500)
        .json({ message: "Erro interno no servidor ao registrar a ação." });
    }
  },

  async registerBarcodeScan(req, res) {
    try {
      const { barcode } = req.body;

      if (!barcode) {
        return res
          .status(400)
          .json({ message: "O código de barras é obrigatório." });
      }

      const product = barcodeDB[barcode];

      if (!product) {
        return res
          .status(404)
          .json({ message: "Produto não encontrado em nossa base de dados." });
      }

      const { itemType, description } = product;

      let pointsEarned = 0;
      switch (itemType) {
        case "Plástico":
          pointsEarned = 10;
          break;
        case "Papel":
          pointsEarned = 5;
          break;
        case "Vidro":
          pointsEarned = 15;
          break;
        case "Metal":
          pointsEarned = 20;
          break;
        case "Eletrônico":
          pointsEarned = 50;
          break;
        case "Orgânico":
          pointsEarned = 5;
          break;
        default:
          pointsEarned = 2;
          break;
      }

      const action = await Action.create({
        user: req.user._id,
        itemType,
        pointsEarned,
        description,
      });

      const user = await User.findById(req.user._id);
      user.points += pointsEarned;
      user.xp += pointsEarned;

      let levelUpMessage = null;
      const xpNeededForNextLevel = user.level * 100;

      if (user.xp >= xpNeededForNextLevel) {
        user.level += 1;
        user.xp = user.xp - xpNeededForNextLevel;
        levelUpMessage = `Parabéns! Você alcançou o Nível ${user.level}!`;
      }

      await user.save();

      const unlockedAchievements = await achievementService.checkAchievements(
        req.user._id,
        itemType,
        user.points,
        user.level,
      );

      res.status(200).json({
        message: "Código lido com sucesso!",
        item: description,
        pointsEarned,
        levelUpMessage,
        newlyUnlockedAchievements: unlockedAchievements,
        userProgress: {
          points: user.points,
          level: user.level,
        },
      });
    } catch (error) {
      console.error("Erro ao processar código de barras:", error);
      res
        .status(500)
        .json({ message: "Erro interno ao processar o código de barras." });
    }
  },

  async registerImageScan(req, res) {
    try {
      let { imageBase64 } = req.body;

      if (!imageBase64) {
        return res.status(400).json({ message: "A imagem é obrigatória." });
      }

      if (imageBase64.includes("base64,")) {
        imageBase64 = imageBase64.split("base64,")[1];
      }

      const hfApiKey = process.env.HUGGINGFACE_API_KEY;
      if (!hfApiKey) {
        return res
          .status(500)
          .json({
            message: "Chave do Hugging Face não configurada no servidor.",
          });
      }

      const imageBuffer = Buffer.from(imageBase64, "base64");

      const hfResponse = await axios.post(
        "https://api-inference.huggingface.co/models/google/vit-base-patch16-224",
        imageBuffer,
        {
          headers: {
            Authorization: `Bearer ${hfApiKey}`,
            "Content-Type": "application/octet-stream",
          },
        },
      );

      const predictions = hfResponse.data;

      let detectedItemType = null;
      let detectedLabelName = "Item desconhecido";

      for (let i = 0; i < Math.min(3, predictions.length); i++) {
        const possibleLabels = predictions[i].label.toLowerCase().split(", ");

        for (const label of possibleLabels) {
          if (labelToCategoryMap[label]) {
            detectedItemType = labelToCategoryMap[label];
            detectedLabelName = predictions[i].label;
            break;
          }
        }
        if (detectedItemType) break;
      }

      if (!detectedItemType) {
        return res.status(400).json({
          message:
            "Não conseguimos classificar este objeto como um resíduo conhecido. Tente tirar a foto com o objeto mais centralizado.",
        });
      }

      let pointsEarned = 0;
      switch (detectedItemType) {
        case "Plástico":
          pointsEarned = 10;
          break;
        case "Papel":
          pointsEarned = 5;
          break;
        case "Vidro":
          pointsEarned = 15;
          break;
        case "Metal":
          pointsEarned = 20;
          break;
        case "Eletrônico":
          pointsEarned = 50;
          break;
        case "Orgânico":
          pointsEarned = 5;
          break;
        default:
          pointsEarned = 2;
          break;
      }

      const description = `Identificado por IA: ${detectedItemType} (${detectedLabelName})`;

      const action = await Action.create({
        user: req.user._id,
        itemType: detectedItemType,
        pointsEarned,
        description,
      });

      const user = await User.findById(req.user._id);
      user.points += pointsEarned;
      user.xp += pointsEarned;

      let levelUpMessage = null;
      const xpNeededForNextLevel = user.level * 100;

      if (user.xp >= xpNeededForNextLevel) {
        user.level += 1;
        user.xp = user.xp - xpNeededForNextLevel;
        levelUpMessage = `Parabéns! Você alcançou o Nível ${user.level}!`;
      }

      await user.save();

      const unlockedAchievements = await achievementService.checkAchievements(
        req.user._id,
        detectedItemType,
        user.points,
        user.level,
      );

      res.status(200).json({
        message: "Imagem analisada e validada com sucesso!",
        itemType: detectedItemType,
        detectedObject: detectedLabelName,
        pointsEarned,
        levelUpMessage,
        newlyUnlockedAchievements: unlockedAchievements,
        userProgress: {
          points: user.points,
          level: user.level,
        },
      });
    } catch (error) {
      console.error(
        "Erro ao processar imagem na IA:",
        error.response?.data || error.message,
      );

      if (error.response?.data?.error?.includes("currently loading")) {
        return res.status(503).json({
          message:
            "A Inteligência Artificial está inicializando (servidor gratuito). Tente escanear novamente em 15 segundos.",
        });
      }

      res
        .status(500)
        .json({
          message: "Erro interno ao conectar com a Inteligência Artificial.",
        });
    }
  },

  async getHistory(req, res) {
    try {
      const history = await Action.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(50);

      res.json(history);
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
      res
        .status(500)
        .json({ message: "Erro interno ao buscar histórico de ações." });
    }
  },
};

module.exports = actionController;
