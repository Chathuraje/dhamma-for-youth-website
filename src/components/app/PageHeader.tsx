import { Breadcrumbs, type Crumb } from "@/components/app/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";

/**
 * The standard head of an app page: breadcrumb, bilingual title, one line of
 * explanation. Every page inside the shell uses it, so they read as one app
 * rather than a set of separately designed screens.
 */
export function PageHeader({
  crumbs,
  title,
  intro,
  actions,
  children,
}: {
  crumbs: Crumb[];
  title: string;
  intro?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <Breadcrumbs crumbs={crumbs} actions={actions} className="mb-6" />
      <Reveal>
        <h1 className="si-heading block si-tight font-display text-[clamp(1.6rem,3vw,2.25rem)] font-semibold text-ink">
          {title}
        </h1>
        {intro ? (
          <p className="prose-dhamma mt-4 max-w-2xl text-[0.98rem]">{intro}</p>
        ) : null}
        {children}
      </Reveal>
    </div>
  );
}

/** The page wrapper every app route sits in — one place to change the gutter. */
export function AppPage({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[80rem] px-4 py-5 sm:px-6 sm:py-6 ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
