import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
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
import { supabase } from "@/services/supabaseClient";

export default function AddProjectScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidUrl = (str: string) => {
    const s = str.trim();
    return s.length > 0;
  };

  const handleAdd = async () => {
    if (!title.trim()) {
      setError("Project title is required.");
      return;
    }
    if (!isValidUrl(url)) {
      setError("Project URL is required.");
      return;
    }
    if (!user) return;

    setLoading(true);
    setError(null);

    let finalUrl = url.trim();
    if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
      finalUrl = `https://${finalUrl}`;
    }

    const { error: insertError } = await supabase.from("projects").insert({
      title: title.trim(),
      url: finalUrl,
      user_id: user.id,
    });

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    }
  };

  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: { flexGrow: 1 },
    inner: {
      paddingHorizontal: 20,
      paddingTop: topPad + 16,
      paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 24),
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 32,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    headerTitle: {
      fontSize: 20,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
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
      marginBottom: 20,
      gap: 10,
    },
    inputWrapperFocused: {
      borderColor: colors.primary,
    },
    input: {
      flex: 1,
      height: 48,
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
    },
    hint: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: -16,
      marginBottom: 20,
      marginLeft: 2,
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
    buttonDisabled: { opacity: 0.7 },
    buttonText: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: colors.primaryForeground,
    },
    cancelButton: {
      height: 44,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 12,
    },
    cancelText: {
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
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
          <View style={s.header}>
            <Pressable style={s.backButton} onPress={() => router.back()}>
              <Feather name="x" size={18} color={colors.foreground} />
            </Pressable>
            <Text style={s.headerTitle}>Add Project</Text>
          </View>

          <Text style={s.label}>Project Title</Text>
          <View style={s.inputWrapper}>
            <Feather name="briefcase" size={16} color={colors.mutedForeground} />
            <TextInput
              style={s.input}
              placeholder="My Awesome Project"
              placeholderTextColor={colors.mutedForeground}
              value={title}
              onChangeText={setTitle}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>

          <Text style={s.label}>Project URL</Text>
          <View style={s.inputWrapper}>
            <Feather name="link" size={16} color={colors.mutedForeground} />
            <TextInput
              style={s.input}
              placeholder="https://myproject.com"
              placeholderTextColor={colors.mutedForeground}
              value={url}
              onChangeText={setUrl}
              autoCapitalize="none"
              keyboardType="url"
              autoComplete="url"
              returnKeyType="done"
              onSubmitEditing={handleAdd}
            />
          </View>
          <Text style={s.hint}>Add https:// or enter a domain — we'll handle the rest.</Text>

          {error && (
            <View style={s.errorBox}>
              <Feather name="alert-circle" size={16} color={colors.destructive} />
              <Text style={s.errorText}>{error}</Text>
            </View>
          )}

          <Pressable
            style={[s.button, loading && s.buttonDisabled]}
            onPress={handleAdd}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.primaryForeground} />
            ) : (
              <Text style={s.buttonText}>Add Project</Text>
            )}
          </Pressable>

          <Pressable style={s.cancelButton} onPress={() => router.back()}>
            <Text style={s.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
