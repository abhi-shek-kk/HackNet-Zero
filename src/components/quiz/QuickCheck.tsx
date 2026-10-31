"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LEVEL_CHECKPOINTS, LevelCheckpoint, ScenarioQuestion } from "@/data/checkpoints";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Award,
  ShieldCheck
} from "lucide-react";

interface QuickCheckProps {
  levelNumber: number;
  onCheckpointComplete?: () => void;
}

export function QuickCheck({ levelNumber, onCheckpointComplete }: QuickCheckProps) {
  const checkpoint = LEVEL_CHECKPOINTS[levelNumber];
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  if (!checkpoint) {
    return null;
  }

  const currentQ: ScenarioQuestion = checkpoint.questions[currentQuestionIdx];
  const selectedOptIdx = selectedAnswers[currentQuestionIdx];
  const hasAnswered = selectedOptIdx !== undefined;

  const handleSelectOption = (optIdx: number) => {
    if (hasAnswered) return; // Prevent changing after answer
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestionIdx]: optIdx }));
  };

  const handleNext = () => {
    if (currentQuestionIdx < checkpoint.questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      if (onCheckpointComplete) onCheckpointComplete();
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setCurrentQuestionIdx(0);
    setIsCompleted(false);
  };

  // Calculate score
  const correctCount = checkpoint.questions.filter((q, idx) => {
    const chosen = selectedAnswers[idx];
    return chosen !== undefined && q.options[chosen]?.isCorrect;
  }).length;

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 p-5 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 flex items-center justify-center">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Concept Checkpoint: Level {levelNumber}
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Question {currentQuestionIdx + 1} of {checkpoint.questions.length} • Real-World Security Scenarios
            </p>
          </div>
        </div>

        {/* Score indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">
            Score: {correctCount} / {checkpoint.questions.length}
          </span>
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            title="Reset checkpoint"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isCompleted ? (
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            {/* Scenario Box */}
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1 uppercase tracking-wider text-[10px] font-mono">
                Scenario Background
              </span>
              {currentQ.scenario}
            </div>

            {/* Question */}
            <h5 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 pt-1">
              {currentQ.question}
            </h5>

            {/* Options list */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = selectedOptIdx === oIdx;
                let optStyles =
                  "bg-white dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:border-zinc-300";

                if (hasAnswered) {
                  if (opt.isCorrect) {
                    optStyles =
                      "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/20 font-medium";
                  } else if (isSelected && !opt.isCorrect) {
                    optStyles =
                      "bg-rose-50 dark:bg-rose-950/20 border-rose-500 text-rose-900 dark:text-rose-100 ring-2 ring-rose-500/20";
                  } else {
                    optStyles =
                      "bg-zinc-50/50 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 text-zinc-400 opacity-60";
                  }
                }

                return (
                  <button
                    key={oIdx}
                    type="button"
                    disabled={hasAnswered}
                    onClick={() => handleSelectOption(oIdx)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start justify-between gap-3 ${optStyles}`}
                  >
                    <span>{opt.text}</span>
                    {hasAnswered && opt.isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    )}
                    {hasAnswered && isSelected && !opt.isCorrect && (
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box once answered */}
            {hasAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed border ${
                  currentQ.options[selectedOptIdx].isCorrect
                    ? "bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-500/40 text-emerald-800 dark:text-emerald-200"
                    : "bg-rose-50/80 dark:bg-rose-950/30 border-rose-500/40 text-rose-800 dark:text-rose-200"
                }`}
              >
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  {currentQ.options[selectedOptIdx].isCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Correct Analysis!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-500" />
                      <span>Not Quite. Here is why:</span>
                    </>
                  )}
                </div>
                <p>{currentQ.options[selectedOptIdx].explanation}</p>
              </motion.div>
            )}

            {/* Next question action button */}
            {hasAnswered && (
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span>
                    {currentQuestionIdx < checkpoint.questions.length - 1
                      ? "Next Question"
                      : "Finish Checkpoint"}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          /* Checkpoint Complete Screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 space-y-3"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <Award className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Checkpoint Complete!
            </h4>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
              You scored {correctCount} out of {checkpoint.questions.length}. You have verified the core networking principles for this level!
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Checkpoint</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
