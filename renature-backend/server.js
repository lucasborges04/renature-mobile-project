require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./src/app");

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

console.log("Tentando conectar ao MongoDB Atlas...");

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Conectado ao MongoDB Atlas com sucesso!");

    app.listen(PORT, () => {
      console.log(`Servidor rodando perfeitamente na porta ${PORT}`);
      console.log(`Teste a API acessando: http://localhost:${PORT}/api/status`);
    });
  })
  .catch((error) => {
    console.error("Erro fatal ao conectar ao MongoDB:");
    console.error(error.message);
  });
