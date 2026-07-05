import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Noto_Kufi_Arabic } from "next/font/google";
import "./globals.css";

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic-sans",
  display: "swap",
});

const notoKufiArabic = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-arabic-kufi",
  display: "swap",
});

const siteUrl = "https://www.alshehai.ae";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "الشحيل للصناعات الغذائية | تصنيع مخبوزات وعلامات خاصة في الإمارات",
    template: "%s | الشحيل للصناعات الغذائية",
  },
  description:
    "الشحيل للصناعات الغذائية شريك تصنيع مخبوزات مقره الإمارات، متخصص في حلول العلامة الخاصة. من فكرة المنتج إلى منتج جاهز للتوريد — تطوير، تصنيع، تغليف، وتوريد لعلامات غذائية جادة.",
  keywords: [
    "تصنيع مخبوزات في الإمارات",
    "علامة خاصة مخبوزات",
    "مصنع مخبوزات بالعقد",
    "الشحيل للصناعات الغذائية",
    "مورد مخبوزات للشركات",
    "مصنع كرواسان الإمارات",
    "مصنع خبز عربي",
    "مخبز معتمد HACCP",
    "مخبز معتمد ISO",
  ],
  authors: [{ name: "Al Shehail Food Industries" }],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "ar_AE",
    url: siteUrl,
    siteName: "الشحيل للصناعات الغذائية",
    title: "شريك تصنيع مخبوزات وعلامات خاصة في الإمارات",
    description:
      "من فكرة المنتج إلى جاهزية الرف — الشحيل تطوّر وتصنّع منتجات مخبوزات مبنية لتنجح في السوق.",
  },
  twitter: {
    card: "summary_large_image",
    title: "الشحيل للصناعات الغذائية | تصنيع مخبوزات وعلامات خاصة",
    description:
      "من فكرة المنتج إلى جاهزية الرف — شريك تصنيع مخبوزات مقره الإمارات لعلامات غذائية جادة.",
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
    <html
      lang="ar-AE"
      dir="rtl"
      className={`${ibmPlexSansArabic.variable} ${notoKufiArabic.variable}`}
    >
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
