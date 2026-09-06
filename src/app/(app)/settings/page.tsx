import type { Metadata } from "next";
import { Palette, ShieldCheck } from "lucide-react";

import { AppPage, PageHeader } from "@/components/app/PageHeader";
import { ResetProgress } from "@/components/app/ResetProgress";
import { ThemeChoice } from "@/components/app/ThemeChoice";
import { t } from "@/lib/strings";

export const metadata: Metadata = {
  title: t.settings.heading,
  description: t.settings.dataNote,
  robots: { index: false, follow: true },
};

/**
 * Settings.
 *
 * There is very little here, and that is the point: with no account there is
 * nothing to configure but how the site looks and whether to erase what it has
 * stored. Both live on this one page so a learner never has to hunt for the
 * delete button.
 */
export default function SettingsPage() {
  return (
    <AppPage className="max-w-3xl">
      <PageHeader
        crumbs={[{ label: t.settings.heading }]}
        title={t.settings.heading}
      />

      <div className="space-y-5">
        <Section
          icon={<Palette size={17} aria-hidden />}
          title={t.settings.appearance}
        >
          <ThemeChoice />
        </Section>

        <Section
          icon={<ShieldCheck size={17} aria-hidden />}
          title={t.settings.data}
        >
          <p className="prose-dhamma text-[0.95rem]">{t.settings.dataNote}</p>
          <ResetProgress />
        </Section>
      </div>
    </AppPage>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0 text-ink-faint">{icon}</span>
        <h2 className="si-heading font-display text-lg font-semibold text-ink">
          {title}
        </h2>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
