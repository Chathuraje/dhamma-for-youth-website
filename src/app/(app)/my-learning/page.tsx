import type { Metadata } from "next";

import { AppPage, PageHeader } from "@/components/app/PageHeader";
import { MyLearning } from "@/components/app/personal";
import { personLessons } from "@/lib/course";
import { t } from "@/lib/strings";

export const metadata: Metadata = {
  title: t.mine.learningHeading,
  description: t.mine.learningIntro,
  robots: { index: false, follow: true },
};

/** Everything the learner has read. The data is theirs; this page only shapes it. */
export default function MyLearningPage() {
  return (
    <AppPage>
      <PageHeader
        crumbs={[{ label: t.mine.learningHeading }]}
        title={t.mine.learningHeading}
        intro={t.mine.learningIntro}
      />
      <MyLearning lessons={personLessons()} />
    </AppPage>
  );
}
