import { LinearGradient } from 'expo-linear-gradient';
import { Apple, ArrowRight, Leaf, Lock, Mail } from 'lucide-react-native';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppButton, StatPill, SurfaceCard } from '../components/primitives';
import { authBenefits } from '../data/content';
import { stitchConfig } from '../config/stitch';
import { colors, radius, spacing, typography } from '../theme/tokens';
import type { ScreenId } from '../types/navigation';

type AuthScreenProps = {
  onNavigate: (screen: ScreenId) => void;
};

export function AuthScreen({ onNavigate }: AuthScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.root}>
        <View style={styles.bgBlobTop} />
        <View style={styles.bgBlobBottom} />

        <View style={styles.hero}>
          <View style={styles.brand}>
            <View style={styles.brandIcon}>
              <Leaf color={colors.primary} size={18} strokeWidth={2.5} />
            </View>
            <Text style={styles.brandText}>Terra</Text>
          </View>

          <Text style={styles.headline}>Plante uma semente para um futuro mais verde.</Text>
          <Text style={styles.subheadline}>
            Entre para continuar sua jornada ecológica e acompanhar seu impacto
            real no planeta.
          </Text>

          <View style={styles.benefits}>
            {authBenefits.map((benefit, index) => (
              <StatPill
                key={benefit}
                label={benefit}
                tone={index === 2 ? 'tertiary' : 'primary'}
              />
            ))}
          </View>
        </View>

        <SurfaceCard style={styles.formCard}>
          <StatPill label={stitchConfig.projectTitle} tone="secondary" />
          <Text style={styles.formTitle}>Bem-vindo de volta</Text>
          <Text style={styles.formSubtitle}>
            Entre para continuar sua jornada ecológica.
          </Text>

          <Pressable onPress={() => onNavigate('home')} style={styles.socialButton}>
            <View style={styles.socialIcon}>
              <Mail color={colors.primary} size={18} strokeWidth={2.2} />
            </View>
            <Text style={styles.socialLabel}>Continuar com Google</Text>
          </Pressable>

          <Pressable onPress={() => onNavigate('home')} style={styles.socialButton}>
            <View style={styles.socialIcon}>
              <Apple color={colors.primary} size={18} strokeWidth={2.2} />
            </View>
            <Text style={styles.socialLabel}>Continuar com Apple</Text>
          </Pressable>

          <Text style={styles.divider}>ou com e-mail</Text>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>E-mail</Text>
            <View style={styles.inputWrap}>
              <Mail color={colors.textSoft} size={18} strokeWidth={2.2} />
              <TextInput
                keyboardType="email-address"
                placeholder="mariana@terra.app"
                placeholderTextColor={colors.textSoft}
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Senha</Text>
            <View style={styles.inputWrap}>
              <Lock color={colors.textSoft} size={18} strokeWidth={2.2} />
              <TextInput
                placeholder="••••••••"
                placeholderTextColor={colors.textSoft}
                secureTextEntry
                style={styles.input}
              />
            </View>
          </View>

          <Pressable style={styles.textLink}>
            <Text style={styles.textLinkLabel}>Esqueceu a senha?</Text>
          </Pressable>

          <AppButton
            icon={ArrowRight}
            label="Entrar"
            onPress={() => onNavigate('home')}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Ainda não tem conta?</Text>
            <Pressable onPress={() => onNavigate('home')}>
              <Text style={styles.footerLink}>Cadastre-se</Text>
            </Pressable>
          </View>
        </SurfaceCard>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  benefits: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  bgBlobBottom: {
    backgroundColor: colors.tertiarySoft,
    borderRadius: radius.pill,
    bottom: -80,
    height: 260,
    opacity: 0.5,
    position: 'absolute',
    right: -60,
    width: 260,
  },
  bgBlobTop: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    height: 260,
    left: -80,
    opacity: 0.55,
    position: 'absolute',
    top: -80,
    width: 260,
  },
  brand: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  brandIcon: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  brandText: {
    color: colors.primary,
    fontFamily: typography.headlineStrong,
    fontSize: 26,
  },
  divider: {
    color: colors.textSoft,
    fontFamily: typography.bodyBold,
    fontSize: 13,
    textAlign: 'center',
  },
  field: {
    gap: spacing.xs,
  },
  fieldLabel: {
    color: colors.textMuted,
    fontFamily: typography.bodyBold,
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
  },
  footerLink: {
    color: colors.primary,
    fontFamily: typography.bodyBold,
    fontSize: 14,
  },
  footerText: {
    color: colors.textSoft,
    fontFamily: typography.body,
    fontSize: 14,
  },
  formCard: {
    gap: spacing.md,
  },
  formSubtitle: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 15,
    lineHeight: 23,
  },
  formTitle: {
    color: colors.text,
    fontFamily: typography.headline,
    fontSize: 28,
  },
  headline: {
    color: colors.text,
    fontFamily: typography.headlineStrong,
    fontSize: 34,
    letterSpacing: -0.9,
    lineHeight: 40,
  },
  hero: {
    gap: spacing.md,
  },
  input: {
    color: colors.text,
    flex: 1,
    fontFamily: typography.bodySemiBold,
    fontSize: 15,
  },
  inputWrap: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 56,
    paddingHorizontal: spacing.md,
  },
  root: {
    backgroundColor: colors.background,
    flex: 1,
    gap: spacing.xl,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  socialButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 56,
    paddingHorizontal: spacing.md,
  },
  socialIcon: {
    alignItems: 'center',
    backgroundColor: colors.surfaceRaised,
    borderRadius: radius.pill,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  socialLabel: {
    color: colors.text,
    fontFamily: typography.bodyBold,
    fontSize: 15,
  },
  subheadline: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 16,
    lineHeight: 25,
  },
  textLink: {
    alignSelf: 'flex-end',
  },
  textLinkLabel: {
    color: colors.primary,
    fontFamily: typography.bodyBold,
    fontSize: 14,
  },
});
