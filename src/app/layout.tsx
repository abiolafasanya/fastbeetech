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

// ---- Site constants (adjust to prod domain) ----
const SITE_URL = "https://fastbeetech.com";
const SITE_NAME = "Fastbeetech";
const SITE_TAGLINE = "Empowering Africa’s Digital Future";

// Optional: exact office address for Local SEO (Lagos)
const ORG = {
  name: "Fastbeetech",
  legalName: "Fastbeetech",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  sameAs: [
    "https://x.com/fastbeetech",
    // add more socials when ready
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
    "Fastbeetech builds modern web & mobile apps, AI automations, and trains young engineers. Ship faster with Next.js, Express, and solid UX.",
  keywords: [
    "Fastbeetech",
    "software development Nigeria",
    "Next.js developers",
    "AI automation",
    "Lagos software company",
    "mobile app development",
    "UI/UX design",
    "tech training Nigeria",
  ],
  alternates: {
    canonical: SITE_URL, // per-page can override in generateMetadata
  },
  category: "technology",
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description:
      "Modern apps, AI automations, and engineering training for Africa’s digital future.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Fastbeetech — Empowering Africa’s Digital Future",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@fastbeetech",
    site: "@fastbeetech",
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description:
      "Modern apps, AI automations, and engineering training for Africa’s digital future.",
    images: ["/opengraph-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192" },
      { url: "/icon-512.png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      // maxSnippet: -1,
      // maxImagePreview: "large",
      // maxVideoPreview: -1,
    },
  },
  verification: {
    google: "GOOGLE_SITE_VERIFICATION_TOKEN", // <- replace
    other: {
      "msvalidate.01": ["BING_VERIFICATION_TOKEN"], // optional
    },
  },
  appLinks: {
    web: {
      url: SITE_URL,
      should_fallback: true,
    },
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0B0F19" },
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
      >
        <AppInitProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </AppInitProvider>
        <Toaster position="top-center" toastOptions={{ duration: 5000 }} />

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
