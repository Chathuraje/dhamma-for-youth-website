import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { Container, Eyebrow } from "@/components/ui";
import { ResetProgress } from "@/components/app/ResetProgress";
import { site } from "@/lib/site";
import { t } from "@/lib/strings";

export const metadata: Metadata = {
  title: t.nav.about,
  description: `${site.name} යනු කුමක්ද, එය ගොඩනැගී ඇත්තේ කෙසේද, සහ ඔබේ දත්ත හසුරුවන්නේ කෙසේද.`,
};

export default function AboutPage() {
  return (
    <Container className="py-16 sm:py-24" width="narrow">
      <Reveal>
        <Eyebrow className="eyebrow-si">{t.nav.about}</Eyebrow>
        <h1 className="si-heading mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">
          {site.name}
        </h1>
      </Reveal>

      <div className="mt-10 space-y-10">
        <Reveal delay={0.05}>
          <section>
            <h2 className="si-heading font-display text-xl font-semibold text-ink">
              මෙය කුමක්ද
            </h2>
            <p className="prose-dhamma mt-3">
              අභිධර්මය පිළිබඳ අන්තර්ක්‍රියාකාරී පාඨමාලාවකි. අභිධර්මය යනු
              බුදුරජාණන් වහන්සේගේ දේශනාව තනිකරම තාක්ෂණික වචනවලින් නැවත ඉදිරිපත්
              කරන ත්‍රිපිටකයේ කොටසයි (පුද්ගලයන් නැත, කථා නැත, ඇත්තේ මානසික හා භෞතික
              සිදුවීම් සහ ඒවා සම්බන්ධ කරන ප්‍රත්‍ය පමණි).
            </p>
            <p className="prose-dhamma mt-3">
              සාමාන්‍යයෙන් එය ඉගැන්වෙන්නේ වගු සහ ලැයිස්තු වලිනි. එබැවින් බොහෝ
              දෙනෙක් එයින් ඉවතට යති. ඇත්තටම එම කරුණු අමාරු නැත. ඒවා
              **ව්‍යුහාත්මකයි**. ව්‍යුහයක් තේරුම් ගැනීම පහසු වන්නේ එය විවෘත කර,
              පියවරෙන් පියවර ගොස්, බිඳ බැලිය හැකි විටයි.
            </p>
          </section>
        </Reveal>

        <Reveal delay={0.08}>
          <section>
            <h2 className="si-heading font-display text-xl font-semibold text-ink">
              පාඩම් සකසන ආකාරය
            </h2>
            <p className="prose-dhamma mt-3">
              සෑම පාඩමක්ම ව්‍යුහගත දත්ත ලෙස ලියා, පොදු අන්තර්ක්‍රියාකාරී අංග
              මගින් ඉදිරිපත් කෙරේ (වර්ගීකරණ ගස්, ක්‍රියාවලි, බිඳ දැක්මේ මෙවලම්,
              සිමියුලේටර සහ ප්‍රශ්න). එමගින් සෑම පාඩමක්ම එකම ස්වරූපයෙන්
              පවතින අතර, එක් අංගයක් වැඩිදියුණු කිරීමෙන් සියලු පාඩම් එකවර
              වැඩිදියුණු වේ.
            </p>
          </section>
        </Reveal>

        <Reveal delay={0.11}>
          <section>
            <h2 className="si-heading font-display text-xl font-semibold text-ink">
              නිරවද්‍යතාව පිළිබඳව
            </h2>
            <p className="prose-dhamma mt-3">
              අර්ථ දැක්වීම් ථේරවාද අභිධර්ම සම්ප්‍රදායට අනුව යයි, සහ පාඩම් තම
              මූලාශ්‍ර දක්වයි. ගුරුවරුන් අතර අර්ථකථන වෙනසක් ඇති තැන, පැත්තක්
              තෝරා ගැනීම වෙනුවට එම වෙනස පාඩමේම සඳහන් කෙරේ.
            </p>
            <p className="prose-dhamma mt-3">
              මෙය අධ්‍යයන සහායකයකි, අධිකාරියක් නොවේ. වැදගත් ඕනෑම කරුණක් සඳහා
              ත්‍රිපිටකය සහ ගුරුවරයෙකු හමුවී තහවුරු කර ගන්න.
            </p>
          </section>
        </Reveal>

        <Reveal delay={0.14}>
          <section>
            <h2 className="si-heading font-display text-xl font-semibold text-ink">
              ඔබේ දත්ත
            </h2>
            <p className="prose-dhamma mt-3">
              ගිණුමක් හෝ ලොග් වීමක් නැත. ඔබේ ප්‍රගතිය, ප්‍රශ්නවලට දුන් පිළිතුරු
              සහ ලියූ අදහස් ඔබේම බ්‍රව්සරයේ
              <code className="mx-1 rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.85em] text-jade-ink">
                localStorage
              </code>
              තුළ ගබඩා වන අතර කිසිවිටෙක කිසිතැනකට යවන්නේ නැත. විශ්ලේෂණ
              ස්ක්‍රිප්ට් හෝ තෙවන පාර්ශ්ව ලුහුබැඳීමක් නැත.
            </p>
            <p className="prose-dhamma mt-3">
              ප්‍රායෝගික ප්‍රතිඵලය: බ්‍රව්සර දත්ත මකා දැමීමෙන් ඔබේ ප්‍රගතිය
              මැකෙයි, සහ ඔබේ ප්‍රගතිය වෙනත් උපකරණයකට යන්නේ නැත.
            </p>

            <ResetProgress />
          </section>
        </Reveal>
      </div>
    </Container>
  );
}
