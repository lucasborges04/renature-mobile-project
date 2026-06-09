import {
  AlertTriangle,
  ArrowLeft,
  Bookmark,
  Share2,
  CheckCircle2,
} from "lucide-react-native";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
} from "react-native";

import { AppScreen } from "../components/app-screen";
import {
  AppButton,
  SectionHeading,
  SurfaceCard,
} from "../components/primitives";
import { recyclingGuides } from "../data/content";
import { radius, spacing, typography } from "../theme/tokens";
import type { ScreenId } from "../types/navigation";
import { useFavorites } from "../context/FavoritesContext";
import { useTheme } from "../theme/ThemeContext";
import { userService } from "../services/userService";
import { useEffect } from "react";

type DetailScreenProps = {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  guideId?: string;
};

export function DetailScreen({
  currentScreen,
  onNavigate,
  guideId = "plastico",
}: DetailScreenProps) {
  const { activeColors } = useTheme();
  const styles = createStyles(activeColors);
  const { toggleFavorite, isFavorite } = useFavorites();
  const isFav = isFavorite(guideId);

  const guide =
    recyclingGuides[guideId as keyof typeof recyclingGuides] ||
    recyclingGuides.plastico;

  useEffect(() => {
    async function checkReadAchievement() {
      try {
        const response = await userService.unlockAchievement("ALUNO_NATUREZA");

        if (response && response.newlyUnlocked) {
          Alert.alert(
            "Conquista Desbloqueada! 🏆",
            "Aluno da Natureza: Você leu seu primeiro conteúdo educativo!",
          );
        }
      } catch (error) {}
    }

    checkReadAchievement();
  }, []);

  return (
    <AppScreen currentScreen={currentScreen} onNavigate={onNavigate}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.topBar}>
          <Pressable
            onPress={() => onNavigate("learn")}
            style={styles.iconButton}
          >
            <ArrowLeft color={activeColors.text} size={18} strokeWidth={2.4} />
          </Pressable>
          <Text style={styles.topTitle}>Guia de Reciclagem</Text>
          <View style={styles.topActions}>
            <Pressable
              style={styles.iconButton}
              onPress={() => toggleFavorite(guideId)}
            >
              <Bookmark
                color={isFav ? activeColors.primary : activeColors.textSoft}
                fill={isFav ? activeColors.primary : "transparent"}
                size={18}
                strokeWidth={2.2}
              />
            </Pressable>
            <Pressable style={styles.iconButton}>
              <Share2
                color={activeColors.textSoft}
                size={18}
                strokeWidth={2.2}
              />
            </Pressable>
          </View>
        </View>

        <SurfaceCard
          style={[styles.heroCard, { backgroundColor: guide.color }]}
        >
          <Text style={styles.heroTitle}>{guide.title}</Text>
          <Text style={styles.heroSubtitle}>{guide.intro}</Text>
        </SurfaceCard>

        <SectionHeading title="Pode ser reciclado" />
        <SurfaceCard style={styles.safeListCard}>
          {guide.canRecycle.map((item) => (
            <View key={item} style={styles.listItem}>
              <CheckCircle2
                color={activeColors.primary}
                size={20}
                strokeWidth={2.5}
              />
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </SurfaceCard>

        <SectionHeading title="Como descartar corretamente" />
        <View style={styles.listWrap}>
          {guide.steps.map((step, index) => (
            <SurfaceCard key={index} style={styles.stepCard}>
              <View style={styles.stepIcon}>
                <Text style={styles.stepNumber}>{index + 1}</Text>
              </View>
              <View style={styles.stepCopy}>
                <Text style={styles.stepDescription}>{step}</Text>
              </View>
            </SurfaceCard>
          ))}
        </View>

        <SectionHeading title="O que NÃO fazer (Não reciclável)" />
        <SurfaceCard style={styles.warningCard}>
          {guide.cannotRecycle.map((mistake) => (
            <View key={mistake} style={styles.warningItem}>
              <View style={styles.warningIcon}>
                <AlertTriangle
                  color={activeColors.danger}
                  size={18}
                  strokeWidth={2.3}
                />
              </View>
              <Text style={styles.warningText}>{mistake}</Text>
            </View>
          ))}
        </SurfaceCard>

        <AppButton
          label="Voltar para os guias"
          onPress={() => onNavigate("learn")}
        />
      </ScrollView>
    </AppScreen>
  );
}

const createStyles = (themeColors: any) =>
  StyleSheet.create({
    scrollContent: {
      gap: spacing.xl,
      paddingBottom: spacing.xl,
    },
    heroCard: {
      gap: spacing.md,
      borderWidth: 0,
      padding: spacing.xl,
    },
    heroSubtitle: {
      color: "#ffffff",
      fontFamily: typography.body,
      fontSize: 15,
      lineHeight: 22,
      opacity: 0.9,
    },
    heroTitle: {
      color: "#ffffff",
      fontFamily: typography.headlineStrong,
      fontSize: 34,
    },
    iconButton: {
      alignItems: "center",
      backgroundColor: themeColors.surfaceRaised,
      borderColor: themeColors.border,
      borderRadius: radius.pill,
      borderWidth: 1,
      height: 38,
      justifyContent: "center",
      width: 38,
    },
    listWrap: {
      gap: spacing.md,
    },
    safeListCard: {
      gap: spacing.md,
    },
    listItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
    },
    listText: {
      color: themeColors.text,
      fontFamily: typography.bodySemiBold,
      fontSize: 15,
      flex: 1,
    },
    stepCard: {
      alignItems: "center",
      flexDirection: "row",
      gap: spacing.md,
    },
    stepCopy: {
      flex: 1,
    },
    stepDescription: {
      color: themeColors.textMuted,
      fontFamily: typography.body,
      fontSize: 14,
      lineHeight: 21,
    },
    stepIcon: {
      alignItems: "center",
      backgroundColor: themeColors.primarySoft,
      borderRadius: radius.md,
      height: 42,
      justifyContent: "center",
      width: 42,
    },
    stepNumber: {
      color: themeColors.primary,
      fontFamily: typography.headlineStrong,
      fontSize: 18,
    },
    topActions: {
      flexDirection: "row",
      gap: spacing.xs,
    },
    topBar: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    topTitle: {
      color: themeColors.text,
      fontFamily: typography.headline,
      fontSize: 20,
    },
    warningCard: {
      gap: spacing.md,
    },
    warningIcon: {
      alignItems: "center",
      backgroundColor: themeColors.surfaceSoft,
      borderRadius: radius.md,
      height: 38,
      justifyContent: "center",
      width: 38,
    },
    warningItem: {
      alignItems: "center",
      flexDirection: "row",
      gap: spacing.md,
    },
    warningText: {
      color: themeColors.textMuted,
      flex: 1,
      fontFamily: typography.body,
      fontSize: 14,
      lineHeight: 21,
    },
  });
