import { Bell, BookOpen, Footprints, Gift, Recycle, type LucideIcon } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '../components/app-screen';
import {
  AppButton,
  ProgressBar,
  SectionHeading,
  StatPill,
  SurfaceCard,
} from '../components/primitives';
import { challengeItems } from '../data/content';
import { colors, radius, spacing, typography } from '../theme/tokens';
import type { ScreenId } from '../types/navigation';

type ChallengesScreenProps = {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
};

export function ChallengesScreen({
  currentScreen,
  onNavigate,
}: ChallengesScreenProps) {
  return (
    <AppScreen currentScreen={currentScreen} onNavigate={onNavigate}>
      <View style={styles.topBar}>
        <Text style={styles.greeting}>Olá, Eco-Herói</Text>
        <View style={styles.notifyButton}>
          <Bell color={colors.textSoft} size={18} strokeWidth={2.2} />
        </View>
      </View>

      <SectionHeading
        subtitle="Complete missões e ganhe recompensas sustentáveis."
        title="Desafios Diários"
      />

      <SurfaceCard style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <View>
            <Text style={styles.progressTitle}>Progresso semanal</Text>
            <Text style={styles.progressSubtitle}>3/7 desafios</Text>
          </View>
          <StatPill label="Semente rara" tone="tertiary" />
        </View>
        <ProgressBar value={43} />
        <Text style={styles.progressHint}>
          Complete mais 4 para abrir o baú de recompensas.
        </Text>
      </SurfaceCard>

      <View style={styles.listWrap}>
        {challengeItems.map((item) => (
          <ChallengeCard key={item.title} item={item} />
        ))}
      </View>
    </AppScreen>
  );
}

function ChallengeCard({
  item,
}: {
  item: {
    actionLabel: string;
    current: number;
    icon: LucideIcon;
    target: number;
    title: string;
  };
}) {
  const Icon = item.icon;
  const progress = Math.min((item.current / item.target) * 100, 100);

  return (
    <SurfaceCard style={styles.challengeCard}>
      <View style={styles.challengeHeader}>
        <View style={styles.challengeIcon}>
          <Icon color={colors.primary} size={20} strokeWidth={2.2} />
        </View>
        <View style={styles.challengeCopy}>
          <Text style={styles.challengeTitle}>{item.title}</Text>
          <Text style={styles.challengeCounter}>
            {item.current}/{item.target}
          </Text>
        </View>
      </View>
      <ProgressBar value={progress} />
      <AppButton label={item.actionLabel} onPress={() => undefined} variant="secondary" />
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  challengeCard: {
    gap: spacing.md,
  },
  challengeCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  challengeCounter: {
    color: colors.primary,
    fontFamily: typography.bodyBold,
    fontSize: 13,
  },
  challengeHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  challengeIcon: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  challengeTitle: {
    color: colors.text,
    fontFamily: typography.bodyBold,
    fontSize: 16,
  },
  greeting: {
    color: colors.primary,
    fontFamily: typography.headline,
    fontSize: 22,
  },
  listWrap: {
    gap: spacing.md,
  },
  notifyButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  progressCard: {
    gap: spacing.md,
  },
  progressHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressHint: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 21,
  },
  progressSubtitle: {
    color: colors.primary,
    fontFamily: typography.headline,
    fontSize: 26,
  },
  progressTitle: {
    color: colors.textMuted,
    fontFamily: typography.bodyBold,
    fontSize: 13,
    textTransform: 'uppercase',
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
