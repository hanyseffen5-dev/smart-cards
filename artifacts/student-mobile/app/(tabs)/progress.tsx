import { Ionicons } from "@expo/vector-icons";
import { useGetProgressStats } from "@workspace/api-client-react";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useStudent } from "@/contexts/StudentContext";
import { useColors } from "@/hooks/useColors";

function StatCard({
  icon,
  label,
  value,
  color,
  colors,
}: {
  icon: string;
  label: string;
  value: string | number;
  color: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View
      style={[
        statStyles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={[statStyles.iconWrap, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon as never} size={22} color={color} />
      </View>
      <Text style={[statStyles.value, { color: colors.foreground }]}>
        {value}
      </Text>
      <Text style={[statStyles.label, { color: colors.mutedForeground }]}>
        {label}
      </Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    alignItems: "center",
    gap: 6,
    minWidth: 100,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    fontSize: 24,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  label: {
    fontSize: 12,
    textAlign: "center",
    fontFamily: "Inter_400Regular",
  },
});

export default function ProgressScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { student } = useStudent();
  const isWeb = Platform.OS === "web";
  const topPad = isWeb ? 67 : insets.top;

  const { data: stats, isLoading } = useGetProgressStats({
    studentId: student?.id ?? undefined,
  });

  if (isLoading) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: colors.background, paddingTop: topPad },
        ]}
      >
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  const masteryPct =
    stats && stats.totalWords > 0
      ? Math.round((stats.masteredWords / stats.totalWords) * 100)
      : 0;

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.container,
        {
          paddingTop: topPad + 8,
          paddingBottom: isWeb ? 100 : insets.bottom + 80,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            Progress
          </Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            {student ? `Hi, ${student.name}` : "Your learning journey"}
          </Text>
        </View>
        <View
          style={[styles.levelBadge, { backgroundColor: colors.primary + "20" }]}
        >
          <Text style={[styles.levelText, { color: colors.primary }]}>
            {student?.level ?? "Beginner"}
          </Text>
        </View>
      </View>

      {stats ? (
        <>
          <View style={styles.statsRow}>
            <StatCard
              icon="layers-outline"
              label="Total Words"
              value={stats.totalWords}
              color={colors.secondary}
              colors={colors}
            />
            <StatCard
              icon="checkmark-circle-outline"
              label="Mastered"
              value={stats.masteredWords}
              color="#4caf50"
              colors={colors}
            />
            <StatCard
              icon="flame-outline"
              label="Attempts"
              value={stats.totalAttempts}
              color={colors.primary}
              colors={colors}
            />
          </View>

          <View
            style={[
              styles.masteryCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.masteryHeader}>
              <Text style={[styles.masteryLabel, { color: colors.foreground }]}>
                Mastery Rate
              </Text>
              <Text style={[styles.masteryPct, { color: colors.primary }]}>
                {masteryPct}%
              </Text>
            </View>
            <View
              style={[styles.progressBar, { backgroundColor: colors.muted }]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: colors.primary,
                    width: `${masteryPct}%` as `${number}%`,
                  },
                ]}
              />
            </View>
            <Text
              style={[styles.masteryNote, { color: colors.mutedForeground }]}
            >
              Avg. score:{" "}
              <Text style={{ color: colors.foreground, fontWeight: "600" }}>
                {Math.round(stats.averageScore)}%
              </Text>
            </Text>
          </View>

          {stats.lessonProgress.length > 0 && (
            <View style={styles.section}>
              <Text
                style={[styles.sectionTitle, { color: colors.foreground }]}
              >
                Lessons
              </Text>
              {stats.lessonProgress.map((lp) => {
                const pct =
                  lp.totalWords > 0
                    ? Math.round((lp.masteredWords / lp.totalWords) * 100)
                    : 0;
                return (
                  <View
                    key={lp.lessonId}
                    style={[
                      styles.lessonRow,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <View style={styles.lessonInfo}>
                      <Text
                        style={[
                          styles.lessonTitle,
                          { color: colors.foreground },
                        ]}
                        numberOfLines={1}
                      >
                        {lp.lessonTitle}
                      </Text>
                      <Text
                        style={[
                          styles.lessonMeta,
                          { color: colors.mutedForeground },
                        ]}
                      >
                        {lp.masteredWords}/{lp.totalWords} mastered
                      </Text>
                    </View>
                    <Text style={[styles.lessonPct, { color: colors.primary }]}>
                      {pct}%
                    </Text>
                  </View>
                );
              })}
            </View>
          )}

          {stats.recentActivity.length > 0 && (
            <View style={styles.section}>
              <Text
                style={[styles.sectionTitle, { color: colors.foreground }]}
              >
                Recent Activity
              </Text>
              {stats.recentActivity.slice(0, 5).map((activity) => (
                <View
                  key={activity.id}
                  style={[
                    styles.activityRow,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.scoreCircle,
                      {
                        backgroundColor:
                          activity.score >= 80
                            ? "#4caf5020"
                            : activity.score >= 50
                              ? colors.primary + "20"
                              : colors.destructive + "20",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.scoreText,
                        {
                          color:
                            activity.score >= 80
                              ? "#4caf50"
                              : activity.score >= 50
                                ? colors.primary
                                : colors.destructive,
                        },
                      ]}
                    >
                      {activity.score}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.activityWord,
                      { color: colors.foreground },
                    ]}
                  >
                    {activity.word ?? `Word #${activity.wordId}`}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </>
      ) : (
        <View style={styles.empty}>
          <Ionicons
            name="bar-chart-outline"
            size={56}
            color={colors.mutedForeground}
          />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
            No data yet
          </Text>
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
            Start studying flashcards to track your progress
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
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
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    marginTop: 4,
  },
  levelText: {
    fontSize: 13,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
    textTransform: "capitalize",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  masteryCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
    gap: 10,
  },
  masteryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  masteryLabel: {
    fontSize: 16,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  masteryPct: {
    fontSize: 24,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
  },
  masteryNote: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    marginBottom: 10,
  },
  lessonRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 8,
  },
  lessonInfo: { flex: 1 },
  lessonTitle: {
    fontSize: 15,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  lessonMeta: {
    fontSize: 12,
    marginTop: 2,
    fontFamily: "Inter_400Regular",
  },
  lessonPct: {
    fontSize: 16,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    marginLeft: 12,
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
    gap: 12,
  },
  scoreCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreText: {
    fontSize: 15,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  activityWord: {
    fontSize: 15,
    fontWeight: "500" as const,
    fontFamily: "Inter_500Medium",
    flex: 1,
  },
  empty: { alignItems: "center", paddingTop: 80, gap: 12 },
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
