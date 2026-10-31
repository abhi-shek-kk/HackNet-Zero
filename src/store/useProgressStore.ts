"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { LESSONS } from "@/data/lessons";

interface ProgressState {
  completedSteps: string[];
  unlockedLevels: number[];
  activeLevel: number | null; // null = Roadmap view, 1..6 = Lesson view
  activeStepIndex: number; // 0, 1, or 2
  theme: "dark" | "light";

  // Actions
  setActiveLevel: (level: number | null) => void;
  setActiveStepIndex: (index: number) => void;
  startLevel: (levelNumber: number, stepIndex?: number) => void;
  returnToRoadmap: () => void;
  completeStep: (stepId: string, levelNumber: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetProgress: () => void;
  toggleTheme: () => void;
  isStepCompleted: (stepId: string) => boolean;
  isLevelCompleted: (levelNumber: number) => boolean;
  getLevelProgress: (levelNumber: number) => { completed: number; total: number; percent: number };
  getOverallProgress: () => { completed: number; total: number; percent: number };
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedSteps: [],
      unlockedLevels: [1], // Level 1 is unlocked by default
      activeLevel: null,
      activeStepIndex: 0,
      theme: "dark",

      setActiveLevel: (level) => set({ activeLevel: level }),
      setActiveStepIndex: (index) => set({ activeStepIndex: Math.max(0, Math.min(2, index)) }),

      startLevel: (levelNumber, stepIndex = 0) => {
        set({
          activeLevel: levelNumber,
          activeStepIndex: stepIndex,
        });
      },

      returnToRoadmap: () => {
        set({ activeLevel: null });
      },

      completeStep: (stepId, levelNumber) => {
        const { completedSteps, unlockedLevels } = get();
        const updatedSteps = completedSteps.includes(stepId)
          ? completedSteps
          : [...completedSteps, stepId];

        // Check if all 3 steps of this level are now complete
        const targetLevel = LESSONS.find((l) => l.levelNumber === levelNumber);
        let updatedUnlocked = [...unlockedLevels];

        if (targetLevel) {
          const allStepsDone = targetLevel.steps.every((s) =>
            updatedSteps.includes(s.id)
          );
          if (allStepsDone && levelNumber < 6 && !unlockedLevels.includes(levelNumber + 1)) {
            updatedUnlocked.push(levelNumber + 1);
          }
        }

        set({
          completedSteps: updatedSteps,
          unlockedLevels: updatedUnlocked,
        });
      },

      nextStep: () => {
        const { activeStepIndex, activeLevel } = get();
        if (activeLevel === null) return;

        if (activeStepIndex < 2) {
          set({ activeStepIndex: activeStepIndex + 1 });
        } else {
          // Finished level, return to roadmap
          set({ activeLevel: null, activeStepIndex: 0 });
        }
      },

      prevStep: () => {
        const { activeStepIndex } = get();
        if (activeStepIndex > 0) {
          set({ activeStepIndex: activeStepIndex - 1 });
        }
      },

      resetProgress: () => {
        set({
          completedSteps: [],
          unlockedLevels: [1],
          activeLevel: null,
          activeStepIndex: 0,
        });
      },

      toggleTheme: () => {
        const newTheme = get().theme === "dark" ? "light" : "dark";
        set({ theme: newTheme });
        if (typeof document !== "undefined") {
          if (newTheme === "dark") {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
      },

      isStepCompleted: (stepId) => {
        return get().completedSteps.includes(stepId);
      },

      isLevelCompleted: (levelNumber) => {
        const targetLevel = LESSONS.find((l) => l.levelNumber === levelNumber);
        if (!targetLevel) return false;
        const { completedSteps } = get();
        return targetLevel.steps.every((s) => completedSteps.includes(s.id));
      },

      getLevelProgress: (levelNumber) => {
        const targetLevel = LESSONS.find((l) => l.levelNumber === levelNumber);
        if (!targetLevel) return { completed: 0, total: 3, percent: 0 };
        const { completedSteps } = get();
        const completed = targetLevel.steps.filter((s) => completedSteps.includes(s.id)).length;
        const total = targetLevel.steps.length;
        return {
          completed,
          total,
          percent: Math.round((completed / total) * 100),
        };
      },

      getOverallProgress: () => {
        const { completedSteps } = get();
        const total = LESSONS.reduce((acc, curr) => acc + curr.steps.length, 0);
        const completed = completedSteps.length;
        return {
          completed,
          total,
          percent: total > 0 ? Math.round((completed / total) * 100) : 0,
        };
      },
    }),
    {
      name: "hacknet-zero-progress",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        completedSteps: state.completedSteps,
        unlockedLevels: state.unlockedLevels,
        theme: state.theme,
      }),
    }
  )
);
