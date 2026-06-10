import {
  ArrowLeft,
  Camera as CameraIcon,
  Flashlight,
  Recycle,
  Smartphone,
  Edit3,
  CheckCircle,
  Trophy,
  AlertTriangle,
} from "lucide-react-native";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";

import { AppScreen } from "../components/app-screen";
import { AppButton, SurfaceCard } from "../components/primitives";
import { radius, spacing, typography } from "../theme/tokens";
import { useTheme } from "../theme/ThemeContext";
import type { ScreenId } from "../types/navigation";
import { recyclingService } from "../services/recyclingService";

type ScannerScreenProps = {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
};

// Nosso controlador de estado para o Feedback Visual
type FeedbackState = {
  visible: boolean;
  type: "success" | "error" | "levelup";
  title: string;
  message: string;
};

export function ScannerScreen({
  currentScreen,
  onNavigate,
}: ScannerScreenProps) {
  const { activeColors } = useTheme();
  const styles = createStyles(activeColors);

  const [permission, requestPermission] = useCameraPermissions();
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Substituímos o scanResult antigo pelo nosso Feedback Visual
  const [feedback, setFeedback] = useState<FeedbackState>({
    visible: false,
    type: "success",
    title: "",
    message: "",
  });

  if (!permission) {
    return (
      <AppScreen currentScreen={currentScreen} onNavigate={onNavigate}>
        <ActivityIndicator size="large" color={activeColors.primary} />
      </AppScreen>
    );
  }

  if (!permission.granted) {
    return (
      <AppScreen currentScreen={currentScreen} onNavigate={onNavigate}>
        <SurfaceCard
          style={{ alignItems: "center", padding: spacing.xl, gap: spacing.md }}
        >
          <CameraIcon color={activeColors.primary} size={40} />
          <Text
            style={{
              color: activeColors.text,
              fontFamily: typography.headline,
              fontSize: 20,
              textAlign: "center",
            }}
          >
            Precisamos de acesso
          </Text>
          <Text
            style={{
              color: activeColors.textMuted,
              fontFamily: typography.body,
              textAlign: "center",
            }}
          >
            Para ler os códigos de barras, o aplicativo precisa usar a câmera do
            seu celular.
          </Text>
          <AppButton label="Conceder Permissão" onPress={requestPermission} />
        </SurfaceCard>
      </AppScreen>
    );
  }

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned || isProcessing) return;

    setScanned(true);
    setIsProcessing(true);

    try {
      const response = await recyclingService.recycleWithBarcode(data);

      if (response.levelUpMessage) {
        setFeedback({
          visible: true,
          type: "levelup",
          title: "Evolução! 🌟",
          message: response.levelUpMessage,
        });
      } else {
        setFeedback({
          visible: true,
          type: "success",
          title: "Reciclagem Registrada!",
          message: `Identificamos: ${response.item}\nVocê ganhou +${response.pointsEarned} XP!`,
        });
      }
    } catch (error: any) {
      setFeedback({
        visible: true,
        type: "error",
        title: "Ops! Código não encontrado",
        message:
          error.message ||
          "Não conseguimos identificar este item na base global.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const closeFeedback = () => {
    setFeedback({ ...feedback, visible: false });
    // Se for erro, libera a câmera para tentar outro código.
    // Se for sucesso, o usuário deve voltar para a Home ou apertar o botão manual.
    if (feedback.type === "error") {
      setScanned(false);
    }
  };

  const renderFeedbackIcon = () => {
    switch (feedback.type) {
      case "success":
        return (
          <CheckCircle color={activeColors.primary} size={54} strokeWidth={2} />
        );
      case "levelup":
        return <Trophy color="#F59E0B" size={54} strokeWidth={2} />;
      case "error":
        return <AlertTriangle color="#EF4444" size={54} strokeWidth={2} />;
    }
  };

  return (
    <AppScreen currentScreen={currentScreen} onNavigate={onNavigate}>
      <View style={styles.cameraCard}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          enableTorch={isFlashOn}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["ean13", "ean8", "qr", "upc_a", "upc_e"],
          }}
        />

        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: "rgba(0,0,0,0.3)",
          }}
        />

        <View style={styles.cameraHeader}>
          <Pressable
            onPress={() => onNavigate("home")}
            style={styles.iconButton}
          >
            <ArrowLeft color={activeColors.white} size={18} strokeWidth={2.4} />
          </Pressable>
          <Pressable
            style={styles.iconButton}
            onPress={() => setIsFlashOn(!isFlashOn)}
          >
            <Flashlight
              color={isFlashOn ? activeColors.tertiary : activeColors.white}
              size={18}
              strokeWidth={2.4}
            />
          </Pressable>
        </View>

        <View style={styles.scanFrame}>
          <Text style={styles.scanHint}>
            {isProcessing
              ? "Consultando banco de dados..."
              : "Aponte para o código de barras"}
          </Text>
        </View>

        {isProcessing && (
          <View style={styles.processingCard}>
            <ActivityIndicator size="small" color={activeColors.primary} />
            <Text style={styles.processingText}>Identificando produto...</Text>
          </View>
        )}
      </View>

      <SurfaceCard style={styles.mobileCard}>
        <View style={styles.mobileIcon}>
          <Smartphone
            color={activeColors.primary}
            size={22}
            strokeWidth={2.2}
          />
        </View>
        <Text style={styles.mobileTitle}>Produto sem código?</Text>
        <Text style={styles.mobileText}>
          Se o item não possui embalagem ou o código está ilegível, você pode
          registrar a reciclagem manualmente.
        </Text>
      </SurfaceCard>

      <AppButton
        icon={Edit3}
        label="Adicionar Manualmente"
        onPress={() => onNavigate("manual")}
      />

      {/* --- O NOSSO NOVO OVERLAY DE FEEDBACK (SUBSTITUTO DO POP-UP) --- */}
      {feedback.visible && (
        <View style={styles.overlayContainer}>
          <View style={styles.overlayCard}>
            <View style={styles.overlayIconWrap}>{renderFeedbackIcon()}</View>
            <Text style={styles.overlayTitle}>{feedback.title}</Text>
            <Text style={styles.overlayMessage}>{feedback.message}</Text>

            <View style={styles.overlayActions}>
              <AppButton
                label={
                  feedback.type === "error" ? "Escanear Novamente" : "Legal!"
                }
                onPress={closeFeedback}
              />
              {feedback.type === "success" && (
                <View style={{ marginTop: spacing.sm }}>
                  <AppButton
                    label="Voltar para a Home"
                    variant="secondary"
                    onPress={() => {
                      closeFeedback();
                      onNavigate("home");
                    }}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
      )}
    </AppScreen>
  );
}

