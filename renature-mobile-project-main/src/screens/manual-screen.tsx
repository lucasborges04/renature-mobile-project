import {
  ArrowLeft,
  CheckCircle,
  Database,
  Droplets,
  FileText,
  Laptop,
  Recycle,
  TreePine,
} from "lucide-react-native";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { useState } from "react";

import { AppScreen } from "../components/app-screen";
import {
  AppButton,
  SectionHeading,
  SurfaceCard,
} from "../components/primitives";
import { colors, radius, spacing, typography } from "../theme/tokens";
import type { ScreenId } from "../types/navigation";
import { recyclingService } from "../services/recyclingService";

type ManualScreenProps = {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
};

const materials = [
  { id: "Plástico", label: "Plástico", icon: Droplets },
  { id: "Vidro", label: "Vidro", icon: Recycle },
  { id: "Papel", label: "Papel", icon: FileText },
  { id: "Metal", label: "Metal", icon: Database },
  { id: "Eletrônico", label: "Eletrônicos", icon: Laptop },
  { id: "Orgânico", label: "Orgânico", icon: TreePine },
];

export function ManualScreen({ currentScreen, onNavigate }: ManualScreenProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleManualSubmit = async () => {
    if (!selectedMaterial) {
      Alert.alert("Atenção", "Por favor, selecione o tipo de material.");
      return;
    }

    try {
      setIsSubmitting(true);

      type ValidMaterial =
        | "Plástico"
        | "Vidro"
        | "Papel"
        | "Metal"
        | "Eletrônico"
        | "Orgânico";

      const response = await recyclingService.recycleManual(
        selectedMaterial as ValidMaterial,
        description.trim() || `Reciclagem de ${selectedMaterial}`,
      );

      if (response.levelUpMessage) {
        Alert.alert("Evolução!", response.levelUpMessage);
      } else {
        Alert.alert(
          "Sucesso!",
          `Registro concluído! (+${response.pointsEarned} pts)`,
        );
      }

      setSelectedMaterial(null);
      setDescription("");
      onNavigate("home");
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Falha ao registrar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppScreen currentScreen={currentScreen} onNavigate={onNavigate}>
      <KeyboardAvoidingView
        style={styles.keyboardWrap}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <Pressable
              onPress={() => onNavigate("scanner")}
              style={styles.backButton}
            >
              <ArrowLeft color={colors.text} size={20} strokeWidth={2.5} />
            </Pressable>
            <Text style={styles.headerTitle}>Registro Manual</Text>
            <View style={styles.spacer} />
          </View>
          <SectionHeading
            title="O que você está reciclando?"
            subtitle="Selecione o material principal do item para calcularmos os pontos corretamente."
          />
          <View style={styles.grid}>
            {materials.map((mat) => {
              const Icon = mat.icon;
              const isSelected = selectedMaterial === mat.id;
              return (
                <Pressable
                  key={mat.id}
                  onPress={() => setSelectedMaterial(mat.id)}
                  style={[
                    styles.materialCard,
                    isSelected && styles.materialCardActive,
                  ]}
                >
                  <View
                    style={[
                      styles.iconWrap,
                      isSelected && styles.iconWrapActive,
                    ]}
                  >
                    <Icon
                      color={isSelected ? colors.white : colors.primary}
                      size={24}
                      strokeWidth={2.2}
                    />
                  </View>
                  <Text
                    style={[
                      styles.materialLabel,
                      isSelected && styles.materialLabelActive,
                    ]}
                  >
                    {mat.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <SurfaceCard style={styles.inputCard}>
            <Text style={styles.inputLabel}>Nome do Produto (Opcional)</Text>
            <Text style={styles.inputHint}>
              Ex: "Garrafa de Suco 1L" ou "Caixa de Sapato". Isso nos ajuda a
              mapear novos itens!
            </Text>
            <View style={styles.inputWrap}>
              <TextInput
                placeholder="Descreva o item..."
                placeholderTextColor={colors.textSoft}
                style={styles.input}
                value={description}
                onChangeText={setDescription}
                maxLength={40}
              />
            </View>
          </SurfaceCard>
          <AppButton
            icon={CheckCircle}
            label={isSubmitting ? "Registrando..." : "Confirmar Reciclagem"}
            onPress={handleManualSubmit}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  keyboardWrap: {
    flex: 1,
  },
  spacer: {
    width: 40,
  },
  backButton: {
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    color: colors.text,
    fontFamily: typography.headline,
    fontSize: 20,
  },
  iconWrap: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    height: 50,
    justifyContent: "center",
    width: 50,
  },
  iconWrapActive: {
    backgroundColor: colors.primary,
  },
  input: {
    color: colors.text,
    flex: 1,
    fontFamily: typography.bodySemiBold,
    fontSize: 15,
  },
  inputCard: {
    gap: spacing.sm,
  },
  inputHint: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
  inputLabel: {
    color: colors.text,
    fontFamily: typography.headline,
    fontSize: 18,
  },
  inputWrap: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    minHeight: 56,
    paddingHorizontal: spacing.md,
  },
  materialCard: {
    alignItems: "center",
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexBasis: "47%",
    gap: spacing.sm,
    padding: spacing.md,
  },
  materialCardActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  materialLabel: {
    color: colors.text,
    fontFamily: typography.bodyBold,
    fontSize: 15,
  },
  materialLabelActive: {
    color: colors.primaryDeep,
  },
  scrollContent: {
    gap: spacing.xl,
    paddingBottom: spacing.xl,
  },
});
