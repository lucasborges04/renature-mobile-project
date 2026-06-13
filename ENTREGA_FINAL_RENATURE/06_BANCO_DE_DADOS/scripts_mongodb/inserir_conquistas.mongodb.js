use("renature");

db.achievements.insertMany([
  {
    title: "Primeiro Passo",
    description: "Registre sua primeira acao sustentavel.",
    code: "FIRST_ACTION",
    iconName: "award",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Reciclador Iniciante",
    description: "Alcance 100 pontos no aplicativo.",
    code: "POINTS_100",
    iconName: "recycle",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);
