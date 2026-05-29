import { ArrowLeft, Camera, Flashlight, Recycle, Smartphone } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '../components/app-screen';
import { AppButton, SurfaceCard } from '../components/primitives';
import { scannerResult } from '../data/content';
import { colors, radius, spacing, typography } from '../theme/tokens';
import type { ScreenId } from '../types/navigation';

type ScannerScreenProps = {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
};

export function ScannerScreen({
  currentScreen,
  onNavigate,
}: ScannerScreenProps) {
  return (
    <AppScreen currentScreen={currentScreen} onNavigate={onNavigate}>
      <View style={styles.cameraCard}>
        <View style={styles.cameraHeader}>
          <Pressable onPress={() => onNavigate('home')} style={styles.iconButton}>
            <ArrowLeft color={colors.white} size={18} strokeWidth={2.4} />
          </Pressable>
          <Pressable style={styles.iconButton}>
            <Flashlight color={colors.white} size={18} strokeWidth={2.4} />
          </Pressable>
        </View>

        <View style={styles.scanFrame}>
          <Text style={styles.scanHint}>Alinhe o código de barras ou item</Text>
        </View>

        <View style={styles.resultCard}>
          <Text style={styles.resultCaption}>Item identificado</Text>
          <Text style={styles.resultTitle}>{scannerResult.title}</Text>
          <View style={styles.resultMeta}>
            <Recycle color={colors.primary} size={18} strokeWidth={2.3} />
            <Text style={styles.resultMetaText}>Reciclável</Text>
          </View>
          <Text style={styles.resultPoints}>{scannerResult.points}</Text>
        </View>
      </View>

      <SurfaceCard style={styles.mobileCard}>
        <View style={styles.mobileIcon}>
          <Smartphone color={colors.primary} size={22} strokeWidth={2.2} />
        </View>
        <Text style={styles.mobileTitle}>Scanner otimizado para mobile</Text>
        <Text style={styles.mobileText}>
          A experiência foi pensada para uso em dispositivos móveis. Aqui já
          deixamos a tela pronta para a integração futura da câmera.
        </Text>
      </SurfaceCard>

      <AppButton label="Ver guia completo" onPress={() => onNavigate('detail')} />
      <AppButton
        icon={Camera}
        label="Voltar para Home"
        onPress={() => onNavigate('home')}
        variant="secondary"
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  cameraCard: {
    backgroundColor: colors.scannerOverlay,
    borderRadius: radius.xl,
    gap: spacing.xl,
    minHeight: 430,
    overflow: 'hidden',
    padding: spacing.xl,
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.pill,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  mobileCard: {
    gap: spacing.sm,
  },
  mobileIcon: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  mobileText: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 21,
  },
  mobileTitle: {
    color: colors.text,
    fontFamily: typography.headline,
    fontSize: 24,
  },
  resultCaption: {
    color: colors.textSoft,
    fontFamily: typography.bodyBold,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  resultCard: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: radius.lg,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  resultMeta: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  resultMetaText: {
    color: colors.primary,
    fontFamily: typography.bodyBold,
    fontSize: 13,
  },
  resultPoints: {
    color: colors.tertiary,
    fontFamily: typography.bodyBold,
    fontSize: 18,
  },
  resultTitle: {
    color: colors.text,
    fontFamily: typography.headlineStrong,
    fontSize: 30,
  },
  scanFrame: {
    alignItems: 'center',
    borderColor: 'rgba(255,255,255,0.45)',
    borderRadius: radius.xl,
    borderStyle: 'dashed',
    borderWidth: 2,
    flex: 1,
    justifyContent: 'center',
    minHeight: 190,
  },
  scanHint: {
    color: colors.white,
    fontFamily: typography.bodyBold,
    fontSize: 15,
  },
});
