"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { findGlossaryTerm, GLOSSARY, GlossaryEntry } from "@/data/glossary";
import { Sparkles, HelpCircle, BookOpen } from "lucide-react";

interface TermTooltipProps {
  termKey?: string;
  termText?: string;
  children: React.ReactNode;
}

export function TermTooltip({ termKey, termText, children }: TermTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Find glossary entry
  let entry: GlossaryEntry | undefined;
  if (termKey && GLOSSARY[termKey]) {
    entry = GLOSSARY[termKey];
  } else if (termText) {
    entry = findGlossaryTerm(termText);
  } else if (typeof children === "string") {
    entry = findGlossaryTerm(children);
  }

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!entry) {
    return <>{children}</>;
  }

  return (
    <span
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <span
        tabIndex={0}
        role="button"
        aria-label={`Definition of ${entry.term}`}
        className="cursor-help font-medium text-indigo-400 dark:text-indigo-400 hover:text-indigo-300 dark:hover:text-indigo-300 border-b border-dashed border-indigo-400/60 dark:border-indigo-400/60 hover:border-indigo-300 transition-colors inline-flex items-center gap-0.5"
      >
        {children}
      </span>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 sm:w-80 p-3.5 rounded-xl bg-zinc-900/95 dark:bg-zinc-900/95 text-zinc-100 border border-zinc-700/80 shadow-2xl backdrop-blur-md pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Term and Category */}
            <div className="flex items-center justify-between gap-2 mb-1.5 pb-1.5 border-b border-zinc-800">
              <span className="font-semibold text-sm tracking-tight text-white flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                {entry.term}
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                {entry.category}
              </span>
            </div>

            {/* Plain English 1-sentence Explanation */}
            <p className="text-xs text-zinc-300 leading-relaxed mb-2">
              {entry.explanation}
            </p>

            {/* Analogy callout */}
            {entry.analogy && (
              <div className="flex items-start gap-1.5 p-2 rounded-lg bg-zinc-800/60 border border-zinc-700/40 text-[11px] text-zinc-400">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-zinc-300 font-medium">Analogy: </strong>
                  {entry.analogy}
                </span>
              </div>
            )}

            {/* Caret / arrow */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-zinc-800" />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

/**
 * Helper to automatically parse a paragraph of text, finding known glossary terms and wrapping them in TermTooltip.
 */
export function FormattedParagraph({ text }: { text: string }) {
  // Collect all terms to match, sorted by length descending so longer terms match first (e.g. "MAC Address" before "MAC")
  const termPatterns = React.useMemo(() => {
    const list: { key: string; pattern: string; length: number }[] = [];
    for (const [key, entry] of Object.entries(GLOSSARY)) {
      list.push({ key, pattern: entry.term, length: entry.term.length });
      for (const alias of entry.aliases) {
        if (alias.length > 2) {
          list.push({ key, pattern: alias, length: alias.length });
        }
      }
    }
    return list.sort((a, b) => b.length - a.length);
  }, []);

  // Split text by regex
  const parts = React.useMemo(() => {
    // Build regex with word boundaries
    const escaped = termPatterns
      .map((item) => item.pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|");
    const regex = new RegExp(`\\b(${escaped})\\b`, "gi");

    const tokens: React.ReactNode[] = [];
    let lastIdx = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIdx) {
        tokens.push(text.slice(lastIdx, match.index));
      }
      const matchedWord = match[0];
      const found = findGlossaryTerm(matchedWord);
      if (found) {
        tokens.push(
          <TermTooltip key={`${match.index}-${matchedWord}`} termText={matchedWord}>
            {matchedWord}
          </TermTooltip>
        );
      } else {
        tokens.push(matchedWord);
      }
      lastIdx = regex.lastIndex;
    }

    if (lastIdx < text.length) {
      tokens.push(text.slice(lastIdx));
    }

    return tokens;
  }, [text, termPatterns]);

  return <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-base">{parts}</p>;
}
