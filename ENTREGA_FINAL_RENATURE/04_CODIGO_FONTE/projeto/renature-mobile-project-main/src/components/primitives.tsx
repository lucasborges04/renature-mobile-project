import type { LucideIcon } from "lucide-react-native";
import { ArrowRight } from "lucide-react-native";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { radius, spacing, typography } from "../theme/tokens";
import { useTheme } from "../theme/ThemeContext";

type ButtonVariant = "primary" | "secondary" | "ghost";

type AppButtonProps = {
  icon?: LucideIcon;
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  variant?: ButtonVariant;
  disabled?: boolean;
};

type CardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

type ProgressBarProps = {
  label?: string;
  value: number;
};

type SectionHeadingProps = {
  actionLabel?: string;
  onActionPress?: () => void;
  subtitle?: string;
  title: string;
};

type StatPillProps = {
  label: string;
  tone?: "primary" | "secondary" | "tertiary";
};

export function AppButton({
  icon: Icon = ArrowRight,
  label,
  onPress,
  style,
  variant = "primary",
  disabled,
}: AppButtonProps) {
  const { activeColors } = useTheme();
  const styles = createStyles(activeColors);

  const buttonVariants: Record<ButtonVariant, ViewStyle> = {
    ghost: {
      backgroundColor: "transparent",
      borderWidth: 0,
    },
    primary: {
      backgroundColor: activeColors.primary,
      borderWidth: 0,
    },
    secondary: {
      backgroundColor: activeColors.secondarySoft,
      borderColor: activeColors.border,
      borderWidth: 1,
    },
  };

  const isGhost = variant === "ghost";
  const isPrimary = variant === "primary";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        buttonVariants[variant],
        pressed && styles.buttonPressed,
        style,
      ]}
    >
      <Text
        style={[
          styles.buttonLabel,
          isPrimary && styles.buttonLabelPrimary,
          isGhost && styles.buttonLabelGhost,
        ]}
      >
        {label}
      </Text>
      <Icon
        color={isPrimary ? activeColors.white : activeColors.primary}
        size={18}
        strokeWidth={2.3}
      />
    </Pressable>
  );
}

interface SurfaceCardProps extends ViewProps {
  children: React.ReactNode;
}

export function SurfaceCard({ children, style, ...props }: SurfaceCardProps) {
  const { activeColors } = useTheme();
  const styles = createStyles(activeColors);

  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
}

export function ProgressBar({ label, value }: ProgressBarProps) {
  const { activeColors } = useTheme();
  const styles = createStyles(activeColors);

  return (
    <View style={styles.progressWrap}>
      {label ? <Text style={styles.progressLabel}>{label}</Text> : null}
      <View style={styles.progressTrack}>
        <View
          style={[styles.progressValue, { width: `${Math.min(value, 100)}%` }]}
        />
      </View>
    </View>
  );
}

export function SectionHeading({
  actionLabel,
  onActionPress,
  subtitle,
  title,
}: SectionHeadingProps) {
  const { activeColors } = useTheme();
  const styles = createStyles(activeColors);

  return (
    <View style={styles.sectionHeading}>
      <View style={styles.sectionHeadingCopy}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? (
          <Text style={styles.sectionSubtitle}>{subtitle}</Text>
        ) : null}
      </View>
      {actionLabel && onActionPress ? (
        <Pressable onPress={onActionPress} style={styles.sectionAction}>
          <Text style={styles.sectionActionLabel}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function StatPill({ label, tone = "primary" }: StatPillProps) {
  const { activeColors } = useTheme();

  const toneStyles = {
    primary: {
      backgroundColor: activeColors.primarySoft,
      color: activeColors.primary,
    },
    secondary: {
      backgroundColor: activeColors.secondarySoft,
      color: activeColors.secondary,
    },
    tertiary: {
      backgroundColor: activeColors.tertiarySoft,
      color: activeColors.tertiary,
    },
  };

  const styles = createStyles(activeColors);

  return (
    <View
      style={[
        styles.statPill,
        { backgroundColor: toneStyles[tone].backgroundColor },
      ]}
    >
      <Text style={[styles.statPillLabel, { color: toneStyles[tone].color }]}>
        {label}
      </Text>
    </View>
  );
}

const createStyles = (themeColors: any) =>
  StyleSheet.create({
    button: {
      alignItems: "center",
      borderRadius: radius.md,
      flexDirection: "row",
      gap: spacing.sm,
      justifyContent: "center",
      minHeight: 56,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    buttonLabel: {
      color: themeColors.primary,
      fontFamily: typography.bodyBold,
      fontSize: 16,
    },
    buttonLabelGhost: {
      color: themeColors.primary,
    },
    buttonLabelPrimary: {
      color: themeColors.white,
    },
    buttonPressed: {
      opacity: 0.92,
      transform: [{ scale: 0.99 }],
    },
    card: {
      backgroundColor: themeColors.surfaceRaised,
      borderColor: themeColors.border,
      borderRadius: radius.lg,
      borderWidth: 1,
      padding: spacing.lg,
      shadowColor: themeColors.shadow,
      elevation: 4,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 20,
    },
    progressLabel: {
      color: themeColors.textSoft,
      fontFamily: typography.bodyBold,
      fontSize: 13,
    },
    progressTrack: {
      backgroundColor: themeColors.surfaceStrong,
      borderRadius: radius.pill,
      height: 10,
      overflow: "hidden",
    },
    progressValue: {
      backgroundColor: themeColors.primary,
      borderRadius: radius.pill,
      height: "100%",
    },
    progressWrap: {
      gap: spacing.xs,
    },
    sectionAction: {
      paddingLeft: spacing.md,
      paddingVertical: spacing.xs,
    },
    sectionActionLabel: {
      color: themeColors.primary,
      fontFamily: typography.bodyBold,
      fontSize: 14,
    },
    sectionHeading: {
      alignItems: "flex-start",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    sectionHeadingCopy: {
      flex: 1,
      gap: spacing.xs,
    },
    sectionSubtitle: {
      color: themeColors.textMuted,
      fontFamily: typography.body,
      fontSize: 14,
      lineHeight: 21,
    },
    sectionTitle: {
      color: themeColors.text,
      fontFamily: typography.headline,
      fontSize: 24,
      letterSpacing: -0.4,
    },
    statPill: {
      alignSelf: "flex-start",
      borderRadius: radius.pill,
      paddingHorizontal: spacing.sm,
      paddingVertical: 8,
    },
    statPillLabel: {
      fontFamily: typography.bodyBold,
      fontSize: 12,
    },
  });
