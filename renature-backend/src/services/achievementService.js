const Action = require("../models/Action");
const Achievement = require("../models/Achievement");
const User = require("../models/User");

const achievementService = {
  async checkAchievements(userId, itemType, currentPoints, currentLevel) {
    try {
      const user = await User.findById(userId).populate("unlockedAchievements");

      const alreadyUnlockedCodes = user.unlockedAchievements.map(
        (ach) => ach.code,
      );

      const newlyUnlockedCodes = [];

      const award = (code) => {
        if (
          !alreadyUnlockedCodes.includes(code) &&
          !newlyUnlockedCodes.includes(code)
        ) {
          newlyUnlockedCodes.push(code);
        }
      };

      const totalActions = await Action.countDocuments({ user: userId });
      const materialActions = await Action.countDocuments({
        user: userId,
        itemType: itemType,
      });

      if (totalActions >= 1) award("PRIMEIRA_RECICLAGEM");
      if (totalActions >= 10) award("RECICLADOR_INICIANTE");
      if (totalActions >= 50) award("RECICLADOR_DEDICADO");
      if (totalActions >= 100) award("MESTRE_RECICLAGEM");

      if (currentPoints >= 100) award("PRIMEIROS_PONTOS");
      if (currentPoints >= 1000) award("ESPECIALISTA_SUSTENTAVEL");
      if (currentLevel >= 5) award("NIVEL_5");

      const materialPrefixMap = {
        Plástico: "PLASTICO",
        Vidro: "VIDRO",
        Metal: "METAL",
        Papel: "PAPEL",
        Orgânico: "ORGANICO",
        Eletrônico: "ELETRONICO",
      };

      const prefix = materialPrefixMap[itemType];
      if (prefix) {
        if (materialActions >= 5) award(`${prefix}_5`);
        if (materialActions >= 20) award(`${prefix}_20`);
        if (materialActions >= 100) award(`${prefix}_100`);
      }

      if (newlyUnlockedCodes.length === 0) {
        return [];
      }

      const newAchievements = await Achievement.find({
        code: { $in: newlyUnlockedCodes },
      });

      newAchievements.forEach((ach) => {
        user.unlockedAchievements.push(ach._id);
      });

      await user.save();

      return newAchievements;
    } catch (error) {
      console.error("Erro no motor de conquistas:", error);
      return [];
    }
  },
};

module.exports = achievementService;
