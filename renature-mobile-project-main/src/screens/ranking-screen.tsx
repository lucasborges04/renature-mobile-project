import { Bell, Crown, TrendingUp } from "lucide-react-native";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";

import { AppScreen } from "../components/app-screen";
import {
  ProgressBar,
  SectionHeading,
  StatPill,
  SurfaceCard,
} from "../components/primitives";
import { rankingProgress } from "../data/content";
import { colors, radius, spacing, typography } from "../theme/tokens";
import type { ScreenId } from "../types/navigation";
import { userService } from "../services/userService";

type RankingScreenProps = {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
};

export function RankingScreen({
  currentScreen,
  onNavigate,
}: RankingScreenProps) {
  const [ranking, setRanking] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRankingData() {
      try {
        const [rankingData, profileData] = await Promise.all([
          userService.getRanking(),
          userService.getProfile(),
        ]);
        setRanking(rankingData);
        setUserProfile(profileData);
      } catch (error) {
        console.error("Erro ao carregar ranking:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadRankingData();
  }, []);

  const podium = ranking.slice(0, 3);
  const remainingTop10 = ranking.slice(3, 10);

  const currentUserIndex = ranking.findIndex(
    (person) => person.name === userProfile?.name,
  );
  const currentUserData =
    currentUserIndex !== -1 ? ranking[currentUserIndex] : null;
  const userRankPosition = currentUserIndex !== -1 ? currentUserIndex + 1 : 0;

  const thirdPlacePoints = podium.length === 3 ? podium[2].points : 0;
  const pointsMissingForTop3 =
    currentUserData && thirdPlacePoints > currentUserData.points
      ? thirdPlacePoints - currentUserData.points
      : 0;

  return (
    <AppScreen currentScreen={currentScreen} onNavigate={onNavigate}>
      <View style={styles.topBar}>
        <Text style={styles.greeting}>
          Olá, {userProfile?.name?.split(" ")[0] || "Eco-Herói"}
        </Text>
        <View style={styles.notifyButton}>
          <Bell color={colors.textSoft} size={18} strokeWidth={2.2} />
        </View>
      </View>

      <SectionHeading
        subtitle="Veja sua posição e acompanhe sua evolução."
        title="Ranking e Pontuação"
      />

      {isLoading ? (
        <View style={{ paddingVertical: spacing.xl, alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          <View style={styles.podiumWrap}>
            {podium.map((person, index) => (
              <SurfaceCard key={person._id || index} style={styles.podiumCard}>
                <View style={styles.crownBadge}>
                  <Crown color={colors.tertiary} size={18} strokeWidth={2.2} />
                </View>
                <Text style={styles.podiumRank}>#{index + 1}</Text>
                {/* Mostra só o primeiro nome para caber no card */}
                <Text style={styles.podiumName}>
                  {person.name.split(" ")[0]}
                </Text>
                <Text style={styles.podiumPoints}>{person.points} pts</Text>
              </SurfaceCard>
            ))}
          </View>

          {currentUserData && (
            <SurfaceCard style={styles.userCard}>
              <StatPill
                label={`Nível ${currentUserData.level || 1} · Eco-Guardião`}
                tone="primary"
              />
              <Text style={styles.userTitle}>
                Você está em {userRankPosition}º lugar
              </Text>
              <Text style={styles.userPoints}>
                {currentUserData.points} pts
              </Text>

              {userRankPosition > 3 ? (
                <Text style={styles.userHint}>
                  Faltam apenas {pointsMissingForTop3} pontos para entrar no top
                  3.
                </Text>
              ) : (
                <Text style={styles.userHint}>
                  Parabéns! Você está no pódio dos melhores do aplicativo.
                </Text>
              )}
            </SurfaceCard>
          )}

          {remainingTop10.length > 0 && (
            <SurfaceCard style={{ gap: spacing.md }}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>Restante do Top 10</Text>
              </View>
              <View style={{ gap: spacing.sm }}>
                {remainingTop10.map((person, index) => (
                  <View
                    key={person._id || index}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingVertical: spacing.sm,
                      borderBottomWidth: 1,
                      borderBottomColor: colors.surfaceMuted,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        gap: spacing.md,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: typography.headline,
                          fontSize: 18,
                          color: colors.textMuted,
                        }}
                      >
                        #{index + 4}
                      </Text>
                      <Text
                        style={{
                          fontFamily: typography.bodyBold,
                          fontSize: 16,
                          color: colors.text,
                        }}
                      >
                        {person.name}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontFamily: typography.bodyBold,
                        color: colors.primary,
                      }}
                    >
                      {person.points} pts
                    </Text>
                  </View>
                ))}
              </View>
            </SurfaceCard>
          )}
        </>
      )}

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
        <Text style={styles.progressHint}>
          Você subiu 2 posições desde o início do mês.
        </Text>
      </SurfaceCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  crownBadge: {
    alignItems: "center",
    backgroundColor: colors.tertiarySoft,
    borderRadius: radius.pill,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  greeting: {
    color: colors.primary,
    fontFamily: typography.headline,
    fontSize: 22,
  },
  notifyButton: {
    alignItems: "center",
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  podiumCard: {
    alignItems: "center",
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
    flexDirection: "row",
    gap: spacing.md,
  },
  progressCard: {
    gap: spacing.md,
  },
  progressFillWrap: {
    flex: 1,
  },
  progressHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  progressHint: {
    color: colors.primary,
    fontFamily: typography.bodyBold,
    fontSize: 14,
  },
  progressItem: {
    alignItems: "center",
    flexDirection: "row",
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
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
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
