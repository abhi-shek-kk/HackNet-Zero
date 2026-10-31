"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { LESSONS } from "@/data/lessons";
import { useProgressStore } from "@/store/useProgressStore";
import { GuidedTerminal, MISSIONS } from "@/components/terminal/GuidedTerminal";
import {
  Mail,
  Wifi,
  DoorClosed,
  Radio,
  BookOpen,
  ShieldAlert,
  Lock,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Terminal,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";

// Map string icon names to Lucide components
const iconMap: Record<string, React.ElementType> = {
  Mail,
  Wifi,
  DoorClosed,
  Radio,
  BookOpen,
  ShieldAlert,
};

export function RoadmapView() {
  const {
    unlockedLevels,
    startLevel,
    isLevelCompleted,
    getLevelProgress,
    getOverallProgress,
  } = useProgressStore();

  const [showTerminalPlayground, setShowTerminalPlayground] = useState(false);

  const { completed, total, percent } = getOverallProgress();

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Hero Header (Linear / Brilliant style) */}
      <div className="text-center mb-12 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Curriculum • Zero to Intermediate</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Networking for Ethical Hackers
        </h1>

        <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
          Learn how the internet truly operates—from raw packets and Wi-Fi routing to
          stealth port scanning and defensive tunneling—in bite-sized visual steps.
        </p>

        {/* Mobile progress indicator */}
        <div className="pt-2 md:hidden max-w-xs mx-auto">
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
            <span>Overall Progress</span>
            <span className="font-mono font-medium">{percent}%</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Vertical Path Roadmap */}
      <div className="relative space-y-6">
        {LESSONS.map((level, index) => {
          const isUnlocked = unlockedLevels.includes(level.levelNumber);
          const isCompleted = isLevelCompleted(level.levelNumber);
          const progress = getLevelProgress(level.levelNumber);
          const Icon = iconMap[level.iconName] || Mail;

          const isLast = index === LESSONS.length - 1;

          return (
            <div key={level.id} className="relative">
              {/* Vertical Connecting Line */}
              {!isLast && (
                <div
                  className={`absolute left-7 top-14 bottom-[-24px] w-0.5 -ml-[1px] transition-colors ${
                    isCompleted
                      ? "bg-emerald-500/70"
                      : isUnlocked
                      ? "bg-indigo-300 dark:bg-indigo-900/60"
                      : "bg-zinc-200 dark:bg-zinc-800"
                  }`}
                />
              )}

              {/* Node Card */}
              <motion.div
                whileHover={isUnlocked ? { y: -2 } : {}}
                transition={{ duration: 0.15 }}
                className={`relative rounded-2xl border transition-all p-5 sm:p-6 ${
                  isCompleted
                    ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/40 shadow-sm"
                    : isUnlocked
                    ? "bg-white dark:bg-zinc-900 border-indigo-300 dark:border-indigo-800/80 shadow-md ring-1 ring-indigo-500/20"
                    : "bg-zinc-50/60 dark:bg-zinc-900/40 border-zinc-200/70 dark:border-zinc-800/50 opacity-70"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Left Circle Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                      isCompleted
                        ? "bg-emerald-500 text-white shadow-sm"
                        : isUnlocked
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                        : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : isUnlocked ? (
                      <Icon className="w-6 h-6" />
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                  </div>

                  {/* Center Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        Level {level.levelNumber}
                      </span>
                      <span className="text-zinc-300 dark:text-zinc-700">•</span>
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {level.estimatedMinutes} min
                      </span>

                      {/* Step completion pill */}
                      {isUnlocked && (
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full ml-auto ${
                            isCompleted
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20"
                              : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium"
                          }`}
                        >
                          {progress.completed} / 3 Steps
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                      {level.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                      {level.shortDescription}
                    </p>

                    {/* Step indicator dots & Quick Practice */}
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                      <div className="flex items-center gap-1.5 flex-1">
                        {level.steps.map((st, sIdx) => {
                          const isStepDone = progress.completed > sIdx;
                          return (
                            <div
                              key={st.id}
                              className={`h-1.5 flex-1 rounded-full transition-all ${
                                isStepDone
                                  ? "bg-emerald-500"
                                  : isUnlocked && sIdx === progress.completed
                                  ? "bg-indigo-400 animate-pulse"
                                  : "bg-zinc-200 dark:bg-zinc-800"
                              }`}
                              title={st.title}
                            />
                          );
                        })}
                      </div>

                      {/* Action button */}
                      {isUnlocked ? (
                        <button
                          type="button"
                          onClick={() => {
                            const nextStep = Math.min(2, progress.completed);
                            startLevel(level.levelNumber, nextStep);
                          }}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
                            isCompleted
                              ? "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200"
                              : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/30"
                          }`}
                        >
                          <span>{isCompleted ? "Review" : progress.completed > 0 ? "Continue" : "Start"}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="text-[11px] text-zinc-400 font-medium flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Locked
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Terminal Playground Toggle Card */}
      <div className="mt-10 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Interactive Guided Terminal Lab
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Practice 4 hands-on ethical hacking missions with clickable command blocks
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowTerminalPlayground(!showTerminalPlayground)}
            className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
          >
            <span>{showTerminalPlayground ? "Hide Terminal" : "Open Terminal"}</span>
            {showTerminalPlayground ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showTerminalPlayground && (
          <div className="mt-5 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <GuidedTerminal />
          </div>
        )}
      </div>
    </div>
  );
}
