import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useGetLesson, useRecordProgress } from "@workspace/api-client-react";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useStudent } from "@/contexts/StudentContext";
import { useColors } from "@/hooks/useColors";

function FlipCard({
  front,
  back,
  flipped,
}: {
  front: React.ReactNode;
  back: React.ReactNode;
  flipped: boolean;
}) {
  const flipAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(flipAnim, {
      toValue: flipped ? 1 : 0,
      useNativeDriver: true,
      tension: 60,
      friction: 8,
    }).start();
  }, [flipped]);

  const frontRotate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });
  const backRotate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });
  const frontOpacity = flipAnim.interpolate({
    inputRange: [0.4, 0.5],
    outputRange: [1, 0],
  });
  const backOpacity = flipAnim.interpolate({
    inputRange: [0.4, 0.5],
    outputRange: [0, 1],
  });

  return (
    <View style={flipStyles.wrapper}>
      <Animated.View
        style={[
          flipStyles.face,
          {
            opacity: frontOpacity,
            transform: [{ rotateY: frontRotate }],
          },
        ]}
      >
        {front}
      </Animated.View>
      <Animated.View
        style={[
          flipStyles.face,
          flipStyles.back,
          {
            opacity: backOpacity,
            transform: [{ rotateY: backRotate }],
          },
        ]}
      >
        {back}
      </Animated.View>
    </View>
  );
}

const flipStyles = StyleSheet.create({
  wrapper: { flex: 1 },
  face: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  back: {},
});

