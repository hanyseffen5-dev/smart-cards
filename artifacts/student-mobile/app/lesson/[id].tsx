import { Ionicons } from "@expo/vector-icons";
import { useGetLesson } from "@workspace/api-client-react";
import { useLocalSearchParams, useRouter } from "expo-router";
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

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isWeb = Platform.OS === "web";

  const lessonId = Number(id);
  const { data: lesson, isLoading } = useGetLesson(lessonId);

  const topPad = isWeb ? 67 : insets.top;
  const bottomPad = isWeb ? 100 : insets.bottom + 80;

  const diffColor = (d: string) =>
    d === "easy" ? "#4caf50" : d === "medium" ? colors.primary : colors.accent;

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (!lesson) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.mutedForeground }}>Lesson not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad + 8,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </Pressable>
        <View style={styles.headerMid}>
          <Text
            style={[styles.headerTitle, { color: colors.foreground }]}
            numberOfLines={1}
          >
            {lesson.title}
          </Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            {lesson.wordCount} vocabulary words
          </Text>
        </View>
        {lesson.words.length > 0 && (
          <Pressable
            onPress={() => router.push(`/study/${lesson.id}`)}
            style={[styles.studyBtn, { backgroundColor: colors.primary }]}
            testID="study-btn"
          >
            <Ionicons name="school" size={18} color="#fff" />
          </Pressable>
        )}
      </View>

      <FlatList
        data={lesson.words}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad }]}
        scrollEnabled={lesson.words.length > 0}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons
              name="layers-outline"
              size={48}
              color={colors.mutedForeground}
            />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              No words in this lesson
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.wordCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.wordCardTop}>
              <Text style={[styles.wordText, { color: colors.foreground }]}>
                {item.word}
              </Text>
              <View style={[styles.diffBadge, { backgroundColor: diffColor(item.difficulty) + "20" }]}>
                <Text style={[styles.diffText, { color: diffColor(item.difficulty) }]}>
                  {item.difficulty}
                </Text>
              </View>
            </View>
            <Text style={[styles.translationText, { color: colors.secondary }]}>
              {item.translation}
            </Text>
            {item.example && (
              <Text
                style={[styles.exampleText, { color: colors.mutedForeground }]}
              >
                {item.example}
              </Text>
            )}
            {item.partOfSpeech && (
              <Text style={[styles.posText, { color: colors.mutedForeground }]}>
                {item.partOfSpeech}
              </Text>
            )}
          </View>
        )}
      />

      {lesson.words.length > 0 && (
        <View
          style={[
            styles.studyFab,
            { bottom: bottomPad - 40 },
          ]}
        >
          <Pressable
            onPress={() => router.push(`/study/${lesson.id}`)}
            style={({ pressed }) => [
              styles.studyFabBtn,
              { backgroundColor: colors.primary, opacity: pressed ? 0.88 : 1 },
            ]}
          >
            <Ionicons name="school-outline" size={22} color="#fff" />
            <Text style={styles.studyFabText}>Study Flashcards</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 10,
  },
  backBtn: { padding: 4 },
  headerMid: { flex: 1 },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  headerSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 1,
  },
  studyBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  list: { paddingHorizontal: 16, paddingTop: 12, gap: 10 },
  wordCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 4,
  },
  wordCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  wordText: {
    fontSize: 20,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    flex: 1,
  },
  diffBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
  },
  diffText: {
    fontSize: 11,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  translationText: {
    fontSize: 16,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
    marginTop: 2,
  },
  exampleText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
    marginTop: 4,
    fontStyle: "italic",
  },
  posText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 4,
  },
  empty: {
    alignItems: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  studyFab: {
    position: "absolute",
    left: 20,
    right: 20,
  },
  studyFabBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    padding: 16,
    gap: 8,
  },
  studyFabText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
});
