import { Bell, Crown, TrendingUp } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '../components/app-screen';
import { ProgressBar, SectionHeading, StatPill, SurfaceCard } from '../components/primitives';
import { leaderboard, rankingProgress } from '../data/content';
import { colors, radius, spacing, typography } from '../theme/tokens';
import type { ScreenId } from '../types/navigation';

type RankingScreenProps = {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
};

export function RankingScreen({
  currentScreen,
  onNavigate,
}: RankingScreenProps) {
  const podium = leaderboard.slice(0, 3);
  const currentUser = leaderboard.find((person) => person.name === 'Você');

  return (
    <AppScreen currentScreen={currentScreen} onNavigate={onNavigate}>
      <View style={styles.topBar}>
        <Text style={styles.greeting}>Olá, Eco-Herói</Text>
        <View style={styles.notifyButton}>
          <Bell color={colors.textSoft} size={18} strokeWidth={2.2} />
        </View>
      </View>

      <SectionHeading
        subtitle="Veja sua posição e acompanhe sua evolução."
        title="Ranking e Pontuação"
      />

      <View style={styles.podiumWrap}>
        {podium.map((person) => (
          <SurfaceCard key={person.rank} style={styles.podiumCard}>
            <View style={styles.crownBadge}>
              <Crown color={colors.tertiary} size={18} strokeWidth={2.2} />
            </View>
            <Text style={styles.podiumRank}>#{person.rank}</Text>
            <Text style={styles.podiumName}>{person.name}</Text>
            <Text style={styles.podiumPoints}>{person.points}</Text>
          </SurfaceCard>
        ))}
      </View>

      {currentUser ? (
        <SurfaceCard style={styles.userCard}>
          <StatPill label="Nível 8 · Eco-Guardião" tone="primary" />
          <Text style={styles.userTitle}>Você está em 5º lugar</Text>
          <Text style={styles.userPoints}>{currentUser.points}</Text>
          <Text style={styles.userHint}>Faltam apenas 700 pontos para entrar no top 3.</Text>
        </SurfaceCard>
      ) : null}

      <SurfaceCard style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <TrendingUp color={colors.primary} size={20} strokeWidth={2.2} />
          <Text style={styles.progressTitle}>Evolução nos últimos 3 meses</Text>
        </View>
        <View style={styles.progressList}>
          {rankingProgress.map((item) => (
            <View key={item.label} style={styles.progressItem}>
              <Text style={styles.progressLabel}>{item.label}</Text>
              <View style={styles.progressFillWrap}>
                <ProgressBar value={item.value} />
              </View>
            </View>
          ))}
        </View>
        <Text style={styles.progressHint}>Você subiu 2 posições desde o início do mês.</Text>
      </SurfaceCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  crownBadge: {
    alignItems: 'center',
    backgroundColor: colors.tertiarySoft,
    borderRadius: radius.pill,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  greeting: {
    color: colors.primary,
    fontFamily: typography.headline,
    fontSize: 22,
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
  podiumCard: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  podiumName: {
    color: colors.text,
    fontFamily: typography.bodyBold,
    fontSize: 15,
  },
  podiumPoints: {
    color: colors.primary,
    fontFamily: typography.bodyBold,
    fontSize: 14,
  },
  podiumRank: {
    color: colors.tertiary,
    fontFamily: typography.headline,
    fontSize: 22,
  },
  podiumWrap: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  progressCard: {
    gap: spacing.md,
  },
  progressFillWrap: {
    flex: 1,
  },
  progressHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  progressHint: {
    color: colors.primary,
    fontFamily: typography.bodyBold,
    fontSize: 14,
  },
  progressItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  progressLabel: {
    color: colors.textMuted,
    fontFamily: typography.bodyBold,
    fontSize: 13,
    width: 26,
  },
  progressList: {
    gap: spacing.md,
  },
  progressTitle: {
    color: colors.text,
    fontFamily: typography.headline,
    fontSize: 24,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userCard: {
    gap: spacing.sm,
  },
  userHint: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 21,
  },
  userPoints: {
    color: colors.primary,
    fontFamily: typography.headlineStrong,
    fontSize: 32,
  },
  userTitle: {
    color: colors.text,
    fontFamily: typography.headline,
    fontSize: 28,
  },
});
