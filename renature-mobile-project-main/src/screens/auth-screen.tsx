import { LinearGradient } from "expo-linear-gradient";
import {
  Apple,
  ArrowRight,
  Leaf,
  Lock,
  Mail,
  UserRound,
} from "lucide-react-native";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

import { AppButton, StatPill, SurfaceCard } from "../components/primitives";
import { authBenefits } from "../data/content";
import { stitchConfig } from "../config/stitch";
import { radius, spacing, typography } from "../theme/tokens";
import { useTheme } from "../theme/ThemeContext";
import type { ScreenId } from "../types/navigation";
import { authService } from "../services/authService";

WebBrowser.maybeCompleteAuthSession();

type AuthScreenProps = {
  onNavigate: (screen: ScreenId) => void;
};

export function AuthScreen({ onNavigate }: AuthScreenProps) {
  const { activeColors } = useTheme();
  const styles = createStyles(activeColors);

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      "75150017031-h3msun3o4eemske9i58150nv7ejuejm3.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      handleGoogleLogin(id_token);
    }
  }, [response]);

  const handleGoogleLogin = async (idToken: string) => {
    try {
      setIsLoading(true);
      const data = await authService.googleLogin(idToken);
      Alert.alert("Sucesso!", `Bem-vindo pelo Google, ${data.user.name}!`);
      onNavigate("home");
    } catch (error: any) {
      Alert.alert("Erro no Google", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Atenção", "Por favor, preencha o email e a senha.");
      return;
    }
    try {
      setIsLoading(true);
      const data = await authService.login(email.trim(), password);
      Alert.alert("Sucesso!", `Bem-vindo de volta, ${data.user.name}!`);
      onNavigate("home");
    } catch (error: any) {
      Alert.alert("Erro no Login", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Atenção", "Por favor, preencha todos os campos.");
      return;
    }
    try {
      setIsLoading(true);
      await authService.register(name.trim(), email.trim(), password);

      setName("");
      setPassword("");
      setIsLoginMode(true);
      setSuccessMessage(
        "Conta criada com sucesso! Digite a senha para entrar.",
      );
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error: any) {
      Alert.alert(
        "Erro no Cadastro",
        error.message || "Não foi possível criar a conta.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (isLoginMode) {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setName("");
    setEmail("");
    setPassword("");
    setSuccessMessage("");
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
          {/* Bolhas de fundo */}
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
            <StatPill label={stitchConfig.projectTitle} tone="secondary" />

            <Text style={styles.formTitle}>
              {isLoginMode ? "Bem-vindo de volta" : "Crie sua conta"}
            </Text>
            <Text style={styles.formSubtitle}>
              {isLoginMode
                ? "Entre para continuar sua jornada ecológica."
                : "Junte-se a nós e comece a pontuar."}
            </Text>

            {!isLoginMode && (
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

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Senha</Text>
              <View style={styles.inputWrap}>
                <Lock
                  color={activeColors.textSoft}
                  size={18}
                  strokeWidth={2.2}
                />
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor={activeColors.textSoft}
                  secureTextEntry
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
            </View>

            {isLoginMode && (
              <Pressable style={styles.textLink}>
                <Text style={styles.textLinkLabel}>Esqueceu a senha?</Text>
              </Pressable>
            )}

            <Text style={styles.divider}>Ou</Text>

            <Pressable
              style={styles.socialButton}
              onPress={() => promptAsync()}
              disabled={!request || isLoading}
            >
              <View style={styles.socialIcon}>
                <Mail
                  color={activeColors.primary}
                  size={18}
                  strokeWidth={2.2}
                />
              </View>
              <Text style={styles.socialLabel}>
                {isLoading ? "Aguarde..." : "Continuar com Google"}
              </Text>
            </Pressable>

            <AppButton
              icon={ArrowRight}
              label={
                isLoading ? "Aguarde..." : isLoginMode ? "Entrar" : "Cadastrar"
              }
              onPress={handleSubmit}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {isLoginMode ? "Ainda não tem conta?" : "Já tem uma conta?"}
              </Text>
              <Pressable onPress={toggleMode}>
                <Text style={styles.footerLink}>
                  {isLoginMode ? "Cadastre-se" : "Entrar"}
                </Text>
              </Pressable>
            </View>
          </SurfaceCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (themeColors: any) =>
  StyleSheet.create({
    benefits: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
    },
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
    brand: {
      alignItems: "center",
      flexDirection: "row",
      gap: spacing.sm,
    },
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
    divider: {
      color: themeColors.textSoft,
      fontFamily: typography.bodyBold,
      fontSize: 13,
      textAlign: "center",
    },
    field: {
      gap: spacing.xs,
    },
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
    formCard: {
      gap: spacing.md,
    },
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
    hero: {
      gap: spacing.md,
    },
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
    safeArea: {
      backgroundColor: themeColors.background,
      flex: 1,
    },
    scrollRoot: {
      backgroundColor: themeColors.background,
      flexGrow: 1,
      gap: spacing.xl,
      justifyContent: "center",
      padding: spacing.xl,
    },
    socialButton: {
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
    socialIcon: {
      alignItems: "center",
      backgroundColor: themeColors.surfaceRaised,
      borderRadius: radius.pill,
      height: 34,
      justifyContent: "center",
      width: 34,
    },
    socialLabel: {
      color: themeColors.text,
      fontFamily: typography.bodyBold,
      fontSize: 15,
    },
    subheadline: {
      color: themeColors.textMuted,
      fontFamily: typography.body,
      fontSize: 16,
      lineHeight: 25,
    },
    textLink: {
      alignSelf: "flex-end",
    },
    textLinkLabel: {
      color: themeColors.primary,
      fontFamily: typography.bodyBold,
      fontSize: 14,
    },
  });
