import type { Metadata } from "next";

import { AppPage, PageHeader } from "@/components/app/PageHeader";
import { ParamatthaTable } from "@/components/lesson/blocks/ParamatthaTable";
import { t } from "@/lib/strings";

export const metadata: Metadata = {
  title: t.paramattha.heading,
  description: t.paramattha.indexBlurb,
};

/**
 * THE 82
 * ======
 * The course's index of ultimate realities, and the one place a learner can
 * ask "what is ඕජා, and where is it taught?" without having to remember which
 * lesson happened to carry the table.
 *
 * It renders the course-wide map from `src/content/paramattha.ts`. Cells unlock
 * from the learner's own reading, and an opened cell links to the lesson that
 * teaches it and to its glossary entry.
 *
 * The component is a client one (it reads progress), so this page stays a
 * server component that renders it and nothing else.
 */
export default function ParamatthaPage() {
  return (
    <AppPage>
      <PageHeader
        crumbs={[{ label: t.paramattha.heading }]}
        title={t.paramattha.heading}
        intro={t.paramattha.indexBlurb}
      />

      <ParamatthaTable block={{ type: "paramatthaTable" }} />
    </AppPage>
  );
}
