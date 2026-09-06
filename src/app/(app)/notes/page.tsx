import type { Metadata } from "next";

import { AppPage, PageHeader } from "@/components/app/PageHeader";
import { NotesList } from "@/components/app/personal";
import { personPrompts } from "@/lib/course";
import { t } from "@/lib/strings";

export const metadata: Metadata = {
  title: t.mine.notesHeading,
  description: t.mine.notesIntro,
  robots: { index: false, follow: true },
};

/** The learner's reflections, gathered. Written and edited in their lessons. */
export default function NotesPage() {
  return (
    <AppPage>
      <PageHeader
        crumbs={[{ label: t.mine.notesHeading }]}
        title={t.mine.notesHeading}
        intro={t.mine.notesIntro}
      />
      <NotesList prompts={personPrompts()} />
    </AppPage>
  );
}
