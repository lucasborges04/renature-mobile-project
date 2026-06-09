import {
  ChevronRight,
  Lock,
  Leaf,
  Zap,
  Recycle,
  Droplets,
  Shield,
  Award,
  Book,
  Flag,
  Target,
  Star,
  Sparkles,
  FileText,
  ScrollText,
  Sprout,
  Trees,
  Smartphone,
  Cpu,
  Monitor,
  Layers,
  Earth,
  type LucideIcon,
} from "lucide-react-native";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";

import { AppScreen } from "../components/app-screen";
import {
  AppButton,
  ProgressBar,
  SectionHeading,
  StatPill,
  SurfaceCard,
} from "../components/primitives";
import { radius, spacing, typography } from "../theme/tokens";
import { useTheme } from "../theme/ThemeContext";
import type { ScreenId } from "../types/navigation";
import { userService } from "../services/userService";

type AchievementsScreenProps = {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
};

const MASTER_ACHIEVEMENTS = [
  {
    code: "PRIMEIRA_RECICLAGEM",
    title: "Primeiro Passo",
    description: "Realizou sua primeira reciclagem no aplicativo.",
    icon: Leaf,
    lockedText: "Faça 1 reciclagem",
  },
  {
    code: "RECICLADOR_INICIANTE",
    title: "Reciclador Iniciante",
    description: "Reciclou 10 itens diferentes.",
    icon: Recycle,
    lockedText: "Recicle 10 itens",
  },
  {
    code: "RECICLADOR_DEDICADO",
    title: "Reciclador Dedicado",
    description: "Reciclou 50 itens diferentes.",
    icon: Recycle,
    lockedText: "Recicle 50 itens",
  },
  {
    code: "MESTRE_RECICLAGEM",
    title: "Mestre da Reciclagem",
    description: "Reciclou 100 itens diferentes.",
    icon: Award,
    lockedText: "Recicle 100 itens",
  },
  {
    code: "ALUNO_NATUREZA",
    title: "Aluno da Natureza",
    description: "Leu seu primeiro conteúdo educativo.",
    icon: Book,
    lockedText: "Aprenda 1 conteúdo",
  },
  {
    code: "DESAFIO_ACEITO",
    title: "Desafio Aceito",
    description: "Completou seu primeiro desafio.",
    icon: Flag,
    lockedText: "Cumpra 1 desafio",
  },
  {
    code: "PERSISTENTE",
    title: "Persistente",
    description: "Completou 10 desafios.",
    icon: Target,
    lockedText: "Cumpra 10 desafios",
  },
  {
    code: "PRIMEIROS_PONTOS",
    title: "Primeiros Pontos",
    description: "Alcançou 100 pontos.",
    icon: Star,
    lockedText: "Alcance 100 pts",
  },
  {
    code: "ESPECIALISTA_SUSTENTAVEL",
    title: "Especialista Sustentável",
    description: "Alcançou 1000 pontos.",
    icon: Sparkles,
    lockedText: "Alcance 1000 pts",
  },
  {
    code: "PLASTICO_5",
    title: "Novato do Plástico",
    description: "Reciclou 5 itens de plástico.",
    icon: Award,
    lockedText: "Recicle 5 plásticos",
  },
  {
    code: "PLASTICO_20",
    title: "Capitão Plástico",
    description: "Reciclou 20 itens de plástico.",
    icon: Award,
    lockedText: "Recicle 20 plásticos",
  },
  {
    code: "PLASTICO_100",
    title: "Herói do Plástico",
    description: "Reciclou 100 itens de plástico.",
    icon: Award,
    lockedText: "Recicle 100 plásticos",
  },
  {
    code: "VIDRO_5",
    title: "Novato do Vidro",
    description: "Reciclou 5 itens de vidro.",
    icon: Star,
    lockedText: "Recicle 5 vidros",
  },
  {
    code: "VIDRO_20",
    title: "Capitão do Vidro",
    description: "Reciclou 20 itens de vidro.",
    icon: Star,
    lockedText: "Recicle 20 vidros",
  },
  {
    code: "VIDRO_100",
    title: "Herói do Vidro",
    description: "Reciclou 100 itens de vidro.",
    icon: Star,
    lockedText: "Recicle 100 vidros",
  },
  {
    code: "METAL_5",
    title: "Novato dos Metais",
    description: "Reciclou 5 itens de metal.",
    icon: Zap, // Lucide Bolt alternative
    lockedText: "Recicle 5 metais",
  },
  {
    code: "METAL_20",
    title: "Capitão dos Metais",
    description: "Reciclou 20 itens de metal.",
    icon: Zap,
    lockedText: "Recicle 20 metais",
  },
  {
    code: "METAL_100",
    title: "Caçador de Metais",
    description: "Reciclou 100 itens de metal.",
    icon: Zap,
    lockedText: "Recicle 100 metais",
  },
  {
    code: "PAPEL_5",
    title: "Amigo do Papel",
    description: "Reciclou 5 itens de papel.",
    icon: FileText,
    lockedText: "Recicle 5 papéis",
  },
  {
    code: "PAPEL_20",
    title: "Guardião do Papel",
    description: "Reciclou 20 itens de papel.",
    icon: ScrollText,
    lockedText: "Recicle 20 papéis",
  },
  {
    code: "PAPEL_100",
    title: "Mestre do Papel",
    description: "Reciclou 100 itens de papel.",
    icon: Award,
    lockedText: "Recicle 100 papéis",
  },
  {
    code: "ORGANICO_5",
    title: "Compostador Iniciante",
    description: "Reciclou 5 resíduos orgânicos.",
    icon: Sprout,
    lockedText: "Recicle 5 orgânicos",
  },
  {
    code: "ORGANICO_20",
    title: "Guardião Orgânico",
    description: "Reciclou 20 resíduos orgânicos.",
    icon: Leaf,
    lockedText: "Recicle 20 orgânicos",
  },
  {
    code: "ORGANICO_100",
    title: "Mestre da Compostagem",
    description: "Reciclou 100 resíduos orgânicos.",
    icon: Trees,
    lockedText: "Recicle 100 orgânicos",
  },
  {
    code: "ELETRONICO_5",
    title: "Coletor Tecnológico",
    description: "Reciclou 5 resíduos eletrônicos.",
    icon: Smartphone,
    lockedText: "Recicle 5 eletrônicos",
  },
  {
    code: "ELETRONICO_20",
    title: "Defensor Digital",
    description: "Reciclou 20 resíduos eletrônicos.",
    icon: Cpu,
    lockedText: "Recicle 20 eletrônicos",
  },
  {
    code: "ELETRONICO_100",
    title: "Mestre dos Eletrônicos",
    description: "Reciclou 100 resíduos eletrônicos.",
    icon: Monitor,
    lockedText: "Recicle 100 eletrônicos",
  },
  {
    code: "MESTRE_DA_SEPARACAO",
    title: "Mestre da Separação",
    description: "Reciclou pelo menos um item de cada categoria.",
    icon: Layers,
    lockedText: "Recicle 1 de cada tipo",
  },
  {
    code: "NIVEL_5",
    title: "Defensor da Natureza",
    description: "Atingiu o Nível 5 no aplicativo.",
    icon: Shield,
    lockedText: "Chegue ao Nível 5",
  },
  {
    code: "SALVADOR_DO_PLANETA",
    title: "Salvador do Planeta",
    description: "Desbloqueou todas as conquistas disponíveis.",
    icon: Earth,
    lockedText: "Desbloqueie tudo",
  },
];

