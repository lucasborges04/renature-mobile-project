import type { LucideIcon } from "lucide-react-native";
import {
  Battery,
  BookOpen,
  CheckCircle2,
  FileText,
  Footprints,
  Gift,
  Leaf,
  Lock,
  Medal,
  Recycle,
  ShieldAlert,
  Sparkles,
  TreePine,
  Trash2,
  Trophy,
  Wine,
} from "lucide-react-native";

import type { ScreenId } from "../types/navigation";

export type ActionLink = {
  description: string;
  icon: LucideIcon;
  screen: ScreenId;
  title: string;
};

export type AchievementItem = {
  description: string;
  earned: boolean;
  icon: LucideIcon;
  progress: string;
  title: string;
};

export type ChallengeItem = {
  actionLabel: string;
  current: number;
  icon: LucideIcon;
  target: number;
  title: string;
};

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

export const homeActions: ActionLink[] = [
  {
    description: "Identifique o descarte correto",
    icon: Recycle,
    screen: "scanner",
    title: "Escanear item",
  },
  {
    description: "Guias e artigos ecológicos",
    icon: BookOpen,
    screen: "learn",
    title: "Aprender",
  },
  {
    description: "Missões ativas desta semana",
    icon: Sparkles,
    screen: "challenges",
    title: "Desafios",
  },
  {
    description: "Galeria de medalhas e marcos",
    icon: Trophy,
    screen: "achievements",
    title: "Conquistas",
  },
];

export const learnCategories = [
  {
    description: "PET, sacolas e embalagens leves.",
    icon: Recycle,
    title: "Plástico",
  },
  {
    description: "Jornais, caixas e folhas secas.",
    icon: FileText,
    title: "Papel",
  },
  {
    description: "Garrafas, potes e frascos.",
    icon: Wine,
    title: "Vidro",
  },
  {
    description: "Latas, alumínio e aço.",
    icon: Medal,
    title: "Metal",
  },
  {
    description: "Restos de alimentos e poda.",
    icon: Leaf,
    title: "Orgânico",
  },
  {
    description: "Cabos, celulares e aparelhos.",
    icon: Battery,
    title: "Eletrônico",
  },
  {
    description: "Pilhas e baterias portáteis.",
    icon: Battery,
    title: "Pilhas",
  },
  {
    description: "Resíduos hospitalares e especiais.",
    icon: ShieldAlert,
    title: "Especial",
  },
];

export const challengeItems: ChallengeItem[] = [
  {
    actionLabel: "Resgatar",
    current: 2,
    icon: Recycle,
    target: 2,
    title: "Escaneie 2 embalagens recicláveis hoje.",
  },
  {
    actionLabel: "Ir para aula",
    current: 0,
    icon: BookOpen,
    target: 1,
    title: "Complete 1 lição sobre compostagem.",
  },
  {
    actionLabel: "Registrar",
    current: 2250,
    icon: Footprints,
    target: 5000,
    title: "Registre 5000 passos hoje.",
  },
];

export const achievementItems: AchievementItem[] = [
  {
    description: "Completou 50 ações de reciclagem registradas no app.",
    earned: true,
    icon: Leaf,
    progress: "Concluído",
    title: "Eco-Líder",
  },
  {
    description: "Separou e descartou corretamente 100 itens recicláveis.",
    earned: true,
    icon: Recycle,
    progress: "Concluído",
    title: "Reciclador Ouro",
  },
  {
    description: "Iniciou sua primeira composteira caseira com sucesso.",
    earned: true,
    icon: TreePine,
    progress: "Concluído",
    title: "Mestre do Solo",
  },
  {
    description:
      "Passe 30 dias consecutivos sem registrar consumo de plástico descartável.",
    earned: false,
    icon: Trash2,
    progress: "0/30 dias",
    title: "Zero Plástico",
  },
  {
    description:
      "Percorra 50 km utilizando bicicleta ou caminhada em vez de carro.",
    earned: false,
    icon: Footprints,
    progress: "12/50 km",
    title: "Mobilidade Verde",
  },
  {
    description:
      "Participe de 3 eventos de limpeza de espaços públicos comunitários.",
    earned: false,
    icon: Lock,
    progress: "Bloqueado",
    title: "Guardião Local",
  },
];

export const leaderboard = [
  { name: "Mariana", points: "15.2k pts", rank: 1 },
  { name: "Lucas", points: "12.4k pts", rank: 2 },
  { name: "João", points: "11.8k pts", rank: 3 },
  { name: "Ana C.", points: "10.5k pts", rank: 4 },
  { name: "Você", points: "9.8k pts", rank: 5 },
  { name: "Carlos Silva", points: "9.2k pts", rank: 6 },
];

export const recentActivities = [
  {
    points: "+150 pts",
    subtitle: "Ecoponto Central - 3 itens",
    time: "Hoje, 10:30",
    title: "Reciclagem registrada",
  },
  {
    points: "+10 pts",
    subtitle: "Garrafa PET - guia de reciclagem",
    time: "Ontem, 15:45",
    title: "Conteúdo concluído",
  },
  {
    points: "+500 pts",
    subtitle: "Iniciante Sustentável - 10 descartes",
    time: "12 de Out",
    title: "Badge desbloqueada",
  },
];

export const profileHighlights = [
  { label: "Impacto total", value: "42 kg" },
  { label: "Horas de ação", value: "18.5 h" },
];

export const detailSteps = [
  {
    description:
      "Certifique-se de que não haja restos de líquidos no interior. Uma rápida enxaguada ajuda muito no processo de reciclagem.",
    title: "Esvazie completamente",
  },
  {
    description:
      "Retire o ar e amasse para reduzir o volume. Isso otimiza o espaço nos caminhões de coleta e nas lixeiras.",
    title: "Amasse a garrafa",
  },
  {
    description:
      "Separar tampa e rótulo facilita a triagem. Mantenha a tampa na garrafa somente se a coleta local orientar assim.",
    title: "Separe tampa e rótulo",
  },
];

export const detailMistakes = [
  "Restos de líquido contaminam outros recicláveis, como papel e papelão.",
  "Usar garrafas PET como cinzeiro inviabiliza a reciclagem por causa das toxinas.",
];

export const onboardingBadges = [
  { icon: Leaf, label: "Iniciante" },
  { icon: Medal, label: "Guardião" },
  { icon: TreePine, label: "Explorador" },
  { icon: Trophy, label: "Mestre" },
];

export const homeTip =
  "Lave embalagens de vidro ou plástico antes de descartar para evitar contaminação no lixo reciclável e facilitar o processo.";

export const rankingProgress = [
  { label: "N5", value: 35 },
  { label: "N6", value: 50 },
  { label: "N7", value: 68 },
  { label: "N8", value: 88 },
];

export const profileAchievements = [
  { label: "Mestre do Plástico", icon: Recycle },
  { label: "Energia Limpa", icon: Sparkles },
  { label: "Em breve", icon: Lock },
];

export const profileLinks = [
  "Editar perfil",
  "Configurações",
  "Privacidade e permissões",
];

export const authBenefits = [
  "Pequenos passos, grande impacto",
  "Acompanhe suas ações diárias",
  "Pontue com cada descarte correto",
];

export const detailMetrics = [
  { label: "Reciclabilidade", value: "50%" },
  { label: "Tempo na natureza", value: "400 anos" },
  { label: "Lixeira correta", value: "Vermelha" },
];

export const scannerResult = {
  points: "+10 pontos",
  title: "Lata de Alumínio",
};

export const homeStatus = {
  level: "Nível 4",
  points: "1.250 pts",
  progress: 83,
};
