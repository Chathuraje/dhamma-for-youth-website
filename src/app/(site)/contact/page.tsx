import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, ArrowRight, Mail } from "lucide-react";

import { Reveal } from "@/components/motion/Reveal";
import { Container, Eyebrow } from "@/components/ui";
import { site } from "@/lib/site";
import { t } from "@/lib/strings";

export const metadata: Metadata = {
  title: t.nav.contact,
  description: t.contact.intro,
};

/**
 * Contact.
 *
 * There is no form here, deliberately. A form posts a visitor's words to
 * somebody's server, and the footer of every page on this site says nothing is
 * uploaded. An address that opens the reader's own mail client keeps that
 * claim literally true. If a form is ever added, the footer wording has to
 * change with it.
 */
export default function ContactPage() {
  return (
    <Container className="py-16 sm:py-24" width="narrow">
      <Reveal>
        <Eyebrow className="eyebrow-si">{t.nav.contact}</Eyebrow>
        <h1 className="si-heading block si-tight mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">
          {t.contact.heading}
        </h1>
        <p className="prose-dhamma mt-5 text-lg">{t.contact.intro}</p>
      </Reveal>

      <Reveal delay={0.06}>
        <a
          href={`mailto:${site.contactEmail}`}
          className="mt-10 flex items-center gap-4 rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line transition-all duration-300 hover:-translate-y-0.5 hover:ring-cobalt-500/40"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cobalt-100 text-cobalt-600">
            <Mail size={20} aria-hidden />
          </span>
          <span className="min-w-0">
            <span className="si-heading block text-sm font-medium text-ink">
              {t.contact.email}
            </span>
            <span className="mt-0.5 block truncate font-mono text-sm text-cobalt-600">
              {site.contactEmail}
            </span>
          </span>
          <ArrowRight
            size={17}
            aria-hidden
            className="ml-auto shrink-0 text-ink-faint"
          />
        </a>
      </Reveal>

      <Reveal delay={0.1}>
        <section className="mt-8 rounded-2xl bg-surface-2 p-6 ring-1 ring-line">
          <div className="flex items-start gap-3">
            <AlertCircle
              size={17}
              aria-hidden
              className="mt-0.5 shrink-0 text-gold-600"
            />
            <div>
              <h2 className="si-heading font-display text-lg font-semibold text-ink">
                {t.contact.corrections}
              </h2>
              <p className="prose-dhamma mt-2 text-[0.95rem]">
                {t.contact.correctionsNote}
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.14}>
        <p className="si-heading mt-8 text-sm text-ink-faint">
          {t.contact.formNote}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/about"
            className="si-heading inline-flex items-center gap-2 rounded-full bg-surface-2 px-4 py-2.5 text-sm font-medium text-ink ring-1 ring-line transition-colors hover:bg-surface-3"
          >
            {t.nav.about}
            <ArrowRight size={14} aria-hidden />
          </Link>
          <Link
            href={site.appHome}
            className="si-heading inline-flex items-center gap-2 rounded-full bg-cobalt-500 px-4 py-2.5 text-sm font-medium text-on-brand transition-colors hover:bg-cobalt-600"
          >
            {t.nav.openDashboard}
            <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
      </Reveal>
    </Container>
  );
}
