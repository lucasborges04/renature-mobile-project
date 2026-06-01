const User = require("../models/User");

const userController = {
  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user._id).select("-password");

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
};

module.exports = userController;
