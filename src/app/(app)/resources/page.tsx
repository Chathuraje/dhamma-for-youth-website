import type { Metadata } from "next";
import { FolderOpen } from "lucide-react";

import { ComingSoon } from "@/components/app/ComingSoon";
import { AppPage, PageHeader } from "@/components/app/PageHeader";
import { t } from "@/lib/strings";

export const metadata: Metadata = {
  title: t.app.resources,
  description:
    "සම්පත් — බාගත කළ හැකි සටහන්, ග්‍රන්ථ යොමු සහ තවත් දේ. මෙම කොටස තවම සූදානම් නැත.",
  robots: { index: false, follow: true },
};

export default function ResourcesPage() {
  return (
    <AppPage>
      <PageHeader
        crumbs={[{ label: t.app.resources }]}
        title={t.app.resources}
      />
      <ComingSoon
        icon={<FolderOpen size={26} aria-hidden />}
        what="බාගත කළ හැකි සටහන්, ග්‍රන්ථ යොමු සහ පාඩම්වලින් ඔබ්බට යන අධ්‍යයන උපකරණ."
        links={[
          { href: "/reference", label: t.nav.reference},
          { href: "/glossary", label: t.nav.glossary},
        ]}
      />
    </AppPage>
  );
}
