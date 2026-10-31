export interface GlossaryEntry {
  term: string;
  aliases: string[];
  explanation: string;
  analogy: string;
  category: "Foundations" | "Hardware & Routing" | "Protocols" | "Attacks & Defense";
}

export const GLOSSARY: Record<string, GlossaryEntry> = {
  "ip-address": {
    term: "IP Address",
    aliases: ["ip address", "ip addresses", "ip"],
    explanation: "A unique numerical label assigned to every device connected to a network so information can find where to go.",
    analogy: "Like your physical home street address where postal mail gets delivered.",
    category: "Foundations",
  },
  "mac-address": {
    term: "MAC Address",
    aliases: ["mac address", "mac addresses", "mac"],
    explanation: "A permanent hardware fingerprint etched into your network card at the factory that identifies your specific device locally.",
    analogy: "Like your government-issued ID card or fingerprint—unique to your physical hardware.",
    category: "Foundations",
  },
  "packet": {
    term: "Packet",
    aliases: ["packet", "packets", "network packet"],
    explanation: "A small chunk of digital data wrapped with source and destination address headers so it can travel across a network.",
    analogy: "Like an envelope with a stamp, destination address, and a written message folded inside.",
    category: "Foundations",
  },
  "payload": {
    term: "Payload",
    aliases: ["payload", "payloads"],
    explanation: "The actual raw content or secret message being delivered inside a network packet, excluding the routing headers.",
    analogy: "The letter inside the mailing envelope, separate from the addresses written on the outside.",
    category: "Foundations",
  },
  "router": {
    term: "Router",
    aliases: ["router", "routers", "home router"],
    explanation: "A smart networking device that directs traffic between different networks, like bridging your home Wi-Fi to the global internet.",
    analogy: "Like the central sorting postal hub that routes packages between your local city and other countries.",
    category: "Hardware & Routing",
  },
  "switch": {
    term: "Switch",
    aliases: ["switch", "network switch"],
    explanation: "A local networking device that connects multiple computers in the same room and passes data directly by hardware MAC address.",
    analogy: "Like an intercom in an apartment building that connects room to room without calling outside.",
    category: "Hardware & Routing",
  },
  "nat": {
    term: "NAT (Network Address Translation)",
    aliases: ["nat", "network address translation"],
    explanation: "A router technique that allows dozens of home devices with private addresses to share a single public internet address.",
    analogy: "Like an office building reception desk that receives all company mail and distributes it to private cubicles.",
    category: "Hardware & Routing",
  },
  "private-ip": {
    term: "Private IP",
    aliases: ["private ip", "private ips", "private ip address"],
    explanation: "An internal IP address (like 192.168.1.15) usable only within your local Wi-Fi or office network.",
    analogy: "Like an internal apartment room number: meaningful inside your building, but meaningless on a public street.",
    category: "Hardware & Routing",
  },
  "public-ip": {
    term: "Public IP",
    aliases: ["public ip", "public ips", "public ip address"],
    explanation: "A globally unique internet address that anyone across the worldwide web can route traffic to.",
    analogy: "Like the building street address listed on Google Maps for the entire world to see.",
    category: "Hardware & Routing",
  },
  "dhcp": {
    term: "DHCP",
    aliases: ["dhcp", "dhcp server"],
    explanation: "The automatic protocol that hands out temporary IP addresses and Wi-Fi settings whenever your phone or laptop connects.",
    analogy: "Like a hotel concierge handing you a room key card the moment you check in.",
    category: "Hardware & Routing",
  },
  "port": {
    term: "Port",
    aliases: ["port", "ports", "port number", "port numbers"],
    explanation: "A virtual numbered door (from 0 to 65,535) on a computer that directs incoming data to the specific application waiting for it.",
    analogy: "Like specific room numbers or dock doors in a warehouse: door 80 is the store, door 22 is the secure back office.",
    category: "Protocols",
  },
  "port-scanning": {
    term: "Port Scanning",
    aliases: ["port scanning", "port scan", "port scanner"],
    explanation: "The reconnaissance practice of systematically probing every door on a server to discover which applications are open and listening.",
    analogy: "Like walking down a hotel hallway and checking each doorknob to see which rooms are unlocked.",
    category: "Attacks & Defense",
  },
  "tcp": {
    term: "TCP (Transmission Control Protocol)",
    aliases: ["tcp", "transmission control protocol"],
    explanation: "A reliable communication rulebook that verifies every packet arrived intact and in order before confirming delivery.",
    analogy: "Like a registered phone call where both sides confirm they can hear each other before exchanging sensitive information.",
    category: "Protocols",
  },
  "udp": {
    term: "UDP (User Datagram Protocol)",
    aliases: ["udp", "user datagram protocol"],
    explanation: "A fast, lightweight protocol that streams data immediately without checking for lost packets or establishing handshakes.",
    analogy: "Like a live radio broadcast or shouting through a megaphone: fast and real-time, but without delivery receipts.",
    category: "Protocols",
  },
  "3-way-handshake": {
    term: "3-Way Handshake",
    aliases: ["3-way handshake", "three-way handshake", "tcp handshake"],
    explanation: "The 3-step TCP greeting (SYN, SYN-ACK, ACK) used to establish a reliable synchronized connection before data exchange.",
    analogy: "Saying 'Hello, can you hear me?', receiving 'Yes I can, can you hear me?', and answering 'Yes! Let’s begin!'",
    category: "Protocols",
  },
  "syn": {
    term: "SYN (Synchronize)",
    aliases: ["syn", "syn packet"],
    explanation: "The first packet sent in a TCP connection, asking the target computer to synchronize sequence numbers and start talking.",
    analogy: "Knocking on someone’s door and saying 'Hello! Want to talk?'",
    category: "Protocols",
  },
  "ack": {
    term: "ACK (Acknowledge)",
    aliases: ["ack", "ack packet", "syn-ack"],
    explanation: "A confirmation packet letting the sender know that their previous transmission was received loud and clear.",
    analogy: "Nodding your head and saying 'Message received!'",
    category: "Protocols",
  },
  "syn-scan": {
    term: "SYN Stealth Scan",
    aliases: ["syn scan", "syn stealth scan", "half-open scan"],
    explanation: "An ethical hacking scanning technique that initiates a TCP handshake but hangs up with a RST packet before completing, leaving no trace in standard logs.",
    analogy: "Knocking on a door, noticing someone unlocking it, and darting away before they write your name in the visitor guestbook.",
    category: "Attacks & Defense",
  },
  "dns": {
    term: "DNS (Domain Name System)",
    aliases: ["dns", "domain name system"],
    explanation: "The internet's phonebook that translates human-friendly names like 'google.com' into machine-friendly IP addresses.",
    analogy: "Like searching for 'Mom' in your contacts list instead of memorizing her 10-digit phone number.",
    category: "Protocols",
  },
  "arp": {
    term: "ARP (Address Resolution Protocol)",
    aliases: ["arp", "address resolution protocol"],
    explanation: "A local protocol that asks 'Who on this Wi-Fi network owns this IP address?' and maps it to their physical MAC address.",
    analogy: "Like standing up in a crowded room and shouting 'Who here is Alice?' so Alice can raise her hand.",
    category: "Protocols",
  },
  "mitm": {
    term: "Man-in-the-Middle (MITM)",
    aliases: ["mitm", "man-in-the-middle", "man-in-the-middle attack", "arp poisoning", "arp spoofing"],
    explanation: "A cyber attack where an eavesdropper tricks two parties into routing their communications through the attacker's machine.",
    analogy: "A rogue postal carrier who quietly intercepts all your letters, photocopies them, and delivers them without you noticing.",
    category: "Attacks & Defense",
  },
  "firewall": {
    term: "Firewall",
    aliases: ["firewall", "firewalls"],
    explanation: "A network security shield that inspects incoming and outgoing traffic and blocks whatever violates predefined security rules.",
    analogy: "A vigilant bouncer outside a nightclub checking IDs and dress codes before letting anyone inside.",
    category: "Attacks & Defense",
  },
  "port-forwarding": {
    term: "Port Forwarding",
    aliases: ["port forwarding"],
    explanation: "A router rule that routes traffic arriving on an external public port directly to an internal computer's private port.",
    analogy: "Telling the building receptionist: 'Whenever a package arrives labeled Suite 80, route it straight to Alice on Floor 3.'",
    category: "Hardware & Routing",
  },
  "ssh-tunnel": {
    term: "SSH Tunneling / Pivoting",
    aliases: ["ssh tunnel", "ssh tunneling", "pivoting", "tunneling"],
    explanation: "Encapsulating network traffic inside an encrypted SSH connection to safely pass through restrictive firewalls to reach internal machines.",
    analogy: "Digging a secure underground private tunnel directly under a locked security fence.",
    category: "Attacks & Defense",
  },
  "wireshark": {
    term: "Wireshark",
    aliases: ["wireshark", "packet sniffer"],
    explanation: "The gold-standard packet analyzer used by security analysts to inspect real-time network traffic down to individual bytes.",
    analogy: "A digital x-ray machine that shows you every letter, envelope, and stamp travelling through the postal conveyor belt.",
    category: "Attacks & Defense",
  },
  "nmap": {
    term: "Nmap",
    aliases: ["nmap", "network mapper"],
    explanation: "The world's premier open-source network scanner used to discover live hosts, open ports, and operating system fingerprints.",
    analogy: "A high-tech digital radar map that scans an entire neighborhood to detect every house, door, and lock type.",
    category: "Attacks & Defense",
  },
};

export function findGlossaryTerm(word: string): GlossaryEntry | undefined {
  const normalized = word.toLowerCase().trim();
  for (const entry of Object.values(GLOSSARY)) {
    if (entry.term.toLowerCase() === normalized || entry.aliases.includes(normalized)) {
      return entry;
    }
  }
  return undefined;
}
