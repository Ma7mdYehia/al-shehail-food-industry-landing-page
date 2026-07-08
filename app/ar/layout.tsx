import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";

// Self-hosted Arabic fonts (no next/font/google, no runtime requests to
// fonts.googleapis.com / fonts.gstatic.com). Files live in app/fonts/arabic/
// and are licensed under the SIL Open Font License — see
// docs/font-licenses.md and public/fonts/arabic/LICENSES/ for full text and
// provenance. Bound to the SAME CSS variable names the English layout uses
// (--font-inter for body/sans, --font-playfair for headings/serif) so the
// shared Tailwind config resolves to the correct script per locale with no
// config change.
const arabicSans = localFont({
  src: [
    { path: "../fonts/arabic/IBMPlexSansArabic-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/arabic/IBMPlexSansArabic-Medium.ttf", weight: "500", style: "normal" },
    { path: "../fonts/arabic/IBMPlexSansArabic-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../fonts/arabic/IBMPlexSansArabic-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
});

// Kufam is a variable font (weight axis 400-900) — a single file covers the
// full weight range the design needs (500/600/700), so no weight array.
const arabicHeading = localFont({
  src: "../fonts/arabic/Kufam-VariableFont_wght.ttf",
  variable: "--font-playfair",
  display: "swap",
  weight: "400 700",
});

const siteUrl = "https://www.alshehai.ae";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "الشهيل للصناعات الغذائية | تصنيع مخبوزات وعلامات خاصة في الإمارات",
    template: "%s | الشهيل للصناعات الغذائية",
  },
  description:
    "الشهيل للصناعات الغذائية شريك تصنيع مخبوزات مقره الإمارات، متخصص في حلول العلامة الخاصة. من فكرة المنتج إلى منتج جاهز للرف — تطوير، تصنيع، تغليف، وتوريد لعلامات غذائية حديثة.",
  keywords: [
    "تصنيع مخبوزات في الإمارات",
    "علامة خاصة مخبوزات",
    "مصنع مخبوزات بالعقد",
    "الشهيل للصناعات الغذائية",
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
    url: `${siteUrl}/ar`,
    siteName: "الشهيل للصناعات الغذائية",
    title: "شريك تصنيع المخبوزات وحلول العلامة الخاصة في الإمارات",
    description:
      "من الفكرة إلى الرف — يطوّر الشهيل ويصنّع منتجات مخبوزات مهيأة للنجاح في التجزئة.",
  },
  twitter: {
    card: "summary_large_image",
    title: "الشهيل للصناعات الغذائية | تصنيع مخبوزات بعلامة خاصة",
    description:
      "من الفكرة إلى الرف — شريك تصنيع مخبوزات وعلامات خاصة مقره الإمارات للعلامات الغذائية الحديثة.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ArabicRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${arabicSans.variable} ${arabicHeading.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
