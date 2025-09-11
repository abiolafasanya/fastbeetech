// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/header";
import Footer from "./components/footer";
import { Toaster } from "@/components/ui/sonner";
import AppInitProvider from "./components/AppInitProvider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** -------------------------------
 *  Site constants (Hexonest)
 *  Update SITE_URL when prod domain is live
 *  ------------------------------- */
const SITE_URL = "https://hexonest.com";
const SITE_NAME = "Hexonest";
const SITE_TAGLINE = "Build fast. Ship smart.";

// Optional: Local SEO (Lagos)
const ORG = {
  name: "Hexonest",
  legalName: "Hexonest Digital Ltd.",
  url: SITE_URL,
  logo: "/hexonest-logo-light.svg", // served from /public
  sameAs: [
    "https://x.com/hexonest",
    // add linkedin, github, etc.
  ],
  address: {
    streetAddress: "14 Isaac Anjorin Street, Fawole, Igbogbo, Ikorodu",
    addressLocality: "Lagos",
    addressRegion: "LA",
    postalCode: "104211",
    addressCountry: "NG",
  },
  contactPoint: {
    telephone: "+234-000-000-0000",
    contactType: "customer support",
    areaServed: "NG",
    availableLanguage: ["en"],
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Hexonest builds modern web & mobile apps, AI automations, and trains engineers. Ship faster with Next.js, Express, and thoughtful UX.",
  keywords: [
    "Hexonest",
    "software development Nigeria",
    "Next.js developers",
    "AI automation",
    "Lagos software company",
    "mobile app development",
    "UI/UX design",
    "tech training Nigeria",
  ],
  alternates: { canonical: SITE_URL },
  category: "technology",
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description:
      "Modern apps, AI automations, and engineering training — built to scale.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Hexonest — Build fast. Ship smart.",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@hexonest",
    site: "@hexonest",
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description:
      "Modern apps, AI automations, and engineering training — built to scale.",
    images: ["/opengraph-image.png"],
  },
  icons: {
    icon: [
      { url: "/hexonest-favicon.ico" },
      { url: "/hexonest-favicon-32.png", sizes: "32x32" },
      { url: "/hexonest-favicon-16.png", sizes: "16x16" },
      { url: "/hexonest-favicon-192.png", sizes: "192x192" },
      { url: "/hexonest-favicon-512.png", sizes: "512x512" },
    ],
    apple: [{ url: "/hexonest-favicon-180.png", sizes: "180x180" }],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: { index: true, follow: true, noimageindex: false },
  },
  verification: {
    google: "GOOGLE_SITE_VERIFICATION_TOKEN", // replace
    other: { "msvalidate.01": ["BING_VERIFICATION_TOKEN"] },
  },
  appLinks: { web: { url: SITE_URL, should_fallback: true } },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0B0F19" }, // slate-950-ish
    { color: "#ffffff" },
  ],
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-background text-foreground`}
        suppressHydrationWarning
      >
        <AppInitProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </AppInitProvider>
        <Toaster position="top-right" richColors />

        {/* <Toaster position="top-center" toastOptions={{ duration: 5000 }} /> */}

        {/* Organization + Website + LocalBusiness JSON‑LD */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: ORG.name,
                legalName: ORG.legalName,
                url: ORG.url,
                logo: ORG.logo,
                sameAs: ORG.sameAs,
                contactPoint: {
                  "@type": "ContactPoint",
                  ...ORG.contactPoint,
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                url: SITE_URL,
                name: SITE_NAME,
                potentialAction: {
                  "@type": "SearchAction",
                  target: `${SITE_URL}/search?q={search_term_string}`,
                  "query-input": "required name=search_term_string",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                name: ORG.name,
                url: SITE_URL,
                image: `${SITE_URL}/opengraph-image.png`,
                address: { "@type": "PostalAddress", ...ORG.address },
                telephone: ORG.contactPoint.telephone,
                areaServed: "NG",
              },
            ]),
          }}
        />
      </body>
    </html>
  );
}