export function AchievementsScreen({
  currentScreen,
  onNavigate,
}: AchievementsScreenProps) {
  const { activeColors } = useTheme();
  const styles = createStyles(activeColors);

  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await userService.getProfile();
        setUserData(data);
      } catch (error) {
        console.error("Erro ao carregar conquistas:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const userPoints = userData?.points || 0;
  const levelThresholds = [0, 100, 250, 500, 1000, 2000, 4000, 8000, 15000];
  let userLevel = 1;
  let previousLevelPoints = levelThresholds[0];
  let nextLevelPoints = levelThresholds[1];

  for (let i = 0; i < levelThresholds.length; i++) {
    if (userPoints >= levelThresholds[i]) {
      userLevel = i + 1;
      previousLevelPoints = levelThresholds[i];
      nextLevelPoints = levelThresholds[i + 1] || levelThresholds[i];
    } else {
      break;
    }
  }

  const levelRange = nextLevelPoints - previousLevelPoints;
  const progressInCurrentLevel = userPoints - previousLevelPoints;
  const currentProgress =
    levelRange > 0 ? (progressInCurrentLevel / levelRange) * 100 : 100;

  const unlockedCodes =
    userData?.unlockedAchievements?.map((ach: any) => ach.code) || [];

  const dynamicAchievements = MASTER_ACHIEVEMENTS.map((master) => {
    const isEarned = unlockedCodes.includes(master.code);
    return {
      title: master.title,
      description: master.description,
      icon: master.icon,
      earned: isEarned,
      progress: isEarned ? "CONCLUÍDO" : master.lockedText,
    };
  });

  return (
    <AppScreen currentScreen={currentScreen} onNavigate={onNavigate}>
      {isLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={activeColors.primary} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.topBar}>
            <Text style={styles.greeting}>
              Olá, {userData?.name?.split(" ")[0] || "Eco-Herói"}
            </Text>
          </View>

          <SectionHeading
            subtitle="Colecione insígnias ajudando o planeta."
            title="Suas Conquistas"
          />

          <SurfaceCard style={styles.heroCard}>
            <StatPill
              label={`${userPoints.toLocaleString("pt-BR")} XP`}
              tone="tertiary"
            />
            <Text style={styles.heroTitle}>Jornada Sustentável</Text>
            <Text style={styles.heroSubtitle}>
              Nível {userLevel} · Eco-Guardião
            </Text>
            <ProgressBar
              label={`${Math.round(currentProgress)}% para nível ${userLevel + 1}`}
              value={currentProgress}
            />
          </SurfaceCard>

          <AppButton
            icon={ChevronRight}
            label="Ver ranking e pontuação"
            onPress={() => onNavigate("ranking")}
          />

          <View style={styles.listWrap}>
            {dynamicAchievements.map((achievement) => (
              <AchievementCard key={achievement.title} item={achievement} />
            ))}
          </View>
        </ScrollView>
      )}
    </AppScreen>
  );
}

