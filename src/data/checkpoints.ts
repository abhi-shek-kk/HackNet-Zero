export interface ScenarioQuestion {
  id: string;
  scenario: string;
  question: string;
  options: {
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface LevelCheckpoint {
  levelNumber: number;
  levelTitle: string;
  questions: [ScenarioQuestion, ScenarioQuestion];
}

export const LEVEL_CHECKPOINTS: Record<number, LevelCheckpoint> = {
  1: {
    levelNumber: 1,
    levelTitle: "How Computers Talk",
    questions: [
      {
        id: "l1-q1",
        scenario: "You are investigating network traffic on an office floor. You notice that every 15 minutes, a laptop's IP address changes from 192.168.1.45 to 192.168.1.92, but its MAC address remains 00:14:22:01:23:45.",
        question: "Why did the IP address change while the MAC address stayed identical?",
        options: [
          {
            text: "The DHCP server handed out a new temporary IP lease, but the network card hardware fingerprint never changes.",
            isCorrect: true,
            explanation: "Correct! IP addresses are logical locations assigned dynamically by DHCP, whereas MAC addresses are permanent physical hardware identifiers burned into the network card."
          },
          {
            text: "A hacker physically swapped the computer's CPU while the user was away.",
            isCorrect: false,
            explanation: "Hardware MAC addresses remain on the network card; changing an IP is a routine software networking operation."
          },
          {
            text: "MAC addresses automatically randomize every 15 minutes.",
            isCorrect: false,
            explanation: "Hardware MAC addresses are factory burned unless intentionally spoofed by software."
          },
          {
            text: "The laptop disconnected from the internet and became a router.",
            isCorrect: false,
            explanation: "Re-leasing an IP address does not turn a client into a router."
          }
        ]
      },
      {
        id: "l1-q2",
        scenario: "During an audit at an airport cafe, you find the guest Wi-Fi portal only allows devices that purchased a 1-hour ticket. The portal remembers authorized devices by their MAC address.",
        question: "From an ethical hacker's perspective, why is MAC filtering considered a weak security control?",
        options: [
          {
            text: "Because MAC addresses are broadcast in clear text and can be easily spoofed in the operating system's software settings.",
            isCorrect: true,
            explanation: "Spot on! Any network sniffer can observe authorized MAC addresses floating through the air, and any modern OS allows users to spoof their outgoing MAC address with one command."
          },
          {
            text: "Because routers cannot read MAC addresses.",
            isCorrect: false,
            explanation: "Routers and switches always read Layer 2 MAC addresses to route frames on local links."
          },
          {
            text: "Because MAC addresses only work on Bluetooth devices.",
            isCorrect: false,
            explanation: "Every Ethernet and Wi-Fi interface has a MAC address."
          },
          {
            text: "Because MAC addresses expire after 24 hours.",
            isCorrect: false,
            explanation: "Hardware MAC addresses never expire."
          }
        ]
      }
    ]
  },
  2: {
    levelNumber: 2,
    levelTitle: "Local Networks & Routers",
    questions: [
      {
        id: "l2-q1",
        scenario: "Alice is at home on Wi-Fi with IP 192.168.1.20. Bob is in another city on his home Wi-Fi, also with IP 192.168.1.20. Both are streaming video simultaneously without any collision.",
        question: "How can both computers have the exact same IP address at the same time?",
        options: [
          {
            text: "192.168.1.x is a private IP range (RFC 1918) isolated within each home; each home router translates traffic to a unique Public IP via NAT.",
            isCorrect: true,
            explanation: "Exactly! Private IP ranges are intended to be reused across millions of separate private networks. NAT on the router translates internal addresses to distinct public internet addresses."
          },
          {
            text: "Internet cables take turns carrying Alice's and Bob's packets every 2 seconds.",
            isCorrect: false,
            explanation: "Packet networks do not time-slice internet cables between arbitrary households."
          },
          {
            text: "Alice and Bob are actually connected to the same computer.",
            isCorrect: false,
            explanation: "They are in different cities using independent local networks."
          },
          {
            text: "It is an illegal IP conflict that will crash the internet within minutes.",
            isCorrect: false,
            explanation: "Private IP reuse is a standard internet specification that preserves IPv4 address space."
          }
        ]
      },
      {
        id: "l2-q2",
        scenario: "You plug your audit laptop into an office wall jack and run a local network sweep (e.g., nmap -sn 192.168.1.0/24). You discover an active device at 192.168.1.88 labeled 'Security-Cam-Admin' with default credentials.",
        question: "Why was this camera easily discoverable on the network?",
        options: [
          {
            text: "All devices plugged into the same local subnet share a broadcast domain where ARP and ICMP requests reach all hosts.",
            isCorrect: true,
            explanation: "Right! On a local subnet, broadcast traffic is seen by all connected nodes unless network segmentation (VLANs) or client isolation is configured."
          },
          {
            text: "The camera sends emails to all laptops on Wi-Fi automatically.",
            isCorrect: false,
            explanation: "Cameras do not email local laptops; discovery occurs via low-level network broadcast protocols."
          },
          {
            text: "The camera is broadcasting its Wi-Fi password over satellite.",
            isCorrect: false,
            explanation: "Discovery was performed over the local wired/wireless subnet, not satellites."
          },
          {
            text: "IP addresses above .80 are public and visible worldwide.",
            isCorrect: false,
            explanation: "All 192.168.1.x addresses are private, regardless of the host number."
          }
        ]
      }
    ]
  },
  3: {
    levelNumber: 3,
    levelTitle: "Ports & Doors",
    questions: [
      {
        id: "l3-q1",
        scenario: "You run an Nmap port scan against an internal server (192.168.1.50). The scan output shows: 'Port 80/tcp open' and 'Port 8080/tcp open'.",
        question: "What does this tell an ethical hacker about the server?",
        options: [
          {
            text: "Two separate software services (or two web servers) are actively listening for incoming connections on those specific ports.",
            isCorrect: true,
            explanation: "Correct! Each port number routes to a listening socket bound by a software daemon. Port 80 is likely the production web server, and 8080 is often an alternate development or administrative portal."
          },
          {
            text: "The server has two physical network cables plugged in.",
            isCorrect: false,
            explanation: "Ports are virtual software doors managed by the operating system, not physical network cables."
          },
          {
            text: "Port 8080 is an error that means the router is about to overheat.",
            isCorrect: false,
            explanation: "8080 is a standard registered port commonly used for alternate HTTP services or proxies."
          },
          {
            text: "Only 2 people in the company can browse the web.",
            isCorrect: false,
            explanation: "Server ports define which services are listening, not how many clients can connect."
          }
        ]
      },
      {
        id: "l3-q2",
        scenario: "When scanning Port 21 (FTP), the server responds with a TCP RST (Reset) packet immediately.",
        question: "What does a RST packet indicate about Port 21?",
        options: [
          {
            text: "The port is CLOSED: the machine is alive, but no software process is currently listening behind Door 21.",
            isCorrect: true,
            explanation: "Spot on! When an operating system receives a connection request for a port that has no listening daemon, RFC specifications dictate that it returns a RST (Reset) to politely close the attempt."
          },
          {
            text: "The port is OPEN and waiting for a password.",
            isCorrect: false,
            explanation: "If it were open, the host would return a SYN-ACK, not a RST."
          },
          {
            text: "A firewall completely blocked your packet from reaching the machine.",
            isCorrect: false,
            explanation: "If a firewall silently dropped it, you would receive no response at all (FILTERED)."
          },
          {
            text: "Your network cable was unplugged.",
            isCorrect: false,
            explanation: "Receiving a RST packet proves the target machine is online and responding."
          }
        ]
      }
    ]
  },
  4: {
    levelNumber: 4,
    levelTitle: "The Rules of Conversation (TCP & UDP)",
    questions: [
      {
        id: "l4-q1",
        scenario: "You run an Nmap scan with the flag '-sS' (SYN Stealth Scan) against Port 22. The target replies with SYN-ACK, and your scanner immediately fires back a RST packet.",
        question: "Why did your scanner send a RST packet instead of sending the final ACK?",
        options: [
          {
            text: "To abort the connection before it completes, verifying the port is open while preventing application daemons from logging a full session.",
            isCorrect: true,
            explanation: "Bingo! A SYN-ACK proves the port is open. Sending RST kills the handshake in a 'half-open' state, meaning application logs (like SSH auth logs) rarely record a completed connection."
          },
          {
            text: "Because the scanner crashed due to a memory overload.",
            isCorrect: false,
            explanation: "This is intentional behavior designed into SYN stealth scans."
          },
          {
            text: "Because Port 22 rejected your encryption key.",
            isCorrect: false,
            explanation: "Encryption keys are exchanged much later after the TCP handshake is finished."
          },
          {
            text: "To change the protocol from TCP to UDP.",
            isCorrect: false,
            explanation: "RST is a TCP control flag that terminates an active TCP state."
          }
        ]
      },
      {
        id: "l4-q2",
        scenario: "An engineer is designing a real-time multiplayer first-person shooter game and must choose between TCP and UDP for transmitting continuous player position coordinates (X, Y, Z).",
        question: "Why is UDP the superior protocol choice for live player movement?",
        options: [
          {
            text: "If a packet is lost, UDP doesn't waste time retransmitting old data—the game simply renders the newest incoming position.",
            isCorrect: true,
            explanation: "Exactly! TCP guarantees delivery by pausing and retransmitting lost packets. In a fast-paced game, a player position from 200ms ago is obsolete; you only care about where the player is right now."
          },
          {
            text: "UDP is encrypted with military-grade ciphers by default.",
            isCorrect: false,
            explanation: "UDP does not provide built-in encryption."
          },
          {
            text: "TCP cannot carry numbers, only letters.",
            isCorrect: false,
            explanation: "Both TCP and UDP transport raw binary bytes."
          },
          {
            text: "UDP routers give gamers free internet priority.",
            isCorrect: false,
            explanation: "Routers process packets according to standard queue policies, not gaming status."
          }
        ]
      }
    ]
  },
  5: {
    levelNumber: 5,
    levelTitle: "Network Phonebooks: DNS & ARP",
    questions: [
      {
        id: "l5-q1",
        scenario: "You run 'arp -a' in your terminal and notice two different IP addresses (192.168.1.1 and 192.168.1.99) share the EXACT same MAC address: DE:AD:BE:EF:66:66.",
        question: "What is the most likely cybersecurity explanation for this finding?",
        options: [
          {
            text: "An attacker at 192.168.1.99 has launched an ARP Spoofing / Poisoning attack claiming to be the Default Gateway router.",
            isCorrect: true,
            explanation: "Correct! If two different IPs resolve to the same MAC address on a standard LAN, an attacker is actively sending spoofed ARP replies to position themselves as a Man-in-the-Middle."
          },
          {
            text: "The router and the laptop were manufactured on the same assembly line.",
            isCorrect: false,
            explanation: "MAC addresses must be globally unique per hardware interface; they do not share duplicate IDs naturally."
          },
          {
            text: "DNS resolved the domain name backwards.",
            isCorrect: false,
            explanation: "This is a Layer 2 ARP cache issue, unrelated to DNS."
          },
          {
            text: "Your Wi-Fi antenna is picking up radio waves from two routers.",
            isCorrect: false,
            explanation: "Duplicate MAC entries in an ARP table indicate active Layer 2 spoofing."
          }
        ]
      },
      {
        id: "l5-q2",
        scenario: "Even though an attacker is successfully running ARP poisoning on an open coffee shop network, when you log into your bank at 'https://mybank.com', the attacker cannot steal your password.",
        question: "Why does HTTPS protect you even when an attacker intercepts all your raw packets?",
        options: [
          {
            text: "HTTPS wraps the application payload in TLS encryption; the attacker only sees scrambled ciphertext and lacks the private cryptographic key.",
            isCorrect: true,
            explanation: "Spot on! ARP spoofing reroutes physical packets, but TLS provides end-to-end cryptographic confidentiality. Without the server's private key, the intercepted payload is unreadable noise."
          },
          {
            text: "HTTPS tells the router to disconnect the attacker immediately.",
            isCorrect: false,
            explanation: "HTTPS is an application-layer encryption protocol; it does not control Wi-Fi association."
          },
          {
            text: "ARP packets cannot travel through HTTPS tunnels.",
            isCorrect: false,
            explanation: "ARP operates at Layer 2 underneath IP and TLS."
          },
          {
            text: "Banks use special analog internet cables that cannot be sniffed.",
            isCorrect: false,
            explanation: "All internet traffic travels over standard digital networks."
          }
        ]
      }
    ]
  },
  6: {
    levelNumber: 6,
    levelTitle: "Firewalls & Sneaking Through",
    questions: [
      {
        id: "l6-q1",
        scenario: "During an authorized penetration test, an external firewall blocks direct connections to an internal database server (10.0.5.25:3306). However, you have valid SSH login access to a DMZ Jump Box (jumpbox.company.com:22).",
        question: "How can you reach the internal database to test its security?",
        options: [
          {
            text: "Use SSH Local Port Forwarding ('ssh -L 9000:10.0.5.25:3306') to encapsulate database traffic inside an allowed SSH tunnel to pivot inside.",
            isCorrect: true,
            explanation: "Bingo! SSH port forwarding wraps the prohibited database traffic inside permitted SSH traffic on Port 22. The Jump Box unwraps it and delivers it internally, effectively pivoting past the perimeter firewall."
          },
          {
            text: "Email the database administrator asking them to delete the firewall.",
            isCorrect: false,
            explanation: "Security testing evaluates architectural controls, not social engineering to disable defenses."
          },
          {
            text: "Unplug the firewall power cord remotely via Wi-Fi.",
            isCorrect: false,
            explanation: "Perimeter enterprise firewalls cannot be powered down over Wi-Fi."
          },
          {
            text: "Change your laptop's screen resolution to bypass the packet inspector.",
            isCorrect: false,
            explanation: "Display resolution has zero bearing on network protocol encapsulation."
          }
        ]
      },
      {
        id: "l6-q2",
        scenario: "A corporate firewall is configured with a 'Stateful Packet Inspection (SPI)' engine and a strict default-deny inbound policy.",
        question: "Why are internal employees able to browse external websites without opening inbound ports on the firewall?",
        options: [
          {
            text: "The stateful firewall tracks outbound connection states and dynamically allows returning response packets that belong to established sessions.",
            isCorrect: true,
            explanation: "Correct! When an internal client initiates an outbound TCP handshake to an external web server, the stateful firewall notes the socket pair in its state table and automatically permits the returning HTTP/HTTPS packets."
          },
          {
            text: "Websites are not considered incoming traffic.",
            isCorrect: false,
            explanation: "All internet responses entering the network are inbound packets."
          },
          {
            text: "Firewalls only inspect traffic on weekends.",
            isCorrect: false,
            explanation: "Stateful firewalls operate continuously 24/7."
          },
          {
            text: "Every employee has their own private public IP address.",
            isCorrect: false,
            explanation: "Most organizations use NAT with a shared pool of public IPs."
          }
        ]
      }
    ]
  }
};
