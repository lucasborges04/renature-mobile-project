import { ArrowLeft, Mail, UserRound } from "lucide-react-native";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useEffect, useState } from "react";

import { AppScreen } from "../components/app-screen";
import { AppButton, SurfaceCard } from "../components/primitives";
import { colors, radius, spacing, typography } from "../theme/tokens";
import type { ScreenId } from "../types/navigation";
import { api } from "../services/api";

type EditProfileScreenProps = {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
};

export function EditProfileScreen({
  currentScreen,
  onNavigate,
}: EditProfileScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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
    if (!name.trim() || !email.trim()) {
      Alert.alert("Atenção", "O nome e o e-mail não podem ficar vazios.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Atenção", "Por favor, digite um formato de e-mail válido.");
      return;
    }

    setIsSaving(true);
    try {
      await api.put("/users/profile", { name, email });
      Alert.alert("Sucesso!", "Seus dados foram atualizados com sucesso.", [
        { text: "OK", onPress: () => onNavigate("profile") },
      ]);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Ocorreu um erro ao atualizar o perfil.";
      Alert.alert("Ops!", errorMessage);
    } finally {
      setIsSaving(false);
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
            <ArrowLeft color={colors.text} size={18} strokeWidth={2.4} />
          </Pressable>
          <Text style={styles.topTitle}>Editar Perfil</Text>
          <View style={{ width: 38 }} />
        </View>

        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <View style={styles.formContainer}>
            <SurfaceCard style={styles.inputCard}>
              <Text style={styles.inputLabel}>Como devemos te chamar?</Text>
              <View style={styles.inputRow}>
                <UserRound
                  color={colors.textSoft}
                  size={20}
                  strokeWidth={2.2}
                />
                <TextInput
                  style={styles.textInput}
                  value={name}
                  onChangeText={setName}
                  placeholder="Seu Nome"
                  placeholderTextColor={colors.textSoft}
                  maxLength={50}
                />
              </View>
            </SurfaceCard>

            <SurfaceCard style={styles.inputCard}>
              <Text style={styles.inputLabel}>Seu e-mail de acesso</Text>
              <View style={styles.inputRow}>
                <Mail color={colors.textSoft} size={20} strokeWidth={2.2} />
                <TextInput
                  style={styles.textInput}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="email@exemplo.com"
                  placeholderTextColor={colors.textSoft}
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
    </AppScreen>
  );
}

const styles = StyleSheet.create({
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
    color: colors.text,
    fontFamily: typography.headline,
    fontSize: 20,
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
  formContainer: {
    gap: spacing.md,
  },
  inputCard: {
    gap: spacing.sm,
    padding: spacing.lg,
  },
  inputLabel: {
    color: colors.textMuted,
    fontFamily: typography.bodyBold,
    fontSize: 14,
  },
  inputRow: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    height: 50,
  },
  textInput: {
    color: colors.text,
    flex: 1,
    fontFamily: typography.bodySemiBold,
    fontSize: 16,
    height: "100%",
  },
});
