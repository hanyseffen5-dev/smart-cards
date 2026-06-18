import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useStudent } from "@/contexts/StudentContext";
import { useColors } from "@/hooks/useColors";
import {
  analyzeText,
  createLesson,
  createWord,
  extractTextFromImage,
} from "@workspace/api-client-react";

type ExtractedWord = {
  word: string;
  translation: string;
  example: string;
  difficulty: "easy" | "medium" | "hard";
  partOfSpeech: string;
  selected: boolean;
};

type Step = "idle" | "extracting" | "reviewing" | "saving";

export default function ScanScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { student } = useStudent();
  const isWeb = Platform.OS === "web";
  const topPad = isWeb ? 67 : insets.top;
  const bottomPad = isWeb ? 34 : insets.bottom;

  const [step, setStep] = useState<Step>("idle");
  const [lessonTitle, setLessonTitle] = useState("");
  const [extractedWords, setExtractedWords] = useState<ExtractedWord[]>([]);
  const [statusMessage, setStatusMessage] = useState("");

  async function fileToBase64(uri: string): Promise<{ base64: string; mimeType: string }> {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(",")[1];
        resolve({ base64, mimeType: blob.type || "image/jpeg" });
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async function processImageUri(uri: string, mimeType = "image/jpeg") {
    setStep("extracting");
    setStatusMessage("Scanning page...");
    try {
      const { base64 } = await fileToBase64(uri);
      const result = await extractTextFromImage({
        imageBase64: base64,
        mimeType,
      });
      await processText(result.text);
    } catch (e) {
      Alert.alert("Error", "Failed to extract text from image. Please try again.");
      setStep("idle");
    }
  }

  async function processText(text: string) {
    setStatusMessage("Extracting vocabulary...");
    try {
      const result = await analyzeText({
        text,
        level: student?.level ?? "beginner",
      });
      setLessonTitle(result.lessonTitle);
      setExtractedWords(
        result.words.map((w) => ({
          ...w,
          selected: true,
        }))
      );
      setStep("reviewing");
    } catch (e) {
      Alert.alert("Error", "Failed to analyze text. Please try again.");
      setStep("idle");
    }
  }

  async function handleCamera() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission Required", "Camera access is needed to scan pages.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.85,
      base64: false,
    });
    if (!result.canceled && result.assets[0]) {
      await processImageUri(result.assets[0].uri);
    }
  }

  async function handleGallery() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.85,
      base64: false,
    });
    if (!result.canceled && result.assets[0]) {
      await processImageUri(result.assets[0].uri);
    }
  }

  async function handleDocument() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "text/plain"],
        copyToCacheDirectory: true,
      });
      if (result.canceled || !result.assets?.[0]) return;
      const asset = result.assets[0];
      const mimeType = asset.mimeType ?? "application/pdf";

      if (mimeType === "text/plain") {
        setStep("extracting");
        setStatusMessage("Reading document...");
        try {
          const response = await fetch(asset.uri);
          const text = await response.text();
          await processText(text);
        } catch {
          Alert.alert("Error", "Failed to read file.");
          setStep("idle");
        }
      } else {
        await processImageUri(asset.uri, mimeType);
      }
    } catch {
      Alert.alert("Error", "Could not open document.");
    }
  }

  async function handleSave() {
    const selected = extractedWords.filter((w) => w.selected);
    if (!selected.length) {
      Alert.alert("No words selected", "Please select at least one word to save.");
      return;
    }
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setStep("saving");
    try {
      const lesson = await createLesson({
        title: lessonTitle || "New Lesson",
        text: "",
        level: student?.level ?? "beginner",
        createdByStudentId: student?.id ?? null,
      });
      for (const w of selected) {
        await createWord({
          lessonId: lesson.id,
          word: w.word,
          translation: w.translation,
          example: w.example,
          difficulty: w.difficulty,
          partOfSpeech: w.partOfSpeech,
        });
      }
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setStep("idle");
      setExtractedWords([]);
      setLessonTitle("");
      router.push(`/lesson/${lesson.id}`);
    } catch {
      Alert.alert("Error", "Failed to save lesson. Please try again.");
      setStep("reviewing");
    }
  }

  function toggleWord(index: number) {
    setExtractedWords((prev) =>
      prev.map((w, i) => (i === index ? { ...w, selected: !w.selected } : w))
    );
  }

  function resetScan() {
    setStep("idle");
    setExtractedWords([]);
    setLessonTitle("");
  }

  const diffColor = (d: string) =>
    d === "easy" ? "#4caf50" : d === "medium" ? colors.primary : colors.accent;

  if (step === "extracting" || step === "saving") {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background, paddingTop: topPad },
        ]}
      >
        <View
          style={[
            styles.loadingCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.foreground }]}>
            {statusMessage || (step === "saving" ? "Saving lesson..." : "Processing...")}
          </Text>
          <Text style={[styles.loadingSub, { color: colors.mutedForeground }]}>
            {step === "extracting"
              ? "Our AI is analyzing your page"
              : "Creating your flashcards"}
          </Text>
        </View>
      </View>
    );
  }

  if (step === "reviewing") {
    const selectedCount = extractedWords.filter((w) => w.selected).length;
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.reviewHeader, { paddingTop: topPad + 8 }]}>
          <Pressable onPress={resetScan} style={styles.backBtn} testID="back-btn">
            <Ionicons name="arrow-back" size={24} color={colors.foreground} />
          </Pressable>
          <View style={styles.reviewHeaderText}>
            <Text style={[styles.reviewTitle, { color: colors.foreground }]}>
              Review Words
            </Text>
            <Text style={[styles.reviewSub, { color: colors.mutedForeground }]}>
              {selectedCount} of {extractedWords.length} selected
            </Text>
          </View>
          <Pressable
            onPress={handleSave}
            style={[styles.saveBtn, { backgroundColor: colors.primary }]}
            testID="save-btn"
          >
            <Text style={[styles.saveBtnText, { color: colors.primaryForeground }]}>
              Save
            </Text>
          </Pressable>
        </View>

        <View style={[styles.titleInputWrap, { borderColor: colors.border }]}>
          <TextInput
            style={[styles.titleInput, { color: colors.foreground }]}
            value={lessonTitle}
            onChangeText={setLessonTitle}
            placeholder="Lesson title"
            placeholderTextColor={colors.mutedForeground}
          />
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.wordList,
            { paddingBottom: bottomPad + 80 },
          ]}
        >
          {extractedWords.map((w, i) => (
            <Pressable
              key={i}
              onPress={() => toggleWord(i)}
              style={[
                styles.wordCard,
                {
                  backgroundColor: w.selected ? colors.card : colors.muted,
                  borderColor: w.selected ? colors.primary : colors.border,
                  opacity: w.selected ? 1 : 0.6,
                },
              ]}
            >
              <View style={styles.wordCardRow}>
                <View style={styles.wordCardMain}>
                  <Text style={[styles.wordText, { color: colors.foreground }]}>
                    {w.word}
                  </Text>
                  <Text style={[styles.wordTranslation, { color: colors.secondary }]}>
                    {w.translation}
                  </Text>
                  <Text style={[styles.wordExample, { color: colors.mutedForeground }]} numberOfLines={2}>
                    {w.example}
                  </Text>
                  <View style={styles.wordMeta}>
                    <View
                      style={[
                        styles.diffBadge,
                        { backgroundColor: diffColor(w.difficulty) + "20" },
                      ]}
                    >
                      <Text style={[styles.diffText, { color: diffColor(w.difficulty) }]}>
                        {w.difficulty}
                      </Text>
                    </View>
                    <Text style={[styles.posText, { color: colors.mutedForeground }]}>
                      {w.partOfSpeech}
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name={w.selected ? "checkmark-circle" : "ellipse-outline"}
                  size={24}
                  color={w.selected ? colors.primary : colors.mutedForeground}
                />
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.primary + "15", colors.background]}
        style={[styles.heroGradient, { paddingTop: topPad + 16 }]}
      >
        <View style={styles.heroContent}>
          <View
            style={[styles.heroIcon, { backgroundColor: colors.primary + "20" }]}
          >
            <Ionicons name="camera" size={40} color={colors.primary} />
          </View>
          <Text style={[styles.heroTitle, { color: colors.foreground }]}>
            Scan a Page
          </Text>
          <Text style={[styles.heroSub, { color: colors.mutedForeground }]}>
            Point your camera at any textbook page to instantly extract English vocabulary
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.actionsContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.primaryAction,
            { backgroundColor: colors.primary, opacity: pressed ? 0.88 : 1 },
          ]}
          onPress={handleCamera}
          testID="camera-btn"
        >
          <Ionicons name="camera" size={28} color="#fff" />
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Take Photo</Text>
            <Text style={styles.actionSub}>Use camera to scan page</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ffffff80" />
        </Pressable>

        <View style={styles.secondaryRow}>
          <Pressable
            style={({ pressed }) => [
              styles.secondaryAction,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            onPress={handleGallery}
            testID="gallery-btn"
          >
            <Ionicons name="images-outline" size={26} color={colors.secondary} />
            <Text style={[styles.secondaryLabel, { color: colors.foreground }]}>
              Gallery
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryAction,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            onPress={handleDocument}
            testID="document-btn"
          >
            <Ionicons name="document-text-outline" size={26} color={colors.accent} />
            <Text style={[styles.secondaryLabel, { color: colors.foreground }]}>
              Document
            </Text>
          </Pressable>
        </View>

        <View
          style={[styles.tipCard, { backgroundColor: colors.muted }]}
        >
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={colors.mutedForeground}
          />
          <Text style={[styles.tipText, { color: colors.mutedForeground }]}>
            Supports images (JPG, PNG) and PDF files
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  loadingCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 40,
    alignItems: "center",
    gap: 16,
    width: "100%",
    maxWidth: 320,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
  loadingSub: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  heroGradient: { paddingBottom: 24 },
  heroContent: { alignItems: "center", paddingHorizontal: 24, gap: 12 },
  heroIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  heroSub: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    fontFamily: "Inter_400Regular",
    maxWidth: 280,
  },
  actionsContainer: { flex: 1, paddingHorizontal: 20, gap: 12, paddingTop: 8 },
  primaryAction: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    padding: 20,
    gap: 16,
  },
  actionText: { flex: 1 },
  actionTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  actionSub: {
    color: "#ffffff99",
    fontSize: 13,
    marginTop: 2,
    fontFamily: "Inter_400Regular",
  },
  secondaryRow: { flexDirection: "row", gap: 12 },
  secondaryAction: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    alignItems: "center",
    gap: 8,
  },
  secondaryLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  tipText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  backBtn: { padding: 4 },
  reviewHeaderText: { flex: 1 },
  reviewTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  reviewSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  saveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  titleInputWrap: {
    marginHorizontal: 16,
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  titleInput: {
    fontSize: 16,
    paddingVertical: 10,
    fontFamily: "Inter_500Medium",
  },
  wordList: { paddingHorizontal: 16, paddingTop: 8, gap: 8 },
  wordCard: {
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 14,
  },
  wordCardRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  wordCardMain: { flex: 1, gap: 3 },
  wordText: {
    fontSize: 17,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  wordTranslation: {
    fontSize: 15,
    fontWeight: "500" as const,
    fontFamily: "Inter_500Medium",
  },
  wordExample: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  wordMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  diffBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 100,
  },
  diffText: {
    fontSize: 11,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  posText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
});