const createStyles = (themeColors: any) =>
  StyleSheet.create({
    cameraCard: {
      backgroundColor: themeColors.scannerOverlay,
      borderRadius: radius.xl,
      gap: spacing.xl,
      minHeight: 430,
      overflow: "hidden",
      padding: spacing.xl,
      position: "relative",
    },
    cameraHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      zIndex: 10,
    },
    iconButton: {
      alignItems: "center",
      backgroundColor: "rgba(255,255,255,0.15)",
      borderRadius: radius.pill,
      height: 44,
      justifyContent: "center",
      width: 44,
    },
    mobileCard: {
      gap: spacing.sm,
    },
    mobileIcon: {
      alignItems: "center",
      backgroundColor: themeColors.primarySoft,
      borderRadius: radius.pill,
      height: 42,
      justifyContent: "center",
      width: 42,
    },
    mobileText: {
      color: themeColors.textMuted,
      fontFamily: typography.body,
      fontSize: 14,
      lineHeight: 21,
    },
    mobileTitle: {
      color: themeColors.text,
      fontFamily: typography.headline,
      fontSize: 24,
    },
    scanFrame: {
      alignItems: "center",
      borderColor: "rgba(255,255,255,0.5)",
      borderRadius: radius.xl,
      borderStyle: "dashed",
      borderWidth: 2,
      flex: 1,
      justifyContent: "center",
      minHeight: 190,
      zIndex: 10,
    },
    scanHint: {
      color: themeColors.white,
      fontFamily: typography.bodyBold,
      fontSize: 15,
      textAlign: "center",
      textShadowColor: "rgba(0, 0, 0, 0.75)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 4,
    },
    processingCard: {
      position: "absolute",
      bottom: spacing.xl,
      left: spacing.xl,
      right: spacing.xl,
      backgroundColor: themeColors.surfaceRaised,
      borderRadius: radius.lg,
      padding: spacing.md,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      zIndex: 20,
    },
    processingText: {
      color: themeColors.text,
      fontFamily: typography.bodyBold,
      fontSize: 16,
    },

    // ESTILOS DO NOVO OVERLAY DE FEEDBACK (Adapta 100% ao Tema)
    overlayContainer: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.85)", // Fundo bem escuro para focar no cartão
      zIndex: 999, // Fica acima de TUDO na tela
      justifyContent: "center",
      alignItems: "center",
      padding: spacing.xl,
    },
    overlayCard: {
      backgroundColor: themeColors.surfaceRaised, // Puxa automático do Light/Dark Mode
      borderRadius: radius.xl,
      padding: spacing.xl,
      width: "100%",
      alignItems: "center",
      borderColor: themeColors.border,
      borderWidth: 1,
    },
    overlayIconWrap: {
      marginBottom: spacing.md,
      backgroundColor: themeColors.background,
      padding: spacing.md,
      borderRadius: radius.pill,
    },
    overlayTitle: {
      color: themeColors.text,
      fontFamily: typography.headlineStrong,
      fontSize: 24,
      textAlign: "center",
      marginBottom: spacing.xs,
    },
    overlayMessage: {
      color: themeColors.textMuted,
      fontFamily: typography.body,
      fontSize: 16,
      textAlign: "center",
      lineHeight: 24,
      marginBottom: spacing.xl,
    },
    overlayActions: {
      width: "100%",
    },
  });
