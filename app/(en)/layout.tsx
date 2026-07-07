import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const siteUrl = "https://www.alshehai.ae";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "Al Shehail Food Industries | UAE Private Label Bakery Manufacturing",
    template: "%s | Al Shehail Food Industries",
  },
  description:
    "Al Shehail Food Industries is a UAE-based bakery manufacturing and private label partner. From product concept to retail-ready bakery solutions — developed, manufactured, packed, and scaled for modern food brands.",
  keywords: [
    "private label bakery",
    "bakery manufacturing UAE",
    "contract bakery manufacturer",
    "Al Shehail Food Industries",
    "B2B bakery supplier",
    "croissant manufacturer UAE",
    "Arabic bread manufacturer",
    "HACCP bakery",
    "ISO bakery manufacturer",
  ],
  authors: [{ name: "Al Shehail Food Industries" }],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Al Shehail Food Industries",
    title: "UAE-Based Bakery Manufacturing & Private Label Partner",
    description:
      "From idea to shelf — Al Shehail develops and manufactures bakery products built for retail success.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Al Shehail Food Industries | Private Label Bakery Manufacturing",
    description:
      "From idea to shelf — UAE-based bakery manufacturing and private label partner for modern food brands.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        {children}

        {/*
          TRACKING / ANALYTICS PLACEHOLDER — intentionally not loaded yet.
          IDs live in lib/analytics.ts (currently empty). When ready, add the
          scripts here, gated on the relevant ID being set, e.g.:

          {analyticsConfig.googleAnalyticsId && (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.googleAnalyticsId}`}
                strategy="afterInteractive"
              />
              <Script id="ga4" strategy="afterInteractive">{`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${analyticsConfig.googleAnalyticsId}');
              `}</Script>
            </>
          )}

          - Meta Pixel:        analyticsConfig.metaPixelId
          - LinkedIn Insight:  analyticsConfig.linkedInPartnerId

          No tracking scripts run until these are configured.
        */}
      </body>
    </html>
  );
}
