import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Rohith B | Build Ledger",
    template: "%s | Rohith B",
  },
  description:
    "A light-theme build ledger shaped from Rohith B's public GitHub work across product engineering, AI systems, and practical tools.",
  openGraph: {
    title: "Rohith B | Build Ledger",
    description:
      "Public project dossiers, repo evidence, and working signals from Rohith B's GitHub profile.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rohith B | Build Ledger",
    description:
      "Public project dossiers and repo evidence from Rohith B's GitHub work.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${spaceGrotesk.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <div className="flex min-h-full flex-col">{children}</div>
      </body>
    </html>
  );
}
