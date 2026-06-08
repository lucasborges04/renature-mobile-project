import {
  ArrowLeft,
  Camera as CameraIcon,
  Flashlight,
  Recycle,
  Smartphone,
  Edit3,
  CheckCircle,
} from "lucide-react-native";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Alert,
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
  const [scanResult, setScanResult] = useState<{
    item: string;
    pointsEarned: number;
    material: string;
  } | null>(null);

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
            Para identificar os resíduos recicláveis, o aplicativo precisa usar
            a câmera do seu celular.
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
    setScanResult(null);

    try {
      const response = await recyclingService.recycleWithBarcode(data);

      setScanResult({
        item: response.item,
        pointsEarned: response.pointsEarned,
        material: response.material,
      });

      if (response.levelUpMessage) {
        Alert.alert("Evolução!", response.levelUpMessage);
      } else {
        Alert.alert(
          "Sucesso!",
          `Você reciclou: ${response.item}! (+${response.pointsEarned} pts)`,
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Ops!",
        error.message || "Código não cadastrado ou erro na rede.",
      );
      setScanned(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetScanner = () => {
    setScanned(false);
    setScanResult(null);
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

        <View style={styles.resultCard}>
          {isProcessing && (
            <View
              style={{
                flexDirection: "row",
                gap: spacing.sm,
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="small" color={activeColors.primary} />
              <Text style={styles.resultTitle}>Identificando...</Text>
            </View>
          )}

          {!isProcessing && !scanResult && (
            <>
              <Text style={styles.resultCaption}>Status</Text>
              <Text style={styles.resultTitle}>Aguardando item</Text>
              <View style={styles.resultMeta}>
                <Recycle
                  color={activeColors.primary}
                  size={18}
                  strokeWidth={2.3}
                />
                <Text style={styles.resultMetaText}>Pronto para leitura</Text>
              </View>
            </>
          )}

          {scanResult && (
            <>
              <Text style={styles.resultCaption}>
                Item computado com sucesso
              </Text>
              <Text style={styles.resultTitle}>{scanResult.item}</Text>
              <View style={styles.resultMeta}>
                <CheckCircle
                  color={activeColors.primary}
                  size={18}
                  strokeWidth={2.3}
                />
                <Text style={styles.resultMetaText}>
                  {scanResult.material} · +{scanResult.pointsEarned} XP
                </Text>
              </View>
            </>
          )}
        </View>
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

      {scanned && !isProcessing ? (
        <AppButton
          icon={CameraIcon}
          label="Escanear Novo Item"
          onPress={handleResetScanner}
        />
      ) : (
        <AppButton
          icon={Edit3}
          label="Adicionar Manualmente"
          onPress={() => onNavigate("manual")}
        />
      )}

      <AppButton
        label="Voltar para Home"
        onPress={() => onNavigate("home")}
        variant="secondary"
      />
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
    },
    cameraHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    iconButton: {
      alignItems: "center",
      backgroundColor: "rgba(255,255,255,0.12)",
      borderRadius: radius.pill,
      height: 40,
      justifyContent: "center",
      width: 40,
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
    resultCaption: {
      color: themeColors.textSoft,
      fontFamily: typography.bodyBold,
      fontSize: 12,
      textTransform: "uppercase",
    },
    resultCard: {
      backgroundColor: themeColors.surfaceRaised,
      borderRadius: radius.lg,
      gap: spacing.sm,
      padding: spacing.lg,
    },
    resultMeta: {
      alignItems: "center",
      flexDirection: "row",
      gap: spacing.xs,
    },
    resultMetaText: {
      color: themeColors.primary,
      fontFamily: typography.bodyBold,
      fontSize: 13,
    },
    resultTitle: {
      color: themeColors.text,
      fontFamily: typography.headlineStrong,
      fontSize: 30,
    },
    scanFrame: {
      alignItems: "center",
      borderColor: "rgba(255,255,255,0.45)",
      borderRadius: radius.xl,
      borderStyle: "dashed",
      borderWidth: 2,
      flex: 1,
      justifyContent: "center",
      minHeight: 190,
    },
    scanHint: {
      color: themeColors.white,
      fontFamily: typography.bodyBold,
      fontSize: 15,
    },
  });
