import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import React, { useState } from "react";
import {
  Alert,
  Animated,
  Platform,
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
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const handleOpenURL = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    let url = project.url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`;
    }
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Invalid URL", "Cannot open this URL.");
    }
  };

  const handleDelete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      "Delete Project",
      `Remove "${project.title}" from your portfolio?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
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

  const styles = StyleSheet.create({
    wrapper: {
      marginBottom: 12,
    },
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
    titleRow: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    indicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.primary,
      marginTop: 3,
    },
    title: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      flex: 1,
    },
    deleteButton: {
      padding: 4,
      marginLeft: 8,
    },
    url: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginBottom: 14,
      marginLeft: 16,
    },
    openButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      backgroundColor: colors.primary,
      borderRadius: colors.radius - 4,
      paddingVertical: 10,
    },
    openButtonText: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.primaryForeground,
    },
  });

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale }] }]}>
      <Pressable
        style={styles.card}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handleOpenURL}
      >
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={styles.indicator} />
            <Text style={styles.title} numberOfLines={1}>
              {project.title}
            </Text>
          </View>
          <Pressable style={styles.deleteButton} onPress={handleDelete}>
            <Feather name="trash-2" size={16} color={colors.destructive} />
          </Pressable>
        </View>

        <Text style={styles.url} numberOfLines={1}>
          {displayUrl}
        </Text>

        <Pressable style={styles.openButton} onPress={handleOpenURL}>
          <Feather name="external-link" size={14} color={colors.primaryForeground} />
          <Text style={styles.openButtonText}>Open Project</Text>
        </Pressable>
      </Pressable>
    </Animated.View>
  );
}
