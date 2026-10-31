"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DoorClosed, DoorOpen, Shield, ShieldAlert, Lock, Unlock, Play, RotateCcw, Info, Terminal, Sparkles } from "lucide-react";

type ScanStyle = "polite" | "stealth";

interface DoorConfig {
  port: number;
  name: string;
  expectedState: "open" | "closed" | "filtered";
  service: string;
  openColor: string;
}

export function PortDoorKnocker() {
  const [scanStyle, setScanStyle] = useState<ScanStyle>("polite");
  const [activePort, setActivePort] = useState<number | null>(null);
  const [knocking, setKnocking] = useState(false);
  const [doorStates, setDoorStates] = useState<Record<number, "idle" | "open" | "closed" | "filtered">>({
    22: "idle",
    80: "idle",
    443: "idle",
    3306: "idle",
  });
  const [eventLog, setEventLog] = useState<string>("Select a scan style and click any door to knock!");

  const doors: DoorConfig[] = [
    { port: 22, name: "SSH Remote Admin", expectedState: "open", service: "OpenSSH 8.9", openColor: "indigo" },
    { port: 80, name: "HTTP Web", expectedState: "open", service: "Nginx 1.18", openColor: "emerald" },
    { port: 443, name: "HTTPS Secure Web", expectedState: "open", service: "Nginx (TLS)", openColor: "emerald" },
    { port: 3306, name: "Database (Internal)", expectedState: "filtered", service: "Protected by Firewall", openColor: "amber" },
  ];

  const handleKnock = (port: number) => {
    if (knocking) return;
    setActivePort(port);
    setKnocking(true);

    const targetDoor = doors.find((d) => d.port === port)!;

    if (targetDoor.expectedState === "filtered") {
      setEventLog(`Knocking on Door ${port}... Waiting for response...`);
      setTimeout(() => {
        setDoorStates((prev) => ({ ...prev, [port]: "filtered" }));
        setKnocking(false);
        setEventLog(`Door ${port} is hidden behind a Firewall brick wall! The probe was silently dropped.`);
      }, 900);
      return;
    }

    if (scanStyle === "polite") {
      setEventLog(`[Polite Knock]: Sent SYN → Door ${port} replied SYN-ACK → Sent ACK. Full connection logged in server guestbook!`);
      setTimeout(() => {
        setDoorStates((prev) => ({ ...prev, [port]: "open" }));
        setKnocking(false);
      }, 800);
    } else {
      setEventLog(`[Stealth SYN]: Sent SYN → Door ${port} started opening (SYN-ACK) → Sent RST instantly and ran away! Door checked, zero logs written.`);
      setTimeout(() => {
        setDoorStates((prev) => ({ ...prev, [port]: "open" }));
        setKnocking(false);
      }, 800);
    }
  };

  const handleReset = () => {
    setActivePort(null);
    setKnocking(false);
    setDoorStates({
      22: "idle",
      80: "idle",
      443: "idle",
      3306: "idle",
    });
    setEventLog("All doors reset. Choose a scan style and knock on a door!");
  };

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 p-5 sm:p-6 shadow-sm">
      {/* Top Controls Bar (Max 2-3 buttons) */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800/80">
        <div>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <DoorClosed className="w-4 h-4 text-indigo-500" />
            Port Door Knocker
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Target Server: <span className="font-mono font-medium">192.168.1.50</span>
          </p>
        </div>

        {/* Scan Style Selector Toggle & Reset (2 controls) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60">
            <button
              type="button"
              onClick={() => setScanStyle("polite")}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                scanStyle === "polite"
                  ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
              }`}
            >
              Polite Knock (Full Connect)
            </button>
            <button
              type="button"
              onClick={() => setScanStyle("stealth")}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1 ${
                scanStyle === "stealth"
                  ? "bg-indigo-600 text-white shadow-sm font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              Stealth Peek (Half-Open SYN)
            </button>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
            title="Reset doors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Big Visual Doors Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {doors.map((d) => {
          const state = doorStates[d.port];
          const isTargeted = activePort === d.port;

          return (
            <button
              key={d.port}
              type="button"
              onClick={() => handleKnock(d.port)}
              disabled={knocking}
              className={`relative p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-between min-h-[160px] group ${
                state === "open"
                  ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/80 shadow-md shadow-emerald-500/10"
                  : state === "filtered"
                  ? "bg-amber-50/50 dark:bg-amber-950/20 border-amber-500/80 shadow-md shadow-amber-500/10"
                  : isTargeted && knocking
                  ? "border-indigo-500 ring-2 ring-indigo-500/30 bg-indigo-50/40 dark:bg-indigo-950/20 animate-pulse"
                  : "bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700/80 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md"
              }`}
            >
              {/* Door Header Number */}
              <div className="w-full flex items-center justify-between text-xs mb-2">
                <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                  Door #{d.port}
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 font-semibold">
                  {state === "open"
                    ? "OPEN"
                    : state === "filtered"
                    ? "FILTERED"
                    : "CLICK"}
                </span>
              </div>

              {/* Big Door Icon */}
              <div className="my-2 transition-transform group-hover:scale-110">
                {state === "open" ? (
                  <DoorOpen className="w-12 h-12 text-emerald-500" />
                ) : state === "filtered" ? (
                  <ShieldAlert className="w-12 h-12 text-amber-500" />
                ) : (
                  <DoorClosed className="w-12 h-12 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
                )}
              </div>

              {/* Service & Action label */}
              <div className="w-full">
                <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                  {d.name}
                </div>
                <div className="text-[10px] text-zinc-400 font-mono mt-0.5 truncate">
                  {state === "open"
                    ? d.service
                    : state === "filtered"
                    ? "🧱 Brick Firewall"
                    : "Knock to probe"}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Terminal Feedback Bar */}
      <div className="p-3 rounded-xl bg-zinc-900 text-zinc-100 font-mono text-xs mb-4 flex items-center gap-2 border border-zinc-800">
        <Terminal className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
        <span className="truncate">{eventLog}</span>
      </div>

      {/* Mandatory Rule: "What's happening right now" plain-English caption box */}
      <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/50 space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-400">
          <Info className="w-4 h-4" />
          <span>What&apos;s happening right now:</span>
        </div>
        <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {scanStyle === "polite" ? (
            <>
              <strong>Polite Full Connect:</strong> When you knock, your computer completes the entire 3-way handshake (SYN $\to$ SYN-ACK $\to$ ACK). The door opens and the web application writes your visitor IP into its access log.
            </>
          ) : (
            <>
              <strong>Stealth Peek (SYN Scan):</strong> When you knock, you send SYN. As soon as the door begins to unlock (SYN-ACK), you immediately yell <code>RST</code> and vanish. You know the door is open, but the application never logs a connection!
            </>
          )}
        </p>
      </div>
    </div>
  );
}
