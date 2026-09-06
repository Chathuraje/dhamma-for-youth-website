import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookMarked } from "lucide-react";

import { Breadcrumbs } from "@/components/app/Breadcrumbs";
import { BlockRenderer } from "@/components/lesson/BlockRenderer";
import { LessonRail } from "@/components/lesson/LessonRail";
import { SectionHeading } from "@/components/lesson/SectionHeading";
import { Sources } from "@/components/lesson/Sources";
import { Reveal } from "@/components/motion/Reveal";
import { Container, Eyebrow, Pali } from "@/components/ui";
import { allReferences, getReference } from "@/content/reference";
import { t } from "@/lib/strings";

export function generateStaticParams() {
  return allReferences().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/reference/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const topic = getReference(slug);
  if (!topic) return { title: "යොමුව හමු නොවීය" };
  return {
    title: topic.title,
    description: topic.summary,
    openGraph: { title: topic.title, description: topic.summary },
  };
}

/**
 * A single reference topic.
 *
 * Renders with the same blocks and the same rail as a lesson — background
 * material deserves the same interactives — but it is visually keyed to jade
 * rather than cobalt, and carries no lesson number or progress claim, so a
 * learner always knows they have stepped off the course.
 */
export default async function ReferenceTopicPage({
  params,
}: PageProps<"/reference/[slug]">) {
  const { slug } = await params;
  const topic = getReference(slug);
  if (!topic) notFound();

  const related = (topic.see ?? [])
    .map((s) => getReference(s))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  return (
    <>
      <header className="relative overflow-hidden border-b border-line-soft">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-96 w-3xl -translate-x-1/2 rounded-full bg-jade-500/8 blur-[110px]"
        />

        <Container className="relative py-10 sm:py-14" width="wide">
          <Breadcrumbs
            crumbs={[
              { label: t.reference.heading, href: "/reference" },
              { label: topic.title },
            ]}
          />

          <Reveal delay={0.05}>
            <Eyebrow className="eyebrow-si mt-8 text-jade-ink">
              {topic.category}
            </Eyebrow>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="si-tight mt-3 max-w-3xl font-display text-[clamp(1.9rem,4.5vw,3.25rem)] font-semibold text-ink">
              {topic.title}
            </h1>
          </Reveal>

          {topic.pali && (
            <Reveal delay={0.14}>
              <Pali className="mt-2 block text-xl text-jade-ink/85">
                {topic.pali}
              </Pali>
            </Reveal>
          )}

          <Reveal delay={0.18}>
            <p className="prose-dhamma mt-5 max-w-2xl text-lg">
              {topic.summary}
            </p>
          </Reveal>

          <Reveal delay={0.22}>
            <p className="si-heading mt-6 inline-flex items-center gap-2 rounded-full bg-jade-500/10 px-3.5 py-1.5 text-xs text-jade-ink ring-1 ring-jade-500/25">
              <BookMarked size={12} />
              {t.reference.notRequired}
            </p>
          </Reveal>
        </Container>
      </header>

      <Container className="py-12" width="wide">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="min-w-0 max-w-3xl xl:order-1">
            {topic.sections.map((section, si) => (
              <section
                key={section.id}
                id={`section-${section.id}`}
                className="scroll-mt-24 pb-20"
                aria-labelledby={`heading-${section.id}`}
              >
                <SectionHeading
                  id={section.id}
                  index={si + 1}
                  title={section.title}
                  pali={section.pali}
                  brief={section.brief}
                  accent="jade"
                />

                {section.blocks.map((block, bi) => (
                  <BlockRenderer
                    key={bi}
                    block={block}
                    lessonSlug={`__ref:${topic.slug}`}
                    sectionId={section.id}
                    index={bi}
                  />
                ))}
              </section>
            ))}

            {related.length > 0 && (
              <Reveal>
                <section className="mt-4 rounded-2xl bg-surface p-6 ring-1 ring-jade-500/25">
                  <h2 className="si-heading text-xs font-semibold text-jade-ink">
                    {t.reference.related}
                  </h2>
                  <ul className="mt-4 space-y-2">
                    {related.map((r) => (
                      <li key={r.slug}>
                        <Link
                          href={`/reference/${r.slug}`}
                          className="si-heading text-sm text-ink-dim transition-colors hover:text-jade-ink"
                        >
                          {r.title}
                          <span className="ml-2 text-xs text-ink-faint">
                            {r.summary}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              </Reveal>
            )}

            <Sources sources={topic.sources} accent="jade" />
          </div>

          <aside className="xl:order-2">
            <div className="xl:sticky xl:top-24">
              <LessonRail
                slug={`__ref:${topic.slug}`}
                sections={topic.sections.map((s) => ({
                  id: s.id,
                  title: s.title,
                  brief: s.brief,
                }))}
                accent="jade"
              />
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
