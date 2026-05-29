import { Bell, ChevronRight, Search, type LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '../components/app-screen';
import { SectionHeading, SurfaceCard } from '../components/primitives';
import { learnCategories } from '../data/content';
import { colors, radius, spacing, typography } from '../theme/tokens';
import type { ScreenId } from '../types/navigation';

type LearnScreenProps = {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
};

export function LearnScreen({ currentScreen, onNavigate }: LearnScreenProps) {
  return (
    <AppScreen currentScreen={currentScreen} onNavigate={onNavigate}>
      <View style={styles.topBar}>
        <Text style={styles.greeting}>Olá, Eco-Herói</Text>
        <View style={styles.notifyButton}>
          <Bell color={colors.textSoft} size={18} strokeWidth={2.2} />
        </View>
      </View>

      <SectionHeading
        subtitle="Encontre o destino certo para cada tipo de material."
        title="Aprenda a Descartar"
      />

      <View style={styles.searchBar}>
        <Search color={colors.textSoft} size={18} strokeWidth={2.2} />
        <Text style={styles.searchText}>Buscar material ou embalagem</Text>
      </View>

      <View style={styles.grid}>
        {learnCategories.map((category) => {
          const Icon = category.icon;

          return (
            <Pressable
              key={category.title}
              onPress={() => onNavigate('detail')}
              style={({ pressed }) => [
                styles.categoryCard,
                pressed && styles.cardPressed,
              ]}
            >
              <View style={styles.categoryIcon}>
                <Icon color={colors.primary} size={22} strokeWidth={2.2} />
              </View>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <Text style={styles.categoryDescription}>{category.description}</Text>
              <View style={styles.categoryFooter}>
                <Text style={styles.categoryLink}>Abrir guia</Text>
                <ChevronRight color={colors.primary} size={16} strokeWidth={2.4} />
              </View>
            </Pressable>
          );
        })}
      </View>

      <SurfaceCard style={styles.tipCard}>
        <Text style={styles.tipTitle}>Sempre limpe as embalagens</Text>
        <Text style={styles.tipText}>
          Embalagens plásticas e de vidro devem ser enxaguadas antes do descarte.
          Resíduos orgânicos podem inviabilizar a reciclagem de todo o lote.
        </Text>
      </SurfaceCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  cardPressed: {
    opacity: 0.94,
  },
  categoryCard: {
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexBasis: '47%',
    gap: spacing.sm,
    minHeight: 180,
    padding: spacing.lg,
  },
  categoryDescription: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 20,
  },
  categoryFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: 'auto',
  },
  categoryIcon: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  categoryLink: {
    color: colors.primary,
    fontFamily: typography.bodyBold,
    fontSize: 13,
  },
  categoryTitle: {
    color: colors.text,
    fontFamily: typography.headline,
    fontSize: 22,
  },
  greeting: {
    color: colors.primary,
    fontFamily: typography.headline,
    fontSize: 22,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  searchBar: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  searchText: {
    color: colors.textSoft,
    fontFamily: typography.bodySemiBold,
    fontSize: 14,
  },
  tipCard: {
    backgroundColor: colors.primarySoft,
    gap: spacing.xs,
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
