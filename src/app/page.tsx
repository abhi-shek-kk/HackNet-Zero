"use client";

import React, { useEffect, useState } from "react";
import { useProgressStore } from "@/store/useProgressStore";
import { Navbar } from "@/components/layout/Navbar";
import { RoadmapView } from "@/components/roadmap/RoadmapView";
import { LessonPlayer } from "@/components/lesson/LessonPlayer";
import { Shield, Sparkles, Terminal } from "lucide-react";

export default function Home() {
  const { activeLevel, theme } = useProgressStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Sync dark class on mount
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 text-xs font-mono">
        Loading HackNet Zero...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <Navbar />

      <main className="flex-1 pb-16">
        {activeLevel === null ? <RoadmapView /> : <LessonPlayer />}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 py-8 px-4 text-center text-xs text-zinc-500 dark:text-zinc-500">
        <div className="max-w-2xl mx-auto space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-zinc-700 dark:text-zinc-300 font-medium">
            <Shield className="w-3.5 h-3.5 text-indigo-500" />
            <span>HackNet Zero • Phase 1 Interactive Curriculum</span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Hover or tap any underlined technical term for instant plain-English explanations.
            Progress is automatically saved to your browser.
          </p>
        </div>
      </footer>
    </div>
  );
}
