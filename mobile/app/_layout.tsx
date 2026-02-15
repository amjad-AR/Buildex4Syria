import {
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";
import { AuthProvider } from "../context/AuthContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    'SpaceGrotesk-Bold': require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Manrope-Regular': require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Manrope-Medium': require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Manrope-SemiBold': require('../assets/fonts/SpaceMono-Regular.ttf'),
    'JetBrainsMono-Medium': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={DefaultTheme}>
        <Stack
          screenOptions={({ route }) => ({
            headerShown: !route.name.startsWith("tempobook"),
          })}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="category/walls" options={{ headerShown: false }} />
          <Stack.Screen name="category/floors" options={{ headerShown: false }} />
          <Stack.Screen name="category/ceilings" options={{ headerShown: false }} />
          <Stack.Screen name="category/furniture" options={{ headerShown: false }} />
          <Stack.Screen name="project/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="orders/index" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}

