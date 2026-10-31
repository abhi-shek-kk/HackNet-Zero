"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Laptop, Wifi, Globe, Mail, ArrowRight, RotateCcw, ChevronRight, ChevronLeft, CheckCircle2, Info } from "lucide-react";

export function EnvelopeJourneyWidget() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "1. Raw Message on Laptop",
      position: "laptop", // 'laptop' | 'to-router' | 'router' | 'to-server' | 'server'
      activeNode: 0,
      packetState: "raw",
      ipHeader: null,
      macHeader: null,
      caption:
        "You type 'Hello Web!' on your laptop. At this stage, it is just raw application data waiting to be delivered across the world.",
      tip: "Data needs two envelopes before it can leave: an address for the global journey (IP), and an address for the local hop (MAC).",
    },
    {
      title: "2. The Inner IP Envelope (Global Address)",
      position: "laptop",
      activeNode: 0,
      packetState: "ip-wrapped",
      ipHeader: { src: "192.168.1.15", dst: "93.184.216.34" },
      macHeader: null,
      caption:
        "Your laptop wraps the message in an IP Envelope. The Destination IP (93.184.216.34) tells the global internet exactly which web server needs to receive this.",
      tip: "The IP address is like the city and street address written on a letter. It stays constant the entire trip across the globe.",
    },
    {
      title: "3. The Outer MAC Envelope (Local Hop to Router)",
      position: "to-router",
      activeNode: 1,
      packetState: "fully-wrapped",
      ipHeader: { src: "192.168.1.15", dst: "93.184.216.34" },
      macHeader: { src: "AA:11:22 (Laptop)", dst: "BB:33:44 (Router)" },
      caption:
        "Your laptop puts the IP envelope inside an Ethernet MAC Envelope addressed to the local Home Router (BB:33:44). The packet flies over Wi-Fi!",
      tip: "Your laptop doesn't talk directly to California—it only knows how to hand physical Wi-Fi radio pulses to the nearby router.",
    },
    {
      title: "4. Router Swaps the MAC Envelope",
      position: "router",
      activeNode: 1,
      packetState: "mac-swapped",
      ipHeader: { src: "192.168.1.15", dst: "93.184.216.34" },
      macHeader: { src: "CC:55:66 (Router WAN)", dst: "DD:77:88 (Next Server)" },
      caption:
        "Crucial moment! The router shreds the old MAC envelope and puts on a NEW MAC envelope for the next fiber hop. Notice: The IP address inside NEVER changed!",
      tip: "MAC addresses change at every single router hop along the way, but the IP address stays locked on the final destination.",
    },
    {
      title: "5. Delivered to Web Server!",
      position: "server",
      activeNode: 2,
      packetState: "delivered",
      ipHeader: null,
      macHeader: null,
      caption:
        "The web server receives the packet, strips away the MAC and IP envelopes, and hands 'Hello Web!' to the web application.",
      tip: "Mission accomplished! The payload made it safely from your screen to the server.",
    },
  ];

  const active = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
  };

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 p-5 sm:p-6 shadow-sm">
      {/* Top Controls Bar (Max 2-3 buttons) */}
      <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800/80">
        <div>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Mail className="w-4 h-4 text-indigo-500" />
            The Journey of Two Envelopes
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Step {currentStep + 1} of {steps.length}: {active.title}
          </p>
        </div>

        {/* Buttons (Prev, Next, Reset) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Step Back"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {currentStep === steps.length - 1 ? (
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Start Over</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>Step Forward</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Visual Animation Stage: 3 Big Nodes */}
      <div className="relative py-4 px-2 mb-6">
        {/* Progress Line Behind Nodes */}
        <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-zinc-200 dark:bg-zinc-800 -z-0 rounded-full" />
        <div
          className="absolute top-1/2 left-8 -translate-y-1/2 h-1 bg-indigo-500 -z-0 rounded-full transition-all duration-500"
          style={{ width: `${(currentStep / (steps.length - 1)) * 88}%` }}
        />

        <div className="grid grid-cols-3 gap-2 relative z-10 text-center">
          {/* Node 1: Laptop */}
          <div className="flex flex-col items-center">
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all ${
                active.activeNode === 0
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105"
                  : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
              }`}
            >
              <Laptop className="w-7 h-7" />
            </div>
            <span className="font-semibold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 mt-2">
              Your Laptop
            </span>
            <span className="font-mono text-[10px] text-zinc-500">192.168.1.15</span>
          </div>

          {/* Node 2: Home Router */}
          <div className="flex flex-col items-center">
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all ${
                active.activeNode === 1
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105"
                  : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
              }`}
            >
              <Wifi className="w-7 h-7" />
            </div>
            <span className="font-semibold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 mt-2">
              Home Router
            </span>
            <span className="font-mono text-[10px] text-zinc-500">Gateway</span>
          </div>

          {/* Node 3: Web Server */}
          <div className="flex flex-col items-center">
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all ${
                active.activeNode === 2
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105"
                  : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
              }`}
            >
              <Globe className="w-7 h-7" />
            </div>
            <span className="font-semibold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 mt-2">
              Web Server
            </span>
            <span className="font-mono text-[10px] text-zinc-500">93.184.216.34</span>
          </div>
        </div>
      </div>

      {/* The Visual Envelopes Container */}
      <div className="mb-5 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800">
        <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2 font-semibold">
          Packet Construction Status:
        </div>

        {/* Envelope layers display */}
        <div className="space-y-2">
          {/* Outer MAC Envelope */}
          <div
            className={`p-3 rounded-lg border transition-all ${
              active.macHeader
                ? "bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-400 dark:border-indigo-800"
                : "bg-transparent border-dashed border-zinc-300 dark:border-zinc-800 text-zinc-400 opacity-60"
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                <Mail className="w-3.5 h-3.5" />
                Outer Layer: Ethernet MAC Envelope (Local Hop)
              </span>
              <span className="font-mono text-[11px]">
                {active.macHeader
                  ? `${active.macHeader.src} → ${active.macHeader.dst}`
                  : "Not yet applied"}
              </span>
            </div>

            {/* Inner IP Envelope */}
            <div
              className={`p-2.5 rounded-md border transition-all mt-1.5 ${
                active.ipHeader
                  ? "bg-white dark:bg-zinc-900 border-emerald-500/60 shadow-sm"
                  : "bg-zinc-100 dark:bg-zinc-800/40 border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-400"
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <Globe className="w-3 h-3" />
                  Inner Layer: IP Envelope (Global Destination)
                </span>
                <span className="font-mono text-[11px] font-bold">
                  {active.ipHeader
                    ? `${active.ipHeader.src} → ${active.ipHeader.dst}`
                    : "Not yet applied"}
                </span>
              </div>

              {/* Data Content */}
              <div className="mt-2 p-2 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-xs text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
                <span>Payload Data: &ldquo;Hello Web!&rdquo;</span>
                <span className="text-[10px] text-zinc-500 font-sans">10 bytes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Rule: "What's happening right now" plain-English caption box */}
      <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/50 space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-400">
          <Info className="w-4 h-4" />
          <span>What&apos;s happening right now:</span>
        </div>
        <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {active.caption}
        </p>
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 italic pt-1">
          💡 {active.tip}
        </p>
      </div>
    </div>
  );
}
