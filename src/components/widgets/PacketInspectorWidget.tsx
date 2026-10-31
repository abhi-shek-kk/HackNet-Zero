"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Mail, ShieldAlert, Cpu, Check, RefreshCw, Eye } from "lucide-react";

interface PacketInspectorProps {
  config?: {
    stepFocus?: "analogy" | "technical" | "hacking";
    defaultPayload?: string;
  };
}

export function PacketInspectorWidget({ config }: PacketInspectorProps) {
  const [activeLayer, setActiveLayer] = useState<"ethernet" | "ip" | "payload">("ip");
  const [payloadText, setPayloadText] = useState(
    config?.defaultPayload || "GET /login HTTP/1.1"
  );
  const [spoofedMac, setSpoofedMac] = useState(false);
  const [promiscuousMode, setPromiscuousMode] = useState(false);

  const macAddress = spoofedMac ? "DE:AD:BE:EF:00:01" : "3A:89:C4:12:F0:2E";

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/60 p-5 shadow-sm">
      {/* Widget Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-zinc-200 dark:border-zinc-800/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Interactive Packet Inspector
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Click layers to unwrap the digital envelope
            </p>
          </div>
        </div>

        {/* Hacking toggle buttons if in hacking step or general */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSpoofedMac(!spoofedMac)}
            className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all flex items-center gap-1.5 ${
              spoofedMac
                ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
                : "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            {spoofedMac ? "MAC Spoofed!" : "Spoof MAC"}
          </button>

          <button
            type="button"
            onClick={() => setPromiscuousMode(!promiscuousMode)}
            className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all flex items-center gap-1.5 ${
              promiscuousMode
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                : "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            {promiscuousMode ? "Promiscuous ON" : "Promiscuous Mode"}
          </button>
        </div>
      </div>

      {/* Envelope Nesting Representation */}
      <div className="space-y-2 mb-4">
        {/* Layer 2: Ethernet Frame Envelope */}
        <div
          onClick={() => setActiveLayer("ethernet")}
          className={`cursor-pointer transition-all rounded-xl p-3 border ${
            activeLayer === "ethernet"
              ? "bg-indigo-50 dark:bg-indigo-950/20 border-indigo-500 ring-2 ring-indigo-500/20"
              : "bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              Layer 2: Ethernet Frame (Local Wire Delivery)
            </span>
            <span className="font-mono text-[11px] text-zinc-500">
              MAC: {macAddress}
            </span>
          </div>

          {/* Nested Layer 3: IP Packet */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              setActiveLayer("ip");
            }}
            className={`mt-2 transition-all rounded-lg p-3 border ${
              activeLayer === "ip"
                ? "bg-indigo-100/50 dark:bg-indigo-900/30 border-indigo-400 ring-2 ring-indigo-400/20"
                : "bg-white dark:bg-zinc-800/70 border-zinc-200 dark:border-zinc-700 hover:border-indigo-300"
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                Layer 3: IP Packet (Global Internet Delivery)
              </span>
              <span className="font-mono text-[11px] text-zinc-500">
                192.168.1.15 → 93.184.216.34
              </span>
            </div>

            {/* Nested Inner: Payload */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                setActiveLayer("payload");
              }}
              className={`mt-2 transition-all rounded-md p-2.5 border ${
                activeLayer === "payload"
                  ? "bg-white dark:bg-zinc-900 border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm"
                  : "bg-zinc-100 dark:bg-zinc-900/60 border-zinc-300 dark:border-zinc-700/60"
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-zinc-600 dark:text-zinc-300 font-medium">
                  Payload (Actual Content):
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {payloadText.length} bytes
                </span>
              </div>
              <p className="font-mono text-xs text-zinc-900 dark:text-zinc-100 mt-1 truncate">
                &ldquo;{payloadText}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Layer Details Inspector Box */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeLayer + (spoofedMac ? "sp" : "org")}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="rounded-xl bg-zinc-50 dark:bg-zinc-800/50 p-3.5 border border-zinc-200 dark:border-zinc-800 text-xs"
        >
          {activeLayer === "ethernet" && (
            <div className="space-y-2">
              <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
                <span>Ethernet Frame Header Fields:</span>
                <span className="text-[11px] text-indigo-500 font-medium">
                  {spoofedMac ? "⚠️ Spoofed Hardware Fingerprint" : "Official Hardware Address"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div className="p-2 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/60">
                  <div className="text-zinc-400 text-[10px]">Source MAC</div>
                  <div className="text-indigo-600 dark:text-indigo-400 font-bold">{macAddress}</div>
                </div>
                <div className="p-2 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/60">
                  <div className="text-zinc-400 text-[10px]">Destination MAC (Next Switch/Router)</div>
                  <div className="text-zinc-700 dark:text-zinc-300">00:1A:2B:3C:4D:5E</div>
                </div>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed">
                Switches use these MAC addresses to steer electrical pulses through the local network switch ports. They are replaced at every router hop!
              </p>
            </div>
          )}

          {activeLayer === "ip" && (
            <div className="space-y-2">
              <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
                <span>IP Header Fields (RFC 791):</span>
                <span className="text-[11px] text-emerald-500 font-medium">End-to-End Delivery</span>
              </div>
              <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
                <div className="p-2 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/60">
                  <div className="text-zinc-400 text-[10px]">Source IP</div>
                  <div className="text-emerald-600 dark:text-emerald-400 font-bold">192.168.1.15</div>
                </div>
                <div className="p-2 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/60">
                  <div className="text-zinc-400 text-[10px]">Dest IP</div>
                  <div className="text-emerald-600 dark:text-emerald-400 font-bold">93.184.216.34</div>
                </div>
                <div className="p-2 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/60">
                  <div className="text-zinc-400 text-[10px]">TTL (Hops Left)</div>
                  <div className="text-zinc-700 dark:text-zinc-300">64</div>
                </div>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed">
                Every internet router reads the Destination IP to decide which fiber-optic link to relay this packet towards.
              </p>
            </div>
          )}

          {activeLayer === "payload" && (
            <div className="space-y-2">
              <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
                <span>Payload Content (Edit to test live envelope):</span>
                <span className="text-[11px] text-zinc-400">Plaintext Data</span>
              </div>
              <input
                type="text"
                value={payloadText}
                onChange={(e) => setPayloadText(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Type any message to package..."
              />
              <p className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed">
                {promiscuousMode ? (
                  <span className="text-emerald-500 font-medium">
                    Wireshark Promiscuous Mode active: This plaintext payload is visible to anyone on the local collision domain!
                  </span>
                ) : (
                  "Without TLS / HTTPS encryption, this payload can be read as clear text by any sniffer on the local network."
                )}
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
