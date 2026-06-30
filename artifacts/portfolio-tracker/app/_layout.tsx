import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router, Slot, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { isSupabaseConfigured } from "@/services/supabaseClient";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function SetupRequired() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.setupContainer, { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 24 }]}>
      <View style={styles.setupIcon}>
        <Text style={styles.setupIconText}>🔧</Text>
      </View>
      <Text style={styles.setupTitle}>Supabase Setup Required</Text>
      <Text style={styles.setupBody}>
        Connect your Supabase project to get started. Set these environment variables:
      </Text>
      <View style={styles.codeBox}>
        <Text style={styles.codeText}>EXPO_PUBLIC_SUPABASE_URL</Text>
        <Text style={styles.codeText}>EXPO_PUBLIC_SUPABASE_ANON_KEY</Text>
      </View>
      <Text style={styles.setupHint}>
        Find these in your Supabase project under Settings → API.
      </Text>
    </View>
  );
}

function AuthGate() {
  const { session, loading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === "(auth)";
    if (!session && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (session && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [session, loading, segments]);

  return <Slot />;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (Platform.OS === "web") {
      const handler = (event: PromiseRejectionEvent) => {
        if (event.reason?.message?.includes("timeout")) {
          event.preventDefault();
        }
      };
      window.addEventListener("unhandledrejection", handler);
      return () => window.removeEventListener("unhandledrejection", handler);
    }
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
      setReady(true);
      return;
    }
    const t = setTimeout(() => {
      SplashScreen.hideAsync();
      setReady(true);
    }, 5000);
    return () => clearTimeout(t);
  }, [fontsLoaded, fontError]);

  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <KeyboardProvider>
            {!isSupabaseConfigured ? (
              <SetupRequired />
            ) : (
              <QueryClientProvider client={queryClient}>
                <AuthProvider>
                  <AuthGate />
                </AuthProvider>
              </QueryClientProvider>
            )}
          </KeyboardProvider>
        </GestureHandlerRootView>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  setupContainer: {
    flex: 1,
    backgroundColor: "#F4F3FF",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  setupIcon: {
    marginBottom: 20,
  },
  setupIconText: {
    fontSize: 48,
  },
  setupTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: "#1A1628",
    marginBottom: 12,
    textAlign: "center",
  },
  setupBody: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: "#7C7A8E",
    textAlign: "center",
    marginBottom: 20,
  },
  codeBox: {
    backgroundColor: "#1A1628",
    borderRadius: 10,
    padding: 16,
    width: "100%",
    marginBottom: 16,
    gap: 8,
  },
  codeText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "#818CF8",
  },
  setupHint: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "#7C7A8E",
    textAlign: "center",
  },
});
