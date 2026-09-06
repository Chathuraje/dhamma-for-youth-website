import { AppShell } from "@/components/app/AppShell";
import { searchIndex } from "@/lib/search";

/**
 * Everything a learner does lives under this layout: the dashboard, chapters,
 * lessons, reference, glossary and the personal pages.
 *
 * The search index is built here, on the server, and handed down as data. That
 * keeps the whole content registry out of the client bundle while still giving
 * the topbar an index it can match against with no request.
 */
export default function AppLayout({ children }: LayoutProps<"/">) {
  return <AppShell searchIndex={searchIndex()}>{children}</AppShell>;
}
