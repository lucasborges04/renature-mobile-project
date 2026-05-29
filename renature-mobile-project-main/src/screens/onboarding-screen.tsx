import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowRight,
  Leaf,
  Medal,
  Recycle,
  ScanLine,
  TreePine,
  Trophy,
} from "lucide-react-native";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { AppButton, ProgressBar, SurfaceCard } from "../components/primitives";
import { onboardingBadges, onboardingSlides } from "../data/content";
import { colors, radius, spacing, typography } from "../theme/tokens";
import type { ScreenId } from "../types/navigation";

type OnboardingScreenProps = {
  currentScreen: Extract<
    ScreenId,
    "onboarding-1" | "onboarding-2" | "onboarding-3"
  >;
  onNavigate: (screen: ScreenId) => void;
};

export function OnboardingScreen({
  currentScreen,
  onNavigate,
}: OnboardingScreenProps) {
  const slideIndex = onboardingSlides.findIndex(
    (slide) => slide.id === currentScreen,
  );
  const slide = onboardingSlides[slideIndex];
  const nextScreen = onboardingSlides[slideIndex + 1]?.id ?? "auth";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.root}>
        <View style={styles.header}>
          <View style={styles.progressDots}>
            {onboardingSlides.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.progressDot,
                  index === slideIndex && styles.progressDotActive,
                ]}
              />
            ))}
          </View>
          {currentScreen !== "onboarding-1" ? (
            <Pressable onPress={() => onNavigate("auth")}>
              <Text style={styles.skipLabel}>Pular</Text>
            </Pressable>
          ) : (
            <View />
          )}
        </View>

        <View style={styles.heroWrap}>
          {currentScreen === "onboarding-1" ? <SlideOneArtwork /> : null}
          {currentScreen === "onboarding-2" ? <SlideTwoArtwork /> : null}
          {currentScreen === "onboarding-3" ? <SlideThreeArtwork /> : null}
        </View>

        <View style={styles.copy}>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.description}>{slide.description}</Text>
        </View>

        <View style={styles.footer}>
          <AppButton
            icon={ArrowRight}
            label={
              currentScreen === "onboarding-3" ? "Começar agora" : "Próximo"
            }
            onPress={() => onNavigate(nextScreen)}
          />
          <Pressable
            onPress={() => onNavigate("auth")}
            style={styles.skipButton}
          >
            <Text style={styles.skipButtonLabel}>Pular</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

function SlideOneArtwork() {
  return (
    <SurfaceCard style={styles.artworkCard}>
      <LinearGradient
        colors={[colors.secondarySoft, colors.surfaceStrong]}
        style={styles.gradientFill}
      >
        <View style={styles.binRow}>
          <View style={[styles.bin, { backgroundColor: colors.primarySoft }]}>
            <Recycle color={colors.primary} size={34} strokeWidth={2.2} />
          </View>
          <View style={[styles.bin, { backgroundColor: colors.secondarySoft }]}>
            <Leaf color={colors.secondary} size={34} strokeWidth={2.2} />
          </View>
          <View style={[styles.bin, { backgroundColor: colors.tertiarySoft }]}>
            <TreePine color={colors.tertiary} size={34} strokeWidth={2.2} />
          </View>
        </View>
      </LinearGradient>
    </SurfaceCard>
  );
}

function SlideTwoArtwork() {
  return (
    <View style={styles.slideTwoWrap}>
      <SurfaceCard style={styles.slideTwoHero}>
        <LinearGradient
          colors={[colors.secondarySoft, colors.surfaceRaised]}
          style={styles.slideTwoGradient}
        >
          <View style={styles.floatingBadge}>
            <Medal color={colors.tertiary} size={18} strokeWidth={2.2} />
            <View>
              <Text style={styles.floatingTitle}>Nova conquista</Text>
              <Text style={styles.floatingText}>+50 pontos eco</Text>
            </View>
          </View>

          <View style={styles.levelCard}>
            <View style={styles.levelHeader}>
              <View style={styles.levelIcon}>
                <Leaf color={colors.primary} size={20} strokeWidth={2.3} />
              </View>
              <View>
                <Text style={styles.levelLabel}>Seu nível</Text>
                <Text style={styles.levelValue}>Semente</Text>
              </View>
              <Text style={styles.levelXp}>0 / 100 xp</Text>
            </View>
            <ProgressBar value={15} />
          </View>
        </LinearGradient>
      </SurfaceCard>

      <View style={styles.slideTwoGrid}>
        <SurfaceCard style={styles.miniTile}>
          <ScanLine color={colors.tertiary} size={26} strokeWidth={2.1} />
          <Text style={styles.miniTileTitle}>Escaneie</Text>
          <Text style={styles.miniTileText}>Registre ações nos ecopontos.</Text>
        </SurfaceCard>
      </View>
    </View>
  );
}