function AchievementCard({
  item,
}: {
  item: {
    description: string;
    earned: boolean;
    icon: LucideIcon;
    progress: string;
    title: string;
  };
}) {
  const { activeColors } = useTheme();
  const styles = createStyles(activeColors);
  const Icon = item.icon;

  return (
    <SurfaceCard
      style={[
        styles.achievementCard,
        !item.earned && styles.achievementCardLocked,
      ]}
    >
      <View
        style={[
          styles.achievementIcon,
          !item.earned && { backgroundColor: activeColors.surfaceStrong },
        ]}
      >
        <Icon
          color={item.earned ? activeColors.primary : activeColors.textSoft}
          size={22}
          strokeWidth={2.2}
        />
      </View>
      <View style={styles.achievementCopy}>
        <Text
          style={[
            styles.achievementStatus,
            !item.earned && { color: activeColors.textMuted },
          ]}
        >
          {item.progress}
        </Text>
        <Text
          style={[
            styles.achievementTitle,
            !item.earned && { color: activeColors.textSoft },
          ]}
        >
          {item.title}
        </Text>
        <Text style={styles.achievementDescription}>{item.description}</Text>
      </View>
      {!item.earned ? (
        <Lock color={activeColors.textSoft} size={18} strokeWidth={2.2} />
      ) : null}
    </SurfaceCard>
  );
}

const createStyles = (themeColors: any) =>
  StyleSheet.create({
    achievementCard: {
      alignItems: "flex-start",
      flexDirection: "row",
      gap: spacing.md,
    },
    achievementCardLocked: {
      backgroundColor: themeColors.surfaceMuted,
    },
    achievementCopy: {
      flex: 1,
      gap: spacing.xs,
    },
    achievementDescription: {
      color: themeColors.textMuted,
      fontFamily: typography.body,
      fontSize: 14,
      lineHeight: 21,
    },
    achievementIcon: {
      alignItems: "center",
      backgroundColor: themeColors.primarySoft,
      borderRadius: radius.md,
      height: 44,
      justifyContent: "center",
      width: 44,
    },
    achievementStatus: {
      color: themeColors.primary,
      fontFamily: typography.bodyBold,
      fontSize: 12,
      textTransform: "uppercase",
    },
    achievementTitle: {
      color: themeColors.text,
      fontFamily: typography.headline,
      fontSize: 22,
    },
    greeting: {
      color: themeColors.primary,
      fontFamily: typography.headline,
      fontSize: 22,
    },
    heroCard: {
      gap: spacing.sm,
    },
    heroSubtitle: {
      color: themeColors.textMuted,
      fontFamily: typography.bodySemiBold,
      fontSize: 15,
    },
    heroTitle: {
      color: themeColors.text,
      fontFamily: typography.headlineStrong,
      fontSize: 30,
    },
    listWrap: {
      gap: spacing.md,
    },
    scrollContent: {
      gap: spacing.xl,
      paddingBottom: spacing.xl,
    },
    topBar: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
    },
  });
