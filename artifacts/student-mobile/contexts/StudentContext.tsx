import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUpsertStudentByFingerprint } from "@workspace/api-client-react";
import React, { createContext, useContext, useEffect, useState } from "react";

interface Student {
  id: number;
  name: string;
  level: "beginner" | "intermediate" | "advanced";
}

interface StudentContextType {
  student: Student | null;
  isLoading: boolean;
}

const StudentContext = createContext<StudentContextType>({
  student: null,
  isLoading: true,
});

function generateFingerprint(): string {
  return (
    "device_" +
    Date.now().toString() +
    "_" +
    Math.random().toString(36).substr(2, 9)
  );
}

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const upsert = useUpsertStudentByFingerprint();

  useEffect(() => {
    async function init() {
      try {
        let fingerprint = await AsyncStorage.getItem("device_fingerprint");
        if (!fingerprint) {
          fingerprint = generateFingerprint();
          await AsyncStorage.setItem("device_fingerprint", fingerprint);
        }

        const result = await upsert.mutateAsync({
          data: { fingerprint, level: "beginner" },
        });
        setStudent({
          id: result.id,
          name: result.name,
          level: result.level,
        });
      } catch (e) {
        setStudent(null);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  return (
    <StudentContext.Provider value={{ student, isLoading }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  return useContext(StudentContext);
}