function SlideThreeArtwork() {
  return (
    <SurfaceCard style={styles.badgeWall}>
      <View style={styles.badgeGrid}>
        {onboardingBadges.map((badge, index) => {
          const Icon = badge.icon;

          return (
            <View key={badge.label} style={styles.badgeCard}>
              <View
                style={[
                  styles.badgeIcon,
                  index === 3 && { backgroundColor: colors.tertiarySoft },
                ]}
              >
                <Icon
                  color={index === 3 ? colors.tertiary : colors.primary}
                  size={22}
                  strokeWidth={2.2}
                />
              </View>
              <Text style={styles.badgeLabel}>{badge.label}</Text>
            </View>
          );
        })}
      </View>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  artworkCard: {
    overflow: "hidden",
    padding: 0,
  },
  badgeCard: {
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flex: 1,
    gap: spacing.sm,
    minWidth: "45%",
    padding: spacing.md,
  },
  badgeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  badgeIcon: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    height: 52,
    justifyContent: "center",
    width: 52,
  },
  badgeLabel: {
    color: colors.text,
    fontFamily: typography.bodyBold,
    fontSize: 14,
  },
  badgeWall: {
    padding: spacing.lg,
  },
  bin: {
    alignItems: "center",
    borderRadius: radius.lg,
    height: 104,
    justifyContent: "center",
    width: 84,
  },
  binRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  copy: {
    gap: spacing.md,
  },
  description: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 17,
    lineHeight: 27,
  },
  floatingBadge: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  floatingText: {
    color: colors.text,
    fontFamily: typography.bodyBold,
    fontSize: 13,
  },
  floatingTitle: {
    color: colors.textSoft,
    fontFamily: typography.bodyBold,
    fontSize: 11,
    textTransform: "uppercase",
  },
  footer: {
    gap: spacing.sm,
  },
  gradientFill: {
    alignItems: "center",
    height: 280,
    justifyContent: "center",
    padding: spacing.xl,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  heroWrap: {
    minHeight: 280,
  },
  levelCard: {
    backgroundColor: colors.secondarySoft,
    borderRadius: radius.md,
    gap: spacing.md,
    padding: spacing.md,
  },
  levelHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  levelIcon: {
    alignItems: "center",
    backgroundColor: colors.surfaceRaised,
    borderRadius: radius.pill,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  levelLabel: {
    color: colors.textSoft,
    fontFamily: typography.bodyBold,
    fontSize: 11,
    textTransform: "uppercase",
  },
  levelValue: {
    color: colors.text,
    fontFamily: typography.bodyBold,
    fontSize: 15,
  },
  levelXp: {
    color: colors.primary,
    fontFamily: typography.bodyBold,
    fontSize: 13,
    marginLeft: "auto",
  },
  miniTile: {
    flex: 1,
    gap: spacing.sm,
    minHeight: 160,
  },
  miniTilePrimary: {
    backgroundColor: colors.primarySoft,
  },
  miniTileText: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 20,
  },
  miniTileTitle: {
    color: colors.text,
    fontFamily: typography.headline,
    fontSize: 20,
  },
  progressDot: {
    backgroundColor: colors.border,
    borderRadius: radius.pill,
    height: 8,
    width: 8,
  },
  progressDotActive: {
    backgroundColor: colors.primary,
    width: 32,
  },
  progressDots: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs,
  },
  root: {
    backgroundColor: colors.background,
    flex: 1,
    gap: spacing.xl,
    padding: spacing.xl,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  skipButton: {
    alignItems: "center",
    paddingVertical: spacing.xs,
  },
  skipButtonLabel: {
    color: colors.primary,
    fontFamily: typography.bodyBold,
    fontSize: 15,
  },
  skipLabel: {
    color: colors.textMuted,
    fontFamily: typography.bodyBold,
    fontSize: 14,
  },
  slideTwoGradient: {
    gap: spacing.md,
    padding: spacing.lg,
  },
  slideTwoGrid: {
    flexDirection: "row",
    gap: spacing.md,
  },
  slideTwoHero: {
    overflow: "hidden",
    padding: 0,
  },
  slideTwoWrap: {
    gap: spacing.md,
  },
  title: {
    color: colors.text,
    fontFamily: typography.headlineStrong,
    fontSize: 34,
    letterSpacing: -0.9,
    lineHeight: 40,
  },
});
