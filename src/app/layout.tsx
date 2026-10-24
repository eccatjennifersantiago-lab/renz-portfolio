import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { profile, siteUrl } from "@/data/site";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const title = `${profile.name} · ${profile.title}`;
const description =
  "Portfolio of Renz Russel Santiago, YouTube Automation Manager, Video Editor, Shopify and Digital Marketing Specialist based in Bulacan, Philippines. Open to remote roles.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: profile.name,
  authors: [{ name: profile.name, url: siteUrl }],
  keywords: [
    "Renz Russel Santiago",
    "YouTube Automation Manager",
    "Video Editor",
    "Shopify Specialist",
    "Digital Marketing",
    "Faceless YouTube",
    "Remote",
    "Philippines",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: profile.name,
    title,
    description,
    locale: "en_US",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: `${profile.name}, ${profile.title}` }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.jpg"],
  },
  robots: { index: true, follow: true },
  // Google Search Console ownership (HTML tag method).
  verification: { google: "q1fqA_N-dOxfIalRntHh3IzxOtz_EvxeZkf3kLp7zzc" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0808" },
  ],
};

// Runs before first paint: applies the saved theme (or the system preference)
// so night mode never flashes light on load, and decides whether the welcome
// screen plays (once per visit, never for reduced motion).
const themeScript = `(function(){var r=document.documentElement;try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}r.dataset.theme=t}catch(e){r.dataset.theme="light"}try{if(matchMedia("(prefers-reduced-motion: reduce)").matches||sessionStorage.getItem("introSeen")){r.dataset.intro="seen"}else{sessionStorage.setItem("introSeen","1");r.dataset.intro="show"}}catch(e){r.dataset.intro="show"}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jakarta.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh font-sans">
        {children}
        <CustomCursor />
      </body>
    </html>
  );
}
