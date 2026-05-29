import {
  Bell,
  Calendar,
  ChevronRight,
  Clock3,
  Recycle,
  Settings,
  Sparkles,
  UserRound,
} from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '../components/app-screen';
import { SectionHeading, StatPill, SurfaceCard } from '../components/primitives';
import {
  profileAchievements,
  profileHighlights,
  profileLinks,
  recentActivities,
} from '../data/content';
import { colors, radius, spacing, typography } from '../theme/tokens';
import type { ScreenId } from '../types/navigation';

type ProfileScreenProps = {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
};

export function ProfileScreen({
  currentScreen,
  onNavigate,
}: ProfileScreenProps) {
  return (
    <AppScreen currentScreen={currentScreen} onNavigate={onNavigate}>
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <Text style={styles.greeting}>Olá, Eco-Herói</Text>
        </View>
        <View style={styles.topBarRight}>
          <View style={styles.iconButton}>
            <Bell color={colors.textSoft} size={18} strokeWidth={2.2} />
          </View>
          <View style={styles.iconButton}>
            <Settings color={colors.textSoft} size={18} strokeWidth={2.2} />
          </View>
        </View>
      </View>

      <SurfaceCard style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.profileAvatar}>
            <UserRound color={colors.primary} size={28} strokeWidth={2.2} />
          </View>
          <View style={styles.profileCopy}>
            <Text style={styles.profileName}>Mariana Silva</Text>
            <Text style={styles.profileMeta}>Membro desde Março 2023</Text>
          </View>
        </View>

        <View style={styles.profileStats}>
          {profileHighlights.map((stat) => (
            <View key={stat.label} style={styles.profileStatCard}>
              <Text style={styles.profileStatValue}>{stat.value}</Text>
              <Text style={styles.profileStatLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </SurfaceCard>

      <SectionHeading actionLabel="Ver tudo" title="Atividades Recentes" />
      <View style={styles.listWrap}>
        {recentActivities.map((activity, index) => (
          <SurfaceCard key={activity.title} style={styles.activityCard}>
            <View style={styles.activityIcon}>
              {index === 0 ? (
                <Recycle color={colors.primary} size={18} strokeWidth={2.2} />
              ) : index === 1 ? (
                <Sparkles color={colors.primary} size={18} strokeWidth={2.2} />
              ) : (
                <Calendar color={colors.primary} size={18} strokeWidth={2.2} />
              )}
            </View>
            <View style={styles.activityCopy}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activitySubtitle}>{activity.subtitle}</Text>
            </View>
            <View style={styles.activityMeta}>
              <Text style={styles.activityPoints}>{activity.points}</Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          </SurfaceCard>
        ))}
      </View>

      <SectionHeading title="Últimas Conquistas" />
      <View style={styles.achievementRow}>
        {profileAchievements.map((item, index) => {
          const Icon = item.icon;
          return (
            <SurfaceCard key={item.label} style={styles.badgeCard}>
              <View
                style={[
                  styles.badgeIcon,
                  index === 2 && { backgroundColor: colors.surfaceStrong },
                ]}
              >
                <Icon
                  color={index === 2 ? colors.textSoft : colors.primary}
                  size={20}
                  strokeWidth={2.2}
                />
              </View>
              <Text style={styles.badgeLabel}>{item.label}</Text>
            </SurfaceCard>
          );
        })}
      </View>

      <SectionHeading title="Ajustes" />
      <View style={styles.listWrap}>
        {profileLinks.map((link) => (
          <Pressable key={link} style={styles.linkRow}>
            <Text style={styles.linkLabel}>{link}</Text>
            <ChevronRight color={colors.textSoft} size={16} strokeWidth={2.3} />
          </Pressable>
        ))}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  achievementRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  activityCard: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
  },
  activityCopy: {
    flex: 1,
    gap: spacing.xxs,
  },
  activityIcon: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  activityMeta: {
    alignItems: 'flex-end',
    gap: spacing.xxs,
  },
  activityPoints: {
    color: colors.primary,
    fontFamily: typography.bodyBold,
    fontSize: 13,
  },
  activitySubtitle: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 13,
    lineHeight: 19,
  },
  activityTime: {
    color: colors.textSoft,
    fontFamily: typography.body,
    fontSize: 12,
  },
  activityTitle: {
    color: colors.text,
    fontFamily: typography.bodyBold,
    fontSize: 15,
  },
  badgeCard: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
    padding: spacing.md,
  },
  badgeIcon: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  badgeLabel: {
    color: colors.text,
    fontFamily: typography.bodyBold,
    fontSize: 13,
    textAlign: 'center',
  },
  greeting: {
    color: colors.primary,
    fontFamily: typography.headline,
    fontSize: 22,
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
  linkLabel: {
    color: colors.text,
    fontFamily: typography.bodyBold,
    fontSize: 15,
  },
  linkRow: {
    alignItems: 'center',
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  listWrap: {
    gap: spacing.md,
  },
  profileAvatar: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    height: 72,
    justifyContent: 'center',
    width: 72,
  },
  profileCard: {
    gap: spacing.lg,
  },
  profileCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  profileHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  profileMeta: {
    color: colors.textSoft,
    fontFamily: typography.body,
    fontSize: 14,
  },
  profileName: {
    color: colors.text,
    fontFamily: typography.headlineStrong,
    fontSize: 30,
  },
  profileStatCard: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    flex: 1,
    gap: spacing.xxs,
    padding: spacing.md,
  },
  profileStatLabel: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 13,
  },
  profileStatValue: {
    color: colors.primary,
    fontFamily: typography.headline,
    fontSize: 24,
  },
  profileStats: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topBarLeft: {
    flex: 1,
  },
  topBarRight: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
});
