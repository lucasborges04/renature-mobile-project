import {
  ArrowLeft,
  Mail,
  UserRound,
  CheckCircle,
  AlertTriangle,
  Lock,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
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
  ScrollView,
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
  const [originalName, setOriginalName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [isPasswordSectionOpen, setIsPasswordSectionOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        setOriginalName(response.data.name || "");
        setEmail(response.data.email || "");
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSaveProfile = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setFeedback({
        visible: true,
        type: "warning",
        title: "Atenção",
        message: "O nome não pode ficar vazio.",
      });
      return;
    }

    if (trimmedName === originalName.trim()) {
      setFeedback({
        visible: true,
        type: "warning",
        title: "Nenhuma alteração",
        message: "Você não modificou o seu nome atual para salvar.",
      });
      return;
    }

    setIsSavingProfile(true);
    try {
      await api.put("/users/profile", { name: trimmedName, email });
      setOriginalName(trimmedName);

      setFeedback({
        visible: true,
        type: "success",
        title: "Sucesso!",
        message: "Seu nome foi atualizado com sucesso.",
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
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setFeedback({
        visible: true,
        type: "warning",
        title: "Campos Vazios",
        message: "Preencha todos os campos de senha para continuar.",
      });
      return;
    }

    if (newPassword.length < 6) {
      setFeedback({
        visible: true,
        type: "warning",
        title: "Senha Curta",
        message: "A nova senha deve ter no mínimo 6 caracteres.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setFeedback({
        visible: true,
        type: "warning",
        title: "Senhas divergentes",
        message: "A nova senha e a confirmação não batem.",
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      await api.put("/users/change-password", {
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setIsPasswordSectionOpen(false);

      setFeedback({
        visible: true,
        type: "success",
        title: "Segurança Atualizada",
        message: "Sua senha foi alterada com sucesso!",
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Erro ao atualizar a senha. Tente novamente.";

      setFeedback({
        visible: true,
        type: "error",
        title: "Falha de Autenticação",
        message: errorMessage,
      });
    } finally {
      setIsChangingPassword(false);
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: spacing.xxl }}
        >
          <View style={styles.topBar}>
            <Pressable
              onPress={() => onNavigate("profile")}
              style={styles.iconButton}
            >
              <ArrowLeft
                color={activeColors.text}
                size={18}
                strokeWidth={2.4}
              />
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

                <Text style={[styles.inputLabel, { marginTop: spacing.sm }]}>
                  Seu e-mail de acesso
                </Text>
                <View style={[styles.inputRow, styles.disabledInputRow]}>
                  <Mail
                    color={activeColors.textMuted}
                    size={20}
                    strokeWidth={2.2}
                  />
                  <TextInput
                    style={[
                      styles.textInput,
                      { color: activeColors.textMuted },
                    ]}
                    value={email}
                    editable={false}
                    placeholder="email@exemplo.com"
                    placeholderTextColor={activeColors.textSoft}
                  />
                </View>

                <AppButton
                  label={isSavingProfile ? "Salvando..." : "Salvar Nome"}
                  onPress={handleSaveProfile}
                  disabled={isSavingProfile}
                  style={{ marginTop: spacing.md }}
                />
              </SurfaceCard>

              <SurfaceCard style={styles.passwordCard}>
                <Pressable
                  style={styles.accordionHeader}
                  onPress={() =>
                    setIsPasswordSectionOpen(!isPasswordSectionOpen)
                  }
                >
                  <View style={styles.accordionTitleWrap}>
                    <Lock
                      color={activeColors.primary}
                      size={20}
                      strokeWidth={2.2}
                    />
                    <Text style={styles.accordionTitle}>
                      Alterar minha senha
                    </Text>
                  </View>
                  {isPasswordSectionOpen ? (
                    <ChevronUp
                      color={activeColors.textSoft}
                      size={20}
                      strokeWidth={2}
                    />
                  ) : (
                    <ChevronDown
                      color={activeColors.textSoft}
                      size={20}
                      strokeWidth={2}
                    />
                  )}
                </Pressable>

                {isPasswordSectionOpen && (
                  <View style={styles.accordionBody}>
                    <View style={styles.field}>
                      <Text style={styles.inputLabel}>Senha Atual</Text>
                      <View style={styles.inputRow}>
                        <TextInput
                          style={styles.textInput}
                          value={currentPassword}
                          onChangeText={setCurrentPassword}
                          placeholder="••••••••"
                          placeholderTextColor={activeColors.textSoft}
                          secureTextEntry={!showCurrentPassword}
                        />
                        <Pressable
                          onPress={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          style={styles.eyeIconWrap}
                        >
                          {showCurrentPassword ? (
                            <EyeOff color={activeColors.textSoft} size={20} />
                          ) : (
                            <Eye color={activeColors.textSoft} size={20} />
                          )}
                        </Pressable>
                      </View>
                    </View>

                    <View style={styles.field}>
                      <Text style={styles.inputLabel}>Nova Senha</Text>
                      <View style={styles.inputRow}>
                        <TextInput
                          style={styles.textInput}
                          value={newPassword}
                          onChangeText={setNewPassword}
                          placeholder="••••••••"
                          placeholderTextColor={activeColors.textSoft}
                          secureTextEntry={!showNewPassword}
                        />
                        <Pressable
                          onPress={() => setShowNewPassword(!showNewPassword)}
                          style={styles.eyeIconWrap}
                        >
                          {showNewPassword ? (
                            <EyeOff color={activeColors.textSoft} size={20} />
                          ) : (
                            <Eye color={activeColors.textSoft} size={20} />
                          )}
                        </Pressable>
                      </View>
                    </View>

                    <View style={styles.field}>
                      <Text style={styles.inputLabel}>
                        Confirmar Nova Senha
                      </Text>
                      <View style={styles.inputRow}>
                        <TextInput
                          style={styles.textInput}
                          value={confirmPassword}
                          onChangeText={setConfirmPassword}
                          placeholder="••••••••"
                          placeholderTextColor={activeColors.textSoft}
                          secureTextEntry={!showConfirmPassword}
                        />
                        <Pressable
                          onPress={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          style={styles.eyeIconWrap}
                        >
                          {showConfirmPassword ? (
                            <EyeOff color={activeColors.textSoft} size={20} />
                          ) : (
                            <Eye color={activeColors.textSoft} size={20} />
                          )}
                        </Pressable>
                      </View>
                    </View>

                    <AppButton
                      label={
                        isChangingPassword
                          ? "Verificando..."
                          : "Atualizar Senha"
                      }
                      onPress={handleChangePassword}
                      disabled={isChangingPassword}
                      variant="secondary"
                      style={{ marginTop: spacing.xs }}
                    />
                  </View>
                )}
              </SurfaceCard>
            </View>
          )}
        </ScrollView>
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
      marginTop: 60,
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
      gap: spacing.xl,
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
      paddingLeft: spacing.md,
      paddingRight: spacing.xs,
      height: 50,
    },
    disabledInputRow: {
      backgroundColor: themeColors.surfaceMuted,
      borderColor: "transparent",
      opacity: 0.8,
      paddingRight: spacing.md,
    },
    textInput: {
      color: themeColors.text,
      flex: 1,
      fontFamily: typography.bodySemiBold,
      fontSize: 16,
      height: "100%",
    },
    eyeIconWrap: {
      padding: spacing.xs,
      justifyContent: "center",
      alignItems: "center",
    },
    passwordCard: {
      padding: spacing.md,
    },
    accordionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: spacing.xs,
    },
    accordionTitleWrap: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    accordionTitle: {
      color: themeColors.text,
      fontFamily: typography.headline,
      fontSize: 16,
    },
    accordionBody: {
      marginTop: spacing.md,
      gap: spacing.md,
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: themeColors.border,
    },
    field: {
      gap: spacing.xs,
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
