"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Play, HelpCircle, CheckCircle2, Sparkles, RotateCcw, Info, ChevronRight, Copy, Check } from "lucide-react";

export interface Mission {
  id: string;
  levelRange: string;
  title: string;
  objective: string;
  suggestedCommands: string[];
  requiredCommands: string[];
}

export const MISSIONS: Mission[] = [
  {
    id: "mission-1",
    levelRange: "Levels 1 & 2",
    title: "Mission 1: Host & Gateway Discovery",
    objective: "Find your own IP address with 'ip addr' and ping your router ('ping 192.168.1.1') to see if it is awake.",
    suggestedCommands: ["ip addr", "ping 192.168.1.1"],
    requiredCommands: ["ip addr", "ping 192.168.1.1"],
  },
  {
    id: "mission-2",
    levelRange: "Levels 3 & 4",
    title: "Mission 2: Discover the Hidden Web Server",
    objective: "Run 'nmap 192.168.1.50' to discover which alternate port is running a secret development server.",
    suggestedCommands: ["nmap 192.168.1.50", "nmap -sS 192.168.1.50"],
    requiredCommands: ["nmap 192.168.1.50"],
  },
  {
    id: "mission-3",
    levelRange: "Level 5",
    title: "Mission 3: Spot the ARP Cache Poisoner",
    objective: "Inspect your local ARP table with 'arp -a' to identify a suspicious duplicate MAC address.",
    suggestedCommands: ["arp -a"],
    requiredCommands: ["arp -a"],
  },
  {
    id: "mission-4",
    levelRange: "Level 6",
    title: "Mission 4: Grab the Secret Flag with Curl",
    objective: "Send an HTTP GET request to the hidden port using 'curl http://192.168.1.50:8080' to extract the flag.",
    suggestedCommands: ["curl http://192.168.1.50:8080"],
    requiredCommands: ["curl http://192.168.1.50:8080"],
  },
];

interface CommandOutput {
  command: string;
  rawText: string;
  explanations?: {
    highlight: string;
    note: string;
  }[];
}

