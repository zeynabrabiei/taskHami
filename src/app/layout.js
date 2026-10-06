import { Vazirmatn } from "next/font/google";
import Providers from "./providers";

const font = Vazirmatn({ subsets: ["arabic", "latin"], display: "swap" });

export const metadata = { title: "درخت حساب‌ها" };

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body className={font.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}