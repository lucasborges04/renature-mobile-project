import {
  ArrowLeft,
  Building2,
  Code2,
  GraduationCap,
  Info,
  Users,
} from "lucide-react-native";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
} from "react-native";

import { AppScreen } from "../components/app-screen";
import { SurfaceCard } from "../components/primitives";
import { radius, spacing, typography } from "../theme/tokens";
import { useTheme } from "../theme/ThemeContext";
import type { ScreenId } from "../types/navigation";

type CreditsScreenProps = {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
};

export function CreditsScreen({
  currentScreen,
  onNavigate,
}: CreditsScreenProps) {
  const { activeColors } = useTheme();
  const styles = createStyles(activeColors);

  const students = [
    "Alisson Barbosa Santana",
    "Eduardo dos Santos Martins",
    "João Renato Cardoso Marques",
    "Lucas Bucci Borges",
    "Victor Hugo de Deus Machado",
  ];

  return (
    <AppScreen currentScreen={currentScreen} onNavigate={onNavigate}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.topBar}>
          <Pressable
            onPress={() => onNavigate("profile")}
            style={styles.iconButton}
          >
            <ArrowLeft color={activeColors.text} size={18} strokeWidth={2.4} />
          </Pressable>
          <Text style={styles.topTitle}>Créditos</Text>
          <View style={{ width: 38 }} />
        </View>

        <SurfaceCard style={styles.card}>
          <View style={styles.cardHeader}>
            <Info color={activeColors.primary} size={22} strokeWidth={2.2} />
            <Text style={styles.cardTitle}>O Projeto</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.highlightText}>
              Projeto de Extensão Fábrica de Software
            </Text>
            <Text style={styles.bodyText}>
              A finalidade deste projeto é proporcionar aos estudantes a
              experiência real do desenvolvimento de sistemas, integrando
              conhecimentos teóricos em um ambiente profissional, aplicando
              tecnologias modernas para solucionar problemas reais da
              comunidade.
            </Text>
          </View>
        </SurfaceCard>

        <SurfaceCard style={styles.card}>
          <View style={styles.cardHeader}>
            <GraduationCap
              color={activeColors.primary}
              size={22}
              strokeWidth={2.2}
            />
            <Text style={styles.cardTitle}>Equipe Docente</Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.personBlock}>
              <Text style={styles.roleLabel}>
                Professor Coordenador do Projeto
              </Text>
              <Text style={styles.personName}>
                Prof. Dr. Elvio Gilberto da Silva
              </Text>
            </View>

            <View style={styles.personBlock}>
              <Text style={styles.roleLabel}>Professores Colaboradores</Text>
              <Text style={styles.personName}>
                Prof. Me. Luis Felipe Grael Tinós
              </Text>
              <Text style={styles.personName}>
                Profª. Esp. Camila Pellizon Floret
              </Text>
            </View>
          </View>
        </SurfaceCard>

        <SurfaceCard style={styles.card}>
          <View style={styles.cardHeader}>
            <Code2 color={activeColors.primary} size={22} strokeWidth={2.2} />
            <Text style={styles.cardTitle}>Desenvolvedores</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.roleLabel}>Curso: Ciência da Computação</Text>
            <View style={styles.listWrap}>
              {students.map((student, index) => (
                <View key={index} style={styles.listItem}>
                  <View
                    style={[
                      styles.bullet,
                      { backgroundColor: activeColors.primary },
                    ]}
                  />
                  <Text style={styles.personName}>{student}</Text>
                </View>
              ))}
            </View>
          </View>
        </SurfaceCard>

        <SurfaceCard style={styles.card}>
          <View style={styles.cardHeader}>
            <Building2
              color={activeColors.primary}
              size={22}
              strokeWidth={2.2}
            />
            <Text style={styles.cardTitle}>Realização e Apoio</Text>
          </View>

          <View style={styles.logosContainer}>
            <View style={styles.logoBlock}>
              <Text style={styles.logoLabel}>Desenvolvimento:</Text>
              <Image
                source={require("../../assets/logo-unisagrado-cor.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.logoBlock}>
              <Text style={styles.logoLabel}>Apoio:</Text>
              <Image
                source={require("../../assets/coordenadoria-de-extensao.jpg")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </SurfaceCard>
      </ScrollView>
    </AppScreen>
  );
}

const createStyles = (themeColors: any) =>
  StyleSheet.create({
    scrollContent: {
      gap: spacing.xl,
      paddingBottom: spacing.xxl,
    },
    topBar: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: spacing.sm,
    },
    topTitle: {
      color: themeColors.text,
      fontFamily: typography.headline,
      fontSize: 20,
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
    card: {
      padding: spacing.lg,
      gap: spacing.md,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: themeColors.border,
      paddingBottom: spacing.sm,
    },
    cardTitle: {
      color: themeColors.text,
      fontFamily: typography.headline,
      fontSize: 18,
    },
    cardContent: {
      gap: spacing.md,
    },
    highlightText: {
      color: themeColors.primary,
      fontFamily: typography.bodyBold,
      fontSize: 16,
    },
    bodyText: {
      color: themeColors.textMuted,
      fontFamily: typography.body,
      fontSize: 15,
      lineHeight: 22,
    },
    personBlock: {
      gap: spacing.xxs,
    },
    roleLabel: {
      color: themeColors.textSoft,
      fontFamily: typography.bodyBold,
      fontSize: 13,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 2,
    },
    personName: {
      color: themeColors.text,
      fontFamily: typography.bodySemiBold,
      fontSize: 16,
    },
    listWrap: {
      gap: spacing.xs,
    },
    listItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    bullet: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    logosContainer: {
      gap: spacing.lg,
      marginTop: spacing.xs,
    },
    logoBlock: {
      alignItems: "center",
      gap: spacing.sm,
    },
    logoLabel: {
      color: themeColors.textMuted,
      fontFamily: typography.bodyBold,
      fontSize: 14,
    },
    logoImage: {
      width: "100%",
      height: 100,
      borderRadius: radius.sm,
    },
    imagePlaceholder: {
      width: "100%",
      height: 100,
      backgroundColor: themeColors.surfaceMuted,
      borderRadius: radius.sm,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: themeColors.border,
      borderStyle: "dashed",
    },
    placeholderText: {
      color: themeColors.textSoft,
      fontFamily: typography.bodyBold,
    },
    divider: {
      height: 1,
      backgroundColor: themeColors.border,
      width: "80%",
      alignSelf: "center",
    },
  });
