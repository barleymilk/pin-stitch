import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { BottomNav } from "@/components/layout/bottom-nav";
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
        <main className="pb-[calc(3.5rem+env(safe-area-inset-bottom,0px))] md:pb-0">
          {children}
        </main>
        <div className="hidden md:block">
          <SiteFooter />
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
