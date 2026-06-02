const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const authController = {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

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
        token: generateToken(user._id),
      });
    } catch (error) {
      console.error("Erro no cadastro:", error);
      res.status(500).json({ message: "Erro interno no servidor." });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Preencha email e senha." });
      }

      const user = await User.findOne({ email });

      if (user && (await user.matchPassword(password))) {
        res.json({
          message: "Login realizado com sucesso!",
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            points: user.points,
            level: user.level,
            avatar: user.avatar,
          },
          token: generateToken(user._id),
        });
      } else {
        res.status(401).json({ message: "Email ou senha inválidos." });
      }
    } catch (error) {
      console.error("Erro no login:", error);
      res.status(500).json({ message: "Erro interno no servidor." });
    }
  },

  async googleLogin(req, res) {
    try {
      const { idToken } = req.body;

      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const { name, email, picture } = ticket.getPayload();

      let user = await User.findOne({ email });

      if (!user) {
        user = await User.create({
          name,
          email,
          avatar: picture,
          authProvider: "google",
        });
      }

      res.json({
        message: "Login com Google realizado com sucesso!",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          points: user.points,
          level: user.level,
          avatar: user.avatar,
        },
        token: generateToken(user._id),
      });
    } catch (error) {
      console.error("Erro no login com Google:", error);
      res
        .status(401)
        .json({ message: "Token do Google inválido ou expirado." });
    }
  },
};

module.exports = authController;
