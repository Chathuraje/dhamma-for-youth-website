import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { ButtonLink, Container } from "@/components/ui";
import { site } from "@/lib/site";
import { t } from "@/lib/strings";

/**
 * The root 404.
 *
 * It carries the public site's chrome explicitly: route-group layouts do not
 * wrap the root `not-found`, so without this it would render as bare text on
 * an empty page with no way out.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />

      <main id="main" className="flex-1">
        <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
          <p className="font-mono text-sm text-cobalt-600">404</p>

          <h1 className="si-heading mt-4 font-display text-3xl font-semibold text-ink sm:text-4xl">
            {t.notFound.title}
          </h1>

          <p className="prose-dhamma mt-4 max-w-sm">{t.notFound.body}</p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href={site.appHome} className="si-heading">
              {t.nav.openDashboard}
            </ButtonLink>
            <ButtonLink href="/" variant="secondary" className="si-heading">
              {t.nav.home}
            </ButtonLink>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
