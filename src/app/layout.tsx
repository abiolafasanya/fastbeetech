import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/header";
import Footer from "./components/footer";
import { Toaster } from "@/components/ui/sonner";
import AppInitProvider from "./components/AppInitProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "Fastbeetech",
//   description: "Empowering Africa’s Digital Future",
// };

export const metadata: Metadata = {
  title: "Fastbeetech | Empowering Africa’s Digital Future",
  description:
    "Fastbeetech builds modern apps, trains young engineers, and delivers innovative solutions in software, mobile, design, and AI.",
  openGraph: {
    title: "Fastbeetech",
    description:
      "Empowering Africa’s Digital Future through software development, training, and digital services.",
    url: "https://fastbeetech.com",
    siteName: "Fastbeetech",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Fastbeetech",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: "index, follow",
  twitter: {
    card: "summary_large_image",
    title: "Fastbeetech",
    description: "Empowering Africa’s Digital Future",
    site: "@fastbeetech",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
      </body>
    </html>
  );
}
