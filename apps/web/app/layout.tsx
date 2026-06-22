import type { Metadata } from "next";
import { DM_Serif_Display, JetBrains_Mono, Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import "./globals.css";

const dmSerif = DM_Serif_Display({ weight: "400", subsets: ["latin"], variable: "--font-dm-serif", display: "swap" });
const notoSerifJp = Noto_Serif_JP({ weight: ["400", "600"], subsets: ["latin"], variable: "--font-noto-serif-jp", display: "swap" });
const notoSansJp = Noto_Sans_JP({ weight: ["400", "500", "700"], subsets: ["latin"], variable: "--font-noto-sans-jp", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "WHV Compass — オーストラリアワーホリAI相談",
  description:
    "公式情報を土台に、AIと一緒にオーストラリアのワーキングホリデーを計画する。相談すると右の知識グラフが自動で育ちます。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${dmSerif.variable} ${notoSerifJp.variable} ${notoSansJp.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}
