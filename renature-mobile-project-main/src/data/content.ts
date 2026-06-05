import type { LucideIcon } from "lucide-react-native";
import {
  Battery,
  FileText,
  Leaf,
  Medal,
  Recycle,
  ShieldAlert,
  TreePine,
  Trophy,
  Wine,
} from "lucide-react-native";

export const onboardingSlides = [
  {
    description:
      "Aprenda a classificar o lixo doméstico de forma simples e rápida. Pequenas atitudes na sua rotina fazem uma grande diferença para um mundo mais verde.",
    id: "onboarding-1" as const,
    title: "Como separar seus resíduos",
  },
  {
    description:
      "Sua jornada sustentável é recompensada. A cada embalagem reciclada corretamente, você acumula pontos para subir de nível e colecionar emblemas.",
    id: "onboarding-2" as const,
    title: "Recicle, ganhe pontos e evolua.",
  },
  {
    description:
      "Ganhe badges exclusivos e acompanhe seu impacto positivo no planeta a cada nova ação realizada.",
    id: "onboarding-3" as const,
    title: "Desbloqueie conquistas",
  },
];

export const onboardingBadges = [
  { icon: Leaf, label: "Iniciante" },
  { icon: Medal, label: "Guardião" },
  { icon: TreePine, label: "Explorador" },
  { icon: Trophy, label: "Mestre" },
];

export const learnCategories = [
  {
    id: "plastico",
    description: "PET, sacolas e embalagens leves.",
    icon: Recycle,
    title: "Plástico",
  },
  {
    id: "papel",
    description: "Jornais, caixas e folhas secas.",
    icon: FileText,
    title: "Papel",
  },
  {
    id: "vidro",
    description: "Garrafas, potes e frascos.",
    icon: Wine,
    title: "Vidro",
  },
  {
    id: "metal",
    description: "Latas, alumínio e aço.",
    icon: Medal,
    title: "Metal",
  },
  {
    id: "organico",
    description: "Restos de alimentos e poda.",
    icon: Leaf,
    title: "Orgânico",
  },
  {
    id: "eletronico",
    description: "Cabos, celulares e baterias.",
    icon: Battery,
    title: "Eletrônico",
  },
];

