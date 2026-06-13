const Action = require("../models/Action");
const User = require("../models/User");
const achievementService = require("../services/achievementService");
const axios = require("axios");

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

      const apiResponse = await axios.get(
        `https://br.openfoodfacts.org/api/v0/product/${barcode}.json`,
      );

      if (apiResponse.data.status !== 1) {
        return res.status(404).json({
          message:
            "Produto não encontrado nas bases globais. Tente registrar por imagem ou manualmente.",
        });
      }

      const productInfo = apiResponse.data.product;
      const productName = productInfo.product_name || "Produto Genérico";
      const packaging = (productInfo.packaging || "").toLowerCase();

      const description = `${productName}`;

      let itemType = "Plástico";
      const searchString = `${packaging} ${productName.toLowerCase()}`;

      if (
        searchString.includes("lata") ||
        searchString.includes("metal") ||
        searchString.includes("alumínio")
      ) {
        itemType = "Metal";
      } else if (
        searchString.includes("vidro") ||
        searchString.includes("glass")
      ) {
        itemType = "Vidro";
      } else if (
        searchString.includes("papel") ||
        searchString.includes("caixa") ||
        searchString.includes("cartão") ||
        searchString.includes("tetrapak")
      ) {
        itemType = "Papel";
      } else if (
        searchString.includes("eletrônico") ||
        searchString.includes("pilha")
      ) {
        itemType = "Eletrônico";
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
        material: itemType,
      });
    } catch (error) {
      console.error("Erro ao processar código de barras externo:", error);
      res.status(500).json({
        message: "Erro interno ao consultar o código de barras na base global.",
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
