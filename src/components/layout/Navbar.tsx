"use client";

import React, { useState } from "react";
import { useProgressStore } from "@/store/useProgressStore";
import { Shield, Sun, Moon, BookOpen, RotateCcw, BookMarked, Terminal } from "lucide-react";
import { GlossaryModal } from "@/components/glossary/GlossaryModal";
import { PocketReferenceDrawer } from "@/components/reference/PocketReferenceDrawer";

export function Navbar() {
  const { theme, toggleTheme, getOverallProgress, resetProgress, returnToRoadmap } =
    useProgressStore();
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [referenceOpen, setReferenceOpen] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const { completed, total, percent } = getOverallProgress();

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo & Title */}
          <div
            onClick={returnToRoadmap}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-zinc-900 dark:text-zinc-100">
                  HackNet Zero
                </span>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  Phase 3
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 -mt-0.5 hidden sm:block">
                Networking for Ethical Hackers
              </p>
            </div>
          </div>

          {/* Center / Global Progress Indicator */}
          <div className="flex-1 max-w-xs hidden md:block">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-zinc-500 dark:text-zinc-400 font-medium">Path Progress</span>
              <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                {completed} / {total} Steps ({percent}%)
              </span>
            </div>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5">
            {/* Pocket Reference Drawer Button */}
            <button
              type="button"
              onClick={() => setReferenceOpen(true)}
              className="px-2.5 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              title="Open Hacker's Pocket Reference"
            >
              <BookMarked className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden sm:inline">Cheat Sheet</span>
            </button>

            {/* Glossary Button */}
            <button
              type="button"
              onClick={() => setGlossaryOpen(true)}
              className="px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-xs font-medium flex items-center gap-1.5"
              title="Open Glossary"
            >
              <BookOpen className="w-3.5 h-3.5 text-zinc-500" />
              <span className="hidden sm:inline">Glossary</span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              title="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Reset Progress Button */}
            <button
              type="button"
              onClick={() => {
                if (showConfirmReset) {
                  resetProgress();
                  setShowConfirmReset(false);
                } else {
                  setShowConfirmReset(true);
                  setTimeout(() => setShowConfirmReset(false), 3000);
                }
              }}
              className={`p-2 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1 ${
                showConfirmReset
                  ? "bg-rose-500/10 border-rose-500/40 text-rose-500"
                  : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              }`}
              title={showConfirmReset ? "Click again to confirm reset" : "Reset progress"}
            >
              <RotateCcw className="w-4 h-4" />
              {showConfirmReset && <span className="text-[10px]">Confirm?</span>}
            </button>
          </div>
        </div>
      </header>

      <GlossaryModal isOpen={glossaryOpen} onClose={() => setGlossaryOpen(false)} />
      <PocketReferenceDrawer isOpen={referenceOpen} onClose={() => setReferenceOpen(false)} />
    </>
  );
}
