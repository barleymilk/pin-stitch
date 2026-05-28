import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { notoSans } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "pin-stitch",
  description: "체형 기반 커머스 MVP"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={notoSans.variable}>
      <body className={notoSans.className}>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
