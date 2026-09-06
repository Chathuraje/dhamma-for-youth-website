import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";

import { BlockRenderer } from "@/components/lesson/BlockRenderer";
import { SectionHeading } from "@/components/lesson/SectionHeading";
import { Sources } from "@/components/lesson/Sources";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui";
import { allPosts, getPost } from "@/content/blog";
import { t } from "@/lib/strings";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return allPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: t.notFound.title };

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      publishedTime: post.published,
    },
  };
}

/**
 * A post.
 *
 * Rendered by the same `BlockRenderer` a lesson uses, so every interactive
 * block works here — but with no rail, no progress and no next-lesson, because
 * a post is read rather than studied.
 *
 * Its blocks are keyed under `__post:<slug>` so a quiz or a reflection inside
 * a post stores its answer separately from any lesson's, and never counts
 * toward course progress.
 */
export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <Container className="py-14 sm:py-20" width="narrow">
      <Reveal>
        <Link
          href="/blog"
          className="si-heading inline-flex items-center gap-1.5 text-sm text-ink-dim transition-colors hover:text-cobalt-600"
        >
          <ArrowLeft size={14} aria-hidden />
          {t.blog.backToBlog}
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-faint">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={12} aria-hidden />
            {formatDate(post.published)}
          </span>
          {post.updated ? (
            <span>
              {t.course.updated}: {formatDate(post.updated)}
            </span>
          ) : null}
          {post.status === "draft" ? (
            <span className="rounded-full bg-gold-500/12 px-2 py-0.5 text-gold-600">
              {t.course.draft}
            </span>
          ) : null}
        </div>

        <h1 className="si-heading block si-tight mt-4 font-display text-4xl font-semibold text-ink sm:text-5xl">
          {post.title}
        </h1>
        <p className="prose-dhamma mt-5 text-lg">{post.summary}</p>
      </Reveal>

      <div className="mt-14">
        {post.sections.map((section, si) => (
          <section
            key={section.id}
            id={`section-${section.id}`}
            className="scroll-mt-24 pb-16"
            aria-labelledby={`heading-${section.id}`}
          >
            <SectionHeading
              id={section.id}
              index={si + 1}
              title={section.title}
              pali={section.pali}
              brief={section.brief}
            />

            {section.blocks.map((block, bi) => (
              <BlockRenderer
                key={bi}
                block={block}
                lessonSlug={`__post:${post.slug}`}
                sectionId={section.id}
                index={bi}
              />
            ))}
          </section>
        ))}

        <Sources sources={post.sources} />
      </div>
    </Container>
  );
}
