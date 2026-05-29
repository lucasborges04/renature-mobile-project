import { Bell, ChevronRight, Lock, type LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '../components/app-screen';
import {
  AppButton,
  ProgressBar,
  SectionHeading,
  StatPill,
  SurfaceCard,
} from '../components/primitives';
import { achievementItems } from '../data/content';
import { colors, radius, spacing, typography } from '../theme/tokens';
import type { ScreenId } from '../types/navigation';

type AchievementsScreenProps = {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
};

export function AchievementsScreen({
  currentScreen,
  onNavigate,
}: AchievementsScreenProps) {
  return (
    <AppScreen currentScreen={currentScreen} onNavigate={onNavigate}>
      <View style={styles.topBar}>
        <Text style={styles.greeting}>Olá, Eco-Herói</Text>
        <View style={styles.notifyButton}>
          <Bell color={colors.textSoft} size={18} strokeWidth={2.2} />
        </View>
      </View>

      <SectionHeading
        subtitle="Colecione insígnias ajudando o planeta e destrave novas recompensas."
        title="Suas Conquistas"
      />

      <SurfaceCard style={styles.heroCard}>
        <StatPill label="1,240 XP" tone="tertiary" />
        <Text style={styles.heroTitle}>Jornada Sustentável</Text>
        <Text style={styles.heroSubtitle}>Nível 8 · Guardião da Terra</Text>
        <ProgressBar label="80% para nível 9" value={80} />
      </SurfaceCard>

      <View style={styles.listWrap}>
        {achievementItems.map((achievement) => (
          <AchievementCard key={achievement.title} item={achievement} />
        ))}
      </View>

      <AppButton
        icon={ChevronRight}
        label="Ver ranking e pontuação"
        onPress={() => onNavigate('ranking')}
      />
    </AppScreen>
  );
}

function AchievementCard({
  item,
}: {
  item: {
    description: string;
    earned: boolean;
    icon: LucideIcon;
    progress: string;
    title: string;
  };
}) {
  const Icon = item.icon;

  return (
    <SurfaceCard
      style={[
        styles.achievementCard,
        !item.earned && styles.achievementCardLocked,
      ]}
    >
      <View style={styles.achievementIcon}>
        <Icon
          color={item.earned ? colors.primary : colors.textSoft}
          size={22}
          strokeWidth={2.2}
        />
      </View>
      <View style={styles.achievementCopy}>
        <Text style={styles.achievementStatus}>{item.progress}</Text>
        <Text style={styles.achievementTitle}>{item.title}</Text>
        <Text style={styles.achievementDescription}>{item.description}</Text>
      </View>
      {!item.earned ? <Lock color={colors.textSoft} size={18} strokeWidth={2.2} /> : null}
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  achievementCard: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
  },
  achievementCardLocked: {
    backgroundColor: colors.surfaceMuted,
  },
  achievementCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  achievementDescription: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 21,
  },
  achievementIcon: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  achievementStatus: {
    color: colors.primary,
    fontFamily: typography.bodyBold,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  achievementTitle: {
    color: colors.text,
    fontFamily: typography.headline,
    fontSize: 22,
  },
  greeting: {
    color: colors.primary,
    fontFamily: typography.headline,
    fontSize: 22,
  },
  heroCard: {
    gap: spacing.sm,
  },
  heroSubtitle: {
    color: colors.textMuted,
    fontFamily: typography.bodySemiBold,
    fontSize: 15,
  },
  heroTitle: {
    color: colors.text,
    fontFamily: typography.headlineStrong,
    fontSize: 30,
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
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
