import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useColors } from "@/hooks/useColors";

function SkeletonBlock({
  width,
  height,
  style,
  opacity,
}: {
  width: number | string;
  height: number;
  style?: object;
  opacity: Animated.Value;
}) {
  const colors = useColors();
  return (
    <Animated.View
      style={[
        {
          width: width as number,
          height,
          borderRadius: 6,
          backgroundColor: colors.muted,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function ProjectCardSkeleton() {
  const colors = useColors();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
      ]}
    >
      <View style={styles.header}>
        <SkeletonBlock width={8} height={8} style={{ borderRadius: 4 }} opacity={opacity} />
        <SkeletonBlock width="55%" height={16} style={{ marginLeft: 8 }} opacity={opacity} />
        <View style={{ flex: 1 }} />
        <SkeletonBlock width={20} height={20} style={{ borderRadius: 4 }} opacity={opacity} />
      </View>
      <SkeletonBlock
        width="75%"
        height={12}
        style={{ marginTop: 8, marginBottom: 14, marginLeft: 16 }}
        opacity={opacity}
      />
      <SkeletonBlock width="100%" height={38} style={{ borderRadius: 8 }} opacity={opacity} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
});