export function GuidedTerminal({ initialMissionId }: { initialMissionId?: string }) {
  const [activeMissionId, setActiveMissionId] = useState<string>(
    initialMissionId || "mission-1"
  );
  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      command: "welcome",
      rawText: "HackNet Zero Interactive Terminal [v1.0.0]\nType a command below or click a 'Command Block' pill above to run.\nType 'help' for available commands.",
    },
  ]);
  const [expandedExplanations, setExpandedExplanations] = useState<Record<number, boolean>>({});
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  const activeMission = MISSIONS.find((m) => m.id === activeMissionId) || MISSIONS[0];

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const executeCommand = (cmdToRun: string) => {
    const trimmed = cmdToRun.trim().toLowerCase();
    if (!trimmed) return;

    let outputEntry: CommandOutput;

    if (trimmed === "clear") {
      setHistory([]);
      setInputVal("");
      return;
    }

    if (trimmed === "help") {
      outputEntry = {
        command: "help",
        rawText: `Available commands in this lab:\n  ip addr                     - List local network interfaces, IPs & MACs\n  ping <ip>                   - Send ICMP echo requests to verify connectivity\n  nmap 192.168.1.50           - Scan open TCP doors and listening services\n  arp -a                      - Inspect local ARP cache for IP-to-MAC pairs\n  curl http://192.168.1.50:8080 - Query the web service to retrieve HTML/flag\n  clear                       - Clear terminal screen`,
      };
    } else if (trimmed === "ip addr" || trimmed === "ip a" || trimmed === "ifconfig") {
      outputEntry = {
        command: cmdToRun,
        rawText: `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN\n    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00\n    inet 127.0.0.1/8 scope host lo\n2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP\n    link/ether 3a:89:c4:12:f0:2e brd ff:ff:ff:ff:ff:ff\n    inet 192.168.1.15/24 brd 192.168.1.255 scope global dynamic eth0`,
        explanations: [
          {
            highlight: "link/ether 3a:89:c4:12:f0:2e",
            note: "Hardware MAC Address: The permanent hardware fingerprint etched into your network card.",
          },
          {
            highlight: "inet 192.168.1.15/24",
            note: "Private IP Address: Your local address on this subnet (192.168.1.15). The /24 means there are 254 addresses in this room.",
          },
        ],
      };
      markMissionComplete("mission-1", "ip addr");
    } else if (trimmed.startsWith("ping")) {
      outputEntry = {
        command: cmdToRun,
        rawText: `PING 192.168.1.1 (192.168.1.1) 56(84) bytes of data.\n64 bytes from 192.168.1.1: icmp_seq=1 ttl=64 time=1.24 ms\n64 bytes from 192.168.1.1: icmp_seq=2 ttl=64 time=1.18 ms\n64 bytes from 192.168.1.1: icmp_seq=3 ttl=64 time=1.31 ms\n--- 192.168.1.1 ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2003ms`,
        explanations: [
          {
            highlight: "64 bytes from 192.168.1.1",
            note: "Echo Reply: The router heard your ICMP probe and verified that Door 192.168.1.1 is alive and reachable!",
          },
          {
            highlight: "0% packet loss",
            note: "Healthy Link: All 3 packets arrived intact with zero lost envelopes.",
          },
        ],
      };
      markMissionComplete("mission-1", "ping");
    } else if (trimmed.startsWith("nmap")) {
      outputEntry = {
        command: cmdToRun,
        rawText: `Starting Nmap 7.94 ( https://nmap.org ) at 2026-10-31 11:45 UTC\nNmap scan report for 192.168.1.50\nHost is up (0.0021s latency).\nNot shown: 996 closed tcp ports (reset)\nPORT     STATE SERVICE\n22/tcp   open  ssh\n80/tcp   open  http\n443/tcp  open  https\n8080/tcp open  http-proxy\n\nNmap done: 1 IP address (1 host up) scanned in 0.48 seconds`,
        explanations: [
          {
            highlight: "22/tcp   open  ssh",
            note: "SSH Admin: Remote secure terminal listener on standard port 22.",
          },
          {
            highlight: "8080/tcp open  http-proxy",
            note: "HIDDEN DEV SERVER FOUND! An internal development web server is listening on port 8080.",
          },
        ],
      };
      markMissionComplete("mission-2", "nmap");
    } else if (trimmed === "arp -a" || trimmed === "arp") {
      outputEntry = {
        command: cmdToRun,
        rawText: `? (192.168.1.1) at de:ad:be:ef:66:66 [ether] on eth0\n? (192.168.1.44) at f8:e0:79:33:11:aa [ether] on eth0\n? (192.168.1.99) at de:ad:be:ef:66:66 [ether] on eth0`,
        explanations: [
          {
            highlight: "192.168.1.1) at de:ad:be:ef:66:66",
            note: "Gateway mapping claimed by MAC de:ad:be:ef:66:66.",
          },
          {
            highlight: "192.168.1.99) at de:ad:be:ef:66:66",
            note: "SUSPICIOUS DUPLICATE MAC! Workstation 192.168.1.99 claims the exact same MAC as the router! Someone has poisoned your ARP cache with a Man-in-the-Middle attack.",
          },
        ],
      };
      markMissionComplete("mission-3", "arp -a");
    } else if (trimmed.includes("curl") && trimmed.includes("8080")) {
      outputEntry = {
        command: cmdToRun,
        rawText: `HTTP/1.1 200 OK\nServer: Internal-Dev-Server/1.0\nContent-Type: text/html; charset=utf-8\n\n<!DOCTYPE html>\n<html>\n<body>\n  <h1>Internal Engineering Portal</h1>\n  <p>Congratulations ethical hacker! Here is your proof of concept flag:</p>\n  <pre>FLAG{n3tw0rk_m4st3r_z3r0_t0_h3r0}</pre>\n</body>\n</html>`,
        explanations: [
          {
            highlight: "HTTP/1.1 200 OK",
            note: "Success Code 200: Server answered your request without requiring authentication.",
          },
          {
            highlight: "FLAG{n3tw0rk_m4st3r_z3r0_t0_h3r0}",
            note: "MISSION ACCOMPLISHED! You discovered the hidden port and captured the secret flag.",
          },
        ],
      };
      markMissionComplete("mission-4", "curl");
    } else {
      outputEntry = {
        command: cmdToRun,
        rawText: `command not found: ${cmdToRun}\nTip: Click one of the 'Command Blocks' above or type 'help' for commands.`,
      };
    }

    setHistory((prev) => [...prev, outputEntry]);
    setInputVal("");
  };

  const markMissionComplete = (missionId: string, cmdKeyword: string) => {
    if (!completedMissions.includes(missionId)) {
      setCompletedMissions((prev) => [...prev, missionId]);
    }
  };

  const toggleExplain = (idx: number) => {
    setExpandedExplanations((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 p-5 sm:p-6 shadow-sm">
      {/* Top Header & Mission Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-zinc-200 dark:border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 flex items-center justify-center">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Guided Command Builder &amp; Terminal
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Practice real ethical hacking commands with zero memorization stress
            </p>
          </div>
        </div>

        {/* Mission Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60">
          {MISSIONS.map((m, idx) => {
            const isDone = completedMissions.includes(m.id);
            const isActive = m.id === activeMissionId;

            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setActiveMissionId(m.id)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                  isActive
                    ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm font-semibold"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                <span>M{idx + 1}</span>
                {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Mission Objective Box */}
      <div className="mb-4 p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/50 flex items-start justify-between gap-3 text-xs">
        <div>
          <div className="flex items-center gap-1.5 font-bold text-indigo-700 dark:text-indigo-400 mb-0.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{activeMission.title} ({activeMission.levelRange})</span>
          </div>
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {activeMission.objective}
          </p>
        </div>

        {completedMissions.includes(activeMission.id) && (
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/20 shrink-0">
            COMPLETED ✓
          </span>
        )}
      </div>

      {/* Command Blocks (Clickable Pills) */}
      <div className="mb-4">
        <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2 font-semibold flex items-center justify-between">
          <span>Click a Command Block to Execute:</span>
          <span className="text-[10px] lowercase text-zinc-400 font-sans">or type freely below</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {activeMission.suggestedCommands.map((cmd) => (
            <button
              key={cmd}
              type="button"
              onClick={() => executeCommand(cmd)}
              className="px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800/80 bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:border-indigo-400 transition-all flex items-center gap-1.5 shadow-sm group"
            >
              <Play className="w-3 h-3 text-indigo-500 group-hover:scale-110 transition-transform" />
              <span>{cmd}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => executeCommand("help")}
            className="px-2.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 font-mono text-xs hover:text-zinc-800 transition-colors"
          >
            help
          </button>
        </div>
      </div>

      {/* Terminal Screen Container */}
      <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-4 font-mono text-xs text-zinc-100 shadow-xl min-h-[260px] max-h-[420px] overflow-y-auto flex flex-col justify-between">
        {/* Terminal Output Stream */}
        <div className="space-y-4">
          {history.map((item, idx) => {
            const hasExplanations = item.explanations && item.explanations.length > 0;
            const isExplained = expandedExplanations[idx];

            return (
              <div key={idx} className="space-y-1.5">
                {item.command !== "welcome" && (
                  <div className="flex items-center justify-between text-zinc-400 text-[11px] border-b border-zinc-900 pb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-400 font-semibold">ethical-hacker@hacknet:~$</span>
                      <span className="text-white font-bold">{item.command}</span>
                    </div>

                    {/* "Explain This Output" Button */}
                    {hasExplanations && (
                      <button
                        type="button"
                        onClick={() => toggleExplain(idx)}
                        className={`px-2 py-0.5 rounded text-[10px] font-sans font-medium transition-all flex items-center gap-1 ${
                          isExplained
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                            : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700"
                        }`}
                      >
                        <Info className="w-3 h-3 text-amber-400" />
                        <span>{isExplained ? "Hide Explanation" : "Explain This Output"}</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Raw Output */}
                <pre className="text-zinc-300 whitespace-pre-wrap leading-relaxed font-mono text-xs overflow-x-auto">
                  {item.rawText}
                </pre>

                {/* Friendly Callout Bubbles when "Explain This Output" is enabled */}
                <AnimatePresence>
                  {isExplained && item.explanations && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200 space-y-2 font-sans text-xs"
                    >
                      <div className="font-bold text-[11px] uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-mono">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Plain-English Breakdown:</span>
                      </div>
                      {item.explanations.map((exp, eIdx) => (
                        <div key={eIdx} className="space-y-0.5">
                          <code className="px-1.5 py-0.5 rounded bg-zinc-900 border border-amber-500/30 text-amber-300 font-mono text-[11px]">
                            {exp.highlight}
                          </code>
                          <p className="text-zinc-300 text-[11px] leading-relaxed pl-1 pt-0.5">
                            ↳ {exp.note}
                          </p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
          <div ref={terminalEndRef} />
        </div>

        {/* Terminal Input Line */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            executeCommand(inputVal);
          }}
          className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center gap-2"
        >
          <span className="text-emerald-400 font-bold">ethical-hacker@hacknet:~$</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type command or click a block above..."
            className="flex-1 bg-transparent border-none text-zinc-100 font-mono text-xs focus:outline-none placeholder-zinc-600"
          />
          <button
            type="submit"
            className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
            title="Execute"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
