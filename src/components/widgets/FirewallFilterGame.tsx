"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ShieldAlert, ShieldCheck, Server, Laptop, ArrowRight, RotateCcw, Check, X, Play, Info, Sparkles } from "lucide-react";

export function FirewallFilterGame() {
  const [selectedPort, setSelectedPort] = useState<number>(443);
  const [selectedIp, setSelectedIp] = useState<string>("198.51.100.4");
  const [evaluationState, setEvaluationState] = useState<"idle" | "testing" | "passed" | "blocked">("idle");
  const [reason, setReason] = useState<string>("");

  const trustedIp = "198.51.100.4";

  const handleTestPacket = () => {
    setEvaluationState("testing");
    setReason("Inspecting packet headers against Firewall Access Control List...");

    setTimeout(() => {
      // Rule 1: Port 80 is strictly blocked
      if (selectedPort === 80) {
        setEvaluationState("blocked");
        setReason("DROPPED: Rule 1 forbids unencrypted HTTP (Port 80) traffic to prevent credential leaks.");
        return;
      }

      // Rule 2: Port 443 allowed ONLY from Trusted IP
      if (selectedPort === 443) {
        if (selectedIp === trustedIp) {
          setEvaluationState("passed");
          setReason("PERMITTED: Port 443 (HTTPS) from approved Trusted IP (198.51.100.4) matched Rule 2. Welcome inside!");
        } else {
          setEvaluationState("blocked");
          setReason("DROPPED: Port 443 is valid, but your Source IP is not on the Trusted Partner whitelist.");
        }
        return;
      }

      // Default deny for other ports
      setEvaluationState("blocked");
      setReason(`DROPPED: Port ${selectedPort} is not on the whitelist. Default-Deny rule dropped the connection.`);
    }, 700);
  };

  const handleReset = () => {
    setSelectedPort(443);
    setSelectedIp("203.0.113.50");
    setEvaluationState("idle");
    setReason("");
  };

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 p-5 sm:p-6 shadow-sm">
      {/* Top Controls Bar (Max 2-3 buttons) */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800/80">
        <div>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            Firewall Filter Mini-Puzzle
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Tweak your packet headers to slip past the security gate
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
            title="Reset puzzle"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            disabled={evaluationState === "testing"}
            onClick={handleTestPacket}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Send Packet</span>
          </button>
        </div>
      </div>

      {/* 2-Rule Firewall Checklist */}
      <div className="mb-6 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-2">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500">
          Firewall Gate Rules:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-lg border border-rose-500/30 bg-rose-50/40 dark:bg-rose-950/20 flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
              1
            </span>
            <div>
              <strong className="text-rose-700 dark:text-rose-300">BLOCK Port 80 (HTTP)</strong>
              <p className="text-[11px] text-zinc-500">Unencrypted traffic is strictly prohibited.</p>
            </div>
          </div>

          <div className="p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
              2
            </span>
            <div>
              <strong className="text-emerald-700 dark:text-emerald-300">ALLOW Port 443 from 198.51.100.4</strong>
              <p className="text-[11px] text-zinc-500">Only trusted partner IP may enter.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Gate Stage (Sender ↔ Firewall Gate ↔ Internal Server) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-6 text-center">
        {/* Your Packet Configuration (2 Dropdowns) */}
        <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 shadow-sm text-left space-y-3">
          <div className="flex items-center gap-2">
            <Laptop className="w-5 h-5 text-indigo-500" />
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              Configure Your Packet
            </span>
          </div>

          {/* Dropdown 1: Port */}
          <div>
            <label className="text-[11px] font-medium text-zinc-500 block mb-1">
              Destination Port:
            </label>
            <select
              value={selectedPort}
              onChange={(e) => {
                setSelectedPort(Number(e.target.value));
                setEvaluationState("idle");
              }}
              className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs font-mono text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500"
            >
              <option value={80}>Port 80 (HTTP Web)</option>
              <option value={443}>Port 443 (HTTPS Secure)</option>
              <option value={22}>Port 22 (SSH Admin)</option>
              <option value={3306}>Port 3306 (MySQL DB)</option>
            </select>
          </div>

          {/* Dropdown 2: Source IP */}
          <div>
            <label className="text-[11px] font-medium text-zinc-500 block mb-1">
              Source IP:
            </label>
            <select
              value={selectedIp}
              onChange={(e) => {
                setSelectedIp(e.target.value);
                setEvaluationState("idle");
              }}
              className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs font-mono text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="198.51.100.4">198.51.100.4 (Trusted Partner)</option>
              <option value="203.0.113.50">203.0.113.50 (Random Public IP)</option>
              <option value="10.0.0.99">10.0.0.99 (Internal Subnet)</option>
            </select>
          </div>
        </div>

        {/* Center: Firewall Gate with Large Shield */}
        <div className="flex flex-col items-center">
          <div
            className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all ${
              evaluationState === "passed"
                ? "bg-emerald-500 text-white shadow-xl shadow-emerald-500/30 scale-110"
                : evaluationState === "blocked"
                ? "bg-rose-500 text-white shadow-xl shadow-rose-500/30 scale-110"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border-2 border-dashed border-zinc-300 dark:border-zinc-700"
            }`}
          >
            {evaluationState === "passed" ? (
              <ShieldCheck className="w-10 h-10" />
            ) : evaluationState === "blocked" ? (
              <ShieldAlert className="w-10 h-10" />
            ) : (
              <Shield className="w-10 h-10" />
            )}
          </div>
          <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100 mt-2">
            Firewall Gate
          </span>
          <span className="font-mono text-[10px] text-zinc-500 uppercase font-semibold">
            {evaluationState === "passed"
              ? "GATE OPENED ✓"
              : evaluationState === "blocked"
              ? "GATE LOCKED ✕"
              : "READY"}
          </span>
        </div>

        {/* Right: Internal Server Destination */}
        <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 shadow-sm flex flex-col items-center justify-center min-h-[140px]">
          <Server className="w-8 h-8 text-emerald-500 mb-2" />
          <span className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
            Internal Corporate Server
          </span>
          <span className="font-mono text-[10px] text-zinc-500">10.0.5.25</span>
          <span className="text-[10px] text-zinc-400 mt-1">Goal: Deliver packet here!</span>
        </div>
      </div>

      {/* Result Reason Banner if tested */}
      {reason && (
        <div
          className={`p-3 rounded-xl mb-4 text-xs font-mono border flex items-center gap-2 ${
            evaluationState === "passed"
              ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
              : "bg-rose-50 dark:bg-rose-950/20 border-rose-500/40 text-rose-700 dark:text-rose-300"
          }`}
        >
          {evaluationState === "passed" ? (
            <Check className="w-4 h-4 shrink-0 text-emerald-500" />
          ) : (
            <X className="w-4 h-4 shrink-0 text-rose-500" />
          )}
          <span>{reason}</span>
        </div>
      )}

      {/* Mandatory Rule: "What's happening right now" plain-English caption box */}
      <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/50 space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-400">
          <Info className="w-4 h-4" />
          <span>What&apos;s happening right now:</span>
        </div>
        <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {evaluationState === "idle" && (
            <>
              Select your <strong>Destination Port</strong> and <strong>Source IP</strong> using the two dropdowns, then hit <strong>Send Packet</strong>. The firewall evaluates the rule checklist sequentially from top to bottom!
            </>
          )}
          {evaluationState === "testing" && "The firewall security daemon is inspecting packet headers..."}
          {evaluationState === "passed" && (
            <>
              <strong>Success!</strong> You satisfied both security rules: your traffic is encrypted on Port 443 and originated from the approved Source IP <code>198.51.100.4</code>.
            </>
          )}
          {evaluationState === "blocked" && (
            <>
              <strong>Blocked by Access Control List:</strong> Your packet headers violated security rules. In ethical hacking, firewalls act as strict filters, requiring penetration testers to identify legitimate allowed ports or use authorized tunnels.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
