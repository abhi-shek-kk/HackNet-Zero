"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgressStore } from "@/store/useProgressStore";
import {
  BookMarked,
  X,
  Lock,
  CheckCircle2,
  Copy,
  Check,
  Search,
  Sparkles,
  Terminal,
  Shield,
  ExternalLink
} from "lucide-react";

interface ReferenceItem {
  level: number;
  category: "command" | "concept";
  title: string;
  syntax?: string;
  description: string;
  example?: string;
}

const REFERENCE_DATA: ReferenceItem[] = [
  // Level 1
  {
    level: 1,
    category: "command",
    title: "ip addr",
    syntax: "ip addr",
    description: "Displays all network interfaces, assigned IP addresses, and hardware MAC addresses.",
    example: "ip addr show dev eth0",
  },
  {
    level: 1,
    category: "command",
    title: "ping",
    syntax: "ping <ip-or-host>",
    description: "Sends ICMP echo requests to verify network connectivity and measure round-trip latency.",
    example: "ping 192.168.1.1",
  },
  {
    level: 1,
    category: "concept",
    title: "IP vs. MAC Address",
    description: "IP is your logical location (like a street address). MAC is your permanent hardware identity (like an ID fingerprint).",
  },
  {
    level: 1,
    category: "concept",
    title: "Network Packet",
    description: "A small chunk of digital data wrapped in Layer 2 (MAC) and Layer 3 (IP) headers so routers can steer it.",
  },

  // Level 2
  {
    level: 2,
    category: "command",
    title: "ip route",
    syntax: "ip route",
    description: "Shows your computer's routing table, including the Default Gateway router address.",
    example: "default via 192.168.1.1 dev eth0",
  },
  {
    level: 2,
    category: "concept",
    title: "NAT (Network Address Translation)",
    description: "Allows an entire home network with private IPs (192.168.1.x) to share a single public internet address.",
  },
  {
    level: 2,
    category: "concept",
    title: "Public vs. Private IP",
    description: "Private IPs (RFC 1918) only work inside your Wi-Fi building. Public IPs are globally routable across the web.",
  },

  // Level 3
  {
    level: 3,
    category: "command",
    title: "nmap",
    syntax: "nmap <target-ip>",
    description: "Scans target IP to discover which ports (doors) are open and running active software services.",
    example: "nmap 192.168.1.50",
  },
  {
    level: 3,
    category: "command",
    title: "ss / netstat",
    syntax: "ss -tulpn",
    description: "Lists all local sockets currently listening for incoming TCP and UDP connections.",
    example: "ss -tulpn | grep :80",
  },
  {
    level: 3,
    category: "concept",
    title: "Port Numbers",
    description: "Virtual doors (0-65535) on a computer. 80 is HTTP, 443 is HTTPS, 22 is SSH, and 3306 is MySQL.",
  },

  // Level 4
  {
    level: 4,
    category: "command",
    title: "nmap -sS (SYN Stealth)",
    syntax: "nmap -sS <target-ip>",
    description: "Half-open SYN stealth scan: checks if a port is open and sends RST before logging a full connection.",
    example: "sudo nmap -sS 192.168.1.50",
  },
  {
    level: 4,
    category: "concept",
    title: "TCP 3-Way Handshake",
    description: "The 3-step greeting: SYN (hello?) → SYN-ACK (heard you!) → ACK (ready!) establishing a reliable conversation.",
  },
  {
    level: 4,
    category: "concept",
    title: "TCP vs. UDP",
    description: "TCP guarantees delivery with acknowledgments; UDP streams immediately without receipts for speed.",
  },

  // Level 5
  {
    level: 5,
    category: "command",
    title: "arp -a",
    syntax: "arp -a",
    description: "Displays your computer's cached IP-to-MAC resolution table for the local Wi-Fi subnet.",
    example: "arp -a",
  },
  {
    level: 5,
    category: "command",
    title: "dig / nslookup",
    syntax: "dig <domain>",
    description: "Queries recursive DNS servers to resolve human domain names into numerical IP addresses.",
    example: "dig example.com +short",
  },
  {
    level: 5,
    category: "concept",
    title: "ARP Cache Poisoning (MITM)",
    description: "Sending fake ARP replies to trick two computers into routing all traffic through your machine.",
  },

  // Level 6
  {
    level: 6,
    category: "command",
    title: "curl",
    syntax: "curl <url>",
    description: "Command-line web client to transfer data and inspect HTTP responses directly in the terminal.",
    example: "curl http://192.168.1.50:8080",
  },
  {
    level: 6,
    category: "command",
    title: "ssh -L (Local Tunnel)",
    syntax: "ssh -L <local-port>:<dest-ip>:<dest-port> user@jumpbox",
    description: "Encapsulates restricted traffic inside an allowed SSH connection to pivot past firewalls.",
    example: "ssh -L 9000:10.0.5.25:3306 user@jumpbox",
  },
  {
    level: 6,
    category: "concept",
    title: "Stateful Firewall & Pivoting",
    description: "Firewalls filter packets by IP/port rules. Ethical hackers pivot using authorized tunnels to evaluate internal hosts.",
  },
];

