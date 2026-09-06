import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";

/**
 * The public site: what this is, who made it, how to reach them, and anything
 * written outside the course.
 *
 * It keeps the header-and-footer shape a visitor expects from a website. The
 * course itself lives under `(app)` in the dashboard shell — one door between
 * them, the "Open Dashboard" button in this header.
 */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
