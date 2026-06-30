import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/services/supabaseClient";
import { Project } from "@/types";

export interface ProjectStats {
  total: number;
  addedThisWeek: number;
  addedThisMonth: number;
  recentProjects: Project[];
}

interface UseProjectStatsReturn {
  stats: ProjectStats | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

export function useProjectStats(): UseProjectStatsReturn {
  const { user } = useAuth();
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
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
        addedThisWeek: projects.filter((p) => new Date(p.created_at) >= weekAgo).length,
        addedThisMonth: projects.filter((p) => new Date(p.created_at) >= monthAgo).length,
        recentProjects: projects.slice(0, 5),
      });
    } catch {
      setStats({ total: 0, addedThisWeek: 0, addedThisMonth: 0, recentProjects: [] });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  return { stats, loading, refetch };
}
