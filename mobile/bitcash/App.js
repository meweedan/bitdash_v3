// App.js
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, I18nManager } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation';
import './src/i18n';
import { getCurrentLanguage } from './src/i18n';
import theme from './src/theme/theme';

// Keep splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function App() {
  const [isRTL, setIsRTL] = useState(false);

  // Load custom fonts
  const [fontsLoaded] = useFonts({
    'DMSans-Regular': require('./assets/fonts/DMSans-Regular.ttf'),
    'DMSans-Medium': require('./assets/fonts/DMSans-Medium.ttf'),
    'DMSans-Bold': require('./assets/fonts/DMSans-Bold.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Check current language and set RTL if needed
        const currentLang = await getCurrentLanguage();
        const shouldBeRTL = currentLang === 'ar';
        
        // Only force RTL/LTR if it's different from current state
        if (I18nManager.isRTL !== shouldBeRTL) {
          I18nManager.allowRTL(shouldBeRTL);
          I18nManager.forceRTL(shouldBeRTL);
          setIsRTL(shouldBeRTL);
        }
      } catch (e) {
        console.warn('Error preparing app:', e);
      } finally {
        // Hide splash screen once everything is ready
        if (fontsLoaded) {
          await SplashScreen.hideAsync();
        }
      }
    }

    prepare();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer>
          <View style={{ flex: 1, backgroundColor: theme.colors.tazdani[500] }}>
            <AppNavigator />
            <StatusBar style="light" />
          </View>
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}