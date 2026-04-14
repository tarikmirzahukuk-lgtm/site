import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Tarık Mirza | Ceza Hukuku Yazıları",
    template: "%s | Tarık Mirza",
  },
  description:
    "Ceza hukuku alanında akademik makaleler, içtihat değerlendirmeleri ve güncel hukuki analizler.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
