import {
  BookOpen,
  Home,
  ScanLine,
  Trophy,
  UserRound,
  type LucideIcon,
} from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography } from "../theme/tokens";
import { useTheme } from "../theme/ThemeContext";
import type { MainTab, ScreenId } from "../types/navigation";

type BottomNavProps = {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
};

type NavItem = {
  icon: LucideIcon;
  label: string;
  tab: MainTab;
};

const navItems: NavItem[] = [
  { icon: Home, label: "Home", tab: "home" },
  { icon: BookOpen, label: "Aprender", tab: "learn" },
  { icon: ScanLine, label: "Scanner", tab: "scanner" },
  { icon: Trophy, label: "Troféus", tab: "achievements" },
  { icon: UserRound, label: "Perfil", tab: "profile" },
];

const screenToTab: Record<ScreenId, MainTab | null> = {
  "onboarding-1": null,
  "onboarding-2": null,
  "onboarding-3": null,
  achievements: "achievements",
  auth: null,
  challenges: "home",
  detail: "learn",
  home: "home",
  learn: "learn",
  profile: "profile",
  ranking: "achievements",
  scanner: "scanner",
};

export function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const activeTab = screenToTab[currentScreen];
  const { activeColors } = useTheme();
  const styles = createStyles(activeColors);

  if (!activeTab) {
    return null;
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.bar}>
        {navItems.map((item) => {
          const active = item.tab === activeTab;
          const Icon = item.icon;

          return (
            <Pressable
              key={item.tab}
              onPress={() => onNavigate(item.tab)}
              style={({ pressed }) => [
                styles.item,
                active && styles.itemActive,
                pressed && styles.itemPressed,
              ]}
            >
              <Icon
                color={active ? activeColors.primary : activeColors.textSoft}
                size={20}
                strokeWidth={active ? 2.5 : 2.1}
              />
              <Text style={[styles.label, active && styles.labelActive]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const createStyles = (themeColors: any) =>
  StyleSheet.create({
    bar: {
      backgroundColor: themeColors.surfaceRaised,
      borderColor: themeColors.border,
      borderRadius: radius.xl,
      borderWidth: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.sm,
      shadowColor: themeColors.shadow,
      elevation: 4,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 20,
    },
    item: {
      alignItems: "center",
      borderRadius: radius.md,
      flex: 1,
      gap: spacing.xxs,
      paddingHorizontal: spacing.xs,
      paddingVertical: spacing.xs,
    },
    itemActive: {
      backgroundColor: themeColors.primarySoft,
    },
    itemPressed: {
      opacity: 0.9,
    },
    label: {
      color: themeColors.textSoft,
      fontFamily: typography.bodyBold,
      fontSize: 11,
    },
    labelActive: {
      color: themeColors.primary,
    },
    wrap: {
      bottom: spacing.md,
      left: spacing.md,
      position: "absolute",
      right: spacing.md,
    },
  });
