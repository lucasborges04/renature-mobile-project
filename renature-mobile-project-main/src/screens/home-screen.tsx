import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowRight,
  Bell,
  Droplets,
  Leaf,
  TreePine,
  Recycle,
  type LucideIcon,
} from "lucide-react-native";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
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
import { homeActions, homeTip } from "../data/content";
import { getStitchStatusLabel } from "../config/stitch";
import { colors, radius, spacing, typography } from "../theme/tokens";
import type { ScreenId } from "../types/navigation";
import { userService } from "../services/userService";

type HomeScreenProps = {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
};

export function HomeScreen({ currentScreen, onNavigate }: HomeScreenProps) {
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUserProfile() {
      try {
        const data = await userService.getProfile();
        setUserData(data);
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadUserProfile();
  }, []);

  const userPoints = userData?.points || 0;

  const levelThresholds = [
    0, 100, 250, 500, 1000, 2000, 4000, 8000, 15000, 30000,
  ];

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

  const pointsMissing = nextLevelPoints - userPoints;

  const levelRange = nextLevelPoints - previousLevelPoints;
  const progressInCurrentLevel = userPoints - previousLevelPoints;
  const currentProgress =
    levelRange > 0 ? (progressInCurrentLevel / levelRange) * 100 : 100;

  return (
    <AppScreen currentScreen={currentScreen} onNavigate={onNavigate}>
      <View style={styles.topBar}>
        <View style={styles.avatarRow}>
          <View style={styles.avatar}>
            <Leaf color={colors.primary} size={20} strokeWidth={2.4} />
          </View>
          <Text style={styles.greeting}>
            {isLoading
              ? "Carregando..."
              : `Olá, ${userData?.name?.split(" ")[0] || "Eco-Herói"}`}
          </Text>
        </View>
        <View style={styles.notifyButton}>
          <Bell color={colors.textSoft} size={18} strokeWidth={2.2} />
        </View>
      </View>

      <LinearGradient
        colors={[colors.primary, colors.primaryDeep]}
        style={styles.heroCard}
      >
        <StatPill label={getStitchStatusLabel()} tone="secondary" />

        {/* Mostra um Loading enquanto busca o perfil */}
        {isLoading ? (
          <View style={{ paddingVertical: spacing.xl, alignItems: "center" }}>
            <ActivityIndicator size="large" color={colors.white} />
          </View>
        ) : (
          <>
            <View style={styles.heroStats}>
              <View>
                <Text style={styles.heroCaption}>Impacto positivo</Text>
                {/* Pontuação real formatada com ponto de milhar */}
                <Text style={styles.heroValue}>
                  {userPoints.toLocaleString("pt-BR")} pts
                </Text>
              </View>
              <View style={styles.levelBadge}>
                <Leaf color={colors.primary} size={18} strokeWidth={2.5} />
                {/* Nível real do banco de dados */}
                <Text style={styles.levelBadgeText}>Nível {userLevel}</Text>
              </View>
            </View>

            <ProgressBar
              label={`Rumo ao nível ${userLevel + 1}`}
              value={currentProgress}
            />

            <Text style={styles.heroText}>
              Faltam apenas {pointsMissing} pontos para a próxima conquista.
            </Text>
          </>
        )}

        <AppButton
          icon={ArrowRight}
          label="Ver ranking e pontos"
          onPress={() => onNavigate("ranking")}
          style={styles.heroButton}
          variant="secondary"
        />
      </LinearGradient>

      <SectionHeading
        subtitle="Identifique, aprenda e evolua com cada ação registrada."
        title="Seu painel Terra"
      />

      <View style={styles.actionGrid}>
        {homeActions.map((action) => {
          const Icon = action.icon;

          return (
            <Pressable
              key={action.title}
              onPress={() => onNavigate(action.screen)}
              style={({ pressed }) => [
                styles.actionCard,
                pressed && styles.cardPressed,
              ]}
            >
              <View style={styles.actionIcon}>
                <Icon color={colors.primary} size={22} strokeWidth={2.2} />
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionDescription}>{action.description}</Text>
            </Pressable>
          );
        })}
      </View>

      <SurfaceCard style={styles.categoryCard}>
        <SectionHeading
          subtitle="Atalhos rápidos para tipos frequentes de descarte."
          title="Mais buscados"
        />
        <View style={styles.categoryRow}>
          <CategoryPill icon={Droplets} label="Plástico" />
          <CategoryPill icon={TreePine} label="Orgânico" />
          <CategoryPill icon={Recycle} label="Vidro" />
        </View>
      </SurfaceCard>

      <SurfaceCard style={styles.tipCard}>
        <View style={styles.tipIcon}>
          <Leaf color={colors.tertiary} size={22} strokeWidth={2.2} />
        </View>
        <View style={styles.tipCopy}>
          <Text style={styles.tipTitle}>Dica sustentável</Text>
          <Text style={styles.tipText}>{homeTip}</Text>
        </View>
      </SurfaceCard>
    </AppScreen>
  );
}

function CategoryPill({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <View style={styles.categoryPill}>
      <Icon color={colors.primary} size={18} strokeWidth={2.3} />
      <Text style={styles.categoryLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  actionCard: {
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexBasis: "47%",
    gap: spacing.sm,
    minHeight: 158,
    padding: spacing.lg,
  },
  actionDescription: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 20,
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  actionIcon: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    height: 46,
    justifyContent: "center",
    width: 46,
  },
  actionTitle: {
    color: colors.text,
    fontFamily: typography.headline,
    fontSize: 21,
  },
  avatar: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderColor: colors.white,
    borderRadius: radius.pill,
    borderWidth: 2,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  avatarRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  cardPressed: {
    opacity: 0.94,
  },
  categoryCard: {
    gap: spacing.lg,
  },
  categoryLabel: {
    color: colors.primary,
    fontFamily: typography.bodyBold,
    fontSize: 14,
  },
  categoryPill: {
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    flexDirection: "row",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  greeting: {
    color: colors.primary,
    fontFamily: typography.headline,
    fontSize: 22,
  },
  heroButton: {
    backgroundColor: colors.surfaceRaised,
    borderWidth: 0,
  },
  heroCaption: {
    color: colors.primarySoft,
    fontFamily: typography.bodyBold,
    fontSize: 12,
    textTransform: "uppercase",
  },
  heroCard: {
    borderRadius: radius.xl,
    gap: spacing.md,
    padding: spacing.xl,
  },
  heroStats: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  heroText: {
    color: "#d8f0de",
    fontFamily: typography.body,
    fontSize: 15,
    lineHeight: 22,
  },
  heroValue: {
    color: colors.white,
    fontFamily: typography.headlineStrong,
    fontSize: 40,
  },
  levelBadge: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    flexDirection: "row",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  levelBadgeText: {
    color: colors.primary,
    fontFamily: typography.bodyBold,
    fontSize: 13,
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
  tipCard: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.md,
  },
  tipCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  tipIcon: {
    alignItems: "center",
    backgroundColor: colors.tertiarySoft,
    borderRadius: radius.md,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  tipText: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 21,
  },
  tipTitle: {
    color: colors.text,
    fontFamily: typography.headline,
    fontSize: 22,
  },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
