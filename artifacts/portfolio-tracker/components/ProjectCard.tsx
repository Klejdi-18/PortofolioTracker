import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useColors } from "@/hooks/useColors";
import { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const colors = useColors();
  const [scale] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 20 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20 }).start();
  };

  const handleOpenURL = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    let url = project.url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`;
    }

    if (url.includes("localhost") || url.includes("127.0.0.1")) {
      Alert.alert(
        "Link lokal",
        "Ky link (localhost) funksionon vetëm në kompjuterin tënd, jo në telefon apo internet. Shto një link real (p.sh. GitHub, Vercel, Netlify)."
      );
      return;
    }

    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Link i pavlefshëm", "Ky URL nuk mund të hapet.");
    }
  };

  const handleEdit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/edit-project/${project.id}`);
  };

  const handleDelete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      "Fshi projektin",
      `A je i sigurt që dëshiron të fshish "${project.title}"?`,
      [
        { text: "Anulo", style: "cancel" },
        {
          text: "Fshi",
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            onDelete(project.id);
          },
        },
      ]
    );
  };

  const displayUrl = project.url.replace(/^https?:\/\//, "");
  const isLocalhost =
    project.url.includes("localhost") || project.url.includes("127.0.0.1");

  const s = StyleSheet.create({
    wrapper: { marginBottom: 12 },
    card: {
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#4F46E5",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    header: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: 4,
    },
    titleRow: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8 },
    indicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: isLocalhost ? colors.mutedForeground : colors.primary,
      marginTop: 3,
    },
    title: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      flex: 1,
    },
    actions: { flexDirection: "row", gap: 4, marginLeft: 8 },
    actionBtn: {
      width: 32,
      height: 32,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    url: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: isLocalhost ? colors.mutedForeground : colors.mutedForeground,
      marginBottom: 14,
      marginLeft: 16,
    },
    localhostBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: "#FEF3C7",
      borderRadius: 6,
      paddingHorizontal: 8,
      paddingVertical: 4,
      marginLeft: 16,
      marginBottom: 12,
      alignSelf: "flex-start",
    },
    localhostText: {
      fontSize: 11,
      fontFamily: "Inter_500Medium",
      color: "#92400E",
    },
    openButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      backgroundColor: isLocalhost ? colors.muted : colors.primary,
      borderRadius: colors.radius - 4,
      paddingVertical: 10,
    },
    openButtonText: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: isLocalhost ? colors.mutedForeground : colors.primaryForeground,
    },
  });

  return (
    <Animated.View style={[s.wrapper, { transform: [{ scale }] }]}>
      <Pressable
        style={s.card}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={s.header}>
          <View style={s.titleRow}>
            <View style={s.indicator} />
            <Text style={s.title} numberOfLines={1}>
              {project.title}
            </Text>
          </View>
          <View style={s.actions}>
            <Pressable style={s.actionBtn} onPress={handleEdit}>
              <Feather name="edit-2" size={15} color={colors.primary} />
            </Pressable>
            <Pressable style={s.actionBtn} onPress={handleDelete}>
              <Feather name="trash-2" size={15} color={colors.destructive} />
            </Pressable>
          </View>
        </View>

        <Text style={s.url} numberOfLines={1}>
          {displayUrl}
        </Text>

        {isLocalhost && (
          <View style={s.localhostBadge}>
            <Feather name="alert-triangle" size={11} color="#92400E" />
            <Text style={s.localhostText}>Link lokal — nuk hapet në telefon</Text>
          </View>
        )}

        <Pressable style={s.openButton} onPress={handleOpenURL}>
          <Feather
            name="external-link"
            size={14}
            color={isLocalhost ? colors.mutedForeground : colors.primaryForeground}
          />
          <Text style={s.openButtonText}>Hap Projektin</Text>
        </Pressable>
      </Pressable>
    </Animated.View>
  );
}
