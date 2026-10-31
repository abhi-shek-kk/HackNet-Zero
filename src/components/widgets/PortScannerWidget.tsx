"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { DoorClosed, DoorOpen, ShieldCheck, Lock, Unlock, Play, Terminal, Info } from "lucide-react";

interface PortScannerWidgetProps {
  config?: {
    stepFocus?: "analogy" | "sockets" | "scanning";
  };
}

interface PortDoor {
  port: number;
  service: string;
  defaultStatus: "open" | "closed" | "filtered";
  banner: string;
  description: string;
  risk: string;
}

export function PortScannerWidget({ config }: PortScannerWidgetProps) {
  const [selectedPort, setSelectedPort] = useState<number | null>(80);
  const [scannedPorts, setScannedPorts] = useState<Record<number, "open" | "closed" | "filtered">>({
    80: "open",
    443: "open",
  });
  const [isScanningAll, setIsScanningAll] = useState(false);

  const ports: PortDoor[] = [
    {
      port: 22,
      service: "SSH (Secure Shell)",
      defaultStatus: "open",
      banner: "SSH-2.0-OpenSSH_8.2p1 Ubuntu-4ubuntu0.5",
      description: "Remote administrative terminal with encrypted authentication.",
      risk: "Attacker could attempt credential brute-forcing if weak passwords are used.",
    },
    {
      port: 80,
      service: "HTTP (Web Server)",
      defaultStatus: "open",
      banner: "Server: Apache/2.4.41 (Ubuntu) mod_ssl/2.4.41",
      description: "Unencrypted web server delivering HTML pages.",
      risk: "Transfers credentials and session tokens in clear text across the wire.",
    },
    {
      port: 443,
      service: "HTTPS (Secure Web)",
      defaultStatus: "open",
      banner: "TLSv1.3 / Certificate valid for *.company.com",
      description: "Encrypted web server protecting user traffic via TLS.",
      risk: "Protects data in transit; penetration tester audits TLS ciphers & certs.",
    },
    {
      port: 21,
      service: "FTP (File Transfer)",
      defaultStatus: "closed",
      banner: "[Connection Refused by OS - TCP RST]",
      description: "Legacy file transfer daemon.",
      risk: "Port is CLOSED: OS returned RST, no software listening.",
    },
    {
      port: 3306,
      service: "MySQL Database",
      defaultStatus: "filtered",
      banner: "[No Response - Dropped by Host Firewall]",
      description: "Relational database server storing user accounts and passwords.",
      risk: "Port is FILTERED: A firewall prevents direct internet access. Good defense!",
    },
    {
      port: 8080,
      service: "HTTP Alternate (Dev API)",
      defaultStatus: "open",
      banner: "Node.js Express / v18.16.0 (Debug mode enabled)",
      description: "Development test server left exposed accidentally.",
      risk: "Leaked internal debug endpoint with exposed stack traces and secrets.",
    },
  ];

  const handleScanPort = (portNum: number) => {
    setSelectedPort(portNum);
    const target = ports.find((p) => p.port === portNum);
    if (!target) return;
    setScannedPorts((prev) => ({
      ...prev,
      [portNum]: target.defaultStatus,
    }));
  };

  const handleScanAll = () => {
    if (isScanningAll) return;
    setIsScanningAll(true);
    setScannedPorts({});

    ports.forEach((p, idx) => {
      setTimeout(() => {
        setScannedPorts((prev) => ({
          ...prev,
          [p.port]: p.defaultStatus,
        }));
        if (idx === ports.length - 1) {
          setIsScanningAll(false);
        }
      }, (idx + 1) * 350);
    });
  };

  const activePortData = ports.find((p) => p.port === selectedPort) || ports[0];
  const activeStatus = scannedPorts[activePortData.port];

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/60 p-5 shadow-sm">
      {/* Widget Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-zinc-200 dark:border-zinc-800/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 flex items-center justify-center">
            <DoorClosed className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Interactive Port Scanner & Banner Grabber
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Target: 192.168.1.50 (Corporate Web Server)
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={isScanningAll}
          onClick={handleScanAll}
          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-medium transition-all flex items-center gap-1.5"
        >
          <Terminal className="w-3.5 h-3.5" />
          {isScanningAll ? "Scanning ports..." : "Scan All Ports (nmap)"}
        </button>
      </div>

      {/* Grid of Numbered Doors */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-4">
        {ports.map((p) => {
          const status = scannedPorts[p.port];
          const isSelected = selectedPort === p.port;

          let badgeColor = "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border-zinc-300 dark:border-zinc-700";
          if (status === "open") {
            badgeColor = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
          } else if (status === "closed") {
            badgeColor = "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30";
          } else if (status === "filtered") {
            badgeColor = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
          }

          return (
            <button
              key={p.port}
              type="button"
              onClick={() => handleScanPort(p.port)}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-between gap-1.5 ${
                isSelected
                  ? "border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-950/20"
                  : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
            >
              <div className="text-[11px] font-mono text-zinc-500">Door #{p.port}</div>
              <div className="my-0.5">
                {status === "open" ? (
                  <DoorOpen className="w-5 h-5 text-emerald-500" />
                ) : status === "filtered" ? (
                  <Lock className="w-5 h-5 text-amber-500" />
                ) : (
                  <DoorClosed className="w-5 h-5 text-zinc-400" />
                )}
              </div>
              <div className="text-xs font-semibold truncate w-full text-zinc-800 dark:text-zinc-200">
                {p.service.split(" ")[0]}
              </div>
              <span
                className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded border font-medium ${badgeColor}`}
              >
                {status ? status : "UNKNOWN"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Port Inspection & Service Banner */}
      <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-sm text-indigo-600 dark:text-indigo-400">
              Port {activePortData.port} ({activePortData.service})
            </span>
            {activeStatus && (
              <span
                className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full font-bold ${
                  activeStatus === "open"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                    : activeStatus === "closed"
                    ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                }`}
              >
                STATUS: {activeStatus.toUpperCase()}
              </span>
            )}
          </div>
          <span className="text-xs text-zinc-500">{activePortData.description}</span>
        </div>

        {/* Grabbed Banner */}
        <div className="mt-3">
          <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mb-1 flex items-center gap-1">
            <Terminal className="w-3 h-3 text-indigo-400" />
            Service Banner (Returned by listening process):
          </div>
          <div className="p-2.5 rounded-lg bg-zinc-900 text-zinc-100 font-mono text-xs overflow-x-auto border border-zinc-800">
            {activeStatus ? (
              activePortData.banner
            ) : (
              <span className="text-zinc-500">Click &apos;Scan&apos; or door above to probe service banner...</span>
            )}
          </div>
        </div>

        {/* Security / Hacker implication */}
        <div className="mt-3 flex items-start gap-2 p-2.5 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/40 text-xs text-zinc-700 dark:text-zinc-300">
          <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
          <div>
            <strong className="text-indigo-700 dark:text-indigo-300">Penetration Tester Note: </strong>
            {activePortData.risk}
          </div>
        </div>
      </div>
    </div>
  );
}
