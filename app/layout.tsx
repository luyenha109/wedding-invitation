import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { SITE_URL } from "@/lib/constants";
import "@/app/globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Đám cưới Luyến Hà & Thơ Nguyễn — Tháng 11 năm 2026 - Lâm Đồng",
  description:
    "Với niềm hạnh phúc trọn vẹn, chúng tôi trân trọng mời bạn đến chứng kiến và gửi lời chúc phúc cho đám cưới của Luyến Hà & Thơ Nguyễn vào Tháng 11 năm 2026 tại Lâm Đồng.",
  keywords: [
    "đám cưới",
    "wedding",
    "Luyến Hà",
    "Thơ Nguyễn",
    "thiệp cưới điện tử",
    "Lâm Đồng",
    "112026",
    "#LuyenTho112026",
  ],
  authors: [{ name: "Luyến Hà & Thơ Nguyễn" }],
  creator: "Luyến Hà & Thơ Nguyễn",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: "/icon.png",
  },
  robots: {
    index: true,
    follow: false,
    googleBot: {
      index: true,
      follow: false,
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Đám cưới Luyến Hà & Thơ Nguyễn — Tháng 11 năm 2026",
    description:
      "Chúng tôi mời bạn đến chứng kiến và gửi lời chúc phúc cho đám cưới của chúng tôi. Tháng 11 năm 2026, tại Lâm Đồng.",
    siteName: "Thiệp cưới Luyến Hà & Thơ Nguyễn",
    locale: "vi_VN",
    images: [
      {
        url: `${SITE_URL}/images/wedding1.jpg`,
        width: 1200,
        height: 1900,
        alt: "Đám cưới Luyến Hà & Thơ Nguyễn",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Đám cưới Luyến Hà & Thơ Nguyễn — Tháng 11 năm 2026",
    description:
      "Chúng tôi mời bạn đến chứng kiến khoảnh khắc hạnh phúc của chúng tôi. Tháng 11 năm 2026, tại Lâm Đồng.",
    images: [`${SITE_URL}/images/wedding1.jpg`],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFF8E7" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0A08" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${playfair.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
