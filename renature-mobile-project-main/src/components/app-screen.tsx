import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";

import { BottomNav } from "./bottom-nav";
import { spacing } from "../theme/tokens";
import type { ScreenId } from "../types/navigation";
import { useTheme } from "../theme/ThemeContext";

type AppScreenProps = {
  children: React.ReactNode;
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
};

export function AppScreen({
  children,
  currentScreen,
  onNavigate,
}: AppScreenProps) {
  // 1. Puxamos as cores ativas (Claras ou Escuras)
  const { activeColors } = useTheme();

  // 2. Injetamos essas cores vivas nos nossos estilos
  const styles = createStyles(activeColors);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.root}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
        {/* A sua navegação está protegida e intacta aqui */}
        <BottomNav currentScreen={currentScreen} onNavigate={onNavigate} />
      </View>
    </SafeAreaView>
  );
}

// 3. Transformamos o objeto fixo em uma função dinâmica que recebe o "themeColors"
const createStyles = (themeColors: any) =>
  StyleSheet.create({
    content: {
      gap: spacing.xl,
      padding: spacing.xl,
      paddingBottom: 136,
    },
    root: {
      flex: 1,
    },
    safeArea: {
      // 4. O fundo escuta o tema ativo em vez de uma cor estática
      backgroundColor: themeColors.background,
      flex: 1,
    },
  });
