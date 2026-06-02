require("dotenv").config();
const mongoose = require("mongoose");
const Achievement = require("../models/Achievement");

const achievements = [
  {
    title: "Primeiro Passo",
    description: "Realizou sua primeira reciclagem no aplicativo.",
    code: "PRIMEIRA_RECICLAGEM",
    iconName: "leaf",
  },
  {
    title: "Reciclador Iniciante",
    description: "Reciclou 10 itens diferentes.",
    code: "RECICLADOR_INICIANTE",
    iconName: "recycle",
  },
  {
    title: "Reciclador Dedicado",
    description: "Reciclou 50 itens diferentes.",
    code: "RECICLADOR_DEDICADO",
    iconName: "recycle",
  },
  {
    title: "Mestre da Reciclagem",
    description: "Reciclou 100 itens diferentes.",
    code: "MESTRE_RECICLAGEM",
    iconName: "award",
  },
  {
    title: "Aluno da Natureza",
    description: "Leu seu primeiro conteúdo educativo",
    code: "ALUNO_NATUREZA",
    iconName: "book",
  },
  {
    title: "Desafio Aceito",
    description: "Completou seu primeiro desafio.",
    code: "DESAFIO_ACEITO",
    iconName: "flag",
  },
  {
    title: "Persistente",
    description: "Completou 10 desafios.",
    code: "PERSISTENTE",
    iconName: "target",
  },
  {
    title: "Primeiros Pontos",
    description: "Alcançou 100 pontos.",
    code: "PRIMEIROS_PONTOS",
    iconName: "star",
  },
  {
    title: "Especialista Sustentável",
    description: "Alcançou 1000 pontos.",
    code: "ESPECIALISTA_SUSTENTAVEL",
    iconName: "sparkles",
  },
  {
    title: "Novato do Plástico",
    description: "Reciclou 5 itens de plástico.",
    code: "PLASTICO_5",
    iconName: "award",
  },
  {
    title: "Capitão Plástico",
    description: "Reciclou 20 itens de plástico.",
    code: "PLASTICO_20",
    iconName: "award",
  },
  {
    title: "Herói do Plástico",
    description: "Reciclou 100 itens de plástico.",
    code: "PLASTICO_100",
    iconName: "award",
  },
  {
    title: "Novato do Vidro",
    description: "Reciclou 5 itens de vidro.",
    code: "VIDRO_5",
    iconName: "star",
  },
  {
    title: "Capitão do Vidro",
    description: "Reciclou 20 itens de vidro.",
    code: "VIDRO_20",
    iconName: "star",
  },
  {
    title: "Herói do Vidro",
    description: "Reciclou 100 itens de vidro.",
    code: "VIDRO_100",
    iconName: "star",
  },
  {
    title: "Novato dos Metais",
    description: "Reciclou 5 itens de metal.",
    code: "METAL_5",
    iconName: "bolt",
  },
  {
    title: "Capitão dos Metais",
    description: "Reciclou 20 itens de metal.",
    code: "METAL_20",
    iconName: "bolt",
  },
  {
    title: "Caçador de Metais",
    description: "Reciclou 100 itens de metal.",
    code: "METAL_100",
    iconName: "bolt",
  },
  {
    title: "Amigo do Papel",
    description: "Reciclou 5 itens de papel.",
    code: "PAPEL_5",
    iconName: "file-text",
  },
  {
    title: "Guardião do Papel",
    description: "Reciclou 20 itens de papel.",
    code: "PAPEL_20",
    iconName: "scroll-text",
  },
  {
    title: "Mestre do Papel",
    description: "Reciclou 100 itens de papel.",
    code: "PAPEL_100",
    iconName: "award",
  },
  {
    title: "Compostador Iniciante",
    description: "Reciclou 5 resíduos orgânicos.",
    code: "ORGANICO_5",
    iconName: "sprout",
  },
  {
    title: "Guardião Orgânico",
    description: "Reciclou 20 resíduos orgânicos.",
    code: "ORGANICO_20",
    iconName: "leaf",
  },
  {
    title: "Mestre da Compostagem",
    description: "Reciclou 100 resíduos orgânicos.",
    code: "ORGANICO_100",
    iconName: "trees",
  },
  {
    title: "Coletor Tecnológico",
    description: "Reciclou 5 resíduos eletrônicos.",
    code: "ELETRONICO_5",
    iconName: "smartphone",
  },
  {
    title: "Defensor Digital",
    description: "Reciclou 20 resíduos eletrônicos.",
    code: "ELETRONICO_20",
    iconName: "cpu",
  },
  {
    title: "Mestre dos Eletrônicos",
    description: "Reciclou 100 resíduos eletrônicos.",
    code: "ELETRONICO_100",
    iconName: "monitor",
  },
  {
    title: "Mestre da Separação",
    description: "Reciclou pelo menos um item de cada categoria.",
    code: "MESTRE_DA_SEPARACAO",
    iconName: "layers",
  },
  {
    title: "Defensor da Natureza",
    description: "Atingiu o Nível 5 no aplicativo.",
    code: "NIVEL_5",
    iconName: "shield",
  },
  {
    title: "Salvador do Planeta",
    description: "Desbloqueou todas as conquistas disponíveis.",
    code: "SALVADOR_DO_PLANETA",
    iconName: "earth",
  },
];

const seedDatabase = async () => {
  try {
    console.log("Conectando ao MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado com sucesso!");
    console.log("Limpando catálogo de conquistas antigo...");
    await Achievement.deleteMany();

    console.log("Criando as novas conquistas...");
    await Achievement.insertMany(achievements);

    console.log("Catálogo de Conquistas gerado com sucesso!");

    mongoose.connection.close();
    process.exit();
  } catch (error) {
    console.error("Erro ao criar o banco:", error);
    process.exit(1);
  }
};

seedDatabase();
