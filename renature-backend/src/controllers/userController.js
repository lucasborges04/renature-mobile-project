const User = require("../models/User");

const userController = {
  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user._id)
        .select("-password")
        .populate("unlockedAchievements");

      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "Usuário não encontrado" });
      }
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
      res.status(500).json({ message: "Erro interno no servidor." });
    }
  },

  async getRanking(req, res) {
    try {
      const top10 = await User.find()
        .sort({ points: -1 })
        .limit(10)
        .select("name points level avatar xp");

      const currentUser = await User.findById(req.user._id);
      const usersAhead = await User.countDocuments({
        points: { $gt: currentUser.points },
      });

      const userPosition = usersAhead + 1;

      res.json({
        top10: top10,
        currentUserInfo: {
          position: userPosition,
          name: currentUser.name,
          points: currentUser.points,
          level: currentUser.level,
          avatar: currentUser.avatar,
        },
      });
    } catch (error) {
      console.error("Erro ao buscar ranking:", error);
      res.status(500).json({ message: "Erro interno ao buscar o ranking." });
    }
  },
};

module.exports = userController;
