import { WidgetType } from "@/components/widgets/WidgetDispatcher";

export interface LessonStep {
  id: string;
  stepNumber: 1 | 2 | 3;
  type: "analogy" | "how-it-works" | "hackers-angle";
  badge: string;
  title: string;
  subtitle: string;
  readTime: string;
  content: string[];
  widgetType: WidgetType;
  widgetConfig?: Record<string, any>;
  keyTakeaway: string;
  quickCheck?: {
    question: string;
    options: { text: string; correct: boolean; explanation: string }[];
  };
}

export interface LessonLevel {
  levelNumber: number;
  id: string;
  title: string;
  shortDescription: string;
  estimatedMinutes: number;
  iconName: string;
  accentColor: string;
  steps: [LessonStep, LessonStep, LessonStep];
}

export const LESSONS: LessonLevel[] = [
  {
    levelNumber: 1,
    id: "level-1",
    title: "How Computers Talk",
    shortDescription: "IP addresses, MAC hardware identities, and digital envelopes called packets.",
    estimatedMinutes: 6,
    iconName: "Mail",
    accentColor: "indigo",
    steps: [
      {
        id: "level-1-step-1",
        stepNumber: 1,
        type: "analogy",
        badge: "1. Real-World Analogy",
        title: "The Digital Postal System",
        subtitle: "Why you need both a street address and an ID card.",
        readTime: "2 min",
        content: [
          "Imagine you want to send a secret letter to a friend named Alice in another city. To make sure your letter gets there safely, you need three things:",
          "1. A Street Address (The IP Address): Tells the postal truck which city, street, and building to deliver the package to. However, if Alice moves to a new apartment next month, her street address changes.",
          "2. A Government ID Card (The MAC Address): Alice's fingerprint or National ID card. No matter what apartment she lives in, her personal identity remains permanent and unique in the entire world.",
          "3. The Envelope (The Packet): You don't toss raw paper out the window. You fold your letter into an envelope, write the recipient's address on the front, your return address on the back, and lick it sealed.",
          "Computers communicate using this exact postal logic. When you click a link or send a chat, your machine bundles your message into thousands of tiny digital envelopes called packets."
        ],
        widgetType: "envelope-journey",
        keyTakeaway: "An IP Address tells the internet WHERE a device is located right now, while a MAC Address identifies WHO the physical machine is forever.",
        quickCheck: {
          question: "If you take your laptop from your home Wi-Fi to a coffee shop, which address changes?",
          options: [
            {
              text: "Your IP Address changes, but your MAC Address stays the same.",
              correct: true,
              explanation: "Correct! Your IP changes to match your new location on the coffee shop network, but your network card's hardware MAC address remains unchanged."
            },
            {
              text: "Your MAC Address changes, but your IP Address stays the same.",
              correct: false,
              explanation: "Incorrect. The MAC address is physically burned into your network card hardware."
            },
            {
              text: "Both addresses change automatically.",
              correct: false,
              explanation: "Incorrect. MAC addresses are permanent hardware identifiers."
            }
          ]
        }
      },
      {
        id: "level-1-step-2",
        stepNumber: 2,
        type: "how-it-works",
        badge: "2. How It Works",
        title: "Dissecting a Live Network Packet",
        subtitle: "Headers, trailers, and the anatomy of digital envelopes.",
        readTime: "2 min",
        content: [
          "In digital networking, large files (like photos or streaming video) are never sent as one monolithic chunk. If a single glitch occurred, you would have to restart the entire 4GB download!",
          "Instead, your operating system dices the data into small segments of roughly 1,500 bytes and wraps them in successive layers of headers:",
          "• Layer 2 (Ethernet Frame): Carries the Source MAC and Destination MAC addresses. This layer gets your data to the very next hardware device on your local wire or Wi-Fi.",
          "• Layer 3 (IP Packet): Carries the Source IP (e.g., 192.168.1.15) and Destination IP (e.g., 93.184.216.34). This layer survives across the entire global internet.",
          "• Payload: The actual text, encrypted bytes, or audio samples being transported.",
          "Every router along the road looks at the outer IP header, checks its routing map, and shoots the packet toward the next destination hop."
        ],
        widgetType: "packet-inspector",
        widgetConfig: {
          stepFocus: "technical",
          defaultPayload: "GET /index.html HTTP/1.1",
        },
        keyTakeaway: "Data travels across the internet diced into small packets wrapped in Layer 2 (MAC) and Layer 3 (IP) headers that routers inspect at each stop.",
        quickCheck: {
          question: "What is the primary role of the Layer 3 IP header?",
          options: [
            {
              text: "To direct the packet across global internet routers to the destination network.",
              correct: true,
              explanation: "Spot on! Layer 3 IP headers provide end-to-end routing across the worldwide web."
            },
            {
              text: "To encrypt the payload so nobody can read it.",
              correct: false,
              explanation: "IP headers provide routing addresses, not encryption (encryption happens at higher layers like TLS)."
            }
          ]
        }
      },
      {
        id: "level-1-step-3",
        stepNumber: 3,
        type: "hackers-angle",
        badge: "3. The Hacker's Angle",
        title: "Sniffing & MAC Spoofing",
        subtitle: "How ethical hackers inspect raw traffic and bypass perimeter gates.",
        readTime: "2 min",
        content: [
          "Now let's put on the ethical hacker's hat. Because network packets are flying through airwaves or copper cables, what stops someone from reading them?",
          "• Packet Sniffing (Wireshark): In normal mode, your network card ignores packets not addressed to its MAC address. But in 'Promiscuous Mode', security analysts capture and inspect EVERY packet crossing the wire, looking for unencrypted passwords or vulnerable protocols.",
          "• MAC Address Spoofing: Many hotel or airport Wi-Fi networks restrict access using 'MAC Filtering'—they only grant internet access to devices that paid for a 24-hour voucher.",
          "Because the operating system sends whatever MAC address it wants in the packet header, a penetration tester can change their software MAC address to mirror an already authorized device and test the network's authorization resilience."
        ],
        widgetType: "packet-inspector",
        widgetConfig: {
          stepFocus: "hacking",
          defaultPayload: "Authorization: Bearer test_token_99",
        },
        keyTakeaway: "Unencrypted packets can be captured in promiscuous mode with Wireshark, and software-level MAC addresses can be changed to test network access controls.",
        quickCheck: {
          question: "Why can MAC addresses be spoofed if they are burned into hardware at the factory?",
          options: [
            {
              text: "The operating system reads the hardware MAC at boot but allows software to overwrite the value used in outgoing packet headers.",
              correct: true,
              explanation: "Exactly! The network driver allows the OS to specify any MAC address it wants when building outgoing Ethernet frames."
            },
            {
              text: "Hackers physically solder new chips onto their motherboards.",
              correct: false,
              explanation: "No hardware modification is required—it is done with simple terminal commands like 'ip link set dev eth0 address xx:xx:xx'."
            }
          ]
        }
      }
    ]
  },
  {
    levelNumber: 2,
    id: "level-2",
    title: "Local Networks & Routers",
    shortDescription: "Wi-Fi switches, Public vs. Private IPs, and local network discovery.",
    estimatedMinutes: 6,
    iconName: "Wifi",
    accentColor: "emerald",
    steps: [
      {
        id: "level-2-step-1",
        stepNumber: 1,
        type: "analogy",
        badge: "1. Real-World Analogy",
        title: "The Gated Apartment Complex",
        subtitle: "Why 192.168.1.1 looks familiar to almost everyone on Earth.",
        readTime: "2 min",
        content: [
          "Have you ever noticed that your home Wi-Fi assigns your laptop an IP address starting with 192.168... and your friend’s Wi-Fi across the country does the exact same thing?",
          "Think of your home as a gated apartment building:",
          "• Inside the building, each resident has a private door number: Apartment 101, 102, 103 (These are Private IPs). You can yell across the hallway to Apartment 102 easily.",
          "• Outside on the street, the entire building shares ONE single street address on the city map: 742 Evergreen Terrace (This is the Public IP).",
          "• The building's front desk receptionist is the Router. When a parcel from Amazon arrives at 742 Evergreen Terrace with 'Attn: Apt 102', the receptionist drops it into tenant 102's internal mailbox."
        ],
        widgetType: "envelope-journey",
        keyTakeaway: "Private IPs are internal room numbers used inside your house. The router translates them to a single Public IP when talking to the outside world.",
        quickCheck: {
          question: "Can two different homes simultaneously use the private IP 192.168.1.5?",
          options: [
            {
              text: "Yes, because private IP ranges are local to each private network and never collide on the public internet.",
              correct: true,
              explanation: "Correct! Private IP ranges (RFC 1918) are reused across millions of independent home and enterprise networks."
            },
            {
              text: "No, every IP in the universe must be globally unique.",
              correct: false,
              explanation: "Only Public IPs must be globally unique. Private IPs can be reused locally."
            }
          ]
        }
      },
      {
        id: "level-2-step-2",
        stepNumber: 2,
        type: "how-it-works",
        badge: "2. How It Works",
        title: "NAT & The Default Gateway",
        subtitle: "How one public internet connection serves 20 personal devices.",
        readTime: "2 min",
        content: [
          "The technology that makes this magic work is NAT (Network Address Translation):",
          "1. When your phone (192.168.1.42) requests a video from YouTube (142.250.190.46), your phone sends the packet to your router's local address, known as the Default Gateway (usually 192.168.1.1).",
          "2. The router rewrites the packet's source address: it swaps out your private IP for its own single Public IP (e.g. 203.0.113.88) and remembers this translation in a NAT State Table.",
          "3. When YouTube responds back to 203.0.113.88, the router looks at its table, sees this response belongs to your phone, swaps the destination back to 192.168.1.42, and transmits it over Wi-Fi."
        ],
        widgetType: "local-network",
        widgetConfig: {
          stepFocus: "nat-flow",
        },
        keyTakeaway: "NAT conserves IPv4 addresses by allowing an entire local subnet of devices to access the internet through a single shared public IP.",
        quickCheck: {
          question: "What is the role of the 'Default Gateway' in your network settings?",
          options: [
            {
              text: "It is the local router address where your computer sends all traffic destined for outside networks.",
              correct: true,
              explanation: "Exactly. Any packet whose destination is outside your local subnet is handed off to the default gateway."
            },
            {
              text: "It is your web browser's homepage address.",
              correct: false,
              explanation: "No, the gateway is a foundational network routing endpoint."
            }
          ]
        }
      },
      {
        id: "level-2-step-3",
        stepNumber: 3,
        type: "hackers-angle",
        badge: "3. The Hacker's Angle",
        title: "Subnet Reconnaissance & Mapping",
        subtitle: "How ethical hackers discover every device sharing a local network.",
        readTime: "2 min",
        content: [
          "When an ethical hacker plugs into a company's internal Ethernet port during an authorized security audit, their first step is Network Reconnaissance.",
          "Because all devices on a local subnet share the same broadcast domain, a scanner can ping or send ARP probes to all 254 possible addresses in the range (e.g. 192.168.1.1 through 192.168.1.254):",
          "• Discovering hidden printers, smart TVs, or unmanaged IoT cameras with default passwords.",
          "• Identifying internal file servers and database instances that were never intended to be exposed.",
          "• Detecting Rogue Access Points—unauthorized Wi-Fi routers plugged in by employees that bypass corporate security firewalls."
        ],
        widgetType: "local-network",
        widgetConfig: {
          stepFocus: "recon",
        },
        keyTakeaway: "Once connected to a local subnet, an ethical hacker uses network discovery tools to map out all active IP addresses and identify vulnerable hardware.",
        quickCheck: {
          question: "Why is an internal network often less defended than external web servers?",
          options: [
            {
              text: "Organizations often adopt a 'hard crunchy shell, soft chewy center' model, assuming anyone inside the physical office is trusted.",
              correct: true,
              explanation: "Spot on! That is why modern cybersecurity emphasizes 'Zero Trust'—never trust any device simply because it is on the local Wi-Fi."
            },
            {
              text: "Internal networks cannot be accessed by computers.",
              correct: false,
              explanation: "Internal networks are made of standard computers and routers."
            }
          ]
        }
      }
    ]
  },
  {
    levelNumber: 3,
    id: "level-3",
    title: "Ports & Doors",
    shortDescription: "Numbered doors on a host, listening services, and port scanning.",
    estimatedMinutes: 7,
    iconName: "DoorClosed",
    accentColor: "indigo",
    steps: [
      {
        id: "level-3-step-1",
        stepNumber: 1,
        type: "analogy",
        badge: "1. Real-World Analogy",
        title: "The Skyscraper with 65,535 Doors",
        subtitle: "Why an IP address alone is never enough to deliver a message.",
        readTime: "2 min",
        content: [
          "Imagine a massive skyscraper office building. The building has one main street address (The IP Address). But inside this skyscraper, there are hundreds of different independent businesses:",
          "• Door 80: The public coffee shop in the lobby (HTTP Web traffic).",
          "• Door 443: The bank vault with biometric scanners and armed guards (HTTPS Secure Web).",
          "• Door 22: The private service elevator for building engineers with master keys (SSH Remote Shell).",
          "• Door 25: The building mailroom dispatching outgoing envelopes (SMTP Email).",
          "If a delivery driver just walked up to the building and dropped a package on the sidewalk, nobody would know which office it belonged to. Every connection specifies both an IP Address AND a Port Number (e.g. 192.168.1.50:443)."
        ],
        widgetType: "port-door-knocker",
        keyTakeaway: "An IP address gets your packet to the right computer. The Port Number routes the packet to the specific software program waiting to process it.",
        quickCheck: {
          question: "What happens if you send web traffic to an IP address with no port specified?",
          options: [
            {
              text: "Browsers default automatically to port 80 for http:// and port 443 for https://.",
              correct: true,
              explanation: "Correct! Your web browser automatically appends :80 or :443 under the hood."
            },
            {
              text: "The packet is permanently lost in the internet void.",
              correct: false,
              explanation: "Standard protocols have well-known default ports."
            }
          ]
        }
      },
      {
        id: "level-3-step-2",
        stepNumber: 2,
        type: "how-it-works",
        badge: "2. How It Works",
        title: "Sockets & Listening Daemons",
        subtitle: "How operating systems manage 0 to 65,535 virtual channels.",
        readTime: "2 min",
        content: [
          "Computers have 65,536 available port numbers (ranging from 0 to 65,535). They are categorized into three groups:",
          "• Well-Known Ports (0 – 1023): Reserved for standard system services (SSH on 22, DNS on 53, HTTP on 80, HTTPS on 443). On Linux/macOS, opening these requires root privileges.",
          "• Registered Ports (1024 – 49151): Assigned to specific applications (MySQL on 3306, PostgreSQL on 5432, Node.js development servers on 3000 or 8080).",
          "• Ephemeral Ports (49152 – 65535): Temporary random ports assigned to your client browser so the server knows where to reply.",
          "When a program like Apache or Nginx starts up, it tells the operating system: 'Bind to Port 80 and Listen for incoming connections.' This bound combination of IP + Port is called a Socket."
        ],
        widgetType: "port-scanner",
        widgetConfig: {
          stepFocus: "sockets",
        },
        keyTakeaway: "A server program opens a 'socket' by binding to a specific port and listening. Only one program can listen on a given port at any time.",
        quickCheck: {
          question: "Can two different programs (e.g. Apache and Nginx) both listen on Port 80 at the exact same time on the same IP?",
          options: [
            {
              text: "No, a port conflict error will occur because an IP + Port socket can only be bound by one process at a time.",
              correct: true,
              explanation: "Precisely! If Port 80 is already in use, the second program will throw an 'Address already in use' error."
            },
            {
              text: "Yes, the operating system splits the traffic 50/50 automatically.",
              correct: false,
              explanation: "Operating systems do not split random traffic between competing listeners on the same socket."
            }
          ]
        }
      },
      {
        id: "level-3-step-3",
        stepNumber: 3,
        type: "hackers-angle",
        badge: "3. The Hacker's Angle",
        title: "Rattling Doorknobs: Port Scanning",
        subtitle: "What penetration testers look for and how service banners leak vulnerabilities.",
        readTime: "3 min",
        content: [
          "Port scanning is the digital equivalent of an ethical security guard walking around a compound and checking every door handle to see if it is locked, unlocked, or completely open.",
          "When an ethical hacker runs a port scan using a tool like Nmap:",
          "• Open: A service responded! There is active software listening here (e.g., OpenSSH 7.2p2).",
          "• Closed: The host responded, but said 'No service is listening on this door' (sent a TCP RST).",
          "• Filtered: No response or blocked. A firewall silently dropped the probe.",
          "Security professionals pay close attention to Banner Grabbing. When connecting to an open port, the server often prints its exact version (e.g. 'Apache 2.4.49'). If that specific version has a published vulnerability (CVE), an attacker could exploit it."
        ],
        widgetType: "port-door-knocker",
        keyTakeaway: "Port scanning identifies which doors are open and which software versions are running, revealing potential entry points for attack or defensive hardening.",
        quickCheck: {
          question: "Why should system administrators close or firewall unused ports?",
          options: [
            {
              text: "Every open port is a potential attack surface running software that could have unpatched vulnerabilities.",
              correct: true,
              explanation: "Exactly right! Minimizing open ports minimizes the system's attack surface—a core tenet of cyber hygiene."
            },
            {
              text: "Open ports consume electricity even if nobody uses them.",
              correct: false,
              explanation: "Port security is about software vulnerabilities and exposure, not electrical power."
            }
          ]
        }
      }
    ]
  },
  {
    levelNumber: 4,
    id: "level-4",
    title: "TCP & UDP: The Rules of Conversation",
    shortDescription: "The 3-Way Handshake, megaphone UDP, and stealth SYN scanning.",
    estimatedMinutes: 7,
    iconName: "Radio",
    accentColor: "emerald",
    steps: [
      {
        id: "level-4-step-1",
        stepNumber: 1,
        type: "analogy",
        badge: "1. Real-World Analogy",
        title: "The Certified Phone Call vs. Shouting with a Megaphone",
        subtitle: "Why some internet traffic demands guarantees while other traffic demands speed.",
        readTime: "2 min",
        content: [
          "Imagine two different ways to communicate across a noisy stadium:",
          "1. Method A: The Certified Phone Call (TCP). You dial Alice. 'Hello, can you hear me?' Alice replies: 'Yes, I hear you, can you hear me?' You say: 'Yes, loud and clear!' Now that you verified the connection, you transmit critical bank instructions. If Alice misses word #4, you repeat it.",
          "2. Method B: The Megaphone Shouting (UDP). You stand on a podium and shout live football scores to 50,000 spectators. You don't pause to ask each fan if they heard score #3. If someone sneezed and missed a goal update, you don't rewind time—the game moves on!",
          "TCP is used when accuracy is paramount (webpages, email, file transfers). UDP is used when live speed matters more than perfection (video streaming, voice chat, online gaming)."
        ],
        widgetType: "port-door-knocker",
        keyTakeaway: "TCP guarantees reliable, ordered packet delivery via handshakes and acknowledgments; UDP trades delivery guarantees for raw real-time speed.",
        quickCheck: {
          question: "Which protocol would a multiplayer action game most likely use for player movement coordinates?",
          options: [
            {
              text: "UDP, because an outdated player position from 200ms ago is useless to retransmit.",
              correct: true,
              explanation: "Correct! If a position packet is dropped, the server immediately sends the newest current position instead of waiting to retransmit the old one."
            },
            {
              text: "TCP, because every pixel on screen must be acknowledged.",
              correct: false,
              explanation: "TCP would introduce stuttering and 'rubber-banding' if packets were dropped and retransmitted."
            }
          ]
        }
      },
      {
        id: "level-4-step-2",
        stepNumber: 2,
        type: "how-it-works",
        badge: "2. How It Works",
        title: "The TCP 3-Way Handshake",
        subtitle: "SYN, SYN-ACK, and ACK in action.",
        readTime: "2 min",
        content: [
          "Before any TCP conversation can transfer even a single byte of data, the client and server must perform the famous 3-Way Handshake:",
          "1. Step 1: SYN (Synchronize). The client sends a packet with the SYN flag enabled and a random initial sequence number (e.g., SEQ=1000). Translation: 'Hey, I want to establish a connection. Here is my starting number.'",
          "2. Step 2: SYN-ACK (Synchronize-Acknowledge). The server receives the SYN, acknowledges it (ACK=1001), and sends its own starting number (SEQ=5000). Translation: 'I heard you! Here is my starting number.'",
          "3. Step 3: ACK (Acknowledge). The client confirms receipt of the server's sequence number (ACK=5001).",
          "Once step 3 lands, the connection state changes to ESTABLISHED and data flows back and forth with bulletproof reliability."
        ],
        widgetType: "tcp-handshake",
        widgetConfig: {
          stepFocus: "handshake",
        },
        keyTakeaway: "The 3-way handshake synchronizes sequence numbers between both machines so lost or out-of-order packets can be detected and retransmitted.",
        quickCheck: {
          question: "What flag does the server include when responding to a client's initial SYN packet?",
          options: [
            {
              text: "SYN-ACK (both Synchronize and Acknowledge flags turned on).",
              correct: true,
              explanation: "Right! The server acknowledges the client's sequence number while offering its own sequence number in a single packet."
            },
            {
              text: "FIN (Finish).",
              correct: false,
              explanation: "FIN is used to terminate a connection, not begin one."
            }
          ]
        }
      },
      {
        id: "level-4-step-3",
        stepNumber: 3,
        type: "hackers-angle",
        badge: "3. The Hacker's Angle",
        title: "The SYN Stealth Scan (Nmap -sS)",
        subtitle: "How hackers knock, see someone looking through the peephole, and run away.",
        readTime: "3 min",
        content: [
          "When you complete a full 3-way handshake with a web server, the operating system hands the connection to the web application (like Nginx or Apache), which writes an entry into its access log: 'Connection established from 192.168.1.100'.",
          "Ethical hackers often want to check if a port is open without triggering application-level logs. This technique is known as the SYN Stealth Scan (or Half-Open Scan):",
          "1. The scanner sends a SYN packet to Port 80.",
          "2. If the port is open, the server responds with SYN-ACK ('Yes, door is open!').",
          "3. Instead of completing the handshake with an ACK, the scanner immediately fires back a RST (Reset) packet!",
          "The connection is instantly killed before it is ever established. The port is confirmed OPEN, yet the application server never logs a completed connection!"
        ],
        widgetType: "port-door-knocker",
        keyTakeaway: "A SYN stealth scan sends RST right after receiving SYN-ACK. This determines whether a port is listening without ever completing the full connection.",
        quickCheck: {
          question: "Why is a SYN scan called a 'half-open' scan?",
          options: [
            {
              text: "Because the scanner terminates the connection with a RST packet before sending the final ACK to complete the handshake.",
              correct: true,
              explanation: "Bingo! The handshake is left half-finished, preventing application daemons from logging a full session."
            },
            {
              text: "Because it only scans half of the 65,535 ports.",
              correct: false,
              explanation: "The term 'half-open' refers to the state of the TCP state machine, not the number of ports."
            }
          ]
        }
      }
    ]
  },
  {
    levelNumber: 5,
    id: "level-5",
    title: "Network Phonebooks: DNS & ARP",
    shortDescription: "Domain name resolution, local MAC mapping, and Man-in-the-Middle attacks.",
    estimatedMinutes: 8,
    iconName: "BookOpen",
    accentColor: "indigo",
    steps: [
      {
        id: "level-5-step-1",
        stepNumber: 1,
        type: "analogy",
        badge: "1. Real-World Analogy",
        title: "Two Phonebooks for Two Different Worlds",
        subtitle: "How humans use names while machines use numbers.",
        readTime: "2 min",
        content: [
          "Humans are great with words ('google.com', 'wikipedia.org'), but computer networks only know how to route to numbers ('142.250.190.46').",
          "To bridge this gap, the internet relies on two vital directories:",
          "• DNS (Global Phonebook): When you type 'netflix.com' into your browser, DNS looks up the domain name across internet servers and returns the corresponding public IP address.",
          "• ARP (Local Wi-Fi Intercom): Once your computer knows the IP address of a device on its local network (e.g. 192.168.1.1), it still doesn't know which physical network card to blast the electrical signals to! It uses ARP like an intercom shouting: 'Attention everyone in the room: who here owns 192.168.1.1? Tell me your MAC address!'"
        ],
        widgetType: "arp-trickster",
        keyTakeaway: "DNS translates human website domain names into IP addresses globally; ARP translates local IP addresses into physical MAC addresses on the local Wi-Fi.",
        quickCheck: {
          question: "What protocol does your computer use when you type 'apple.com' to find its IP address?",
          options: [
            {
              text: "DNS (Domain Name System)",
              correct: true,
              explanation: "Correct! DNS translates domain names into routable IP addresses."
            },
            {
              text: "ARP (Address Resolution Protocol)",
              correct: false,
              explanation: "ARP translates local IPs into MAC addresses, not website domain names."
            }
          ]
        }
      },
      {
        id: "level-5-step-2",
        stepNumber: 2,
        type: "how-it-works",
        badge: "2. How It Works",
        title: "The Hierarchy of a DNS Query & ARP Table",
        subtitle: "Recursive resolution and local caching mechanisms.",
        readTime: "3 min",
        content: [
          "Let's trace what happens in milliseconds when you request a website:",
          "1. Your computer checks its local DNS Cache. If not found, it queries your recursive resolver (usually your ISP or 1.1.1.1 / 8.8.8.8).",
          "2. The resolver queries the Root DNS servers ('.'), then the TLD servers ('.com'), and finally the Authoritative Name Server for the domain, which responds: 'example.com is at 93.184.216.34'.",
          "3. Next, your computer needs to send this packet out through your router (192.168.1.1). It checks its internal ARP Cache: 'Do I know the MAC address of 192.168.1.1?'",
          "4. If not, it broadcasts an ARP Request: 'Who has 192.168.1.1? Tell 192.168.1.15'. The router hears the broadcast and replies: '192.168.1.1 is at 00:1a:2b:3c:4d:5e'.",
          "Both mappings are stored in memory caches so future requests don't waste network bandwidth."
        ],
        widgetType: "dns-arp-mitm",
        widgetConfig: {
          stepFocus: "resolution",
        },
        keyTakeaway: "Computers cache both DNS records and ARP mappings in local memory to avoid re-querying the network for every packet.",
        quickCheck: {
          question: "What command can you type in Windows, Linux, or macOS to view your computer's current ARP cache?",
          options: [
            {
              text: "arp -a",
              correct: true,
              explanation: "Spot on! Running 'arp -a' in your terminal lists all IP-to-MAC address pairs your machine has recently communicated with."
            },
            {
              text: "ipconfig /allports",
              correct: false,
              explanation: "The standard tool to inspect local ARP resolution tables is 'arp -a'."
            }
          ]
        }
      },
      {
        id: "level-5-step-3",
        stepNumber: 3,
        type: "hackers-angle",
        badge: "3. The Hacker's Angle",
        title: "ARP Cache Poisoning & Man-in-the-Middle",
        subtitle: "How an ethical hacker demonstrates total traffic interception on unencrypted networks.",
        readTime: "3 min",
        content: [
          "Here is the fatal flaw built into the original 1982 ARP protocol: ARP has zero authentication! Any computer can send an ARP reply even if nobody asked for it, and devices will obediently update their cache without checking.",
          "In an ARP Poisoning / Spoofing attack:",
          "• The attacker tells the Victim PC: 'Hey, I am the Default Gateway (192.168.1.1), send all your internet traffic to my MAC address!'",
          "• The attacker simultaneously tells the Router: 'Hey, I am the Victim PC (192.168.1.50), send all their incoming packets to my MAC address!'",
          "Now, all traffic between the victim and the internet flows directly through the attacker's laptop. This is a classic Man-in-the-Middle (MITM) attack!",
          "Defense: This attack is why modern web traffic requires HTTPS / TLS encryption (so intercepted data looks like indecipherable gibberish) and why enterprise networks deploy Dynamic ARP Inspection (DAI)."
        ],
        widgetType: "arp-trickster",
        keyTakeaway: "ARP lacks authentication, allowing an attacker to poison caches and position themselves as a Man-in-the-Middle to inspect or alter unencrypted traffic.",
        quickCheck: {
          question: "Why does HTTPS protect users even if someone successfully poisons their local ARP cache?",
          options: [
            {
              text: "HTTPS encrypts the payload end-to-end with TLS certificates, so the attacker in the middle only sees scrambled ciphertext.",
              correct: true,
              explanation: "Exactly! Even if the attacker intercepts every packet, they cannot decrypt the passwords or cookies without the private cryptographic key."
            },
            {
              text: "HTTPS prevents the computer from sending ARP packets.",
              correct: false,
              explanation: "ARP still operates underneath HTTPS; HTTPS protects the confidentiality of the contents."
            }
          ]
        }
      }
    ]
  },
  {
    levelNumber: 6,
    id: "level-6",
    title: "Firewalls & Sneaking Through",
    shortDescription: "Security guard filtering, port forwarding, and defensive SSH tunneling.",
    estimatedMinutes: 8,
    iconName: "ShieldAlert",
    accentColor: "emerald",
    steps: [
      {
        id: "level-6-step-1",
        stepNumber: 1,
        type: "analogy",
        badge: "1. Real-World Analogy",
        title: "The Bouncer with a Strict Guestlist",
        subtitle: "How firewalls inspect every envelope crossing the perimeter.",
        readTime: "2 min",
        content: [
          "Imagine a VIP nightclub with an impenetrable velvet rope and a team of strict security bouncers (The Firewall).",
          "The bouncers hold a clipboard containing an Access Control List (ACL):",
          "• Rule 1: 'If a guest is wearing a suit and arriving at Door 443 (HTTPS), let them in.'",
          "• Rule 2: 'If a guest arrives at Door 22 (SSH) from an unapproved IP address, immediately reject them.'",
          "• Default Rule: 'If anyone arrives who isn't explicitly on this clipboard, DENY ENTRY.'",
          "A firewall sits directly on the border between the outside untrusted internet and an organization's private internal network, inspecting every incoming and outgoing packet against these rules."
        ],
        widgetType: "firewall-filter-game",
        keyTakeaway: "Firewalls enforce an Access Control List (ACL) to block unauthorized packets based on IP address, port, protocol, or state.",
        quickCheck: {
          question: "What is a 'default deny' firewall configuration?",
          options: [
            {
              text: "All traffic is blocked by default unless explicitly permitted by an authorized rule.",
              correct: true,
              explanation: "Correct! 'Default deny' is the gold standard security posture: block everything unless there is an approved business need."
            },
            {
              text: "All traffic is allowed unless someone files a manual complaint.",
              correct: false,
              explanation: "That would be 'default allow', which leaves systems dangerously exposed."
            }
          ]
        }
      },
      {
        id: "level-6-step-2",
        stepNumber: 2,
        type: "how-it-works",
        badge: "2. How It Works",
        title: "Stateful Inspection & Port Forwarding",
        subtitle: "How firewalls remember outgoing conversations and route inbound requests.",
        readTime: "2 min",
        content: [
          "Early firewalls were 'stateless'—they examined each packet in isolation. Modern firewalls use Stateful Packet Inspection (SPI):",
          "• When you browse a website from inside your office, the firewall notes: 'Laptop 192.168.1.10 opened an outbound connection to 93.184.216.34:443.'",
          "• When the website sends reply packets back, the firewall checks its state table, recognizes it as an established return conversation, and lets it through!",
          "• But if an unknown computer on the internet tries to connect inbound to your laptop unsolicited, the firewall drops it immediately.",
          "What if you intentionally want external users to visit an internal web server? You configure Port Forwarding on your edge router: 'Any packet arriving on Public IP Port 80 should be forwarded straight to internal machine 192.168.1.200:80'."
        ],
        widgetType: "firewall-tunnel",
        widgetConfig: {
          stepFocus: "stateful-rules",
        },
        keyTakeaway: "Stateful firewalls track active connections, automatically allowing return traffic while dropping uninvited inbound probes.",
        quickCheck: {
          question: "Why do home routers allow you to browse the web without opening any inbound firewall ports?",
          options: [
            {
              text: "Because the stateful firewall tracks outbound connections initiated by your browser and permits the corresponding incoming responses.",
              correct: true,
              explanation: "Bingo! Outbound traffic dynamically creates temporary return pathways in the state table."
            },
            {
              text: "Home routers do not have firewalls.",
              correct: false,
              explanation: "All modern Wi-Fi routers have built-in SPI firewalls."
            }
          ]
        }
      },
      {
        id: "level-6-step-3",
        stepNumber: 3,
        type: "hackers-angle",
        badge: "3. The Hacker's Angle",
        title: "Pivoting & SSH Tunneling",
        subtitle: "How ethical hackers access segmented internal networks through legitimate tunnels.",
        readTime: "3 min",
        content: [
          "In enterprise penetration testing, sensitive database servers and internal admin dashboards are placed inside deep internal subnets (e.g. 10.0.5.0/24) that have NO public internet access. The perimeter firewall blocks all incoming connections.",
          "However, security auditors often have legitimate SSH access to an edge Jump Box or DMZ server.",
          "By creating an SSH Local Port Forward / Tunnel:",
          "`ssh -L 9000:10.0.5.25:3306 user@jumpbox.company.com`",
          "1. The ethical hacker opens a local port (9000) on their own laptop.",
          "2. Any traffic sent into port 9000 is wrapped inside an encrypted SSH tunnel to the Jump Box.",
          "3. The Jump Box unwraps the traffic and forwards it locally to the private internal database at 10.0.5.25:3306!",
          "This technique is called Pivoting—using a compromised or authorized foothold machine to explore and audit deeper segmented internal networks."
        ],
        widgetType: "firewall-tunnel",
        widgetConfig: {
          stepFocus: "pivoting-tunnel",
        },
        keyTakeaway: "SSH tunneling encapsulates target traffic inside an encrypted connection, allowing ethical hackers to reach segmented internal hosts during an audit.",
        quickCheck: {
          question: "What is 'pivoting' in an ethical hacking penetration test?",
          options: [
            {
              text: "Using access to one compromised or foothold machine to reach and assess other systems on isolated internal subnets.",
              correct: true,
              explanation: "Spot on! Pivoting enables security auditors to evaluate whether internal network segmentation is resilient."
            },
            {
              text: "Physically rotating your laptop monitor 90 degrees.",
              correct: false,
              explanation: "Pivoting is a fundamental network penetration testing methodology."
            }
          ]
        }
      }
    ]
  }
];

export function getLevel(levelNumber: number): LessonLevel | undefined {
  return LESSONS.find((l) => l.levelNumber === levelNumber);
}

export function getTotalStepsCount(): number {
  return LESSONS.reduce((acc, curr) => acc + curr.steps.length, 0);
}
