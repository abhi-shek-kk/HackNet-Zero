"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Search, ShieldAlert, ArrowRight, Laptop, Wifi, Skull, Lock, Unlock, CheckCircle2 } from "lucide-react";

interface DnsArpMitmWidgetProps {
  config?: {
    stepFocus?: "analogy" | "resolution" | "mitm-attack";
  };
}

export function DnsArpMitmWidget({ config }: DnsArpMitmWidgetProps) {
  const [activeTab, setActiveTab] = useState<"dns" | "mitm">(
    config?.stepFocus === "mitm-attack" ? "mitm" : "dns"
  );

  // DNS State
  const [domainInput, setDomainInput] = useState("hacknet.org");
  const [dnsStep, setDnsStep] = useState<number>(0);
  const [dnsResolved, setDnsResolved] = useState(false);

  // MITM State
  const [isArpPoisoned, setIsArpPoisoned] = useState(false);
  const [isHttpsEnabled, setIsHttpsEnabled] = useState(false);

  const handleResolveDns = () => {
    setDnsResolved(false);
    setDnsStep(1); // Local cache
    setTimeout(() => {
      setDnsStep(2); // Root / TLD
      setTimeout(() => {
        setDnsStep(3); // Authoritative server
        setTimeout(() => {
          setDnsResolved(true);
        }, 800);
      }, 800);
    }, 800);
  };

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/60 p-5 shadow-sm">
      {/* Widget Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-zinc-200 dark:border-zinc-800/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              DNS Resolution & ARP Spoofing Lab
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Global domain lookup vs Local ARP Man-in-the-Middle
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60">
          <button
            type="button"
            onClick={() => setActiveTab("dns")}
            className={`text-xs px-3 py-1 rounded-lg font-medium transition-all ${
              activeTab === "dns"
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
            }`}
          >
            DNS Lookup
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("mitm")}
            className={`text-xs px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
              activeTab === "mitm"
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
            }`}
          >
            <ShieldAlert className="w-3 h-3 text-rose-500" />
            ARP MITM Attack
          </button>
        </div>
      </div>

      {activeTab === "dns" ? (
        /* DNS Resolution Simulation */
        <div>
          {/* Query Bar */}
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 font-mono text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Domain name (e.g. google.com)"
              />
            </div>
            <button
              type="button"
              onClick={handleResolveDns}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all shrink-0 flex items-center gap-1.5"
            >
              <span>Resolve DNS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* DNS Query Flow Steps */}
          <div className="space-y-2 mb-3">
            <div
              className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                dnsStep >= 1
                  ? "bg-indigo-50/60 dark:bg-indigo-950/20 border-indigo-500/40"
                  : "bg-zinc-50 dark:bg-zinc-800/20 border-zinc-200 dark:border-zinc-800 text-zinc-400"
              }`}
            >
              <div>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Step 1: Check Local OS & Resolver Cache
                </span>
                <p className="text-[11px] text-zinc-500">Checking if &apos;{domainInput}&apos; was queried recently...</p>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                CACHE MISS
              </span>
            </div>

            <div
              className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                dnsStep >= 2
                  ? "bg-indigo-50/60 dark:bg-indigo-950/20 border-indigo-500/40"
                  : "bg-zinc-50 dark:bg-zinc-800/20 border-zinc-200 dark:border-zinc-800 text-zinc-400"
              }`}
            >
              <div>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Step 2: Query Root (.) &amp; TLD (.org) Servers
                </span>
                <p className="text-[11px] text-zinc-500">
                  Directing query toward authoritative name servers for .{domainInput.split(".").pop() || "com"}
                </p>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                ROOT REFERRED
              </span>
            </div>

            <div
              className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                dnsStep >= 3
                  ? "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-500/40"
                  : "bg-zinc-50 dark:bg-zinc-800/20 border-zinc-200 dark:border-zinc-800 text-zinc-400"
              }`}
            >
              <div>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Step 3: Authoritative Name Server Answer
                </span>
                <p className="text-[11px] text-zinc-500">Final A-Record returned and cached in memory</p>
              </div>
              <span className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                {dnsResolved ? "A: 104.21.78.192" : "WAITING"}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* ARP Spoofing / MITM Attack Simulation */
        <div>
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsArpPoisoned(!isArpPoisoned)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isArpPoisoned
                    ? "bg-rose-600 text-white shadow-sm"
                    : "bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200"
                }`}
              >
                <Skull className="w-3.5 h-3.5" />
                {isArpPoisoned ? "ARP Poisoning ACTIVE" : "Inject Poisoned ARP Replies"}
              </button>

              <button
                type="button"
                onClick={() => setIsHttpsEnabled(!isHttpsEnabled)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isHttpsEnabled
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200"
                }`}
              >
                {isHttpsEnabled ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                {isHttpsEnabled ? "HTTPS / TLS Encrypted" : "Plaintext HTTP (No TLS)"}
              </button>
            </div>

            <span className="text-[11px] text-zinc-500">
              {isArpPoisoned ? "Traffic redirected through Attacker" : "Direct normal routing"}
            </span>
          </div>

          {/* Topology Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center relative mb-4">
            {/* Victim PC */}
            <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
              <div className="flex items-center gap-2 mb-1">
                <Laptop className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  Victim Laptop
                </span>
              </div>
              <div className="font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
                IP: 192.168.1.10
              </div>
              <div className="font-mono text-[10px] text-zinc-500 mt-1">
                ARP Cache: Gateway is at{" "}
                <span className={isArpPoisoned ? "text-rose-500 font-bold" : "text-emerald-500"}>
                  {isArpPoisoned ? "DE:AD:BE:EF:66:66 (Attacker!)" : "00:1A:2B:3C:4D:5E (Router)"}
                </span>
              </div>
            </div>

            {/* Rogue Attacker / MITM Proxy */}
            <div
              className={`p-3.5 rounded-xl border transition-all text-center ${
                isArpPoisoned
                  ? "bg-rose-50 dark:bg-rose-950/20 border-rose-500 ring-2 ring-rose-500/20"
                  : "bg-zinc-50/40 dark:bg-zinc-900/30 border-dashed border-zinc-300 dark:border-zinc-800 opacity-60"
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Skull className={`w-4 h-4 ${isArpPoisoned ? "text-rose-500" : "text-zinc-400"}`} />
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  Attacker (MITM)
                </span>
              </div>
              <div className="font-mono text-[11px] text-zinc-500">192.168.1.99</div>
              <div className="text-[11px] mt-1 font-mono">
                {isArpPoisoned ? (
                  <span className="text-rose-600 dark:text-rose-400 font-bold">
                    Intercepting &amp; Relaying
                  </span>
                ) : (
                  <span className="text-zinc-400">Passive Listening</span>
                )}
              </div>
            </div>

            {/* Router Gateway */}
            <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
              <div className="flex items-center gap-2 mb-1">
                <Wifi className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  Router Gateway
                </span>
              </div>
              <div className="font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
                IP: 192.168.1.1
              </div>
              <div className="font-mono text-[10px] text-zinc-500 mt-1">
                ARP Cache: 192.168.1.10 is at{" "}
                <span className={isArpPoisoned ? "text-rose-500 font-bold" : "text-emerald-500"}>
                  {isArpPoisoned ? "DE:AD:BE:EF:66:66 (Attacker!)" : "AA:BB:CC:11:22:33 (Victim)"}
                </span>
              </div>
            </div>
          </div>

          {/* Attacker Intercept Terminal View */}
          <div className="p-3.5 rounded-xl bg-zinc-900 text-zinc-100 font-mono text-xs border border-zinc-800">
            <div className="text-zinc-400 text-[11px] mb-1">
              [Wireshark Live Packet Sniff on Attacker Machine]:
            </div>
            {isArpPoisoned ? (
              isHttpsEnabled ? (
                <div className="text-emerald-400">
                  <div>Captured TLSv1.3 Handshake packet [Encrypted]</div>
                  <div className="text-zinc-500">
                    Payload: 4f a3 99 d2 10 5e 88... (Unreadable ciphertext! Passwords safe).
                  </div>
                </div>
              ) : (
                <div className="text-rose-400">
                  <div>Captured HTTP POST /api/login [Cleartext]</div>
                  <div className="text-amber-300 font-bold">
                    Payload: username=admin&amp;password=SuperSecretPassword123
                  </div>
                </div>
              )
            ) : (
              <div className="text-zinc-500">
                No redirected packets. Traffic is flowing directly to the legitimate gateway.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
