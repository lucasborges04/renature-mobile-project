const User = require("../models/User");
const Achievement = require("../models/Achievement");
const sendEmail = require("../services/sendEmail");
const bcrypt = require("bcrypt");

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

  async updateProfile(req, res) {
    try {
      const { name, email } = req.body;
      const userId = req.user._id;

      if (!name || !email) {
        return res
          .status(400)
          .json({ message: "Nome e e-mail são obrigatórios." });
      }

      const emailExists = await User.findOne({ email, _id: { $ne: userId } });
      if (emailExists) {
        return res
          .status(400)
          .json({ message: "Este e-mail já está em uso por outro usuário." });
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, email },
        { new: true, runValidators: true },
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      res.json(updatedUser);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      res.status(500).json({ message: "Erro interno no servidor." });
    }
  },

  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          message: "A senha atual e a nova senha são obrigatórias.",
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          message: "A nova senha deve ter pelo menos 8 caracteres.",
        });
      }

      const user = await User.findById(req.user._id).select("+password");

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "A senha atual está incorreta." });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await User.updateOne(
        { _id: req.user._id },
        { $set: { password: hashedPassword } },
      );

      res.status(200).json({ message: "Senha atualizada com sucesso!" });
    } catch (error) {
      console.error("Erro ao trocar senha:", error);
      res.status(500).json({ message: "Erro interno ao atualizar a senha." });
    }
  },

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "O e-mail é obrigatório." });
      }

      const user = await User.findOne({ email: email.toLowerCase().trim() });

      if (!user) {
        return res
          .status(200)
          .json({
            message: "Se o e-mail existir no sistema, um código foi enviado.",
          });
      }

      const pinCode = Math.floor(100000 + Math.random() * 900000).toString();

      const expireDate = new Date(Date.now() + 15 * 60 * 1000);

      user.resetPasswordToken = pinCode;
      user.resetPasswordExpire = expireDate;
      await user.save();

      const messageText = `Olá, ${user.name}.\n\nVocê solicitou a redefinição de senha para a sua conta no Renature App.\n\nSeu código de verificação é: ${pinCode}\n\nEste código é válido por 15 minutos. Se não solicitou esta alteração, ignore este e-mail.`;

      try {
        await sendEmail({
          email: user.email,
          subject: "Recuperação de Senha - Renature App",
          message: messageText,
        });

        res
          .status(200)
          .json({ message: "Código de recuperação enviado para o e-mail." });
      } catch (emailError) {
        console.error("Erro ao enviar e-mail:", emailError);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        return res
          .status(500)
          .json({
            message: "Não foi possível enviar o e-mail de recuperação.",
          });
      }
    } catch (error) {
      console.error("Erro no forgotPassword:", error);
      res
        .status(500)
        .json({ message: "Erro interno ao processar a recuperação de senha." });
    }
  },

  async resetPassword(req, res) {
    try {
      const { email, token, newPassword } = req.body;

      if (!email || !token || !newPassword) {
        return res
          .status(400)
          .json({ message: "Todos os campos são obrigatórios." });
      }

      if (newPassword.length < 8) {
        return res
          .status(400)
          .json({ message: "A nova senha deve ter pelo menos 8 caracteres." });
      }

      const user = await User.findOne({
        email: email.toLowerCase().trim(),
        resetPasswordToken: token,
        resetPasswordExpire: { $gt: Date.now() },
      });

      if (!user) {
        return res
          .status(400)
          .json({ message: "Código de verificação inválido ou expirado." });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await User.updateOne(
        { _id: user._id },
        {
          $set: { password: hashedPassword },
          $unset: { resetPasswordToken: 1, resetPasswordExpire: 1 },
        },
      );

      res
        .status(200)
        .json({
          message: "Senha redefinida com sucesso! Você já pode fazer login.",
        });
    } catch (error) {
      console.error("Erro no resetPassword:", error);
      res.status(500).json({ message: "Erro interno ao redefinir a senha." });
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

  async unlockAchievement(req, res) {
    try {
      const { code } = req.body;
      const userId = req.user._id;

      const achievement = await Achievement.findOne({ code });

      if (!achievement) {
        return res
          .status(404)
          .json({ message: "Código de conquista inválido." });
      }

      const user = await User.findById(userId);

      const alreadyHas = user.unlockedAchievements.includes(achievement._id);

      if (alreadyHas) {
        return res
          .status(400)
          .json({ message: "Conquista já desbloqueada anteriormente." });
      }

      user.unlockedAchievements.push(achievement._id);
      await user.save();

      return res.status(200).json({
        message: "Conquista desbloqueada com sucesso!",
        newlyUnlocked: true,
        achievement: achievement,
      });
    } catch (error) {
      console.error("Erro ao desbloquear conquista:", error);
      res.status(500).json({ message: "Erro interno ao processar conquista." });
    }
  },
};

module.exports = userController;
