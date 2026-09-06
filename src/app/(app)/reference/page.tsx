import type { Metadata } from "next";
import { ArrowRight, BookMarked } from "lucide-react";
import { Breadcrumbs } from "@/components/app/Breadcrumbs";
import { ReferenceLink } from "@/components/lesson/ReferenceLink";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Container, Eyebrow, Pali } from "@/components/ui";
import { referencesByCategory, visibleReferences } from "@/content/reference";
import { t } from "@/lib/strings";

export const metadata: Metadata = {
  title: t.reference.heading,
  description:
    "පාඩම්වලින් යොමු කරන පසුබිම් තොරතුරු (විශ්ව විද්‍යාව, භව, ලෝක ධාතු ආදිය). අභිධර්මයට කෙළින්ම අයත් නොවන එහෙත් දැනගැනීම ප්‍රයෝජනවත් කරුණු.",
};

/**
 * Reference index.
 *
 * Deliberately framed as *background*, not as a second course. Lessons link
 * into it by name; nothing here carries progress, and nothing here is required
 * reading.
 */
export default function ReferencePage() {
  const groups = referencesByCategory();
  const total = visibleReferences().length;

  return (
    <Container className="py-10 sm:py-14" width="default">
      <Breadcrumbs crumbs={[{ label: t.reference.heading }]} className="mb-8" />

      <Reveal>
        <Eyebrow className="eyebrow-si">යොමු</Eyebrow>
        <h1 className="si-heading mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">
          {t.reference.heading}
        </h1>
        <p className="prose-dhamma mt-4 max-w-xl text-lg">
          පාඩම්වලින් නමින් යොමු කරන පසුබිම් තොරතුරු. මේවා අභිධර්මයට කෙළින්ම
          අයත් නොවේ. එහෙත් පාඩමක් &lsquo;තාවතිංසය&rsquo; යැයි කී විට එය කුමක්දැයි
          දැනගැනීම ප්‍රයෝජනවත් වේ.
        </p>
        <p className="si-heading mt-3 text-sm text-ink-faint">
          {t.reference.notRequired}
        </p>
      </Reveal>

      <div className="mt-14 space-y-12">
        {groups.map((group) => (
          <section key={group.category}>
            <Reveal>
              <h2 className="si-heading flex items-center gap-2 text-sm font-semibold text-cobalt-ink">
                <BookMarked size={14} />
                {group.category}
                <span className="font-mono text-xs text-ink-faint">
                  {group.topics.length}
                </span>
              </h2>
            </Reveal>

            <Stagger className="mt-5 grid gap-4 sm:grid-cols-2" gap={0.07}>
              {group.topics.map((topic) => (
                <StaggerItem key={topic.slug} className="h-full">
                  <ReferenceLink
                    slug={topic.slug}
                    className="group flex h-full flex-col rounded-2xl bg-surface p-5 ring-1 ring-line transition-all duration-300 hover:ring-jade-500/40"
                  >
                    <h3 className="si-heading font-display text-lg font-semibold text-ink">
                      {topic.title}
                    </h3>
                    {topic.pali && (
                      <Pali className="mt-0.5 text-sm text-jade-ink/80">
                        {topic.pali}
                      </Pali>
                    )}
                    <p className="prose-dhamma mt-2 flex-1 text-sm">
                      {topic.summary}
                    </p>
                    <span className="si-heading mt-4 flex items-center gap-1 text-xs font-medium text-jade-ink transition-transform duration-300 group-hover:translate-x-0.5">
                      {t.reference.open}
                      <ArrowRight size={13} />
                    </span>
                  </ReferenceLink>
                </StaggerItem>
              ))}
            </Stagger>
          </section>
        ))}
      </div>

      {total === 0 && (
        <Reveal>
          <p className="prose-dhamma mt-14 text-center">
            තවම යොමු මාතෘකා එකතු කර නැත.
          </p>
        </Reveal>
      )}
    </Container>
  );
}
