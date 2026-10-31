"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, ArrowRight, RefreshCw, CheckCircle2, XCircle, ShieldAlert, Zap, PhoneCall } from "lucide-react";

interface TcpHandshakeWidgetProps {
  config?: {
    stepFocus?: "analogy" | "handshake" | "stealth-scan";
  };
}

export function TcpHandshakeWidget({ config }: TcpHandshakeWidgetProps) {
  const [mode, setMode] = useState<"handshake" | "stealth" | "udp">(
    config?.stepFocus === "stealth-scan" ? "stealth" : "handshake"
  );
  const [currentStep, setCurrentStep] = useState<number>(0);

  const resetSimulation = (newMode?: "handshake" | "stealth" | "udp") => {
    if (newMode) setMode(newMode);
    setCurrentStep(0);
  };

  const handleNext = () => {
    if (mode === "handshake") {
      if (currentStep < 3) setCurrentStep((prev) => prev + 1);
    } else if (mode === "stealth") {
      if (currentStep < 3) setCurrentStep((prev) => prev + 1);
    } else if (mode === "udp") {
      if (currentStep < 2) setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/60 p-5 shadow-sm">
      {/* Widget Header & Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-zinc-200 dark:border-zinc-800/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 flex items-center justify-center">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Protocol Handshake & Stealth Scan Simulator
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Interactive TCP sequence state machine vs UDP stream
            </p>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60">
          <button
            type="button"
            onClick={() => resetSimulation("handshake")}
            className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
              mode === "handshake"
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
            }`}
          >
            TCP 3-Way
          </button>
          <button
            type="button"
            onClick={() => resetSimulation("stealth")}
            className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
              mode === "stealth"
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
            }`}
          >
            <ShieldAlert className="w-3 h-3 text-amber-500" />
            SYN Stealth (-sS)
          </button>
          <button
            type="button"
            onClick={() => resetSimulation("udp")}
            className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
              mode === "udp"
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
            }`}
          >
            UDP Stream
          </button>
        </div>
      </div>

      {/* Two Endpoints Diagram */}
      <div className="grid grid-cols-2 gap-8 relative py-4 px-2">
        {/* Client Side */}
        <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-left">
          <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            Client / Scanner
          </div>
          <div className="font-mono text-[11px] text-zinc-500">192.168.1.15:52000</div>
          <div className="mt-2 text-xs font-mono">
            State:{" "}
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              {currentStep === 0
                ? "CLOSED"
                : currentStep === 1
                ? "SYN_SENT"
                : currentStep === 2 && mode === "stealth"
                ? "SCAN_COMPLETED"
                : currentStep === 3
                ? "ESTABLISHED"
                : "SYN_SENT"}
            </span>
          </div>
        </div>

        {/* Server Side */}
        <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-right">
          <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1 flex items-center justify-end gap-1.5">
            Target Web Server
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="font-mono text-[11px] text-zinc-500">93.184.216.34:80 (HTTP)</div>
          <div className="mt-2 text-xs font-mono">
            State:{" "}
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {currentStep === 0
                ? "LISTEN"
                : currentStep === 1
                ? "SYN_RECEIVED"
                : currentStep === 2
                ? "SYN_RECEIVED"
                : currentStep === 3 && mode === "stealth"
                ? "CLOSED (RST Recv)"
                : currentStep === 3
                ? "ESTABLISHED"
                : "LISTEN"}
            </span>
          </div>
        </div>
      </div>

      {/* Packet Exchange Steps */}
      <div className="my-4 space-y-2">
        {mode === "handshake" && (
          <>
            {/* Step 1: SYN */}
            <div
              className={`p-3 rounded-xl border transition-all text-xs flex items-center justify-between ${
                currentStep >= 1
                  ? "bg-indigo-50/60 dark:bg-indigo-950/20 border-indigo-500/40 text-zinc-900 dark:text-zinc-100"
                  : "bg-zinc-50/50 dark:bg-zinc-800/20 border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  Step 1: SYN →
                </span>
                <span>Client initiates: &ldquo;Let&apos;s synchronize sequence numbers!&rdquo;</span>
              </div>
              <span className="font-mono text-[11px] text-zinc-500">SEQ=1000, CTL=SYN</span>
            </div>

            {/* Step 2: SYN-ACK */}
            <div
              className={`p-3 rounded-xl border transition-all text-xs flex items-center justify-between ${
                currentStep >= 2
                  ? "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-500/40 text-zinc-900 dark:text-zinc-100"
                  : "bg-zinc-50/50 dark:bg-zinc-800/20 border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  Step 2: ← SYN-ACK
                </span>
                <span>Server acknowledges: &ldquo;Heard you! Here is my sequence number.&rdquo;</span>
              </div>
              <span className="font-mono text-[11px] text-zinc-500">SEQ=5000, ACK=1001</span>
            </div>

            {/* Step 3: ACK */}
            <div
              className={`p-3 rounded-xl border transition-all text-xs flex items-center justify-between ${
                currentStep >= 3
                  ? "bg-indigo-50/60 dark:bg-indigo-950/20 border-indigo-500/40 text-zinc-900 dark:text-zinc-100"
                  : "bg-zinc-50/50 dark:bg-zinc-800/20 border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  Step 3: ACK →
                </span>
                <span>Client confirms: &ldquo;Acknowledged! Connection ESTABLISHED.&rdquo;</span>
              </div>
              <span className="font-mono text-[11px] text-zinc-500">ACK=5001 (Ready for Data)</span>
            </div>
          </>
        )}

        {mode === "stealth" && (
          <>
            {/* Step 1: SYN */}
            <div
              className={`p-3 rounded-xl border transition-all text-xs flex items-center justify-between ${
                currentStep >= 1
                  ? "bg-indigo-50/60 dark:bg-indigo-950/20 border-indigo-500/40 text-zinc-900 dark:text-zinc-100"
                  : "bg-zinc-50/50 dark:bg-zinc-800/20 border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  Step 1: SYN →
                </span>
                <span>Attacker sends SYN probe to Port 80</span>
              </div>
              <span className="font-mono text-[11px] text-zinc-500">SEQ=2400, CTL=SYN</span>
            </div>

            {/* Step 2: SYN-ACK */}
            <div
              className={`p-3 rounded-xl border transition-all text-xs flex items-center justify-between ${
                currentStep >= 2
                  ? "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-500/40 text-zinc-900 dark:text-zinc-100"
                  : "bg-zinc-50/50 dark:bg-zinc-800/20 border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  Step 2: ← SYN-ACK
                </span>
                <span>Server responds: Port is OPEN and listening!</span>
              </div>
              <span className="font-mono text-[11px] text-emerald-500 font-bold">PORT OPEN!</span>
            </div>

            {/* Step 3: RST (The Stealth Trick) */}
            <div
              className={`p-3 rounded-xl border transition-all text-xs flex items-center justify-between ${
                currentStep >= 3
                  ? "bg-rose-50/60 dark:bg-rose-950/20 border-rose-500/40 text-zinc-900 dark:text-zinc-100"
                  : "bg-zinc-50/50 dark:bg-zinc-800/20 border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                  Step 3: RST (Reset) →
                </span>
                <span>Attacker sends RST: &ldquo;Nevermind! Hangs up immediately.&rdquo;</span>
              </div>
              <span className="font-mono text-[11px] text-rose-500 font-bold">
                No Application Log Created!
              </span>
            </div>
          </>
        )}

        {mode === "udp" && (
          <>
            <div
              className={`p-3 rounded-xl border transition-all text-xs flex items-center justify-between ${
                currentStep >= 1
                  ? "bg-amber-50/60 dark:bg-amber-950/20 border-amber-500/40 text-zinc-900 dark:text-zinc-100"
                  : "bg-zinc-50/50 dark:bg-zinc-800/20 border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                  Datagram 1 →
                </span>
                <span>Audio frame 1 sent immediately (No handshake required!)</span>
              </div>
              <span className="font-mono text-[11px] text-zinc-500">UDP: Port 5060 (VoIP)</span>
            </div>
            <div
              className={`p-3 rounded-xl border transition-all text-xs flex items-center justify-between ${
                currentStep >= 2
                  ? "bg-amber-50/60 dark:bg-amber-950/20 border-amber-500/40 text-zinc-900 dark:text-zinc-100"
                  : "bg-zinc-50/50 dark:bg-zinc-800/20 border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                  Datagram 2 →
                </span>
                <span>Audio frame 2 streamed without waiting for acknowledgment!</span>
              </div>
              <span className="font-mono text-[11px] text-emerald-500 font-bold">0ms Latency Overhead</span>
            </div>
          </>
        )}
      </div>

      {/* Controls & Feedback */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800/80">
        <button
          type="button"
          onClick={() => resetSimulation()}
          className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" />
          Reset Simulation
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={
            (mode === "handshake" && currentStep >= 3) ||
            (mode === "stealth" && currentStep >= 3) ||
            (mode === "udp" && currentStep >= 2)
          }
          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-medium transition-all flex items-center gap-1.5"
        >
          <span>Send Next Packet</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
