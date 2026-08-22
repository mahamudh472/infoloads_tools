import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UIProvider } from "@/context/UIContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tools.infoloads.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "InfoLoads - Everyday tools, simplified.",
    template: "%s | InfoLoads",
  },
  description:
    "Free, fast and easy-to-use tools to solve your daily digital problems. Format JSON, count words, generate QR codes, encode Base64 and more.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9756204809595705"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="min-h-full flex flex-col">
        <UIProvider>{children}</UIProvider>
      </body>
    </html>
  );
}
