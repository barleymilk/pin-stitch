import { Mail } from "lucide-react";
import Link from "next/link";

import { FooterLinkList } from "@/components/layout/footer-link-list";
import { IconLink } from "@/components/layout/icon-link";
import {
  FOOTER_COMPANY_LINKS,
  FOOTER_SERVICE_LINKS,
  FOOTER_SHOPPING_LINKS
} from "@/components/layout/nav-links";

const footerLinkClass =
  "text-sm text-text-muted transition-colors hover:text-text focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1";

export function SiteFooter() {
  return (
    <footer className="border-t border-border pt-6 md:pt-12" aria-label="사이트 정보">
      <div className="mx-auto max-w-[var(--width-customer)] px-4 pb-6">
        <section className="mb-8 max-w-lg">
          <h3 className="mb-2 text-xl font-semibold md:mb-4 md:text-2xl">
            <Link href="/" className="transition-colors hover:text-primary">
              PIN-STITCH
            </Link>
          </h3>
          <p className="text-sm text-text-muted">
            핀스티치는 정교한 데이터 분석을 통해 당신만의 고유한 스타일과 완벽한 핏을 제안하는 프리미엄 패션
            큐레이션 플랫폼입니다.
          </p>
        </section>

        <div className="mb-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <FooterLinkList title="쇼핑" links={FOOTER_SHOPPING_LINKS} />
          <FooterLinkList title="서비스" links={FOOTER_SERVICE_LINKS} />
          <FooterLinkList title="회사" links={FOOTER_COMPANY_LINKS} />
          <section>
            <h4 className="mb-3 font-semibold md:mb-4">문의</h4>
            <ul className="space-y-2">
              <li>
                <Link href="tel:15880000" className={footerLinkClass}>
                  Tel: 1588-0000
                </Link>
              </li>
              <li>
                <Link href="mailto:support@pin-stitch.com" className={footerLinkClass}>
                  Email: support@pin-stitch.com
                </Link>
              </li>
              <li className="text-sm text-text-muted">평일 10:00 - 18:00 (주말·공휴일 제외)</li>
            </ul>
          </section>
        </div>

        <div className="flex w-full flex-col gap-3 border-t border-border pt-4 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-text-muted">&copy; 2026 PIN-STITCH. All rights reserved.</div>
          <IconLink href="mailto:support@pin-stitch.com" label="이메일 문의" className="self-end md:self-auto">
            <Mail className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          </IconLink>
        </div>
      </div>
    </footer>
  );
}
