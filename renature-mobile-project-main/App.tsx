import { useState } from 'react';

import { StatusBar } from 'expo-status-bar';
import {
  Literata_700Bold,
  Literata_800ExtraBold,
  useFonts as useLiterataFonts,
} from '@expo-google-fonts/literata';
import {
  NunitoSans_400Regular,
  NunitoSans_600SemiBold,
  NunitoSans_700Bold,
  NunitoSans_800ExtraBold,
  useFonts as useNunitoFonts,
} from '@expo-google-fonts/nunito-sans';
import { StyleSheet, View } from 'react-native';

import { AuthScreen } from './src/screens/auth-screen';
import { AchievementsScreen } from './src/screens/achievements-screen';
import { ChallengesScreen } from './src/screens/challenges-screen';
import { DetailScreen } from './src/screens/detail-screen';
import { HomeScreen } from './src/screens/home-screen';
import { LearnScreen } from './src/screens/learn-screen';
import { OnboardingScreen } from './src/screens/onboarding-screen';
import { ProfileScreen } from './src/screens/profile-screen';
import { RankingScreen } from './src/screens/ranking-screen';
import { ScannerScreen } from './src/screens/scanner-screen';
import { colors } from './src/theme/tokens';
import type { ScreenId } from './src/types/navigation';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('onboarding-1');
  const [literataLoaded] = useLiterataFonts({
    Literata_700Bold,
    Literata_800ExtraBold,
  });
  const [nunitoLoaded] = useNunitoFonts({
    NunitoSans_400Regular,
    NunitoSans_600SemiBold,
    NunitoSans_700Bold,
    NunitoSans_800ExtraBold,
  });

  if (!literataLoaded || !nunitoLoaded) {
    return <View style={styles.loadingScreen} />;
  }

  const navigate = (screen: ScreenId) => {
    setCurrentScreen(screen);
  };

  return (
    <>
      <StatusBar style={currentScreen === 'scanner' ? 'light' : 'dark'} />
      {renderScreen(currentScreen, navigate)}
    </>
  );
}

function renderScreen(
  currentScreen: ScreenId,
  navigate: (screen: ScreenId) => void,
) {
  switch (currentScreen) {
    case 'onboarding-1':
    case 'onboarding-2':
    case 'onboarding-3':
      return <OnboardingScreen currentScreen={currentScreen} onNavigate={navigate} />;
    case 'auth':
      return <AuthScreen onNavigate={navigate} />;
    case 'home':
      return <HomeScreen currentScreen={currentScreen} onNavigate={navigate} />;
    case 'learn':
      return <LearnScreen currentScreen={currentScreen} onNavigate={navigate} />;
    case 'scanner':
      return <ScannerScreen currentScreen={currentScreen} onNavigate={navigate} />;
    case 'detail':
      return <DetailScreen currentScreen={currentScreen} onNavigate={navigate} />;
    case 'challenges':
      return <ChallengesScreen currentScreen={currentScreen} onNavigate={navigate} />;
    case 'achievements':
      return (
        <AchievementsScreen currentScreen={currentScreen} onNavigate={navigate} />
      );
    case 'ranking':
      return <RankingScreen currentScreen={currentScreen} onNavigate={navigate} />;
    case 'profile':
      return <ProfileScreen currentScreen={currentScreen} onNavigate={navigate} />;
    default:
      return <HomeScreen currentScreen="home" onNavigate={navigate} />;
  }
}

const styles = StyleSheet.create({
  loadingScreen: {
    backgroundColor: colors.background,
    flex: 1,
  },
});
