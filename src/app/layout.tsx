import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HackNet Zero • Networking for Ethical Hackers",
  description:
    "A clean, distraction-free interactive course teaching computer networking for ethical hacking from absolute zero to intermediate.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        {children}
      </body>
    </html>
  );
}
