import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { railGroups, site } from "@/lib/site";
import { t } from "@/lib/strings";

/**
 * The public site's footer.
 *
 * Two columns of links — the pages about the project, and the course's own
 * sections — then the two claims this site is built on: it costs nothing, and
 * it sends nothing anywhere.
 */
export function Footer() {
  /** The course's public surfaces. Personal pages are meaningless without the
      learner's own stored progress, so they are not advertised here. */
  const courseLinks = railGroups
    .flatMap((g) => g.items)
    .filter((i) => !i.soon)
    .filter((i) =>
      ["/chapters", "/practice", "/reference", "/glossary"].includes(
        i.href,
      ),
    );

  return (
    <footer className="mt-24 border-t border-line-soft bg-surface/50">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_repeat(2,minmax(0,1fr))]">
          <div className="max-w-sm">
            <p className="si-heading font-display text-lg font-semibold text-ink">
              {site.name}
            </p>
            <p className="si-heading mt-2 text-sm text-ink-dim">
              {site.tagline}
            </p>

            <Link
              href={site.appHome}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-cobalt-500 px-4 py-2.5 text-on-brand transition-colors hover:bg-cobalt-600"
            >
              <span className="si-heading block text-sm font-medium leading-none">
                {t.nav.openDashboard}
              </span>
              <ArrowRight size={15} aria-hidden />
            </Link>
          </div>

          <FooterColumn
            title={t.nav.home}
            links={site.nav.map((i) => ({ href: i.href, label: i.label }))}
          />

          <FooterColumn
            title={t.footer.study}
            links={courseLinks.map((i) => ({ href: i.href, label: i.label }))}
          />
        </div>

        <div className="si-heading mt-12 flex flex-col gap-3 border-t border-line-soft pt-6 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>{t.footer.freeNote}</p>
          <p>{t.footer.privacyNote}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <nav aria-label={title}>
      <p className="si-heading mb-3 text-xs font-semibold text-ink">{title}</p>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group inline-block transition-colors hover:text-cobalt-600"
            >
              <span className="si-heading block text-sm text-ink-dim group-hover:text-cobalt-600">
                {link.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
