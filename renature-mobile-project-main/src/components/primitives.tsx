import type { LucideIcon } from 'lucide-react-native';
import { ArrowRight } from 'lucide-react-native';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, radius, shadows, spacing, typography } from '../theme/tokens';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type AppButtonProps = {
  icon?: LucideIcon;
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  variant?: ButtonVariant;
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
  tone?: 'primary' | 'secondary' | 'tertiary';
};

const buttonVariants: Record<ButtonVariant, ViewStyle> = {
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  primary: {
    backgroundColor: colors.primary,
    borderWidth: 0,
  },
  secondary: {
    backgroundColor: colors.secondarySoft,
    borderColor: colors.border,
    borderWidth: 1,
  },
};

export function AppButton({
  icon: Icon = ArrowRight,
  label,
  onPress,
  style,
  variant = 'primary',
}: AppButtonProps) {
  const isGhost = variant === 'ghost';
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      onPress={onPress}
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
        color={isPrimary ? colors.white : colors.primary}
        size={18}
        strokeWidth={2.3}
      />
    </Pressable>
  );
}

export function SurfaceCard({ children, style }: CardProps) {
  return <View style={[styles.surfaceCard, style]}>{children}</View>;
}

export function ProgressBar({ label, value }: ProgressBarProps) {
  return (
    <View style={styles.progressWrap}>
      {label ? <Text style={styles.progressLabel}>{label}</Text> : null}
      <View style={styles.progressTrack}>
        <View style={[styles.progressValue, { width: `${Math.min(value, 100)}%` }]} />
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
  return (
    <View style={styles.sectionHeading}>
      <View style={styles.sectionHeadingCopy}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
      {actionLabel && onActionPress ? (
        <Pressable onPress={onActionPress} style={styles.sectionAction}>
          <Text style={styles.sectionActionLabel}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function StatPill({ label, tone = 'primary' }: StatPillProps) {
  const toneStyles = {
    primary: {
      backgroundColor: colors.primarySoft,
      color: colors.primary,
    },
    secondary: {
      backgroundColor: colors.secondarySoft,
      color: colors.secondary,
    },
    tertiary: {
      backgroundColor: colors.tertiarySoft,
      color: colors.tertiary,
    },
  };

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

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: radius.md,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    minHeight: 56,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  buttonLabel: {
    color: colors.primary,
    fontFamily: typography.bodyBold,
    fontSize: 16,
  },
  buttonLabelGhost: {
    color: colors.primary,
  },
  buttonLabelPrimary: {
    color: colors.white,
  },
  buttonPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  progressLabel: {
    color: colors.textSoft,
    fontFamily: typography.bodyBold,
    fontSize: 13,
  },
  progressTrack: {
    backgroundColor: colors.surfaceStrong,
    borderRadius: radius.pill,
    height: 10,
    overflow: 'hidden',
  },
  progressValue: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    height: '100%',
  },
  progressWrap: {
    gap: spacing.xs,
  },
  sectionAction: {
    paddingLeft: spacing.md,
    paddingVertical: spacing.xs,
  },
  sectionActionLabel: {
    color: colors.primary,
    fontFamily: typography.bodyBold,
    fontSize: 14,
  },
  sectionHeading: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionHeadingCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  sectionSubtitle: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 21,
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: typography.headline,
    fontSize: 24,
    letterSpacing: -0.4,
  },
  statPill: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
  },
  statPillLabel: {
    fontFamily: typography.bodyBold,
    fontSize: 12,
  },
  surfaceCard: {
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    ...shadows.card,
  },
});
