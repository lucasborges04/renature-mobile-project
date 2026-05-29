const User = require("../models/User");

const authController = {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // 2. Validação Básica
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Preencha todos os campos." });
      }

      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "Este email já está em uso." });
      }

      const user = await User.create({
        name,
        email,
        password,
      });

      res.status(201).json({
        message: "Usuário cadastrado com sucesso!",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          points: user.points,
          level: user.level,
        },
      });
    } catch (error) {
      console.error("Erro no cadastro:", error);
      res.status(500).json({ message: "Erro interno no servidor." });
    }
  },
};

module.exports = authController;
