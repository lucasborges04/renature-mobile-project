const express = require("express");
const cors = require("cors");

const app = express();
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const actionRoutes = require("./routes/actionRoutes");

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/actions", actionRoutes);

app.get("/api/status", (req, res) => {
  res.json({
    status: "sucesso",
    message: "API do Renature está online e pronta para receber requisições!",
  });
});

module.exports = app;
