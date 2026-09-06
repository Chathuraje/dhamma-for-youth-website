import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Container, Empty, Eyebrow } from "@/components/ui";
import { visiblePosts } from "@/content/blog";
import { t } from "@/lib/strings";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: t.blog.heading,
  description: t.blog.intro,
};

/**
 * The blog index.
 *
 * Empty until something is written. It says so rather than filling itself —
 * a sample post would be a doctrinal claim nobody made, and this project does
 * not put words in the teacher's mouth to decorate a page.
 */
export default function BlogPage() {
  const posts = visiblePosts();

  return (
    <Container className="py-16 sm:py-24" width="default">
      <Reveal>
        <Eyebrow className="eyebrow-si">{t.nav.blog}</Eyebrow>
        <h1 className="si-heading block si-tight mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">
          {t.blog.heading}
        </h1>
        <p className="prose-dhamma mt-5 max-w-xl text-lg">{t.blog.intro}</p>
      </Reveal>

      <div className="mt-14">
        {posts.length === 0 ? (
          <Empty
            title={t.blog.empty}
            body={t.blog.emptyBody}
            action={
              <Link
                href="/chapters"
                className="si-heading inline-flex items-center gap-2 rounded-full bg-cobalt-500 px-4 py-2.5 text-sm font-medium text-on-brand transition-colors hover:bg-cobalt-600"
              >
                {t.nav.chapters}
                <ArrowRight size={14} aria-hidden />
              </Link>
            }
          />
        ) : (
          <Stagger className="space-y-4" gap={0.07}>
            {posts.map((post) => (
              <StaggerItem key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line transition-all duration-300 hover:-translate-y-0.5 hover:ring-cobalt-500/40 sm:p-8"
                >
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.7rem] text-ink-faint">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays size={11} aria-hidden />
                      {formatDate(post.published)}
                    </span>
                    {post.status === "draft" ? (
                      <span className="rounded-full bg-gold-500/12 px-2 py-0.5 text-gold-600">
                        {t.course.draft}
                      </span>
                    ) : null}
                  </div>

                  <span className="si-heading block mt-3 font-display text-2xl font-semibold text-ink transition-colors group-hover:text-cobalt-600">
                    {post.title}
                  </span>
                  <p className="prose-dhamma mt-3 max-w-2xl text-[0.97rem]">
                    {post.summary}
                  </p>

                  {post.tags.length > 0 ? (
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <li
                          key={tag}
                          className="si-heading rounded-full bg-surface-2 px-2.5 py-1 text-[0.68rem] text-ink-dim"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </Container>
  );
}
