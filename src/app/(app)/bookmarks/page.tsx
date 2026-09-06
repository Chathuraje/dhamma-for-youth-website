import type { Metadata } from "next";

import { AppPage, PageHeader } from "@/components/app/PageHeader";
import { BookmarksList } from "@/components/app/personal";
import { personChapters, personLessons } from "@/lib/course";
import { t } from "@/lib/strings";

export const metadata: Metadata = {
  title: t.mine.bookmarksHeading,
  description: t.mine.bookmarksIntro,
  robots: { index: false, follow: true },
};

/** What the learner saved, and where they stopped reading. */
export default function BookmarksPage() {
  return (
    <AppPage>
      <PageHeader
        crumbs={[{ label: t.mine.bookmarksHeading }]}
        title={t.mine.bookmarksHeading}
        intro={t.mine.bookmarksIntro}
      />
      <BookmarksList lessons={personLessons()} chapters={personChapters()} />
    </AppPage>
  );
}
