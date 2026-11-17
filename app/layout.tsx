import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, JetBrains_Mono } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const siteUrl = "https://aghar-portfolio.vercel.app";

const title = "Aghar Usman K T | Full-Stack Developer";
const description =
  "Aghar Usman K T is a full-stack developer in Calicut, Kerala, building Next.js websites, React interfaces and Python APIs. Explore projects and experience.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: title,
    template: "%s | Aghar Usman K T",
  },

  description,

  authors: [
    {
      name: "Aghar Usman K T",
      url: siteUrl,
    },
  ],

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Aghar Usman — Developer Portfolio",
    title,
    description,
  },

  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
