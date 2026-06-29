import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { supabase } from "@/services/supabaseClient";
import { Project } from "@/types";

interface Stats {
  total: number;
  addedThisWeek: number;
  addedThisMonth: number;
  recentProjects: Project[];
}

export default function DashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const projects: Project[] = data ?? [];
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      setStats({
        total: projects.length,
        addedThisWeek: projects.filter(
          (p) => new Date(p.created_at) >= weekAgo
        ).length,
        addedThisMonth: projects.filter(
          (p) => new Date(p.created_at) >= monthAgo
        ).length,
        recentProjects: projects.slice(0, 5),
      });
    } catch {
      setStats({ total: 0, addedThisWeek: 0, addedThisMonth: 0, recentProjects: [] });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const topPad = Platform.OS === "web" ? 67 : 0;
  const bottomPad = insets.bottom + (Platform.OS === "web" ? 34 : 20);

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: { flexGrow: 1 },
    inner: {
      paddingHorizontal: 16,
      paddingTop: topPad + 16,
      paddingBottom: bottomPad + 80,
    },
    greeting: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginBottom: 4,
    },
    greetingName: {
      fontSize: 22,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      marginBottom: 24,
    },
    statsRow: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 24,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
    },
    statValue: {
      fontSize: 32,
      fontFamily: "Inter_700Bold",
      color: colors.primary,
      marginBottom: 2,
    },
    statLabel: {
      fontSize: 11,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
      textAlign: "center",
    },
    section: { marginBottom: 24 },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    seeAllText: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.primary,
    },
    periodCards: {
      flexDirection: "row",
      gap: 12,
    },
    periodCard: {
      flex: 1,
      backgroundColor: colors.secondary,
      borderRadius: colors.radius,
      padding: 14,
      alignItems: "center",
    },
    periodValue: {
      fontSize: 24,
      fontFamily: "Inter_700Bold",
      color: colors.primary,
      marginBottom: 2,
    },
    periodLabel: {
      fontSize: 11,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
    },
    recentItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 14,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 12,
    },
    recentDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.primary,
    },
    recentTitle: {
      flex: 1,
      fontSize: 14,
      fontFamily: "Inter_500Medium",
      color: colors.foreground,
    },
    recentDate: {
      fontSize: 11,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyRecentText: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      paddingVertical: 20,
    },
    addButton: {
      backgroundColor: colors.primary,
      borderRadius: colors.radius,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 8,
    },
    addButtonText: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: colors.primaryForeground,
    },
  });

  if (loading) {
    return (
      <View style={[s.container, s.loadingContainer]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  const email = user?.email ?? "";
  const displayName = email.split("@")[0] ?? "there";

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <ScrollView
      style={[s.container, { paddingTop: topPad }]}
      contentContainerStyle={s.inner}
      showsVerticalScrollIndicator={false}
    >
      <Text style={s.greeting}>Welcome back,</Text>
      <Text style={s.greetingName}>{displayName}</Text>

      <View style={s.statsRow}>
        <View style={s.statCard}>
          <Text style={s.statValue}>{stats?.total ?? 0}</Text>
          <Text style={s.statLabel}>Total{"\n"}Projects</Text>
        </View>
        <View style={s.statCard}>
          <Text style={s.statValue}>{stats?.addedThisWeek ?? 0}</Text>
          <Text style={s.statLabel}>Added This{"\n"}Week</Text>
        </View>
        <View style={s.statCard}>
          <Text style={s.statValue}>{stats?.addedThisMonth ?? 0}</Text>
          <Text style={s.statLabel}>Added This{"\n"}Month</Text>
        </View>
      </View>

      <View style={s.section}>
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Recent Projects</Text>
          <Pressable onPress={() => router.push("/(tabs)/")}>
            <Text style={s.seeAllText}>See all</Text>
          </Pressable>
        </View>

        {stats?.recentProjects.length === 0 ? (
          <Text style={s.emptyRecentText}>No projects yet. Add your first one!</Text>
        ) : (
          stats?.recentProjects.map((project) => (
            <View key={project.id} style={s.recentItem}>
              <View style={s.recentDot} />
              <Text style={s.recentTitle} numberOfLines={1}>
                {project.title}
              </Text>
              <Text style={s.recentDate}>{formatDate(project.created_at)}</Text>
              <Feather name="chevron-right" size={14} color={colors.mutedForeground} />
            </View>
          ))
        )}
      </View>

      <Pressable style={s.addButton} onPress={() => router.push("/add-project")}>
        <Feather name="plus" size={18} color={colors.primaryForeground} />
        <Text style={s.addButtonText}>Add New Project</Text>
      </Pressable>
    </ScrollView>
  );
}
