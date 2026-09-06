import Link from "next/link";

import { t } from "@/lib/strings";

/**
 * What an unbuilt section says.
 *
 * It names what it will be, says plainly that it is not there yet, and points
 * at what *is* built. The alternative — a page dressed as if it worked, with
 * placeholder counts and stock avatars — would be the first untrue thing on
 * the site, and this project's whole claim is that it does not do that.
 */
export function ComingSoon({
  icon,
  what,
  links,
}: {
  icon: React.ReactNode;
  /** One or two lines on what this section is for, in Sinhala. */
  what: string;
  /** Where to send someone instead. */
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <div className="rounded-3xl bg-surface p-8 text-center shadow-card ring-1 ring-line sm:p-12">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cobalt-100 text-cobalt-600">
        {icon}
      </span>

      <p className="mt-6 inline-block rounded-full bg-surface-2 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.12em] text-ink-faint">
        {t.app.comingSoon}
      </p>

      <p className="prose-dhamma mx-auto mt-4 max-w-md text-[0.98rem]">{what}</p>

      <p className="si-heading mx-auto mt-3 max-w-md text-sm text-ink-faint">
        {t.app.comingSoonNote}
      </p>

      {links.length > 0 ? (
        <ul className="mt-8 flex flex-wrap justify-center gap-2.5">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="inline-flex items-center gap-2 rounded-full bg-surface-2 px-4 py-2.5 ring-1 ring-line transition-colors hover:bg-surface-3"
              >
                <span className="si-heading block text-sm font-medium leading-none text-ink">
                  {link.label}
                </span>
                <span aria-hidden className="text-ink-faint">
                  &rarr;
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
