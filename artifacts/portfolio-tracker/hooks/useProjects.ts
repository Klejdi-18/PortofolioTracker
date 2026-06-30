import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/services/supabaseClient";
import { Project } from "@/types";

interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  handleRefresh: () => void;
  handleDelete: (id: string) => Promise<void>;
}

export function useProjects(): UseProjectsReturn {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
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
      setLoading(true);
      refetch();
    }, [refetch])
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    refetch();
  }, [refetch]);

  const handleDelete = useCallback(
    async (id: string) => {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      const { error: deleteError } = await supabase
        .from("projects")
        .delete()
        .eq("id", id);
      if (deleteError) {
        refetch();
      }
    },
    [refetch]
  );

  return { projects, loading, refreshing, error, refetch, handleRefresh, handleDelete };
}
