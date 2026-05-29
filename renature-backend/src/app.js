const express = require("express");
const cors = require("cors");

const app = express();
const authRoutes = require("./routes/authRoutes");

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/api/status", (req, res) => {
  res.json({
    status: "sucesso",
    message: "API do Renature está online e pronta para receber requisições!",
  });
});

module.exports = app;
