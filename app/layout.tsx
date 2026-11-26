import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "./portfolio-theme.css";
import "./design-tokens.css";

const title = "Aghar Usman K T | Full-stack developer";
const description = "React interfaces, Python APIs, and SQL that answers back. Explore Aghar Usman's work, experience, and projects.";
export const metadata: Metadata = {
  metadataBase: new URL("https://aghar-portfolio.vercel.app"), title, description,
  openGraph: { title, description, type: "website", images: ["/share.svg"] },
  twitter: { card: "summary_large_image", title, description, images: ["/share.svg"] },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: [{ media: "(prefers-color-scheme: light)", color: "#FDF5E8" }, { media: "(prefers-color-scheme: dark)", color: "#141318" }] };
const themeBoot = `try{document.documentElement.dataset.theme=localStorage.getItem('portfolio-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'night':'light');delete document.documentElement.dataset.reduceMotion}catch{}`;

// Grammarly can add attributes to body before hydration. Suppress only this element's attribute mismatch.
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="en" data-type="service" suppressHydrationWarning><head><meta name="page-type" content="service" /><meta name="site-kind" content="other" /><script dangerouslySetInnerHTML={{ __html: themeBoot }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Person", name: "Aghar Usman K T", jobTitle: "Full-stack developer", url: "https://aghar-portfolio.vercel.app", sameAs: ["https://github.com/aghar-usman", "https://linkedin.com/in/aghar-usmankt"] }) }} /></head><body suppressHydrationWarning>{children}</body></html>;
}
