import { Ionicons } from "@expo/vector-icons";
import { useGetLessons } from "@workspace/api-client-react";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

function LevelBadge({
  level,
  colors,
}: {
  level: string | undefined;
  colors: ReturnType<typeof useColors>;
}) {
  const color =
    level === "beginner"
      ? "#4caf50"
      : level === "intermediate"
        ? colors.secondary
        : colors.accent;
  const label =
    level === "beginner"
      ? "Beginner"
      : level === "intermediate"
        ? "Intermediate"
        : level === "advanced"
          ? "Advanced"
          : "All";
  return (
    <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 100, backgroundColor: color + "20" }}>
      <Text style={{ fontSize: 11, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold", color }}>{label}</Text>
    </View>
  );
}

export default function LessonsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { data: lessons, isLoading, refetch, isRefetching } = useGetLessons();
  const isWeb = Platform.OS === "web";

  const topPad = isWeb ? 67 : insets.top;

  const styles = makeStyles(colors);

  if (isLoading) {
    return (
      <View
        style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background, paddingTop: topPad }}
      >
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          My Lessons
        </Text>
        <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
          {lessons?.length ?? 0} lessons
        </Text>
      </View>
      <FlatList
        data={lessons ?? []}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: isWeb ? 100 : insets.bottom + 80 },
        ]}
        refreshing={isRefetching}
        onRefresh={refetch}
        scrollEnabled={!!(lessons && lessons.length > 0)}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons
              name="book-outline"
              size={56}
              color={colors.mutedForeground}
            />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              No lessons yet
            </Text>
            <Text
              style={[styles.emptyText, { color: colors.mutedForeground }]}
            >
              Scan a textbook page to create your first lesson
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
            onPress={() => router.push(`/lesson/${item.id}`)}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardLeft}>
                <Text
                  style={[styles.cardTitle, { color: colors.foreground }]}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                <View style={styles.cardMeta}>
                  <LevelBadge level={item.level ?? undefined} colors={colors} />
                  <Text
                    style={[styles.cardCount, { color: colors.mutedForeground }]}
                  >
                    {item.wordCount} words
                  </Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.mutedForeground}
              />
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

function makeStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, alignItems: "center", justifyContent: "center" },
    header: {
      paddingHorizontal: 20,
      paddingBottom: 12,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: "700" as const,
      fontFamily: "Inter_700Bold",
    },
    headerSub: {
      fontSize: 14,
      marginTop: 2,
      fontFamily: "Inter_400Regular",
    },
    list: { paddingHorizontal: 16, paddingTop: 8 },
    card: {
      borderRadius: colors.radius,
      borderWidth: 1,
      marginBottom: 10,
      overflow: "hidden",
    },
    cardContent: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
    },
    cardLeft: { flex: 1, marginRight: 8 },
    cardTitle: {
      fontSize: 16,
      fontWeight: "600" as const,
      fontFamily: "Inter_600SemiBold",
    },
    cardMeta: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 6,
      gap: 8,
    },
    badge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 100,
    },
    badgeText: {
      fontSize: 11,
      fontWeight: "600" as const,
      fontFamily: "Inter_600SemiBold",
    },
    cardCount: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
    },
    empty: {
      alignItems: "center",
      paddingTop: 80,
      gap: 12,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: "600" as const,
      fontFamily: "Inter_600SemiBold",
    },
    emptyText: {
      fontSize: 14,
      textAlign: "center",
      paddingHorizontal: 40,
      fontFamily: "Inter_400Regular",
    },
  });
}
