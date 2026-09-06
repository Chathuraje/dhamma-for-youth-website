import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Layers,
  Mail,
  Newspaper,
  Sparkles,
  Users,
} from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import {
  ButtonLink,
  Container,
  Eyebrow,
  Pali,
} from "@/components/ui";
import { MindField } from "@/components/visuals/MindField";
import { glossary } from "@/content/glossary";
import { courseOutline, courseTotals } from "@/lib/course";
import { site } from "@/lib/site";
import { t } from "@/lib/strings";
import { formatNumber } from "@/lib/utils";

/**
 * THE PUBLIC HOME PAGE
 * ====================
 * For someone who has not started. It says what this is, why it is built the
 * way it is, what is in it, and where else to go — and offers exactly one
 * primary action: open the dashboard.
 *
 * The course itself does not live here. It lives behind that button, in the
 * app shell, where a learner gets a rail, their progress and their own pages.
 */
export default function HomePage() {
  const chapters = courseOutline();
  const totals = courseTotals();

  return (
    <>
      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                             */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative flex min-h-[82vh] items-center overflow-hidden">
        <MindField />

        <Container className="relative z-10 py-24 text-center">
          <Reveal>
            <span className="si-heading inline-flex items-center gap-2 rounded-full bg-surface/70 px-3.5 py-1.5 text-xs text-ink-dim ring-1 ring-line backdrop-blur-sm">
              <Sparkles size={12} className="text-cobalt-600" aria-hidden />
              අන්තර්ක්‍රියාකාරී අභිධර්ම පාඨමාලාව
            </span>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="si-tight mx-auto mt-7 max-w-4xl font-display text-[clamp(2.1rem,6vw,4.25rem)] font-semibold text-ink">
              විශ්වය බිඳ දැක්ම
              <span className="mt-2 block text-gradient-cobalt">
                අවසානයේ ඉතිරි වන්නේ කුමක්ද?
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="prose-dhamma mx-auto mt-7 max-w-xl text-lg">
              වසර දෙදහස් පන්සියයකට පෙර අභිධර්මය සිත සහ පදාර්ථය මොහොතින් මොහොත
              විග්‍රහ කළේය. එම විග්‍රහය මෙන්න (අත්හදා බැලිය හැකි ලෙස, පාඩමෙන්
              පාඩම).
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={site.appHome}
                className="inline-flex items-center gap-2.5 rounded-full bg-cobalt-500 px-6 py-3.5 text-on-brand transition-all duration-200 hover:bg-cobalt-600 hover:shadow-glow-cobalt active:scale-[0.98]"
              >
                <span className="si-heading block text-base font-medium leading-none">
                  {t.nav.openDashboard}
                </span>
                <ArrowRight size={17} aria-hidden />
              </Link>

              <ButtonLink
                href="/about"
                variant="secondary"
                size="lg"
                className="si-heading"
              >
                {t.nav.about}
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={0.32}>
            <p className="si-heading mt-8 text-xs text-ink-faint">
              නොමිලේ &middot; ගිණුමක් අවශ්‍ය නැත &middot; ඔබේ ප්‍රගතිය ඔබේ
              උපකරණයේම
            </p>
          </Reveal>

          <Reveal delay={0.38}>
            <dl className="mx-auto mt-12 flex max-w-lg flex-wrap items-center justify-center gap-x-10 gap-y-4">
              <Figure
                value={formatNumber(totals.chapters)}
                label={t.nav.chapters}
              />
              <Figure
                value={formatNumber(totals.lessons)}
                label={t.course.lessons}
              />
              <Figure
                value={formatNumber(totals.terms)}
                label={t.glossary.terms}
              />
            </dl>
          </Reveal>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Why it is built this way                                         */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative py-24">
        <Container>
          <Reveal>
            <Eyebrow className="eyebrow-si">මෙය මෙසේ ගොඩනැගූ හේතුව</Eyebrow>
            <h2 className="si-heading mt-3 max-w-2xl font-display text-3xl font-semibold text-ink sm:text-4xl">
              අභිධර්මය පද්ධතියකි. එය පද්ධතියක් ලෙසම ඉගැන්විය යුතුය.
            </h2>
          </Reveal>

          <Stagger className="mt-14 grid gap-5 sm:grid-cols-3" gap={0.1}>
            {[
              {
                icon: Layers,
                title: "ව්‍යුහය දකින්න",
                body: "පරමාර්ථ ධර්ම 82. වගුව විවෘත කර ගණන් එකතු වන අයුරු බලන විට, ඒවා අංක බිත්තියක් වීම නවතී.",
                accent: "text-cobalt-600",
              },
              {
                icon: Compass,
                title: "ඔබම බිඳ බලන්න",
                body: "මැටි කළයක්, පළා කොළයක්, මිනිස් සිරුරක්. පියවරෙන් පියවර බිඳන්න, හතරම එකම තැනකට එන බව ඔබම දකින්න.",
                accent: "text-jade-600",
              },
              {
                icon: Sparkles,
                title: "අත්හදා බලන්න",
                body: "ධාතු ප්‍රතිශත වෙනස් කර ලෝකය වෙනස් වන අයුරු, කාල අනුපාතය ගණනය කර දෙව්ලොව විනාඩියක් කුමක්ද යන්න.",
                accent: "text-lotus-600",
              },
            ].map((f) => (
              <StaggerItem key={f.title} className="h-full">
                <div className="flex h-full flex-col rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line transition-all duration-300 hover:-translate-y-0.5 hover:ring-cobalt-500/35">
                  <f.icon size={20} className={f.accent} aria-hidden />
                  <h3 className="si-heading mt-4 font-display text-lg font-semibold text-ink">
                    {f.title}
                  </h3>
                  <p className="prose-dhamma mt-2 text-sm">{f.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Chapters                                                         */}
      {/* ---------------------------------------------------------------- */}
      {chapters.length > 0 && (
        <section className="relative py-16">
          <Container>
            <Reveal>
              <Eyebrow className="eyebrow-si">පාඨමාලාව</Eyebrow>
              <h2 className="si-heading block mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
                {t.nav.chapters}
              </h2>
            </Reveal>

            <Stagger className="mt-10 space-y-4" gap={0.09}>
              {chapters.map((chapter) => (
                <StaggerItem key={chapter.slug}>
                  <Link
                    href={`/chapters/${chapter.slug}`}
                    className="group block rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line transition-all duration-300 hover:-translate-y-0.5 hover:ring-cobalt-500/40 sm:p-8"
                  >
                    <span className="font-mono text-sm text-cobalt-600">
                      {t.course.chapter}{" "}
                      {String(chapter.number).padStart(2, "0")}
                    </span>
                    <span className="si-heading block mt-2 font-display text-2xl font-semibold text-ink transition-colors group-hover:text-cobalt-600">
                      {chapter.title}
                    </span>
                    <p className="prose-dhamma mt-2 max-w-2xl text-[0.97rem]">
                      {chapter.summary}
                    </p>
                    <span className="si-heading mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-cobalt-600">
                      {t.course.begin}
                      <span className="text-ink-faint">
                        &middot; {formatNumber(chapter.lessons.length)}{" "}
                        {t.course.lessons}
                      </span>
                      <ArrowRight
                        size={14}
                        aria-hidden
                        className="transition-transform duration-300 group-hover:translate-x-0.5"
                      />
                    </span>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </Container>
        </section>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Glossary teaser                                                  */}
      {/* ---------------------------------------------------------------- */}
      <section className="py-16">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-surface p-8 shadow-card ring-1 ring-line sm:p-12">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cobalt-500/10 blur-3xl"
              />
              <div className="relative">
                <Eyebrow className="eyebrow-si">සෑම යෙදුමක්ම පැහැදිලියි</Eyebrow>
                <h2 className="si-heading mt-3 max-w-lg font-display text-2xl font-semibold text-ink sm:text-3xl">
                  පැහැදිලි නොකළ පාලි වචනයක් ඔබට මෙහි හමු නොවේ.
                </h2>
                <p className="prose-dhamma mt-3 max-w-lg text-sm">
                  යෙදුම් සෑම තැනකම සම්බන්ධ කර ඇත. ඕනෑම එකක් මත මූසිකය තබා හෝ
                  තට්ටු කර, ඔබේ තැන නැති නොකර අර්ථය, උච්චාරණය සහ වචනාර්ථය
                  බලන්න.
                </p>

                <ul className="mt-7 flex flex-wrap gap-2">
                  {glossary.slice(0, 10).map((term) => (
                    <li
                      key={term.id}
                      className="rounded-full bg-surface-2 px-3 py-1.5 ring-1 ring-line"
                    >
                      <Pali className="text-sm text-cobalt-600">{term.pali}</Pali>
                    </li>
                  ))}
                  <li className="si-heading rounded-full px-3 py-1.5 text-sm text-ink-faint">
                    තවත් {formatNumber(Math.max(glossary.length - 10, 0))}ක්
                  </li>
                </ul>

                <ButtonLink
                  href="/glossary"
                  variant="secondary"
                  className="si-heading mt-8"
                >
                  {t.nav.glossary}
                  <ArrowRight size={15} aria-hidden />
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* About the site                                                   */}
      {/* ---------------------------------------------------------------- */}
      <section className="pb-8">
        <Container>
          <Reveal>
            <Eyebrow className="eyebrow-si">මෙම අඩවිය ගැන</Eyebrow>
            <h2 className="si-heading block mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
              ව්‍යාපෘතිය පිළිබඳව
            </h2>
          </Reveal>

          <Stagger className="mt-10 grid gap-4 sm:grid-cols-3" gap={0.08}>
            {[
              {
                href: "/about",
                icon: Users,
                si: t.nav.about,
                body: "මෙය කුමක්ද, කවුරුන් විසින්ද, පාඩම් සකසන ආකාරය සහ ඔබේ දත්ත හසුරුවන ආකාරය.",
              },
              {
                href: "/blog",
                icon: Newspaper,
                si: t.nav.blog,
                body: "පාඩම් අතරට නොගැලපෙන එහෙත් ලිවීමට වටින කරුණු. පාඨමාලාවේ කොටසක් නොවේ.",
              },
              {
                href: "/contact",
                icon: Mail,
                si: t.nav.contact,
                body: "පාඩමක වරදක් හෝ පැහැදිලි නොවන තැනක් දුටුවොත් කෙලින්ම දන්වන්න.",
              },
            ].map((card) => (
              <StaggerItem key={card.href} className="h-full">
                <Link
                  href={card.href}
                  className="group flex h-full flex-col rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line transition-all duration-300 hover:-translate-y-0.5 hover:ring-cobalt-500/40"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cobalt-100 text-cobalt-600">
                    <card.icon size={18} aria-hidden />
                  </span>
                  <span className="si-heading block mt-4 font-display text-lg font-semibold text-ink transition-colors group-hover:text-cobalt-600">
                    {card.si}
                  </span>
                  <p className="prose-dhamma mt-2 text-sm">{card.body}</p>
                  <span
                    aria-hidden
                    className="mt-4 text-sm text-cobalt-600 transition-transform duration-300 group-hover:translate-x-0.5"
                  >
                    &rarr;
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>
    </>
  );
}

function Figure({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <dt className="sr-only">{label}</dt>
      <dd>
        <span className="block font-display text-2xl font-semibold text-ink">
          {value}
        </span>
        <span className="si-heading mt-1 block text-[0.72rem] text-ink-faint">
          {label}
        </span>
      </dd>
    </div>
  );
}
