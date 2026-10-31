"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Laptop, Wifi, Skull, ShieldCheck, ArrowRight, Play, RotateCcw, Info, Lock, Unlock, Mail } from "lucide-react";

export function ArpTricksterWidget() {
  const [isPoisoned, setIsPoisoned] = useState(false);
  const [isSendingPacket, setIsSendingPacket] = useState(false);
  const [packetStage, setPacketStage] = useState<"idle" | "alice" | "hacker" | "router">("idle");
  const [isHttps, setIsHttps] = useState(false);

  const handleTogglePoison = () => {
    setIsPoisoned((prev) => !prev);
    setPacketStage("idle");
  };

  const handleSendPacket = () => {
    if (isSendingPacket) return;
    setIsSendingPacket(true);
    setPacketStage("alice");

    if (!isPoisoned) {
      // Direct path to router
      setTimeout(() => {
        setPacketStage("router");
        setTimeout(() => {
          setIsSendingPacket(false);
          setPacketStage("idle");
        }, 1200);
      }, 1000);
    } else {
      // Diverted through hacker
      setTimeout(() => {
        setPacketStage("hacker");
        setTimeout(() => {
          setPacketStage("router");
          setTimeout(() => {
            setIsSendingPacket(false);
            setPacketStage("idle");
          }, 1200);
        }, 1200);
      }, 1000);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 p-5 sm:p-6 shadow-sm">
      {/* Top Controls Bar (Max 2-3 buttons) */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800/80">
        <div>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Skull className="w-4 h-4 text-rose-500" />
            The ARP Trickster (Man-in-the-Middle)
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Status: {isPoisoned ? "⚠️ ARP Cache Poisoned (Intercept Active)" : "Normal Unspoofed Local Network"}
          </p>
        </div>

        {/* 2 Buttons: Toggle Poison & Send Message */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsHttps(!isHttps)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 ${
              isHttps
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                : "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
            }`}
          >
            {isHttps ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
            {isHttps ? "HTTPS / TLS Encrypted" : "Plaintext HTTP"}
          </button>

          <button
            type="button"
            onClick={handleTogglePoison}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm ${
              isPoisoned
                ? "bg-rose-600 hover:bg-rose-500 text-white"
                : "bg-indigo-600 hover:bg-indigo-500 text-white"
            }`}
          >
            <Skull className="w-3.5 h-3.5" />
            <span>{isPoisoned ? "Restore Normal ARP" : "Send Fake ARP ('I am Router')"}</span>
          </button>

          <button
            type="button"
            disabled={isSendingPacket}
            onClick={handleSendPacket}
            className="px-3.5 py-1.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:opacity-90 disabled:opacity-40 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Send Message</span>
          </button>
        </div>
      </div>

      {/* Visual Triangle Diagram with Big Icons */}
      <div className="relative py-6 px-4 mb-6">
        <div className="grid grid-cols-2 gap-8 items-start mb-12">
          {/* Top-Left: Alice (Victim) */}
          <div className="flex flex-col items-center text-center">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                packetStage === "alice"
                  ? "bg-indigo-600 text-white ring-4 ring-indigo-500/20 scale-105"
                  : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 shadow-sm"
              }`}
            >
              <Laptop className="w-8 h-8 text-indigo-500" />
            </div>
            <span className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 mt-2">
              Alice (Victim)
            </span>
            <span className="font-mono text-[11px] text-zinc-500">192.168.1.10</span>
            <div className="mt-1 px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-mono text-zinc-600 dark:text-zinc-400">
              Gateway MAC: {isPoisoned ? "DE:AD:66 (Hacker!)" : "00:1A:44 (Router)"}
            </div>
          </div>

          {/* Top-Right: Wi-Fi Router */}
          <div className="flex flex-col items-center text-center">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                packetStage === "router"
                  ? "bg-emerald-600 text-white ring-4 ring-emerald-500/20 scale-105"
                  : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 shadow-sm"
              }`}
            >
              <Wifi className="w-8 h-8 text-emerald-500" />
            </div>
            <span className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 mt-2">
              Wi-Fi Router
            </span>
            <span className="font-mono text-[11px] text-zinc-500">192.168.1.1</span>
            <div className="mt-1 px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-mono text-zinc-600 dark:text-zinc-400">
              MAC: 00:1A:44
            </div>
          </div>
        </div>

        {/* Bottom Center: You (Ethical Hacker / MITM) */}
        <div className="flex flex-col items-center text-center -mt-4">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
              isPoisoned
                ? packetStage === "hacker"
                  ? "bg-rose-600 text-white ring-4 ring-rose-500/20 scale-110 shadow-lg"
                  : "bg-rose-50 dark:bg-rose-950/40 text-rose-600 border-2 border-rose-500 shadow-sm"
                : "bg-zinc-100 dark:bg-zinc-800/40 text-zinc-400 border border-dashed border-zinc-300 dark:border-zinc-700"
            }`}
          >
            <Skull className="w-8 h-8" />
          </div>
          <span className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 mt-2">
            You (Ethical Hacker)
          </span>
          <span className="font-mono text-[11px] text-zinc-500">192.168.1.99 • MAC: DE:AD:66</span>

          {/* Intercept Callout when Poisoned */}
          {isPoisoned && (
            <div className="mt-3 p-3 rounded-xl bg-zinc-900 text-zinc-100 font-mono text-xs border border-zinc-800 max-w-sm w-full text-left shadow-lg">
              <div className="text-[10px] uppercase text-zinc-400 flex items-center justify-between mb-1">
                <span>[MITM Packet Intercepted]</span>
                <span className={isHttps ? "text-emerald-400" : "text-rose-400 font-bold"}>
                  {isHttps ? "ENCRYPTED" : "CLEARTEXT LEAK"}
                </span>
              </div>
              <div className="text-zinc-200">
                {isHttps ? (
                  <span className="text-emerald-400">
                    🔒 Payload: 7a 4f 9b c1 0e... (Scrambled TLS! Passwords safe).
                  </span>
                ) : (
                  <span className="text-amber-300">
                    ⚠️ Payload: &ldquo;Alice login: password=secret123&rdquo;
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mandatory Rule: "What's happening right now" plain-English caption box */}
      <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/50 space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-400">
          <Info className="w-4 h-4" />
          <span>What&apos;s happening right now:</span>
        </div>
        <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {!isPoisoned ? (
            <>
              <strong>Normal Routing:</strong> Alice knows the Router is at <code>00:1A:44</code>. Her packets travel straight to the Wi-Fi router and out to the internet safely without anyone eavesdropping.
            </>
          ) : (
            <>
              <strong>Man-in-the-Middle Active:</strong> Because ARP has zero passwords or authentication, Alice blindly believed your fake announcement: <em>&ldquo;I am 192.168.1.1 at MAC DE:AD:66&rdquo;</em>. Her laptop now obediently sends every packet directly to your machine first before you relay it to the router!
            </>
          )}
        </p>
      </div>
    </div>
  );
}
