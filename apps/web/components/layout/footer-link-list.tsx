import Link from "next/link";

import type { FooterLink } from "@/components/layout/nav-links";

const footerLinkClass =
  "text-sm text-text-muted transition-colors hover:text-text focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

type FooterLinkListProps = {
  title: string;
  links: FooterLink[];
};

export function FooterLinkList({ title, links }: FooterLinkListProps) {
  return (
    <section>
      <h4 className="mb-3 font-semibold md:mb-4">{title}</h4>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link href={link.href} className={footerLinkClass}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
