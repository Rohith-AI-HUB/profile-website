import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { SITE_NAME, SITE_URL } from "@/lib/site-data";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: "%s | Rohith B",
  },
  description: "Public projects, live builds, and repositories from Rohith B.",
  icons: {
    icon: [{ url: "/tab-icon.png?v=20260328", type: "image/png", sizes: "64x64" }],
    shortcut: ["/tab-icon.png?v=20260328"],
    apple: [{ url: "/apple-icon.png?v=20260328", type: "image/png", sizes: "180x180" }],
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_NAME,
    description: "Featured projects with repository links, live demos, and project pages.",
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: "Featured projects with repository links, live demos, and project pages.",
    images: ["/opengraph-image"],
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
