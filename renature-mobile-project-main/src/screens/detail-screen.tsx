import {
  AlertTriangle,
  ArrowLeft,
  Bookmark,
  Share2,
  CheckCircle2,
} from "lucide-react-native";
import { Pressable, StyleSheet, Text, View, ScrollView } from "react-native";

import { AppScreen } from "../components/app-screen";
import {
  AppButton,
  SectionHeading,
  SurfaceCard,
} from "../components/primitives";
import { recyclingGuides } from "../data/content";
import { colors, radius, spacing, typography } from "../theme/tokens";
import type { ScreenId } from "../types/navigation";

type DetailScreenProps = {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  guideId?: string; // NOVO: A tela agora espera um ID
};

export function DetailScreen({
  currentScreen,
  onNavigate,
  guideId = "plastico",
}: DetailScreenProps) {
  // Puxa o guia correspondente do banco de dados local. Se não achar, usa o plástico como fallback seguro.
  const guide =
    recyclingGuides[guideId as keyof typeof recyclingGuides] ||
    recyclingGuides.plastico;

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
            <ArrowLeft color={colors.text} size={18} strokeWidth={2.4} />
          </Pressable>
          <Text style={styles.topTitle}>Guia de Reciclagem</Text>
          <View style={styles.topActions}>
            <Pressable style={styles.iconButton}>
              <Bookmark color={colors.textSoft} size={18} strokeWidth={2.2} />
            </Pressable>
            <Pressable style={styles.iconButton}>
              <Share2 color={colors.textSoft} size={18} strokeWidth={2.2} />
            </Pressable>
          </View>
        </View>

        {/* HERO CARD DINÂMICO: A cor e o texto mudam conforme o material */}
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
                color={colors.primary}
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
                  color={colors.danger}
                  size={18}
                  strokeWidth={2.3}
                />
              </View>
              <Text style={styles.warningText}>{mistake}</Text>
            </View>
          ))}
        </SurfaceCard>

        {/* Botão de concluir retorna para o menu de estudos */}
        <AppButton
          label="Voltar para os guias"
          onPress={() => onNavigate("learn")}
        />
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.border,
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
    color: colors.text,
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
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 21,
  },
  stepIcon: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  stepNumber: {
    color: colors.primary,
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
    color: colors.text,
    fontFamily: typography.headline,
    fontSize: 20,
  },
  warningCard: {
    gap: spacing.md,
  },
  warningIcon: {
    alignItems: "center",
    backgroundColor: "#ffebe9",
    borderRadius: radius.md,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  warningItem: {
    alignItems: "center", // Centraliza o ícone e o texto verticalmente
    flexDirection: "row",
    gap: spacing.md,
  },
  warningText: {
    color: colors.textMuted,
    flex: 1,
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 21,
  },
});
