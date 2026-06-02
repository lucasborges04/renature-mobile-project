const Action = require("../models/Action");
const User = require("../models/User");
const achievementService = require("../services/achievementService");

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
