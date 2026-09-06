import type { Metadata } from "next";
import { Users } from "lucide-react";

import { ComingSoon } from "@/components/app/ComingSoon";
import { AppPage, PageHeader } from "@/components/app/PageHeader";
import { t } from "@/lib/strings";

export const metadata: Metadata = {
  title: t.app.community,
  description:
    "සමාජය — අභිධර්මය ඉගෙන ගන්නා අය එකට. මෙම කොටස තවම සූදානම් නැත.",
  robots: { index: false, follow: true },
};

export default function CommunityPage() {
  return (
    <AppPage>
      <PageHeader
        crumbs={[{ label: t.app.community }]}
        title={t.app.community}
      />
      <ComingSoon
        icon={<Users size={26} aria-hidden />}
        what="අභිධර්මය ඉගෙන ගන්නා අය එකට එකතු වී ප්‍රශ්න අසන, අවබෝධය බෙදාගන්නා තැනක්."
        links={[
          { href: "/chapters", label: t.nav.chapters},
          { href: "/contact", label: t.nav.contact},
        ]}
      />
    </AppPage>
  );
}
