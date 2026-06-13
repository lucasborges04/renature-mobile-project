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
  const { activeColors } = useTheme();

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
        <BottomNav currentScreen={currentScreen} onNavigate={onNavigate} />
      </View>
    </SafeAreaView>
  );
}

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
      backgroundColor: themeColors.background,
      flex: 1,
    },
  });