export default function StudyScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { student } = useStudent();
  const isWeb = Platform.OS === "web";
  const topPad = isWeb ? 67 : insets.top;
  const bottomPad = isWeb ? 34 : insets.bottom;

  const lessonId = Number(id);
  const { data: lesson, isLoading } = useGetLesson(lessonId);
  const recordProgress = useRecordProgress();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);
  const [scores, setScores] = useState<Record<number, number>>({});

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  const words = lesson?.words ?? [];

  if (!words.length) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.mutedForeground }}>No words to study</Text>
        <Pressable onPress={() => router.back()} style={styles.backLink}>
          <Text style={{ color: colors.primary }}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const current = words[currentIndex];

  async function handleFlip() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFlipped((f) => !f);
  }

  async function handleScore(score: number) {
    await Haptics.impactAsync(
      score >= 80
        ? Haptics.ImpactFeedbackStyle.Medium
        : Haptics.ImpactFeedbackStyle.Heavy
    );
    setScores((prev) => ({ ...prev, [current.id]: score }));
    try {
      await recordProgress.mutateAsync({
        data: {
          wordId: current.id,
          score,
          studentId: student?.id ?? null,
        },
      });
    } catch (err) {
      console.warn("[study] Failed to record progress:", err);
    }

    if (currentIndex < words.length - 1) {
      setCurrentIndex((i) => i + 1);
      setFlipped(false);
    } else {
      setDone(true);
    }
  }

  if (done) {
    const scoredWords = words.filter((w) => scores[w.id] !== undefined);
    const avgScore =
      scoredWords.length > 0
        ? Math.round(
            scoredWords.reduce((acc, w) => acc + (scores[w.id] ?? 0), 0) /
              scoredWords.length
          )
        : 0;
    const mastered = scoredWords.filter((w) => (scores[w.id] ?? 0) >= 80).length;

    return (
      <View
        style={[
          styles.center,
          { backgroundColor: colors.background, paddingHorizontal: 24 },
        ]}
      >
        <View
          style={[
            styles.doneCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View
            style={[
              styles.doneIcon,
              { backgroundColor: colors.primary + "20" },
            ]}
          >
            <Ionicons name="trophy" size={40} color={colors.primary} />
          </View>
          <Text style={[styles.doneTitle, { color: colors.foreground }]}>
            Session Complete!
          </Text>
          <Text style={[styles.doneSub, { color: colors.mutedForeground }]}>
            {lesson?.title}
          </Text>
          <View style={styles.doneStats}>
            <View style={styles.doneStat}>
              <Text style={[styles.doneStatVal, { color: colors.primary }]}>
                {avgScore}%
              </Text>
              <Text style={[styles.doneStatLabel, { color: colors.mutedForeground }]}>
                Avg Score
              </Text>
            </View>
            <View style={[styles.doneStatDivider, { backgroundColor: colors.border }]} />
            <View style={styles.doneStat}>
              <Text style={[styles.doneStatVal, { color: "#4caf50" }]}>
                {mastered}
              </Text>
              <Text style={[styles.doneStatLabel, { color: colors.mutedForeground }]}>
                Mastered
              </Text>
            </View>
            <View style={[styles.doneStatDivider, { backgroundColor: colors.border }]} />
            <View style={styles.doneStat}>
              <Text style={[styles.doneStatVal, { color: colors.secondary }]}>
                {words.length}
              </Text>
              <Text style={[styles.doneStatLabel, { color: colors.mutedForeground }]}>
                Total
              </Text>
            </View>
          </View>
          <View style={styles.doneActions}>
            <Pressable
              onPress={() => {
                setCurrentIndex(0);
                setFlipped(false);
                setDone(false);
                setScores({});
              }}
              style={[styles.doneBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.doneBtnText, { color: "#fff" }]}>
                Study Again
              </Text>
            </Pressable>
            <Pressable
              onPress={() => router.back()}
              style={[
                styles.doneBtn,
                { backgroundColor: colors.muted, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.doneBtnText, { color: colors.foreground }]}>
                Done
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  const diffColor =
    current.difficulty === "easy"
      ? "#4caf50"
      : current.difficulty === "medium"
        ? colors.primary
        : colors.accent;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: topPad,
          paddingBottom: bottomPad,
        },
      ]}
    >
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={colors.foreground} />
        </Pressable>
        <View style={styles.progressWrap}>
          <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: colors.primary,
                  width: `${((currentIndex + 1) / words.length) * 100}%` as `${number}%`,
                },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: colors.mutedForeground }]}>
            {currentIndex + 1} / {words.length}
          </Text>
        </View>
      </View>

      <Pressable
        style={styles.cardArea}
        onPress={handleFlip}
        testID="flashcard"
      >
        <FlipCard
          flipped={flipped}
          front={
            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.cardInner}>
                <View
                  style={[
                    styles.diffTag,
                    { backgroundColor: diffColor + "20" },
                  ]}
                >
                  <Text style={[styles.diffTagText, { color: diffColor }]}>
                    {current.difficulty}
                  </Text>
                </View>
                {current.partOfSpeech && (
                  <Text
                    style={[styles.partOfSpeech, { color: colors.mutedForeground }]}
                  >
                    {current.partOfSpeech}
                  </Text>
                )}
                <Text style={[styles.cardWord, { color: colors.foreground }]}>
                  {current.word}
                </Text>
                <Text style={[styles.tapHint, { color: colors.mutedForeground }]}>
                  Tap to see translation
                </Text>
              </View>
            </View>
          }
          back={
            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.primary + "10",
                  borderColor: colors.primary + "40",
                },
              ]}
            >
              <View style={styles.cardInner}>
                <Text style={[styles.cardWord, { color: colors.foreground }]}>
                  {current.word}
                </Text>
                <Text
                  style={[styles.cardTranslation, { color: colors.primary }]}
                >
                  {current.translation}
                </Text>
                {current.example && (
                  <Text
                    style={[styles.cardExample, { color: colors.mutedForeground }]}
                  >
                    "{current.example}"
                  </Text>
                )}
              </View>
            </View>
          }
        />
      </Pressable>

      {flipped ? (
        <View style={styles.scoreRow}>
          <Pressable
            onPress={() => handleScore(25)}
            style={[styles.scoreBtn, { backgroundColor: colors.destructive + "15", borderColor: colors.destructive + "30" }]}
          >
            <Ionicons name="close-circle" size={28} color={colors.destructive} />
            <Text style={[styles.scoreBtnLabel, { color: colors.destructive }]}>
              Hard
            </Text>
          </Pressable>
          <Pressable
            onPress={() => handleScore(60)}
            style={[styles.scoreBtn, { backgroundColor: colors.primary + "15", borderColor: colors.primary + "30" }]}
          >
            <Ionicons name="help-circle" size={28} color={colors.primary} />
            <Text style={[styles.scoreBtnLabel, { color: colors.primary }]}>
              OK
            </Text>
          </Pressable>
          <Pressable
            onPress={() => handleScore(100)}
            style={[styles.scoreBtn, { backgroundColor: "#4caf5015", borderColor: "#4caf5030" }]}
          >
            <Ionicons name="checkmark-circle" size={28} color="#4caf50" />
            <Text style={[styles.scoreBtnLabel, { color: "#4caf50" }]}>
              Easy
            </Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.flipHintRow}>
          <Pressable
            onPress={handleFlip}
            style={[styles.flipHintBtn, { backgroundColor: colors.muted }]}
          >
            <Ionicons name="refresh" size={18} color={colors.mutedForeground} />
            <Text style={[styles.flipHintText, { color: colors.mutedForeground }]}>
              Flip card
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  backLink: { marginTop: 12 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingBottom: 16,
  },
  closeBtn: { padding: 4 },
  progressWrap: { flex: 1, gap: 4 },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    textAlign: "right",
  },
  cardArea: { flex: 1 },
  card: {
    flex: 1,
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 24,
    justifyContent: "center",
  },
  cardInner: {
    alignItems: "center",
    gap: 12,
  },
  diffTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 100,
  },
  diffTagText: {
    fontSize: 12,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  partOfSpeech: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  cardWord: {
    fontSize: 36,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  cardTranslation: {
    fontSize: 28,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  cardExample: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 20,
    fontStyle: "italic",
    paddingHorizontal: 16,
  },
  tapHint: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginTop: 8,
  },
  scoreRow: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 16,
    paddingBottom: 8,
  },
  scoreBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 16,
    gap: 6,
  },
  scoreBtnLabel: {
    fontSize: 14,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  flipHintRow: {
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 8,
  },
  flipHintBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 100,
  },
  flipHintText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  doneCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 28,
    width: "100%",
    alignItems: "center",
    gap: 12,
  },
  doneIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  doneTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  doneSub: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  doneStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginVertical: 8,
  },
  doneStat: { alignItems: "center", gap: 2 },
  doneStatVal: {
    fontSize: 28,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  doneStatLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  doneStatDivider: { width: 1, height: 40 },
  doneActions: { flexDirection: "row", gap: 10, width: "100%", marginTop: 4 },
  doneBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 100,
    alignItems: "center",
    borderWidth: 1,
  },
  doneBtnText: {
    fontSize: 15,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
});
