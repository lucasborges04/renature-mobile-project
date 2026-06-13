require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./src/app");
const { verifyEmailTransport } = require("./src/services/sendEmail");

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("A variavel de ambiente MONGO_URI nao foi configurada.");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("A variavel de ambiente JWT_SECRET nao foi configurada.");
  process.exit(1);
}

console.log("Tentando conectar ao MongoDB Atlas...");

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Conectado ao MongoDB Atlas com sucesso!");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Servidor rodando perfeitamente na porta ${PORT}`);
      console.log(`Health check disponivel em /api/status`);

      verifyEmailTransport()
        .then(() => console.log("API de e-mail da Brevo validada."))
        .catch((error) => {
          console.error("Falha ao validar API de e-mail da Brevo:", {
            code: error.code,
            command: error.command,
            response: error.response,
            message: error.message,
          });
        });
    });
  })
  .catch((error) => {
    console.error("Erro fatal ao conectar ao MongoDB:");
    console.error(error.message);
  });