interface PocketReferenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PocketReferenceDrawer({ isOpen, onClose }: PocketReferenceDrawerProps) {
  const { unlockedLevels } = useProgressStore();
  const [filter, setFilter] = useState<"all" | "command" | "concept">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const highestUnlocked = Math.max(...unlockedLevels, 1);

  const filteredItems = REFERENCE_DATA.filter((item) => {
    const matchesCategory = filter === "all" || item.category === filter;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.syntax && item.syntax.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-zinc-950/60 backdrop-blur-sm flex justify-end">
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="w-full max-w-md h-full bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col"
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 flex items-center justify-center">
                  <BookMarked className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    Hacker&apos;s Pocket Reference
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Unlocks automatically as you progress (Level {highestUnlocked} active)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search unlocked commands or concepts..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className={`text-xs px-3 py-1 rounded-lg font-medium transition-all ${
                    filter === "all"
                      ? "bg-indigo-600 text-white shadow-sm font-semibold"
                      : "bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  All Unlocked
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("command")}
                  className={`text-xs px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                    filter === "command"
                      ? "bg-indigo-600 text-white shadow-sm font-semibold"
                      : "bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  <Terminal className="w-3 h-3" />
                  Commands
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("concept")}
                  className={`text-xs px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                    filter === "concept"
                      ? "bg-indigo-600 text-white shadow-sm font-semibold"
                      : "bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  Concepts
                </button>
              </div>
            </div>

            {/* Reference Items List */}
            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              {filteredItems.map((item, idx) => {
                const isUnlocked = item.level <= highestUnlocked;

                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isUnlocked
                        ? "bg-white dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700/80 shadow-sm"
                        : "bg-zinc-50/50 dark:bg-zinc-900/30 border-dashed border-zinc-200 dark:border-zinc-800 opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        {item.category === "command" ? (
                          <Terminal className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        )}
                        <span className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 font-mono">
                          {item.title}
                        </span>
                      </div>

                      {isUnlocked ? (
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                          Level {item.level}
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-500 font-medium flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />
                          Unlocks at Level {item.level}
                        </span>
                      )}
                    </div>

                    {isUnlocked ? (
                      <div className="space-y-2">
                        <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                          {item.description}
                        </p>

                        {item.syntax && (
                          <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900 text-zinc-100 font-mono text-[11px] border border-zinc-800">
                            <span>{item.syntax}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(item.syntax!)}
                              className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800 transition-colors"
                              title="Copy command"
                            >
                              {copiedText === item.syntax ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-[11px] text-zinc-400 italic">
                        Complete Level {item.level} lessons to reveal this reference guide and command syntax.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
