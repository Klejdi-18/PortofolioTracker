import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectCardSkeleton } from "@/components/SkeletonLoader";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { supabase } from "@/services/supabaseClient";
import { Project } from "@/types";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error: fetchError } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setProjects(data ?? []);
      setError(null);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to load projects";
      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchProjects();
    }, [fetchProjects])
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = useCallback(async (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    const { error: deleteError } = await supabase.from("projects").delete().eq("id", id);
    if (deleteError) {
      fetchProjects();
    }
  }, [fetchProjects]);

  const filtered = search.trim()
    ? projects.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.url.toLowerCase().includes(search.toLowerCase())
      )
    : projects;

  const bottomPad = insets.bottom + (Platform.OS === "web" ? 34 : 20);
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    searchBar: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: colors.radius,
      paddingHorizontal: 12,
      marginHorizontal: 16,
      marginTop: 12,
      marginBottom: 8,
      height: 44,
      gap: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
    },
    listContent: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: bottomPad + 80,
    },
    emptyContainer: {
      alignItems: "center",
      paddingTop: 80,
      gap: 12,
    },
    emptyIcon: {
      width: 72,
      height: 72,
      borderRadius: 24,
      backgroundColor: colors.secondary,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyTitle: {
      fontSize: 18,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    emptySubtitle: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      paddingHorizontal: 32,
    },
    addFirstButton: {
      backgroundColor: colors.primary,
      borderRadius: colors.radius,
      paddingHorizontal: 20,
      paddingVertical: 12,
      marginTop: 8,
    },
    addFirstText: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.primaryForeground,
    },
    fab: {
      position: "absolute",
      right: 20,
      bottom: bottomPad + 20,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 8,
    },
    errorBox: {
      margin: 16,
      backgroundColor: "#FEF2F2",
      borderRadius: 8,
      padding: 12,
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
    countBadge: {
      marginHorizontal: 16,
      marginBottom: 8,
    },
    countText: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
  });

  const renderSkeletons = () => (
    <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
      {[1, 2, 3].map((k) => (
        <ProjectCardSkeleton key={k} />
      ))}
    </View>
  );

  return (
    <View style={[s.container, { paddingTop: topPad }]}>
      <View style={s.searchBar}>
        <Feather name="search" size={16} color={colors.mutedForeground} />
        <TextInput
          style={s.searchInput}
          placeholder="Search projects..."
          placeholderTextColor={colors.mutedForeground}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch("")}>
            <Feather name="x" size={16} color={colors.mutedForeground} />
          </Pressable>
        )}
      </View>

      {error && (
        <View style={s.errorBox}>
          <Feather name="alert-circle" size={16} color={colors.destructive} />
          <Text style={s.errorText}>{error}</Text>
        </View>
      )}

      {loading ? (
        renderSkeletons()
      ) : (
        <>
          {filtered.length > 0 && (
            <View style={s.countBadge}>
              <Text style={s.countText}>
                {filtered.length} project{filtered.length !== 1 ? "s" : ""}
                {search ? " found" : ""}
              </Text>
            </View>
          )}
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            contentContainerStyle={s.listContent}
            scrollEnabled={!!filtered.length}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={colors.primary}
              />
            }
            renderItem={({ item }) => (
              <ProjectCard project={item} onDelete={handleDelete} />
            )}
            ListEmptyComponent={
              <View style={s.emptyContainer}>
                <View style={s.emptyIcon}>
                  <Feather name="grid" size={32} color={colors.primary} />
                </View>
                <Text style={s.emptyTitle}>
                  {search ? "No results" : "No projects yet"}
                </Text>
                <Text style={s.emptySubtitle}>
                  {search
                    ? `No projects match "${search}"`
                    : "Tap + to add your first project and start building your portfolio."}
                </Text>
                {!search && (
                  <Pressable
                    style={s.addFirstButton}
                    onPress={() => router.push("/add-project")}
                  >
                    <Text style={s.addFirstText}>Add First Project</Text>
                  </Pressable>
                )}
              </View>
            }
          />
        </>
      )}

      <Pressable
        style={s.fab}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          router.push("/add-project");
        }}
      >
        <Feather name="plus" size={26} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}
