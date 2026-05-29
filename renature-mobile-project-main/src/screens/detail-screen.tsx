import {
  AlertTriangle,
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  Clock3,
  Droplets,
  Package,
  Share2,
  Trash2,
} from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '../components/app-screen';
import { AppButton, SectionHeading, SurfaceCard, StatPill } from '../components/primitives';
import {
  detailMetrics,
  detailMistakes,
  detailSteps,
} from '../data/content';
import { colors, radius, spacing, typography } from '../theme/tokens';
import type { ScreenId } from '../types/navigation';

type DetailScreenProps = {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
};

export function DetailScreen({
  currentScreen,
  onNavigate,
}: DetailScreenProps) {
  return (
    <AppScreen currentScreen={currentScreen} onNavigate={onNavigate}>
      <View style={styles.topBar}>
        <Pressable onPress={() => onNavigate('learn')} style={styles.iconButton}>
          <ArrowLeft color={colors.text} size={18} strokeWidth={2.4} />
        </Pressable>
        <Text style={styles.topTitle}>Aprender</Text>
        <View style={styles.topActions}>
          <Pressable style={styles.iconButton}>
            <Bookmark color={colors.textSoft} size={18} strokeWidth={2.2} />
          </Pressable>
          <Pressable style={styles.iconButton}>
            <Share2 color={colors.textSoft} size={18} strokeWidth={2.2} />
          </Pressable>
        </View>
      </View>

      <SurfaceCard style={styles.heroCard}>
        <StatPill label="Plástico" tone="primary" />
        <Text style={styles.heroTitle}>Garrafa PET</Text>
        <Text style={styles.heroSubtitle}>Polietileno Tereftalato</Text>
      </SurfaceCard>

      <SectionHeading title="Como descartar corretamente" />
      <View style={styles.listWrap}>
        {detailSteps.map((step, index) => {
          const Icon = index === 0 ? Droplets : index === 1 ? Package : CheckCircle2;
          return (
            <SurfaceCard key={step.title} style={styles.stepCard}>
              <View style={styles.stepIcon}>
                <Icon color={colors.primary} size={20} strokeWidth={2.3} />
              </View>
              <View style={styles.stepCopy}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
            </SurfaceCard>
          );
        })}
      </View>

      <SectionHeading title="O que não fazer" />
      <SurfaceCard style={styles.warningCard}>
        {detailMistakes.map((mistake) => (
          <View key={mistake} style={styles.warningItem}>
            <View style={styles.warningIcon}>
              <AlertTriangle color={colors.danger} size={18} strokeWidth={2.3} />
            </View>
            <Text style={styles.warningText}>{mistake}</Text>
          </View>
        ))}
      </SurfaceCard>

      <View style={styles.metricGrid}>
        {detailMetrics.map((metric, index) => {
          const Icon = index === 0 ? CheckCircle2 : index === 1 ? Clock3 : Trash2;
          return (
            <SurfaceCard key={metric.label} style={styles.metricCard}>
              <Icon color={colors.tertiary} size={20} strokeWidth={2.3} />
              <Text style={styles.metricValue}>{metric.value}</Text>
              <Text style={styles.metricLabel}>{metric.label}</Text>
            </SurfaceCard>
          );
        })}
      </View>

      <AppButton
        label="Marcar como aprendido"
        onPress={() => onNavigate('achievements')}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    gap: spacing.sm,
  },
  heroSubtitle: {
    color: colors.textSoft,
    fontFamily: typography.body,
    fontSize: 16,
  },
  heroTitle: {
    color: colors.text,
    fontFamily: typography.headlineStrong,
    fontSize: 36,
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  listWrap: {
    gap: spacing.md,
  },
  metricCard: {
    alignItems: 'flex-start',
    flex: 1,
    gap: spacing.xs,
    minHeight: 132,
  },
  metricGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  metricLabel: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 13,
  },
  metricValue: {
    color: colors.text,
    fontFamily: typography.headline,
    fontSize: 22,
  },
  stepCard: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
  },
  stepCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  stepDescription: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 21,
  },
  stepIcon: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  stepTitle: {
    color: colors.text,
    fontFamily: typography.bodyBold,
    fontSize: 16,
  },
  topActions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topTitle: {
    color: colors.text,
    fontFamily: typography.headline,
    fontSize: 22,
  },
  warningCard: {
    gap: spacing.md,
  },
  warningIcon: {
    alignItems: 'center',
    backgroundColor: '#ffebe9',
    borderRadius: radius.md,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  warningItem: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
  },
  warningText: {
    color: colors.textMuted,
    flex: 1,
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 21,
  },
});
