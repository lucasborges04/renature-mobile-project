import {
  Bell,
  ChevronRight,
  Search,
  type LucideIcon,
} from "lucide-react-native";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Platform,
} from "react-native";
import { useState, useEffect } from "react";

import { AppScreen } from "../components/app-screen";
import { SectionHeading, SurfaceCard } from "../components/primitives";
import { learnCategories } from "../data/content";
import { colors, radius, spacing, typography } from "../theme/tokens";
import type { ScreenId } from "../types/navigation";
import { userService } from "../services/userService";

type LearnScreenProps = {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onSelectGuide?: (id: string) => void; // NOVO
};

export function LearnScreen({
  currentScreen,
  onNavigate,
  onSelectGuide,
}: LearnScreenProps) {
  const [userData, setUserData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await userService.getProfile();
        setUserData(data);
      } catch (error) {
        console.log("Erro ao carregar perfil na tela aprender");
      }
    }
    loadUser();
  }, []);

  const filteredCategories = learnCategories.filter(
    (category) =>
      category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <AppScreen currentScreen={currentScreen} onNavigate={onNavigate}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.topBar}>
          <Text style={styles.greeting}>
            Olá, {userData?.name?.split(" ")[0] || "Eco-Herói"}
          </Text>
          <View style={styles.notifyButton}>
            <Bell color={colors.textSoft} size={18} strokeWidth={2.2} />
          </View>
        </View>

        <SectionHeading
          subtitle="Encontre o destino certo para cada tipo de material."
          title="Aprenda a Descartar"
        />

        <View style={styles.searchBar}>
          <Search color={colors.textSoft} size={18} strokeWidth={2.2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar material ou embalagem"
            placeholderTextColor={colors.textSoft}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.grid}>
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => {
              const Icon = category.icon;

              return (
                <Pressable
                  key={category.title}
                  onPress={() => {
                    if (onSelectGuide) onSelectGuide(category.id!); // Salva o ID antes de navegar!
                    onNavigate("detail");
                  }}
                  style={({ pressed }) => [
                    styles.categoryCard,
                    pressed && styles.cardPressed,
                  ]}
                >
                  <View style={styles.categoryIcon}>
                    <Icon color={colors.primary} size={22} strokeWidth={2.2} />
                  </View>
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                  <Text style={styles.categoryDescription}>
                    {category.description}
                  </Text>
                  <View style={styles.categoryFooter}>
                    <Text style={styles.categoryLink}>Abrir guia</Text>
                    <ChevronRight
                      color={colors.primary}
                      size={16}
                      strokeWidth={2.4}
                    />
                  </View>
                </Pressable>
              );
            })
          ) : (
            <Text style={styles.emptySearch}>Nenhum material encontrado.</Text>
          )}
        </View>

        <SurfaceCard style={styles.tipCard}>
          <Text style={styles.tipTitle}>Sempre limpe as embalagens</Text>
          <Text style={styles.tipText}>
            Embalagens plásticas e de vidro devem ser enxaguadas antes do
            descarte. Resíduos orgânicos podem inviabilizar a reciclagem de todo
            o lote.
          </Text>
        </SurfaceCard>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: { gap: spacing.xl, paddingBottom: 100 },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontFamily: typography.bodySemiBold,
    fontSize: 14,
    padding: 0,
    height: 40,
  },
  emptySearch: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 15,
    textAlign: "center",
    width: "100%",
    paddingVertical: spacing.xl,
  },
  cardPressed: { opacity: 0.94 },
  categoryCard: {
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexBasis: "47%",
    gap: spacing.sm,
    minHeight: 180,
    padding: spacing.lg,
  },
  categoryDescription: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 20,
  },
  categoryFooter: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs,
    marginTop: "auto",
  },
  categoryIcon: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  categoryLink: {
    color: colors.primary,
    fontFamily: typography.bodyBold,
    fontSize: 13,
  },
  categoryTitle: {
    color: colors.text,
    fontFamily: typography.headline,
    fontSize: 22,
  },
  greeting: {
    color: colors.primary,
    fontFamily: typography.headline,
    fontSize: 22,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  notifyButton: {
    alignItems: "center",
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  searchBar: {
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  searchText: {
    color: colors.textSoft,
    fontFamily: typography.bodySemiBold,
    fontSize: 14,
  },
  tipCard: { backgroundColor: colors.primarySoft, gap: spacing.xs },
  tipText: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 21,
  },
  tipTitle: {
    color: colors.text,
    fontFamily: typography.headline,
    fontSize: 22,
  },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
