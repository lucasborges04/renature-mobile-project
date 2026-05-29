import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowRight,
  Bell,
  Droplets,
  Leaf,
  TreePine,
  Recycle,
  type LucideIcon,
} from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '../components/app-screen';
import {
  AppButton,
  ProgressBar,
  SectionHeading,
  StatPill,
  SurfaceCard,
} from '../components/primitives';
import { homeActions, homeStatus, homeTip } from '../data/content';
import { getStitchStatusLabel } from '../config/stitch';
import { colors, radius, spacing, typography } from '../theme/tokens';
import type { ScreenId } from '../types/navigation';

type HomeScreenProps = {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
};

export function HomeScreen({ currentScreen, onNavigate }: HomeScreenProps) {
  return (
    <AppScreen currentScreen={currentScreen} onNavigate={onNavigate}>
      <View style={styles.topBar}>
        <View style={styles.avatarRow}>
          <View style={styles.avatar}>
            <Leaf color={colors.primary} size={20} strokeWidth={2.4} />
          </View>
          <Text style={styles.greeting}>Olá, Eco-Herói</Text>
        </View>
        <View style={styles.notifyButton}>
          <Bell color={colors.textSoft} size={18} strokeWidth={2.2} />
        </View>
      </View>

      <LinearGradient
        colors={[colors.primary, colors.primaryDeep]}
        style={styles.heroCard}
      >
        <StatPill label={getStitchStatusLabel()} tone="secondary" />
        <View style={styles.heroStats}>
          <View>
            <Text style={styles.heroCaption}>Impacto positivo</Text>
            <Text style={styles.heroValue}>{homeStatus.points}</Text>
          </View>
          <View style={styles.levelBadge}>
            <Leaf color={colors.primary} size={18} strokeWidth={2.5} />
            <Text style={styles.levelBadgeText}>{homeStatus.level}</Text>
          </View>
        </View>
        <ProgressBar label="Rumo ao nível 5" value={homeStatus.progress} />
        <Text style={styles.heroText}>
          Faltam apenas 250 pontos para a próxima conquista.
        </Text>
        <AppButton
          icon={ArrowRight}
          label="Ver ranking e pontos"
          onPress={() => onNavigate('ranking')}
          style={styles.heroButton}
          variant="secondary"
        />
      </LinearGradient>

      <SectionHeading
        subtitle="Identifique, aprenda e evolua com cada ação registrada."
        title="Seu painel Terra"
      />

      <View style={styles.actionGrid}>
        {homeActions.map((action) => {
          const Icon = action.icon;

          return (
            <Pressable
              key={action.title}
              onPress={() => onNavigate(action.screen)}
              style={({ pressed }) => [styles.actionCard, pressed && styles.cardPressed]}
            >
              <View style={styles.actionIcon}>
                <Icon color={colors.primary} size={22} strokeWidth={2.2} />
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionDescription}>{action.description}</Text>
            </Pressable>
          );
        })}
      </View>

      <SurfaceCard style={styles.categoryCard}>
        <SectionHeading
          subtitle="Atalhos rápidos para tipos frequentes de descarte."
          title="Mais buscados"
        />
        <View style={styles.categoryRow}>
          <CategoryPill icon={Droplets} label="Plástico" />
          <CategoryPill icon={TreePine} label="Orgânico" />
          <CategoryPill icon={Recycle} label="Vidro" />
        </View>
      </SurfaceCard>

      <SurfaceCard style={styles.tipCard}>
        <View style={styles.tipIcon}>
          <Leaf color={colors.tertiary} size={22} strokeWidth={2.2} />
        </View>
        <View style={styles.tipCopy}>
          <Text style={styles.tipTitle}>Dica sustentável</Text>
          <Text style={styles.tipText}>{homeTip}</Text>
        </View>
      </SurfaceCard>
    </AppScreen>
  );
}

function CategoryPill({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <View style={styles.categoryPill}>
      <Icon color={colors.primary} size={18} strokeWidth={2.3} />
      <Text style={styles.categoryLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  actionCard: {
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexBasis: '47%',
    gap: spacing.sm,
    minHeight: 158,
    padding: spacing.lg,
  },
  actionDescription: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 20,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actionIcon: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  actionTitle: {
    color: colors.text,
    fontFamily: typography.headline,
    fontSize: 21,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderColor: colors.white,
    borderRadius: radius.pill,
    borderWidth: 2,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  avatarRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  cardPressed: {
    opacity: 0.94,
  },
  categoryCard: {
    gap: spacing.lg,
  },
  categoryLabel: {
    color: colors.primary,
    fontFamily: typography.bodyBold,
    fontSize: 14,
  },
  categoryPill: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  greeting: {
    color: colors.primary,
    fontFamily: typography.headline,
    fontSize: 22,
  },
  heroButton: {
    backgroundColor: colors.surfaceRaised,
    borderWidth: 0,
  },
  heroCaption: {
    color: colors.primarySoft,
    fontFamily: typography.bodyBold,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  heroCard: {
    borderRadius: radius.xl,
    gap: spacing.md,
    padding: spacing.xl,
  },
  heroStats: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroText: {
    color: '#d8f0de',
    fontFamily: typography.body,
    fontSize: 15,
    lineHeight: 22,
  },
  heroValue: {
    color: colors.white,
    fontFamily: typography.headlineStrong,
    fontSize: 40,
  },
  levelBadge: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  levelBadgeText: {
    color: colors.primary,
    fontFamily: typography.bodyBold,
    fontSize: 13,
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
  tipCard: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
  },
  tipCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  tipIcon: {
    alignItems: 'center',
    backgroundColor: colors.tertiarySoft,
    borderRadius: radius.md,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  tipText: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 21,
  },
  tipTitle: {
    color: colors.text,
    fontFamily: typography.headline,
    fontSize: 22,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
