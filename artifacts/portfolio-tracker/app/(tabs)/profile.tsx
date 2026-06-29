import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();

  const topPad = Platform.OS === "web" ? 67 : 0;
  const bottomPad = insets.bottom + (Platform.OS === "web" ? 34 : 20);

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          await signOut();
        },
      },
    ]);
  };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    inner: {
      paddingHorizontal: 16,
      paddingTop: topPad + 16,
      paddingBottom: bottomPad + 80,
    },
    avatarArea: {
      alignItems: "center",
      paddingVertical: 32,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
    },
    avatarInitial: {
      fontSize: 32,
      fontFamily: "Inter_700Bold",
      color: "#FFFFFF",
    },
    email: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    userId: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 4,
    },
    section: { marginBottom: 24 },
    sectionTitle: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      color: colors.mutedForeground,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 8,
      marginLeft: 4,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 12,
      marginBottom: 1,
    },
    rowFirst: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
    rowLast: { borderTopLeftRadius: 0, borderTopRightRadius: 0 },
    rowOnly: {},
    rowText: {
      flex: 1,
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
    },
    rowTextDestructive: {
      flex: 1,
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.destructive,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginHorizontal: 16,
    },
  });

  const email = user?.email ?? "";
  const initial = email.charAt(0).toUpperCase();

  return (
    <ScrollView
      style={[s.container, { paddingTop: topPad > 0 ? 0 : 0 }]}
      contentContainerStyle={s.inner}
      showsVerticalScrollIndicator={false}
    >
      <View style={s.avatarArea}>
        <View style={s.avatar}>
          <Text style={s.avatarInitial}>{initial}</Text>
        </View>
        <Text style={s.email}>{email}</Text>
        <Text style={s.userId}>ID: {user?.id?.slice(0, 8)}...</Text>
      </View>

      <View style={s.section}>
        <Text style={s.sectionTitle}>Account</Text>
        <View style={[s.row, s.rowOnly]}>
          <Feather name="mail" size={18} color={colors.primary} />
          <Text style={s.rowText}>{email}</Text>
        </View>
      </View>

      <View style={s.section}>
        <Text style={s.sectionTitle}>Actions</Text>
        <Pressable style={[s.row, s.rowOnly]} onPress={handleSignOut}>
          <Feather name="log-out" size={18} color={colors.destructive} />
          <Text style={s.rowTextDestructive}>Sign Out</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
