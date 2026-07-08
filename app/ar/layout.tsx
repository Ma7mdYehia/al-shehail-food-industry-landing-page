import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Noto_Kufi_Arabic } from "next/font/google";
import "../globals.css";

// Arabic fonts are bound to the SAME CSS variable names the English layout uses
// (--font-inter for body/sans, --font-playfair for headings/serif) so the shared
// Tailwind config resolves to the correct script per locale with no config change.
const arabicSans = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const arabicKufi = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-playfair",
  display: "swap",
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
      className={`${arabicSans.variable} ${arabicKufi.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