export const recyclingGuides = {
  plastico: {
    title: "Guia do Plástico",
    color: "#2E8B57",
    intro:
      "O plástico é um dos materiais mais presentes no nosso dia a dia, mas pode levar até 400 anos para se decompor na natureza. Reciclá-lo é fundamental.",
    canRecycle: [
      "Garrafas PET",
      "Potes de sorvete e margarina",
      "Embalagens de produtos de limpeza",
      "Sacolas plásticas limpas",
      "Tampinhas",
    ],
    cannotRecycle: [
      "Embalagens metalizadas (como as de salgadinho)",
      "Acrílico",
      "Plástico filme muito engordurado",
      "Espuma de colchão",
    ],
    steps: [
      "Esvazie todo o conteúdo da embalagem.",
      "Faça um enxágue rápido para remover o excesso de produto.",
      "Amasse garrafas e potes para economizar espaço na lixeira.",
      "Tampe as garrafas novamente antes de descartar.",
    ],
  },
  papel: {
    title: "Guia do Papel",
    color: "#4682B4",
    intro:
      "A reciclagem de papel evita o desmatamento e economiza milhões de litros de água. O segredo aqui é mantê-los sempre secos.",
    canRecycle: [
      "Caixas de papelão",
      "Jornais e revistas",
      "Cadernos e folhas de sulfite",
      "Embalagens de papel limpas",
      "Panfletos",
    ],
    cannotRecycle: [
      "Papel higiênico e guardanapos sujos",
      "Papel engordurado (ex: caixa de pizza suja)",
      "Papel metalizado",
      "Fitas adesivas",
    ],
    steps: [
      "Retire espirais de metal ou plástico dos cadernos.",
      "Desmonte caixas de papelão para diminuir o volume.",
      "Não amasse folhas de papel se puder evitar.",
      "Mantenha longe de líquidos. Papel molhado perde valor de reciclagem.",
    ],
  },
  vidro: {
    title: "Guia do Vidro",
    color: "#20B2AA",
    intro:
      "O vidro é 100% reciclável e pode ser reaproveitado infinitamente. No entanto, exige cuidado extra no descarte para evitar acidentes.",
    canRecycle: [
      "Garrafas de bebidas",
      "Potes de geleia e conserva",
      "Copos quebrados",
      "Frascos de perfume",
    ],
    cannotRecycle: [
      "Espelhos",
      "Lâmpadas (fluorescentes têm mercúrio)",
      "Óculos",
      "Cerâmica e porcelana",
      "Vidros de janela e box",
    ],
    steps: [
      "Lave os potes e garrafas para evitar atrair insetos.",
      "Se o vidro estiver quebrado, embrulhe os cacos em folhas de jornal ou coloque-os dentro de uma garrafa PET cortada.",
      "Escreva 'CUIDADO: VIDRO QUEBRADO' do lado de fora.",
      "Separe as tampas de metal ou plástico.",
    ],
  },
  metal: {
    title: "Guia do Metal",
    color: "#DAA520",
    intro:
      "Metais como o alumínio são altamente valiosos. Reciclar uma única latinha economiza energia suficiente para manter uma TV ligada por 3 horas.",
    canRecycle: [
      "Latas de alumínio (refrigerante, suco)",
      "Latas de aço (conservas, sardinha)",
      "Tampinhas de garrafa",
      "Panelas sem cabo",
      "Pregos",
    ],
    cannotRecycle: [
      "Esponja de aço (bombril)",
      "Latas com restos de tinta ou verniz",
      "Clipes e grampos enferrujados",
      "Latas de produtos tóxicos",
    ],
    steps: [
      "Esvazie totalmente as latas.",
      "Passe uma água nas latas de alimentos para tirar o cheiro.",
      "Amasse as latas de alumínio para facilitar o transporte.",
      "Não tente amassar latas de aço (conservas), pois podem cortar.",
    ],
  },
  organico: {
    title: "Guia do Orgânico",
    color: "#8B4513",
    intro:
      "Mais da metade do lixo produzido em casa é orgânico. Quando vai para o aterro, gera gás metano. A melhor solução é a compostagem.",
    canRecycle: [
      "Cascas de frutas e legumes",
      "Restos de verduras",
      "Borra e filtro de café",
      "Cascas de ovos",
      "Folhas secas e grama",
    ],
    cannotRecycle: [
      "Fezes de animais de estimação",
      "Carnes e ossos",
      "Papel higiênico",
      "Óleo de cozinha",
      "Laticínios",
    ],
    steps: [
      "Se tiver uma composteira, corte as cascas em pedaços menores.",
      "Nunca jogue óleo na pia ou no lixo orgânico. Guarde em garrafa PET.",
      "Cubra sempre os resíduos na composteira com matéria seca.",
    ],
  },
  eletronico: {
    title: "Guia do Eletrônico",
    color: "#708090",
    intro:
      "O lixo eletrônico contém metais pesados que podem contaminar a água e o solo. NUNCA devem ser jogados no lixo comum.",
    canRecycle: [
      "Celulares antigos",
      "Fios e cabos USB",
      "Mouses e teclados",
      "Placas de computador",
      "Baterias e pilhas",
    ],
    cannotRecycle: [
      "Aparelhos misturados com lixo comum",
      "Baterias inchadas ou vazando (exigem manuseio especial)",
    ],
    steps: [
      "Separe fios e cabos enrolando-os para não formarem nós.",
      "Apague todos os seus dados pessoais antes de descartar.",
      "Não desmonte aparelhos antigos ou baterias em casa.",
      "Leve tudo a Ecopontos específicos ou lojas de eletrônicos.",
    ],
  },
};

export const homeTip =
  "Lave embalagens de vidro ou plástico antes de descartar para evitar contaminação no lixo reciclável e facilitar o processo.";

export const authBenefits = [
  "Pequenos passos, grande impacto",
  "Acompanhe suas ações diárias",
  "Pontue com cada descarte correto",
];
