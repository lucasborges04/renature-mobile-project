import { Bell, Crown, TrendingUp } from "lucide-react-native";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";

import { AppScreen } from "../components/app-screen";
import {
  ProgressBar,
  SectionHeading,
  StatPill,
  SurfaceCard,
} from "../components/primitives";
import { colors, radius, spacing, typography } from "../theme/tokens";
import type { ScreenId } from "../types/navigation";
import { api } from "../services/api";

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

  const [backendUserRank, setBackendUserRank] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRankingData() {
      try {
        const [rankingRes, profileRes] = await Promise.all([
          api.get("/users/ranking"),
          api.get("/users/profile").catch(() => ({ data: null })),
        ]);

        const fetchedTop10 = rankingRes.data?.top10 || [];
        setRanking(fetchedTop10);

        setBackendUserRank(rankingRes.data?.currentUserInfo || null);
        setUserProfile(profileRes.data || null);
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

  const userRankPosition = backendUserRank?.position || 0;
  const currentUserData = backendUserRank;

  const thirdPlacePoints = podium.length === 3 ? podium[2].points : 0;
  const pointsMissingForTop3 =
    currentUserData && thirdPlacePoints > currentUserData.points
      ? thirdPlacePoints - currentUserData.points
      : 0;

  return (
    <AppScreen currentScreen={currentScreen} onNavigate={onNavigate}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.topBar}>
          <Text style={styles.greeting}>
            Olá,{" "}
            {userProfile?.name ? userProfile.name.split(" ")[0] : "Eco-Herói"}
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
            {ranking.length > 0 ? (
              <View style={styles.podiumWrap}>
                {podium.map((person, index) => (
                  <SurfaceCard
                    key={person._id || index}
                    style={styles.podiumCard}
                  >
                    <View style={styles.crownBadge}>
                      <Crown
                        color={colors.tertiary}
                        size={18}
                        strokeWidth={2.2}
                      />
                    </View>
                    <Text style={styles.podiumRank}>#{index + 1}</Text>
                    <Text style={styles.podiumName} numberOfLines={1}>
                      {person?.name ? person.name.split(" ")[0] : "Anônimo"}
                    </Text>
                    <Text style={styles.podiumPoints}>
                      {person?.points || 0} pts
                    </Text>
                  </SurfaceCard>
                ))}
              </View>
            ) : (
              <Text
                style={{
                  textAlign: "center",
                  color: colors.textMuted,
                  marginBottom: spacing.md,
                }}
              >
                Nenhum dado no ranking ainda.
              </Text>
            )}

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
                    Faltam apenas {pointsMissingForTop3} pontos para entrar no
                    top 3.
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
                      style={styles.rankingListItem}
                    >
                      <View style={styles.rankingListLeft}>
                        <Text style={styles.rankingListRank}>#{index + 4}</Text>
                        <Text style={styles.rankingListName}>
                          {person?.name || "Anônimo"}
                        </Text>
                      </View>
                      <Text style={styles.rankingListPoints}>
                        {person?.points || 0} pts
                      </Text>
                    </View>
                  ))}
                </View>
              </SurfaceCard>
            )}
          </>
        )}

        {currentUserData &&
          (() => {
            const currentLevel = currentUserData.level || 1;
            const currentXP = userProfile?.xp || 0;
            const xpNeededForNext = currentLevel * 100;

            const progressToNext = Math.min(
              Math.round((currentXP / xpNeededForNext) * 100),
              100,
            );

            const dynamicProgress = [
              { label: `N${currentLevel + 1}`, value: progressToNext },
              { label: `N${currentLevel + 2}`, value: 0 },
              { label: `N${currentLevel + 3}`, value: 0 },
            ];

            return (
              <SurfaceCard style={styles.progressCard}>
                <View style={styles.progressHeader}>
                  <TrendingUp
                    color={colors.primary}
                    size={20}
                    strokeWidth={2.2}
                  />
                  <Text style={styles.progressTitle}>
                    Rumo dos Próximos Níveis
                  </Text>
                </View>

                <View style={styles.progressList}>
                  {dynamicProgress.map((item) => (
                    <View key={item.label} style={styles.progressItem}>
                      <Text style={styles.progressLabel}>{item.label}</Text>
                      <View style={styles.progressFillWrap}>
                        <ProgressBar value={item.value} />
                      </View>
                    </View>
                  ))}
                </View>

                <Text style={styles.progressHint}>
                  Faltam {xpNeededForNext - currentXP} XP para você alcançar o
                  Nível {currentLevel + 1}.
                </Text>
              </SurfaceCard>
            );
          })()}
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: { gap: spacing.xl, paddingBottom: spacing.xl },
  rankingListItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceMuted,
  },
  rankingListLeft: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center",
  },
  rankingListRank: {
    fontFamily: typography.headline,
    fontSize: 18,
    color: colors.textMuted,
  },
  rankingListName: {
    fontFamily: typography.bodyBold,
    fontSize: 16,
    color: colors.text,
  },
  rankingListPoints: { fontFamily: typography.bodyBold, color: colors.primary },
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
  podiumWrap: { flexDirection: "row", gap: spacing.md },
  progressCard: { gap: spacing.md },
  progressFillWrap: { flex: 1 },
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
  progressItem: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
  progressLabel: {
    color: colors.textMuted,
    fontFamily: typography.bodyBold,
    fontSize: 13,
    width: 26,
  },
  progressList: { gap: spacing.md },
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
  userCard: { gap: spacing.sm },
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
