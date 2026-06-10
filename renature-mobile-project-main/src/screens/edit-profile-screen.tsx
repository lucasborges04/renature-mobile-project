import {
  ArrowLeft,
  Mail,
  UserRound,
  CheckCircle,
  AlertTriangle,
} from "lucide-react-native";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import { useEffect, useState } from "react";

import { AppScreen } from "../components/app-screen";
import { AppButton, SurfaceCard } from "../components/primitives";
import { radius, spacing, typography } from "../theme/tokens";
import type { ScreenId } from "../types/navigation";
import { api } from "../services/api";
import { useTheme } from "../theme/ThemeContext";

type EditProfileScreenProps = {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
};

type FeedbackState = {
  visible: boolean;
  type: "success" | "error" | "warning";
  title: string;
  message: string;
  action?: () => void;
};

export function EditProfileScreen({
  currentScreen,
  onNavigate,
}: EditProfileScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [feedback, setFeedback] = useState<FeedbackState>({
    visible: false,
    type: "success",
    title: "",
    message: "",
  });

  const { activeColors } = useTheme();
  const styles = createStyles(activeColors);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await api.get("/users/profile");
        setName(response.data.name || "");
        setEmail(response.data.email || "");
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      setFeedback({
        visible: true,
        type: "warning",
        title: "Atenção",
        message: "O nome não pode ficar vazio.",
      });
      return;
    }

    setIsSaving(true);
    try {
      await api.put("/users/profile", { name, email });

      setFeedback({
        visible: true,
        type: "success",
        title: "Sucesso!",
        message: "Seus dados foram atualizados com sucesso.",
        action: () => onNavigate("profile"),
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Ocorreu um erro ao atualizar o perfil.";

      setFeedback({
        visible: true,
        type: "error",
        title: "Ops!",
        message: errorMessage,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const closeFeedback = () => {
    const actionToRun = feedback.action;
    setFeedback({ ...feedback, visible: false, action: undefined });
    if (actionToRun) {
      actionToRun();
    }
  };

  const renderFeedbackIcon = () => {
    switch (feedback.type) {
      case "success":
        return (
          <CheckCircle color={activeColors.primary} size={54} strokeWidth={2} />
        );
      case "warning":
        return <AlertTriangle color="#F59E0B" size={54} strokeWidth={2} />;
      case "error":
        return <AlertTriangle color="#EF4444" size={54} strokeWidth={2} />;
    }
  };

  return (
    <AppScreen currentScreen={currentScreen} onNavigate={onNavigate}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <View style={styles.topBar}>
          <Pressable
            onPress={() => onNavigate("profile")}
            style={styles.iconButton}
          >
            <ArrowLeft color={activeColors.text} size={18} strokeWidth={2.4} />
          </Pressable>
          <Text style={styles.topTitle}>Editar Perfil</Text>
          <View style={{ width: 38 }} />
        </View>

        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={activeColors.primary} />
          </View>
        ) : (
          <View style={styles.formContainer}>
            <SurfaceCard style={styles.inputCard}>
              <Text style={styles.inputLabel}>Como devemos te chamar?</Text>
              <View style={styles.inputRow}>
                <UserRound
                  color={activeColors.textSoft}
                  size={20}
                  strokeWidth={2.2}
                />
                <TextInput
                  style={styles.textInput}
                  value={name}
                  onChangeText={setName}
                  placeholder="Seu Nome"
                  placeholderTextColor={activeColors.textSoft}
                  maxLength={50}
                />
              </View>
            </SurfaceCard>

            <SurfaceCard style={styles.inputCard}>
              <Text style={styles.inputLabel}>Seu e-mail de acesso</Text>
              <View style={[styles.inputRow, styles.disabledInputRow]}>
                <Mail
                  color={activeColors.textMuted}
                  size={20}
                  strokeWidth={2.2}
                />
                <TextInput
                  style={[styles.textInput, { color: activeColors.textMuted }]}
                  value={email}
                  editable={false} // Trava a digitação
                  placeholder="email@exemplo.com"
                  placeholderTextColor={activeColors.textSoft}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </SurfaceCard>

            <AppButton
              label={isSaving ? "Salvando..." : "Salvar Alterações"}
              onPress={handleSave}
              disabled={isSaving}
              style={{ marginTop: spacing.xl }}
            />
          </View>
        )}
      </KeyboardAvoidingView>

      <Modal
        visible={feedback.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeFeedback}
      >
        <View style={styles.overlayContainer}>
          <View style={styles.overlayCard}>
            <View style={styles.overlayIconWrap}>{renderFeedbackIcon()}</View>
            <Text style={styles.overlayTitle}>{feedback.title}</Text>
            <Text style={styles.overlayMessage}>{feedback.message}</Text>

            <View style={styles.overlayActions}>
              <AppButton label="Continuar" onPress={closeFeedback} />
            </View>
          </View>
        </View>
      </Modal>
    </AppScreen>
  );
}

const createStyles = (themeColors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    loaderContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    topBar: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: spacing.xl,
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
    formContainer: {
      gap: spacing.md,
    },
    inputCard: {
      gap: spacing.sm,
      padding: spacing.lg,
    },
    inputLabel: {
      color: themeColors.textMuted,
      fontFamily: typography.bodyBold,
      fontSize: 14,
    },
    inputRow: {
      alignItems: "center",
      backgroundColor: themeColors.surfaceSoft,
      borderColor: themeColors.border,
      borderRadius: radius.md,
      borderWidth: 1,
      flexDirection: "row",
      gap: spacing.sm,
      paddingHorizontal: spacing.md,
      height: 50,
    },
    disabledInputRow: {
      backgroundColor: themeColors.surfaceMuted,
      borderColor: "transparent",
      opacity: 0.8,
    },
    textInput: {
      color: themeColors.text,
      flex: 1,
      fontFamily: typography.bodySemiBold,
      fontSize: 16,
      height: "100%",
    },
    overlayContainer: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.85)",
      justifyContent: "center",
      alignItems: "center",
      padding: spacing.xl,
    },
    overlayCard: {
      backgroundColor: themeColors.surfaceRaised,
      borderRadius: radius.xl,
      padding: spacing.xl,
      width: "100%",
      alignItems: "center",
      borderColor: themeColors.border,
      borderWidth: 1,
    },
    overlayIconWrap: {
      marginBottom: spacing.md,
      backgroundColor: themeColors.background,
      padding: spacing.md,
      borderRadius: radius.pill,
    },
    overlayTitle: {
      color: themeColors.text,
      fontFamily: typography.headlineStrong,
      fontSize: 24,
      textAlign: "center",
      marginBottom: spacing.xs,
    },
    overlayMessage: {
      color: themeColors.textMuted,
      fontFamily: typography.body,
      fontSize: 16,
      textAlign: "center",
      lineHeight: 24,
      marginBottom: spacing.xl,
    },
    overlayActions: {
      width: "100%",
    },
  });
