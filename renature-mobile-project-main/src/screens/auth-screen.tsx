import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowRight,
  Leaf,
  Lock,
  Mail,
  UserRound,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
} from "lucide-react-native";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";

import { AppButton, StatPill, SurfaceCard } from "../components/primitives";
import { authBenefits } from "../data/content";
import { stitchConfig } from "../config/stitch";
import { radius, spacing, typography } from "../theme/tokens";
import { useTheme } from "../theme/ThemeContext";
import type { ScreenId } from "../types/navigation";
import { authService } from "../services/authService";
import { api } from "../services/api";

type AuthScreenProps = {
  onNavigate: (screen: ScreenId) => void;
};

type FeedbackState = {
  visible: boolean;
  type: "success" | "error" | "warning";
  title: string;
  message: string;
  action?: () => void;
};

type AuthMode = "login" | "register" | "forgot" | "reset";

export function AuthScreen({ onNavigate }: AuthScreenProps) {
  const { activeColors } = useTheme();
  const styles = createStyles(activeColors);

  const [authMode, setAuthMode] = useState<AuthMode>("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetCode, setResetCode] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [feedback, setFeedback] = useState<FeedbackState>({
    visible: false,
    type: "success",
    title: "",
    message: "",
  });

  const handleLogin = async () => {
    if (!email || !password) {
      setFeedback({
        visible: true,
        type: "warning",
        title: "Atenção",
        message: "Por favor, preencha o email e a senha.",
      });
      return;
    }
    try {
      setIsLoading(true);
      const data = await authService.login(email.trim(), password);
      setFeedback({
        visible: true,
        type: "success",
        title: "Sucesso!",
        message: `Bem-vindo de volta, ${data.user.name}!`,
        action: () => onNavigate("home"),
      });
    } catch (error: any) {
      setFeedback({
        visible: true,
        type: "error",
        title: "Erro no Login",
        message: error.message || "Credenciais inválidas.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setFeedback({
        visible: true,
        type: "warning",
        title: "Atenção",
        message: "Por favor, preencha todos os campos.",
      });
      return;
    }

    if (password.length < 8) {
      setFeedback({
        visible: true,
        type: "warning",
        title: "Senha Curta",
        message: "A sua senha deve ter no mínimo 8 caracteres.",
      });
      return;
    }

    try {
      setIsLoading(true);
      await authService.register(name.trim(), email.trim(), password);

      setFeedback({
        visible: true,
        type: "success",
        title: "Conta criada!",
        message: "Conta criada com sucesso! Você já pode entrar com sua senha.",
        action: () => {
          setName("");
          setPassword("");
          setAuthMode("login");
          setShowPassword(false);
        },
      });
    } catch (error: any) {
      setFeedback({
        visible: true,
        type: "error",
        title: "Erro no Cadastro",
        message: error.message || "Não foi possível criar a conta.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setFeedback({
        visible: true,
        type: "warning",
        title: "Atenção",
        message: "Digite o seu e-mail para receber o código.",
      });
      return;
    }
    try {
      setIsLoading(true);
      const res = await api.post("/users/forgot-password", {
        email: email.trim(),
      });
      setFeedback({
        visible: true,
        type: "success",
        title: "Código Enviado!",
        message:
          res.data.message || "Verifique sua caixa de entrada (e o spam).",
        action: () => setAuthMode("reset"),
      });
    } catch (error: any) {
      setFeedback({
        visible: true,
        type: "error",
        title: "Ops!",
        message:
          error.response?.data?.message || "Não foi possível enviar o código.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetCode || !password) {
      setFeedback({
        visible: true,
        type: "warning",
        title: "Atenção",
        message: "Preencha o código e a nova senha.",
      });
      return;
    }
    try {
      setIsLoading(true);
      const res = await api.post("/users/reset-password", {
        email: email.trim(),
        token: resetCode.trim(),
        newPassword: password,
      });
      setFeedback({
        visible: true,
        type: "success",
        title: "Senha Redefinida!",
        message: res.data.message || "Sua senha foi alterada com sucesso.",
        action: () => {
          setAuthMode("login");
          setPassword("");
          setResetCode("");
          setShowPassword(false);
        },
      });
    } catch (error: any) {
      setFeedback({
        visible: true,
        type: "error",
        title: "Erro na Redefinição",
        message:
          error.response?.data?.message || "Código inválido ou expirado.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (authMode === "login") handleLogin();
    else if (authMode === "register") handleRegister();
    else if (authMode === "forgot") handleForgotPassword();
    else if (authMode === "reset") handleResetPassword();
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

  const getFormTitle = () => {
    if (authMode === "login") return "Bem-vindo de volta";
    if (authMode === "register") return "Crie sua conta";
    if (authMode === "forgot") return "Recuperar Senha";
    if (authMode === "reset") return "Criar Nova Senha";
  };

  const getFormSubtitle = () => {
    if (authMode === "login")
      return "Entre para continuar sua jornada ecológica.";
    if (authMode === "register") return "Junte-se a nós e comece a pontuar.";
    if (authMode === "forgot")
      return "Digite seu e-mail para receber um código de 6 dígitos.";
    if (authMode === "reset")
      return "Digite o código que chegou no e-mail e a sua nova senha.";
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollRoot}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.bgBlobTop} />
          <View style={styles.bgBlobBottom} />

          <View style={styles.hero}>
            <View style={styles.brand}>
              <View style={styles.brandIcon}>
                <Leaf
                  color={activeColors.primary}
                  size={18}
                  strokeWidth={2.5}
                />
              </View>
              <Text style={styles.brandText}>Terra</Text>
            </View>

            <Text style={styles.headline}>
              Plante uma semente para um futuro mais verde.
            </Text>
            <Text style={styles.subheadline}>
              Entre para continuar sua jornada ecológica e acompanhar seu
              impacto real no planeta.
            </Text>

            <View style={styles.benefits}>
              {authBenefits.map((benefit, index) => (
                <StatPill
                  key={benefit}
                  label={benefit}
                  tone={index === 2 ? "tertiary" : "primary"}
                />
              ))}
            </View>
          </View>

          <SurfaceCard style={styles.formCard}>
            <Text style={styles.formTitle}>{getFormTitle()}</Text>
            <Text style={styles.formSubtitle}>{getFormSubtitle()}</Text>

            {authMode === "register" && (
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Nome</Text>
                <View style={styles.inputWrap}>
                  <UserRound
                    color={activeColors.textSoft}
                    size={18}
                    strokeWidth={2.2}
                  />
                  <TextInput
                    autoCapitalize="words"
                    placeholder="Como devemos te chamar?"
                    placeholderTextColor={activeColors.textSoft}
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              </View>
            )}

            {(authMode === "login" ||
              authMode === "register" ||
              authMode === "forgot") && (
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>E-mail</Text>
                <View style={styles.inputWrap}>
                  <Mail
                    color={activeColors.textSoft}
                    size={18}
                    strokeWidth={2.2}
                  />
                  <TextInput
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="mariana@terra.app"
                    placeholderTextColor={activeColors.textSoft}
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>
            )}

            {authMode === "reset" && (
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Código de 6 dígitos</Text>
                <View style={styles.inputWrap}>
                  <Lock
                    color={activeColors.textSoft}
                    size={18}
                    strokeWidth={2.2}
                  />
                  <TextInput
                    keyboardType="number-pad"
                    maxLength={6}
                    placeholder="Ex: 123456"
                    placeholderTextColor={activeColors.textSoft}
                    style={styles.input}
                    value={resetCode}
                    onChangeText={setResetCode}
                  />
                </View>
              </View>
            )}

            {(authMode === "login" ||
              authMode === "register" ||
              authMode === "reset") && (
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>
                  {authMode === "reset" ? "Nova Senha" : "Senha"}
                </Text>
                <View style={styles.inputWrap}>
                  <Lock
                    color={activeColors.textSoft}
                    size={18}
                    strokeWidth={2.2}
                  />
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor={activeColors.textSoft}
                    secureTextEntry={!showPassword}
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <EyeOff color={activeColors.textSoft} size={18} />
                    ) : (
                      <Eye color={activeColors.textSoft} size={18} />
                    )}
                  </Pressable>
                </View>
              </View>
            )}

            {authMode === "login" && (
              <Pressable
                style={styles.textLink}
                onPress={() => setAuthMode("forgot")}
              >
                <Text style={styles.textLinkLabel}>Esqueceu a senha?</Text>
              </Pressable>
            )}

            <AppButton
              icon={authMode !== "forgot" ? ArrowRight : undefined}
              label={
                isLoading
                  ? "Aguarde..."
                  : authMode === "login"
                    ? "Entrar"
                    : authMode === "register"
                      ? "Cadastrar"
                      : authMode === "forgot"
                        ? "Enviar Código"
                        : "Redefinir Senha"
              }
              onPress={handleSubmit}
            />

            <View style={styles.footer}>
              {authMode === "login" || authMode === "register" ? (
                <>
                  <Text style={styles.footerText}>
                    {authMode === "login"
                      ? "Ainda não tem conta?"
                      : "Já tem uma conta?"}
                  </Text>
                  <Pressable
                    onPress={() => {
                      setAuthMode(authMode === "login" ? "register" : "login");
                      setName("");
                      setPassword("");
                      setShowPassword(false);
                    }}
                  >
                    <Text style={styles.footerLink}>
                      {authMode === "login" ? "Cadastre-se" : "Entrar"}
                    </Text>
                  </Pressable>
                </>
              ) : (
                <Pressable
                  onPress={() => {
                    setAuthMode("login");
                    setPassword("");
                    setResetCode("");
                    setShowPassword(false);
                  }}
                >
                  <Text style={styles.footerLink}>
                    Lembrou a senha? Voltar para o Login
                  </Text>
                </Pressable>
              )}
            </View>
          </SurfaceCard>
        </ScrollView>
      </KeyboardAvoidingView>

      {feedback.visible && (
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
      )}
    </SafeAreaView>
  );
}

const createStyles = (themeColors: any) =>
  StyleSheet.create({
    benefits: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
    bgBlobBottom: {
      backgroundColor: themeColors.tertiarySoft,
      borderRadius: radius.pill,
      bottom: -80,
      height: 260,
      opacity: 0.5,
      position: "absolute",
      right: -60,
      width: 260,
    },
    bgBlobTop: {
      backgroundColor: themeColors.primarySoft,
      borderRadius: radius.pill,
      height: 260,
      left: -80,
      opacity: 0.55,
      position: "absolute",
      top: -80,
      width: 260,
    },
    brand: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
    brandIcon: {
      alignItems: "center",
      backgroundColor: themeColors.primarySoft,
      borderRadius: radius.pill,
      height: 40,
      justifyContent: "center",
      width: 40,
    },
    brandText: {
      color: themeColors.primary,
      fontFamily: typography.headlineStrong,
      fontSize: 26,
    },
    field: { gap: spacing.xs },
    fieldLabel: {
      color: themeColors.textMuted,
      fontFamily: typography.bodyBold,
      fontSize: 14,
    },
    footer: {
      alignItems: "center",
      flexDirection: "row",
      gap: spacing.xs,
      justifyContent: "center",
      marginTop: spacing.sm,
    },
    footerLink: {
      color: themeColors.primary,
      fontFamily: typography.bodyBold,
      fontSize: 14,
    },
    footerText: {
      color: themeColors.textSoft,
      fontFamily: typography.body,
      fontSize: 14,
    },
    formCard: { gap: spacing.md },
    formSubtitle: {
      color: themeColors.textMuted,
      fontFamily: typography.body,
      fontSize: 15,
      lineHeight: 23,
    },
    formTitle: {
      color: themeColors.text,
      fontFamily: typography.headline,
      fontSize: 28,
    },
    headline: {
      color: themeColors.text,
      fontFamily: typography.headlineStrong,
      fontSize: 34,
      letterSpacing: -0.9,
      lineHeight: 40,
    },
    hero: { gap: spacing.md },
    input: {
      color: themeColors.text,
      flex: 1,
      fontFamily: typography.bodySemiBold,
      fontSize: 15,
    },
    inputWrap: {
      alignItems: "center",
      backgroundColor: themeColors.surfaceMuted,
      borderColor: themeColors.border,
      borderRadius: radius.md,
      borderWidth: 1,
      flexDirection: "row",
      gap: spacing.sm,
      minHeight: 56,
      paddingHorizontal: spacing.md,
    },
    safeArea: { backgroundColor: themeColors.background, flex: 1 },
    scrollRoot: {
      backgroundColor: themeColors.background,
      flexGrow: 1,
      gap: spacing.xl,
      justifyContent: "center",
      padding: spacing.xl,
    },
    subheadline: {
      color: themeColors.textMuted,
      fontFamily: typography.body,
      fontSize: 16,
      lineHeight: 25,
    },
    textLink: { alignSelf: "flex-end" },
    textLinkLabel: {
      color: themeColors.primary,
      fontFamily: typography.bodyBold,
      fontSize: 14,
    },
    overlayContainer: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.85)",
      zIndex: 999,
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
    overlayActions: { width: "100%" },
  });
