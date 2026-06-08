import {
  Bell,
  ChevronRight,
  Recycle,
  Settings,
  UserRound,
  Leaf,
  Lock,
} from "lucide-react-native";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";

import { AppScreen } from "../components/app-screen";
import { SectionHeading, SurfaceCard } from "../components/primitives";
import { radius, spacing, typography } from "../theme/tokens";
import { useTheme } from "../theme/ThemeContext";
import type { ScreenId } from "../types/navigation";
import { api } from "../services/api";

type ProfileScreenProps = {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
};

type ActionHistory = {
  _id: string;
  itemType: string;
  description: string;
  pointsEarned: number;
  createdAt: string;
};

export function ProfileScreen({
  currentScreen,
  onNavigate,
}: ProfileScreenProps) {
  const { activeColors } = useTheme();
  const styles = createStyles(activeColors);

  const [history, setHistory] = useState<ActionHistory[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const profileLinks = [
    "Editar perfil",
    "Configurações",
    "Privacidade e permissões",
  ];

  const handleMenuPress = (linkName: string) => {
    if (linkName === "Editar perfil") {
      onNavigate("edit-profile");
    } else {
      Alert.alert(
        "Em desenvolvimento",
        `A área de "${linkName}" estará disponível na versão final do aplicativo.`,
      );
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const historyRes = await api.get("/actions/history");
        setHistory(historyRes.data);

        try {
          const userRes = await api.get("/users/profile");
          setUserData(userRes.data);
        } catch (e) {
          console.log("Aviso: Rota de perfil não encontrada, usando fallback.");
          setUserData({
            name: "Eco-Herói",
            level: 1,
            points: 0,
            createdAt: new Date().toISOString(),
            unlockedAchievements: [],
          });
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        Alert.alert("Ops!", "Não foi possível carregar seu histórico.");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`;
  };

  if (isLoading) {
    return (
      <AppScreen currentScreen={currentScreen} onNavigate={onNavigate}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={activeColors.primary} />
          <Text
            style={{
              color: activeColors.textMuted,
              fontFamily: typography.bodyBold,
              marginTop: spacing.md,
            }}
          >
            Carregando seu impacto...
          </Text>
        </View>
      </AppScreen>
    );
  }

  const stats = [
    { label: "Nível", value: userData?.level || 1 },
    { label: "Pontos XP", value: userData?.points || 0 },
    { label: "Reciclagens", value: history.length },
  ];

  const unlockedList = userData?.unlockedAchievements || [];
  const displayAchievements = [];

  for (let i = 0; i < 3; i++) {
    if (unlockedList[i]) {
      displayAchievements.push({
        label: unlockedList[i].title,
        icon: Leaf,
        isLocked: false,
      });
    } else {
      displayAchievements.push({
        label: "Em breve",
        icon: Lock,
        isLocked: true,
      });
    }
  }

  return (
    <AppScreen currentScreen={currentScreen} onNavigate={onNavigate}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.topBar}>
          <View style={styles.topBarLeft}>
            <Text style={styles.greeting}>
              Olá, {userData?.name?.split(" ")[0] || "Eco-Herói"}
            </Text>
          </View>
          <View style={styles.topBarRight}>
            <View style={styles.iconButton}>
              <Settings
                color={activeColors.textSoft}
                size={18}
                strokeWidth={2.2}
              />
            </View>
          </View>
        </View>

        <SurfaceCard style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.profileAvatar}>
              <UserRound
                color={activeColors.primary}
                size={28}
                strokeWidth={2.2}
              />
            </View>
            <View style={styles.profileCopy}>
              <Text style={styles.profileName}>
                {userData?.name || "Carregando..."}
              </Text>
              <Text style={styles.profileMeta}>
                Membro desde{" "}
                {userData ? formatDate(userData.createdAt) : "2026"}
              </Text>
            </View>
          </View>

          <View style={styles.profileStats}>
            {stats.map((stat) => (
              <View key={stat.label} style={styles.profileStatCard}>
                <Text style={styles.profileStatValue}>{stat.value}</Text>
                <Text style={styles.profileStatLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </SurfaceCard>

        <SectionHeading
          title="Seu Histórico"
          subtitle="Últimos itens reciclados por você"
        />

        <View style={styles.listWrap}>
          {history.length === 0 ? (
            <SurfaceCard style={{ alignItems: "center", padding: spacing.xl }}>
              <Recycle color={activeColors.textMuted} size={32} />
              <Text
                style={{
                  color: activeColors.textMuted,
                  fontFamily: typography.body,
                  marginTop: spacing.sm,
                }}
              >
                Você ainda não fez nenhuma reciclagem.
              </Text>
            </SurfaceCard>
          ) : (
            history.map((activity) => (
              <SurfaceCard key={activity._id} style={styles.activityCard}>
                <View style={styles.activityIcon}>
                  <Recycle
                    color={activeColors.primary}
                    size={18}
                    strokeWidth={2.2}
                  />
                </View>
                <View style={styles.activityCopy}>
                  <Text style={styles.activityTitle}>
                    {activity.description || "Item Reciclado"}
                  </Text>
                  <Text style={styles.activitySubtitle}>
                    {activity.itemType}
                  </Text>
                </View>
                <View style={styles.activityMeta}>
                  <Text style={styles.activityPoints}>
                    +{activity.pointsEarned} pts
                  </Text>
                  <Text style={styles.activityTime}>
                    {formatDate(activity.createdAt)}
                  </Text>
                </View>
              </SurfaceCard>
            ))
          )}
        </View>

        <SectionHeading title="Últimas Conquistas" />

        <View style={styles.achievementRow}>
          {displayAchievements.map((item, index) => {
            const Icon = item.icon;
            return (
              <SurfaceCard
                key={`${item.label}-${index}`}
                style={styles.badgeCard}
              >
                <View
                  style={[
                    styles.badgeIcon,
                    item.isLocked && {
                      backgroundColor: activeColors.surfaceStrong,
                    },
                  ]}
                >
                  <Icon
                    color={
                      item.isLocked
                        ? activeColors.textSoft
                        : activeColors.primary
                    }
                    size={20}
                    strokeWidth={2.2}
                  />
                </View>
                <Text
                  style={[
                    styles.badgeLabel,
                    item.isLocked && { color: activeColors.textSoft },
                  ]}
                >
                  {item.label}
                </Text>
              </SurfaceCard>
            );
          })}
        </View>

        <SectionHeading title="Ajustes" />

        <View style={styles.listWrap}>
          {profileLinks.map((link) => (
            <Pressable
              key={link}
              style={({ pressed }) => [
                styles.linkRow,
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => handleMenuPress(link)}
            >
              <Text style={styles.linkLabel}>{link}</Text>
              <ChevronRight
                color={activeColors.textSoft}
                size={16}
                strokeWidth={2.3}
              />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </AppScreen>
  );
}

const createStyles = (themeColors: any) =>
  StyleSheet.create({
    achievementRow: {
      flexDirection: "row",
      gap: spacing.md,
    },
    activityCard: {
      alignItems: "flex-start",
      flexDirection: "row",
      gap: spacing.md,
    },
    activityCopy: {
      flex: 1,
      gap: spacing.xxs,
    },
    activityIcon: {
      alignItems: "center",
      backgroundColor: themeColors.primarySoft,
      borderRadius: radius.md,
      height: 40,
      justifyContent: "center",
      width: 40,
    },
    activityMeta: {
      alignItems: "flex-end",
      gap: spacing.xxs,
    },
    activityPoints: {
      color: themeColors.primary,
      fontFamily: typography.bodyBold,
      fontSize: 13,
    },
    activitySubtitle: {
      color: themeColors.textMuted,
      fontFamily: typography.body,
      fontSize: 13,
      lineHeight: 19,
    },
    activityTime: {
      color: themeColors.textSoft,
      fontFamily: typography.body,
      fontSize: 12,
    },
    activityTitle: {
      color: themeColors.text,
      fontFamily: typography.bodyBold,
      fontSize: 15,
    },
    badgeCard: {
      alignItems: "center",
      flex: 1,
      gap: spacing.sm,
      padding: spacing.md,
    },
    badgeIcon: {
      alignItems: "center",
      backgroundColor: themeColors.primarySoft,
      borderRadius: radius.pill,
      height: 44,
      justifyContent: "center",
      width: 44,
    },
    badgeLabel: {
      color: themeColors.text,
      fontFamily: typography.bodyBold,
      fontSize: 13,
      textAlign: "center",
    },
    greeting: {
      color: themeColors.primary,
      fontFamily: typography.headline,
      fontSize: 22,
    },
    iconButton: {
      alignItems: "center",
      backgroundColor: themeColors.surfaceRaised,
      borderColor: themeColors.border,
      borderRadius: radius.pill,
      borderWidth: 1,
      height: 38,
      justifyContent: "center",
      width: 38,
    },
    linkLabel: {
      color: themeColors.text,
      fontFamily: typography.bodyBold,
      fontSize: 15,
    },
    linkRow: {
      alignItems: "center",
      backgroundColor: themeColors.surfaceRaised,
      borderColor: themeColors.border,
      borderRadius: radius.md,
      borderWidth: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
    },
    listWrap: {
      gap: spacing.md,
    },
    profileAvatar: {
      alignItems: "center",
      backgroundColor: themeColors.primarySoft,
      borderRadius: radius.pill,
      height: 72,
      justifyContent: "center",
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
      alignItems: "center",
      flexDirection: "row",
      gap: spacing.md,
    },
    profileMeta: {
      color: themeColors.textSoft,
      fontFamily: typography.body,
      fontSize: 14,
    },
    profileName: {
      color: themeColors.text,
      fontFamily: typography.headlineStrong,
      fontSize: 30,
    },
    profileStatCard: {
      backgroundColor: themeColors.surfaceMuted,
      borderRadius: radius.md,
      flex: 1,
      gap: spacing.xxs,
      padding: spacing.md,
    },
    profileStatLabel: {
      color: themeColors.textMuted,
      fontFamily: typography.body,
      fontSize: 13,
    },
    profileStatValue: {
      color: themeColors.primary,
      fontFamily: typography.headline,
      fontSize: 24,
    },
    profileStats: {
      flexDirection: "row",
      gap: spacing.md,
    },
    scrollContent: {
      gap: spacing.xl,
      paddingBottom: spacing.xl,
    },
    topBar: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    topBarLeft: {
      flex: 1,
    },
    topBarRight: {
      flex: 1,
      flexDirection: "row",
      gap: spacing.xs,
      justifyContent: "flex-end",
    },
  });
