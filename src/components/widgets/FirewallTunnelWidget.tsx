"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, ShieldCheck, Lock, ArrowRight, Play, Terminal, Database, CheckCircle, XCircle } from "lucide-react";

interface FirewallTunnelWidgetProps {
  config?: {
    stepFocus?: "analogy" | "stateful-rules" | "pivoting-tunnel";
  };
}

export function FirewallTunnelWidget({ config }: FirewallTunnelWidgetProps) {
  const [tunnelActive, setTunnelActive] = useState(
    config?.stepFocus === "pivoting-tunnel" ? false : false
  );
  const [testResult, setTestResult] = useState<"idle" | "testing" | "blocked" | "tunneled">("idle");

  const handleTestConnection = (useTunnel: boolean) => {
    setTestResult("testing");
    setTimeout(() => {
      if (useTunnel) {
        setTestResult("tunneled");
      } else {
        setTestResult("blocked");
      }
    }, 1000);
  };

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/60 p-5 shadow-sm">
      {/* Widget Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-zinc-200 dark:border-zinc-800/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Firewall ACL &amp; SSH Pivoting Tunnel
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Perimeter security filtering vs Encapsulated SSH tunnel
            </p>
          </div>
        </div>

        {/* Toggle Tunnel */}
        <button
          type="button"
          onClick={() => {
            const next = !tunnelActive;
            setTunnelActive(next);
            setTestResult("idle");
          }}
          className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all flex items-center gap-1.5 ${
            tunnelActive
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
              : "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300"
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          {tunnelActive ? "SSH Tunnel ACTIVE (Port 9000)" : "Enable SSH Tunnel"}
        </button>
      </div>

      {/* Firewall Rules Table */}
      <div className="mb-4">
        <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
          Perimeter Firewall Access Control List (ACL):
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 flex items-center justify-between">
            <div>
              <div className="font-mono font-bold text-zinc-800 dark:text-zinc-200">Port 443 (HTTPS)</div>
              <div className="text-[11px] text-zinc-500">Public Web</div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
              ALLOW
            </span>
          </div>

          <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 flex items-center justify-between">
            <div>
              <div className="font-mono font-bold text-zinc-800 dark:text-zinc-200">Port 22 (SSH)</div>
              <div className="text-[11px] text-zinc-500">Jumpbox DMZ</div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
              ALLOW
            </span>
          </div>

          <div className="p-2.5 rounded-xl border border-rose-500/30 bg-rose-50/40 dark:bg-rose-950/20 flex items-center justify-between">
            <div>
              <div className="font-mono font-bold text-zinc-800 dark:text-zinc-200">Port 3306 (MySQL)</div>
              <div className="text-[11px] text-zinc-500">Internal Database</div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold border border-rose-500/20">
              DROP / DENY
            </span>
          </div>
        </div>
      </div>

      {/* Network Path Diagram */}
      <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center text-center text-xs">
          {/* External Laptop */}
          <div className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/60">
            <div className="font-semibold text-zinc-900 dark:text-zinc-100">Auditor Laptop</div>
            <div className="font-mono text-[11px] text-zinc-500">
              {tunnelActive ? "localhost:9000 (Tunnel)" : "Direct probe :3306"}
            </div>
          </div>

          {/* Firewall Gate */}
          <div
            className={`p-3 rounded-lg border transition-all ${
              tunnelActive
                ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/50"
                : "bg-rose-50 dark:bg-rose-950/30 border-rose-500/50"
            }`}
          >
            <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center justify-center gap-1">
              <ShieldAlert className={`w-3.5 h-3.5 ${tunnelActive ? "text-emerald-500" : "text-rose-500"}`} />
              Firewall Gate
            </div>
            <div className="font-mono text-[11px] mt-0.5">
              {tunnelActive ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  Port 22 SSH (PERMITTED)
                </span>
              ) : (
                <span className="text-rose-600 dark:text-rose-400 font-bold">
                  Port 3306 (DROPPED)
                </span>
              )}
            </div>
          </div>

          {/* Jump Box */}
          <div className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/60">
            <div className="font-semibold text-zinc-900 dark:text-zinc-100">DMZ Jump Box</div>
            <div className="font-mono text-[11px] text-zinc-500">
              {tunnelActive ? "Unwraps & Pivots" : "Bypassed"}
            </div>
          </div>

          {/* Internal Database */}
          <div className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/60">
            <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center justify-center gap-1">
              <Database className="w-3.5 h-3.5 text-indigo-500" />
              Internal MySQL
            </div>
            <div className="font-mono text-[11px] text-zinc-500">10.0.5.25:3306</div>
          </div>
        </div>
      </div>

      {/* Execution Console & Test Action */}
      <div className="p-3.5 rounded-xl bg-zinc-900 text-zinc-100 font-mono text-xs border border-zinc-800">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="text-zinc-400 text-[11px]">Audit Terminal:</span>
          <button
            type="button"
            disabled={testResult === "testing"}
            onClick={() => handleTestConnection(tunnelActive)}
            className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-sans text-xs font-medium transition-all flex items-center gap-1.5"
          >
            <Play className="w-3 h-3" />
            {testResult === "testing" ? "Probing..." : "Test Database Connection"}
          </button>
        </div>

        {testResult === "idle" && (
          <div className="text-zinc-500">
            {tunnelActive
              ? "Tunnel established: ssh -L 9000:10.0.5.25:3306 user@jumpbox. Click 'Test Database Connection'."
              : "Click 'Test Database Connection' to send a raw packet to Port 3306."}
          </div>
        )}

        {testResult === "testing" && (
          <div className="text-amber-400">
            Transmitting TCP SYN packet toward 10.0.5.25:3306...
          </div>
        )}

        {testResult === "blocked" && (
          <div className="text-rose-400 flex items-start gap-1.5">
            <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong>CONNECTION TIMEOUT / FILTERED:</strong> The perimeter firewall inspected the packet destination port (3306) and dropped it according to the default-deny ACL!
            </div>
          </div>
        )}

        {testResult === "tunneled" && (
          <div className="text-emerald-400 flex items-start gap-1.5">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong>SUCCESS:</strong> Encapsulated MySQL query sent to local port 9000 → Encrypted via SSH (Port 22, Allowed by Firewall) → Unwrapped by DMZ Jump Box → Delivered to 10.0.5.25:3306!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
