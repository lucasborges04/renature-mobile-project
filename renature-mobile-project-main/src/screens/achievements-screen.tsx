import {
  Bell,
  ChevronRight,
  Lock,
  Leaf,
  Zap,
  Recycle,
  Droplets,
  Shield,
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
import { colors, radius, spacing, typography } from "../theme/tokens";
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
    code: "NIVEL_2",
    title: "Eco-Iniciante",
    description: "Alcançou o Nível 2 na sua jornada.",
    icon: Zap,
    lockedText: "Requer Nível 2",
  },
  {
    code: "RECICLADOR_10",
    title: "Reciclador Frequente",
    description: "Registrou 10 itens recicláveis no aplicativo.",
    icon: Recycle,
    lockedText: "Recicle 10 itens",
  },
  {
    code: "MESTRE_PLASTICO",
    title: "Mestre do Plástico",
    description: "Reciclou 5 itens de plástico.",
    icon: Droplets,
    lockedText: "Recicle 5 plásticos",
  },
  {
    code: "TOP_RANKING",
    title: "No Topo do Mundo",
    description: "Alcançou o Top 3 no Ranking global.",
    icon: Shield,
    lockedText: "Chegue ao Top 3",
  },
];

export function AchievementsScreen({
  currentScreen,
  onNavigate,
}: AchievementsScreenProps) {
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
          <ActivityIndicator size="large" color={colors.primary} />
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
            <View style={styles.notifyButton}>
              <Bell color={colors.textSoft} size={18} strokeWidth={2.2} />
            </View>
          </View>

          <SectionHeading
            subtitle="Colecione insígnias ajudando o planeta e destrave novas recompensas."
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

          <View style={styles.listWrap}>
            {dynamicAchievements.map((achievement) => (
              <AchievementCard key={achievement.title} item={achievement} />
            ))}
          </View>

          <AppButton
            icon={ChevronRight}
            label="Ver ranking e pontuação"
            onPress={() => onNavigate("ranking")}
          />
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
          !item.earned && { backgroundColor: colors.surfaceStrong },
        ]}
      >
        <Icon
          color={item.earned ? colors.primary : colors.textSoft}
          size={22}
          strokeWidth={2.2}
        />
      </View>
      <View style={styles.achievementCopy}>
        <Text
          style={[
            styles.achievementStatus,
            !item.earned && { color: colors.textMuted },
          ]}
        >
          {item.progress}
        </Text>
        <Text
          style={[
            styles.achievementTitle,
            !item.earned && { color: colors.textSoft },
          ]}
        >
          {item.title}
        </Text>
        <Text style={styles.achievementDescription}>{item.description}</Text>
      </View>
      {!item.earned ? (
        <Lock color={colors.textSoft} size={18} strokeWidth={2.2} />
      ) : null}
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    gap: spacing.xl,
    paddingBottom: spacing.xl,
  },
  achievementCard: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.md,
  },
  achievementCardLocked: {
    backgroundColor: colors.surfaceMuted,
  },
  achievementCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  achievementDescription: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 21,
  },
  achievementIcon: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  achievementStatus: {
    color: colors.primary,
    fontFamily: typography.bodyBold,
    fontSize: 12,
    textTransform: "uppercase",
  },
  achievementTitle: {
    color: colors.text,
    fontFamily: typography.headline,
    fontSize: 22,
  },
  greeting: {
    color: colors.primary,
    fontFamily: typography.headline,
    fontSize: 22,
  },
  heroCard: {
    gap: spacing.sm,
  },
  heroSubtitle: {
    color: colors.textMuted,
    fontFamily: typography.bodySemiBold,
    fontSize: 15,
  },
  heroTitle: {
    color: colors.text,
    fontFamily: typography.headlineStrong,
    fontSize: 30,
  },
  listWrap: {
    gap: spacing.md,
  },
  notifyButton: {
    alignItems: "center",
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
