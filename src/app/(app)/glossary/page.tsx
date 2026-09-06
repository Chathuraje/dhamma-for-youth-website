import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/app/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { Container, Eyebrow } from "@/components/ui";
import { allTerms } from "@/content/glossary";
import { t } from "@/lib/strings";
import { GlossaryBrowser } from "./GlossaryBrowser";

export const metadata: Metadata = {
  title: t.glossary.heading,
  description:
    "පාඨමාලාවේ භාවිත වන සෑම පාලි යෙදුමක්ම (උච්චාරණය, වචනාර්ථය සහ සරල අර්ථ දැක්වීම සමඟ).",
};

export default function GlossaryPage() {
  const terms = allTerms();

  return (
    <Container className="py-10 sm:py-14" width="default">
      <Breadcrumbs crumbs={[{ label: t.glossary.heading }]} className="mb-8" />

      <Reveal>
        <Eyebrow className="eyebrow-si">යොමුව</Eyebrow>
        <h1 className="si-heading mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">
          {t.glossary.heading}
        </h1>
        <p className="prose-dhamma mt-4 max-w-xl text-lg">
          සිංහලෙන් නොහොත් ඉංග්‍රීසියෙන් අපැහැදිලි වන තැන පාලි නිශ්චිතයි.
          අභිධර්මය පාලි යෙදුම් තබා ගන්නේ එබැවිනි. පාඨමාලාවේ භාවිත වන සෑම
          යෙදුමක්ම මෙහි අර්ථ දක්වා ඇත.
        </p>
        <p className="prose-dhamma mt-3 max-w-xl text-sm">
          සෙවීමේදී දීර්ඝ ලකුණු නොසලකයි:{" "}
          <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-xs text-jade-ink">
            panna
          </code>{" "}
          ටයිප් කළත් <span className="font-pali italic">paññā</span> හමු වේ.
        </p>
      </Reveal>

      <div className="mt-12">
        <GlossaryBrowser terms={terms} />
      </div>
    </Container>
  );
}
