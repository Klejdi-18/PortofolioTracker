import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    setError(null);
    const { error: signInError } = await signIn(email.trim(), password);
    setLoading(false);
    if (signInError) {
      setError(signInError);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const s = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      flexGrow: 1,
    },
    inner: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: insets.top + (Platform.OS === "web" ? 67 : 60),
      paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0),
    },
    logoArea: {
      alignItems: "center",
      marginBottom: 48,
    },
    logoCircle: {
      width: 64,
      height: 64,
      borderRadius: 16,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    appName: {
      fontSize: 22,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    tagline: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 4,
    },
    heading: {
      fontSize: 26,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      marginBottom: 6,
    },
    subheading: {
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginBottom: 32,
    },
    label: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.foreground,
      marginBottom: 8,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: colors.radius,
      backgroundColor: colors.card,
      paddingHorizontal: 14,
      marginBottom: 16,
    },
    input: {
      flex: 1,
      height: 48,
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
    },
    eyeButton: {
      padding: 4,
    },
    errorBox: {
      backgroundColor: "#FEF2F2",
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    errorText: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.destructive,
      flex: 1,
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: colors.radius,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 8,
    },
    buttonDisabled: {
      opacity: 0.7,
    },
    buttonText: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: colors.primaryForeground,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 24,
      gap: 4,
    },
    footerText: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    footerLink: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
    },
  });

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={s.inner}>
          <View style={s.logoArea}>
            <View style={s.logoCircle}>
              <Feather name="grid" size={28} color="#FFFFFF" />
            </View>
            <Text style={s.appName}>Portfolio Tracker</Text>
            <Text style={s.tagline}>Your projects, organized.</Text>
          </View>

          <Text style={s.heading}>Welcome back</Text>
          <Text style={s.subheading}>Sign in to your account</Text>

          <Text style={s.label}>Email</Text>
          <View style={s.inputWrapper}>
            <TextInput
              style={s.input}
              placeholder="you@example.com"
              placeholderTextColor={colors.mutedForeground}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
          </View>

          <Text style={s.label}>Password</Text>
          <View style={s.inputWrapper}>
            <TextInput
              style={s.input}
              placeholder="••••••••"
              placeholderTextColor={colors.mutedForeground}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoComplete="password"
            />
            <Pressable style={s.eyeButton} onPress={() => setShowPassword(!showPassword)}>
              <Feather
                name={showPassword ? "eye-off" : "eye"}
                size={18}
                color={colors.mutedForeground}
              />
            </Pressable>
          </View>

          {error && (
            <View style={s.errorBox}>
              <Feather name="alert-circle" size={16} color={colors.destructive} />
              <Text style={s.errorText}>{error}</Text>
            </View>
          )}

          <Pressable
            style={[s.button, loading && s.buttonDisabled]}
            onPress={handleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.primaryForeground} />
            ) : (
              <Text style={s.buttonText}>Sign In</Text>
            )}
          </Pressable>

          <View style={s.footer}>
            <Text style={s.footerText}>No account yet?</Text>
            <Link href="/(auth)/register" asChild>
              <Pressable>
                <Text style={s.footerLink}>Create one</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
