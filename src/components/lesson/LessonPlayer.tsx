"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgressStore } from "@/store/useProgressStore";
import { LESSONS, LessonLevel, LessonStep } from "@/data/lessons";
import { FormattedParagraph } from "@/components/common/TermTooltip";
import { WidgetDispatcher } from "@/components/widgets/WidgetDispatcher";
import { QuickCheck } from "@/components/quiz/QuickCheck";
import { GuidedTerminal, MISSIONS } from "@/components/terminal/GuidedTerminal";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  HelpCircle,
  Sparkles,
  BookOpen,
  Award,
  RotateCcw,
  Terminal,
  ShieldCheck,
  ChevronRight
} from "lucide-react";

export function LessonPlayer() {
  const {
    activeLevel,
    activeStepIndex,
    returnToRoadmap,
    nextStep,
    prevStep,
    setActiveStepIndex,
    completeStep,
    isStepCompleted,
  } = useProgressStore();

  const [activeTab, setActiveTab] = useState<"step" | "checkpoint" | "terminal">("step");
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Find level
  const currentLevel: LessonLevel | undefined = LESSONS.find(
    (l) => l.levelNumber === activeLevel
  );

  if (!currentLevel) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-500 mb-4">Level not found.</p>
        <button
          onClick={returnToRoadmap}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
        >
          Return to Roadmap
        </button>
      </div>
    );
  }

  const currentStep: LessonStep = currentLevel.steps[activeStepIndex];
  const isCompleted = isStepCompleted(currentStep.id);
  const isLastStep = activeStepIndex === currentLevel.steps.length - 1;

  // Determine which mission corresponds to this level
  const missionId =
    currentLevel.levelNumber <= 2
      ? "mission-1"
      : currentLevel.levelNumber <= 4
      ? "mission-2"
      : currentLevel.levelNumber === 5
      ? "mission-3"
      : "mission-4";

  const handleCompleteAndNext = () => {
    // Mark step complete
    completeStep(currentStep.id, currentLevel.levelNumber);
    setSelectedQuizOption(null);

    if (isLastStep) {
      // Transition to Checkpoint
      setActiveTab("checkpoint");
    } else {
      nextStep();
    }
  };

  const handleFinishCheckpoint = () => {
    // Offer terminal lab or return to roadmap
    setActiveTab("terminal");
  };

  const handleFinishLevel = () => {
    setShowCelebration(true);
    setTimeout(() => {
      setShowCelebration(false);
      returnToRoadmap();
    }, 1600);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10">
      {/* Top Header Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          type="button"
          onClick={returnToRoadmap}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors p-1 -ml-1 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Roadmap</span>
        </button>

        {/* Step tabs / indicators */}
        <div className="flex flex-wrap items-center gap-1.5">
          {currentLevel.steps.map((s, idx) => {
            const isDone = isStepCompleted(s.id);
            const isCurrent = activeTab === "step" && idx === activeStepIndex;

            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setActiveTab("step");
                  setActiveStepIndex(idx);
                  setSelectedQuizOption(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  isCurrent
                    ? "bg-indigo-600 text-white shadow-sm font-semibold"
                    : isDone
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
              >
                <span>Step {idx + 1}</span>
                {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
              </button>
            );
          })}

          {/* Checkpoint Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("checkpoint")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeTab === "checkpoint"
                ? "bg-indigo-600 text-white shadow-sm font-semibold"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
            }`}
          >
            <HelpCircle className="w-3 h-3 text-amber-400" />
            <span>Checkpoint</span>
          </button>

          {/* Terminal Lab Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("terminal")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeTab === "terminal"
                ? "bg-emerald-600 text-white shadow-sm font-semibold"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
            }`}
          >
            <Terminal className="w-3 h-3 text-emerald-400" />
            <span>Terminal Lab</span>
          </button>
        </div>
      </div>

      {/* Main Single-Card Container (Distraction-Free Focus) */}
      <AnimatePresence mode="wait">
        {activeTab === "step" && (
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="relative rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-xl overflow-hidden"
          >
            {/* Top Segmented Progress Bar */}
            <div className="grid grid-cols-3 h-1.5 bg-zinc-100 dark:bg-zinc-800">
              {currentLevel.steps.map((st, i) => (
                <div
                  key={st.id}
                  className={`h-full transition-colors ${
                    i < activeStepIndex || isStepCompleted(st.id)
                      ? "bg-emerald-500"
                      : i === activeStepIndex
                      ? "bg-indigo-500"
                      : "bg-transparent"
                  }`}
                />
              ))}
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Step Category & Read Time */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 font-mono">
                  {currentStep.badge}
                </span>
                <span className="text-xs text-zinc-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {currentStep.readTime} read
                </span>
              </div>

              {/* Step Title & Subtitle */}
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
                  {currentStep.title}
                </h2>
                <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400">
                  {currentStep.subtitle}
                </p>
              </div>

              {/* Formatted Content with Interactive Term Tooltips */}
              <div className="space-y-4 pt-1">
                {currentStep.content.map((paragraph, pIdx) => (
                  <FormattedParagraph key={pIdx} text={paragraph} />
                ))}
              </div>

              {/* Embedded Interactive Widget for this Step */}
              <div className="pt-2">
                <WidgetDispatcher
                  widgetType={currentStep.widgetType}
                  config={currentStep.widgetConfig}
                />
              </div>

              {/* Key Takeaway Box */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono">
                    Key Takeaway
                  </span>
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-medium mt-0.5 leading-relaxed">
                    {currentStep.keyTakeaway}
                  </p>
                </div>
              </div>

              {/* Quick Check Question (Brilliant.org style) */}
              {currentStep.quickCheck && (
                <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    <HelpCircle className="w-4 h-4 text-indigo-500" />
                    <span>Quick Check: Test Your Intuition</span>
                  </div>

                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {currentStep.quickCheck.question}
                  </p>

                  <div className="space-y-2 pt-1">
                    {currentStep.quickCheck.options.map((option, optIdx) => {
                      const isSelected = selectedQuizOption === optIdx;

                      return (
                        <div key={optIdx} className="space-y-2">
                          <button
                            type="button"
                            onClick={() => setSelectedQuizOption(optIdx)}
                            className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                              isSelected
                                ? option.correct
                                  ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/20"
                                  : "bg-rose-50 dark:bg-rose-950/20 border-rose-500 text-rose-900 dark:text-rose-100 ring-2 ring-rose-500/20"
                                : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{option.text}</span>
                              {isSelected && (
                                <span>
                                  {option.correct ? "✓ Correct" : "✕ Try Again"}
                                </span>
                              )}
                            </div>
                          </button>

                          {/* Explanation on select */}
                          {isSelected && (
                            <div
                              className={`p-2.5 rounded-lg text-xs leading-relaxed ${
                                option.correct
                                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                                  : "bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20"
                              }`}
                            >
                              {option.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Navigation Bar */}
            <div className="p-4 sm:p-6 bg-zinc-50 dark:bg-zinc-950/50 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4">
              <button
                type="button"
                disabled={activeStepIndex === 0}
                onClick={() => {
                  prevStep();
                  setSelectedQuizOption(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Previous Step
              </button>

              <button
                type="button"
                onClick={handleCompleteAndNext}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shadow-sm ${
                  isLastStep
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20"
                }`}
              >
                <span>
                  {isLastStep
                    ? "Continue to Level Checkpoint"
                    : "Mark Complete & Continue"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Checkpoint View (Phase 3 Deliverable) */}
        {activeTab === "checkpoint" && (
          <motion.div
            key="checkpoint-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <QuickCheck
              levelNumber={currentLevel.levelNumber}
              onCheckpointComplete={() => {
                completeStep(currentLevel.steps[2].id, currentLevel.levelNumber);
              }}
            />

            <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("step");
                  setActiveStepIndex(2);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200"
              >
                ← Back to Lessons
              </button>

              <button
                type="button"
                onClick={handleFinishCheckpoint}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 shadow-sm"
              >
                <span>Practice in Terminal Lab</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Guided Terminal View (Phase 3 Deliverable) */}
        {activeTab === "terminal" && (
          <motion.div
            key="terminal-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <GuidedTerminal initialMissionId={missionId} />

            <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setActiveTab("checkpoint")}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200"
              >
                ← Back to Checkpoint
              </button>

              <button
                type="button"
                onClick={handleFinishLevel}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2 shadow-sm"
              >
                <span>Finish Level &amp; Return</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebration Overlay on Level Complete */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/40"
            >
              <Award className="w-8 h-8" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-1">
              Level {currentLevel.levelNumber} Completed!
            </h3>
            <p className="text-zinc-300 text-sm max-w-sm">
              Incredible work! You completed the lessons, aced the checkpoint, and practiced in the terminal lab.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
