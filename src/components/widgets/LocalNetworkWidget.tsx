"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, Globe, Laptop, Smartphone, Video, ShieldCheck, Terminal, ArrowRight, Play } from "lucide-react";

interface LocalNetworkWidgetProps {
  config?: {
    stepFocus?: "analogy" | "nat-flow" | "recon";
  };
}

export function LocalNetworkWidget({ config }: LocalNetworkWidgetProps) {
  const [activeTab, setActiveTab] = useState<"nat" | "recon">(
    config?.stepFocus === "recon" ? "recon" : "nat"
  );
  const [natSimulating, setNatSimulating] = useState(false);
  const [natStep, setNatStep] = useState<0 | 1 | 2 | 3>(0);
  const [arpScanning, setArpScanning] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState<number[]>([]);

  const handleStartNat = () => {
    if (natSimulating) return;
    setNatSimulating(true);
    setNatStep(1); // Laptop sends private packet to router
    setTimeout(() => {
      setNatStep(2); // Router performs NAT rewrite to Public IP
      setTimeout(() => {
        setNatStep(3); // Public Internet server replies
        setTimeout(() => {
          setNatSimulating(false);
          setNatStep(0);
        }, 2000);
      }, 1800);
    }, 1800);
  };

  const handleStartArpScan = () => {
    if (arpScanning) return;
    setArpScanning(true);
    setDiscoveredDevices([]);

    [1, 2, 3, 4].forEach((id, idx) => {
      setTimeout(() => {
        setDiscoveredDevices((prev) => [...prev, id]);
        if (idx === 3) setArpScanning(false);
      }, (idx + 1) * 600);
    });
  };

  const devices = [
    { id: 1, name: "Home Router / Gateway", ip: "192.168.1.1", mac: "00:1A:2B:44:88:00", type: "router", icon: Wifi },
    { id: 2, name: "Your Laptop", ip: "192.168.1.15", mac: "3A:89:C4:12:F0:2E", type: "laptop", icon: Laptop },
    { id: 3, name: "Smart TV / Streaming", ip: "192.168.1.44", mac: "F8:E0:79:33:11:AA", type: "tv", icon: Smartphone },
    { id: 4, name: "IoT Security Camera (Default admin/admin)", ip: "192.168.1.88", mac: "10:52:1C:B0:92:DF", type: "iot", icon: Video },
  ];

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/60 p-5 shadow-sm">
      {/* Widget Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-zinc-200 dark:border-zinc-800/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 flex items-center justify-center">
            <Wifi className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Local Network & NAT Simulator
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Subnet: 192.168.1.0/24 (Private) ↔ Public IP: 203.0.113.88
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60">
          <button
            type="button"
            onClick={() => setActiveTab("nat")}
            className={`text-xs px-3 py-1 rounded-lg font-medium transition-all ${
              activeTab === "nat"
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
            }`}
          >
            NAT Translation
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("recon")}
            className={`text-xs px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
              activeTab === "recon"
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
            }`}
          >
            <Terminal className="w-3 h-3 text-emerald-500" />
            ARP Recon Scan
          </button>
        </div>
      </div>

      {activeTab === "nat" ? (
        <div>
          {/* Visual Topology Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center mb-4">
            {/* Private LAN Side */}
            <div
              className={`p-3.5 rounded-xl border transition-all ${
                natStep === 1
                  ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 ring-2 ring-emerald-500/20"
                  : "bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Laptop className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  Your Laptop (Private LAN)
                </span>
              </div>
              <div className="font-mono text-xs text-zinc-600 dark:text-zinc-300">
                IP: <span className="font-bold text-emerald-600 dark:text-emerald-400">192.168.1.15</span>
              </div>
              <div className="text-[11px] text-zinc-500 mt-1">
                Port: :54210 (Temporary Ephemeral)
              </div>
            </div>

            {/* Router / NAT Gateway */}
            <div
              className={`p-3.5 rounded-xl border text-center transition-all ${
                natStep === 2
                  ? "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-500 ring-2 ring-indigo-500/20"
                  : "bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800"
              }`}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Wifi className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  Router Gateway (NAT)
                </span>
              </div>
              <div className="text-[11px] font-mono text-zinc-600 dark:text-zinc-300">
                LAN: 192.168.1.1
              </div>
              <div className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                WAN: 203.0.113.88
              </div>
            </div>

            {/* Public Internet */}
            <div
              className={`p-3.5 rounded-xl border transition-all ${
                natStep === 3
                  ? "bg-sky-50 dark:bg-sky-950/30 border-sky-500 ring-2 ring-sky-500/20"
                  : "bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-sky-500" />
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  Public Web Server
                </span>
              </div>
              <div className="font-mono text-xs text-zinc-600 dark:text-zinc-300">
                IP: <span className="font-bold text-sky-600 dark:text-sky-400">142.250.190.46</span>
              </div>
              <div className="text-[11px] text-zinc-500 mt-1">
                Port: 443 (HTTPS)
              </div>
            </div>
          </div>

          {/* Live Translation Status Box */}
          <div className="p-3 rounded-xl bg-zinc-900 text-zinc-100 font-mono text-xs mb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <span className="text-zinc-400">NAT State Table: </span>
              {natStep === 0 && <span className="text-zinc-500">Idle. Click Simulate to trace packet.</span>}
              {natStep === 1 && (
                <span className="text-emerald-400">
                  [1] Outbound: 192.168.1.15:54210 → 192.168.1.1 (Gateway)
                </span>
              )}
              {natStep === 2 && (
                <span className="text-indigo-400">
                  [2] NAT Rewrote Source: 203.0.113.88:14201 → 142.250.190.46:443
                </span>
              )}
              {natStep === 3 && (
                <span className="text-sky-400">
                  [3] Server Replied: Router translated 203.0.113.88 back to 192.168.1.15!
                </span>
              )}
            </div>

            <button
              type="button"
              disabled={natSimulating}
              onClick={handleStartNat}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-sans text-xs font-medium transition-all shrink-0 flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" />
              {natSimulating ? "Translating..." : "Simulate Request"}
            </button>
          </div>
        </div>
      ) : (
        /* Reconnaissance Tab */
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs text-zinc-600 dark:text-zinc-400">
              Scanning local subnet: <code className="font-mono text-indigo-500">nmap -sn 192.168.1.0/24</code>
            </div>
            <button
              type="button"
              disabled={arpScanning}
              onClick={handleStartArpScan}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-medium transition-all flex items-center gap-1.5"
            >
              <Terminal className="w-3.5 h-3.5" />
              {arpScanning ? "Broadcasting ARP..." : "Run ARP Sweep"}
            </button>
          </div>

          <div className="space-y-2">
            {devices.map((dev) => {
              const Icon = dev.icon;
              const isFound = discoveredDevices.includes(dev.id);

              return (
                <div
                  key={dev.id}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between text-xs ${
                    isFound
                      ? "bg-zinc-50 dark:bg-zinc-800/80 border-emerald-500/40 text-zinc-900 dark:text-zinc-100"
                      : "bg-zinc-50/50 dark:bg-zinc-900/30 border-dashed border-zinc-300 dark:border-zinc-800 text-zinc-400"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        isFound
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-semibold">{isFound ? dev.name : "Undiscovered Host"}</div>
                      <div className="font-mono text-[11px] text-zinc-500">
                        {isFound ? `IP: ${dev.ip} | MAC: ${dev.mac}` : "192.168.1.??? (Probing broadcast...)"}
                      </div>
                    </div>
                  </div>

                  <div>
                    {isFound ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono border border-emerald-500/20 font-medium">
                        RESPONDED
                      </span>
                    ) : (
                      <span className="text-[11px] text-zinc-400">Waiting for ARP probe</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
