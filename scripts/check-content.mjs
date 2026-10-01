/**
 * CONTENT VALIDATOR
 * =================
 * Catches the mistakes that TypeScript cannot: broken glossary references,
 * duplicate ids, taxonomy counts that do not add up, quizzes with no right
 * answer, published lessons with no sources.
 *
 *   npm run check:content
 *
 * Runs on Node's native TypeScript stripping, which is why every runtime
 * import in `src/content/**` must be relative and every `@/...` import must be
 * `import type` (those are erased). See /docs/LESSON-AUTHORING.md.
 */

import { pathToFileURL } from "node:url";
import { resolve, join } from "node:path";
import { existsSync, readdirSync, readFileSync } from "node:fs";

const root = resolve(import.meta.dirname, "..");

/**
 * Artwork is mirrored per language by a **file-name suffix**:
 * `images/lessons/<slug>/<name>-si.png` beside `<name>-en.png`. The authored
 * locale must be complete; the others are checked so a missing translation
 * surfaces here rather than as a hole on a future English page.
 *
 * `imageFile` below is the same rule as `figureSrc` in `src/lib/images.ts`,
 * which is the source of truth — this script runs on Node's type-stripping and
 * cannot import a module that reaches the `@/` alias.
 */
const AUTHORED_LOCALE = "si";
const LOCALES = ["si", "en"];

/** `"a/b.png"` + `"si"` → `"public/images/a/b-si.png"`. */
const imageFile = (src, locale) => {
  const clean = src.replace(/^\/+/, "");
  const dot = clean.lastIndexOf(".");
  const named =
    dot === -1
      ? `${clean}-${locale}`
      : `${clean.slice(0, dot)}-${locale}${clean.slice(dot)}`;
  return `public/images/${named}`;
};
const load = (p) => import(pathToFileURL(resolve(root, p)).href);

/**
 * Content files are discovered from the filesystem rather than imported
 * through their registry, because Node's ESM resolver needs explicit `.ts`
 * extensions that the TypeScript source deliberately does not carry.
 *
 * The upside: we can also check that every file on disk is actually
 * registered, which importing the registry alone would never catch.
 */
async function loadDir(dir, exportName) {
  const files = readdirSync(join(root, dir))
    .filter((f) => f.endsWith(".ts") && f !== "index.ts")
    .sort();

  const index = readFileSync(join(root, dir, "index.ts"), "utf8");
  const items = [];

  for (const file of files) {
    const mod = await load(`${dir}/${file}`);
    const value = mod[exportName];
    if (!value) {
      errors.push(`${dir}/${file}: missing \`export const ${exportName}\``);
      continue;
    }
    if (!index.includes(file.replace(/\.ts$/, "")))
      errors.push(`${dir}/${file}: exists but is not registered in index.ts`);
    items.push(value);
  }
  return items;
}

/**
 * Reference topics are allowed to be grouped several-per-file (the four lower
 * realms sit together, for instance), so collect every export that looks like
 * a topic rather than expecting one known name.
 */
async function loadTopics(dir) {
  const files = readdirSync(join(root, dir))
    .filter((f) => f.endsWith(".ts") && f !== "index.ts")
    .sort();

  const index = readFileSync(join(root, dir, "index.ts"), "utf8");
  const out = [];

  for (const file of files) {
    const mod = await load(`${dir}/${file}`);
    const found = Object.values(mod).filter(
      (v) => v && typeof v === "object" && "slug" in v && "sections" in v,
    );
    if (!found.length) {
      errors.push(`${dir}/${file}: exports no reference topic`);
      continue;
    }
    if (!index.includes(file.replace(/\.ts$/, "")))
      errors.push(`${dir}/${file}: exists but is not registered in index.ts`);
    out.push(...found);
  }
  return out;
}

const errors = [];
const warnings = [];

const err = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);

const lessons = await loadDir("src/content/lessons", "lesson");
const chapters = await loadDir("src/content/chapters", "chapter");
const references = await loadTopics("src/content/reference");
const posts = await loadDir("src/content/blog", "post");
const { glossary } = await load("src/content/glossary.ts");

const refSlugs = new Set(references.map((r) => r.slug));

const termIds = new Set(glossary.map((t) => t.id));

/* -- glossary ------------------------------------------------------------- */

const seenTerm = new Set();
for (const t of glossary) {
  const at = `glossary/${t.id}`;
  if (seenTerm.has(t.id)) err(at, "duplicate term id");
  seenTerm.add(t.id);

  if (!/^[a-z0-9-]+$/.test(t.id))
    err(at, "id must be lowercase ASCII, digits and hyphens only");
  if (!t.short) err(at, "missing `short` gloss");
  if (t.short && t.short.length > 120)
    warn(at, `\`short\` is ${t.short.length} chars - it must fit a hover chip`);

  // The inline chip renders `si`, so a term without one would show blank.
  if (!t.si) err(at, "missing `si` - the Sinhala form the chip renders");
  if (t.si && !/[඀-෿]/.test(t.si))
    err(at, "`si` must be in Sinhala script");

  for (const ref of t.see ?? [])
    if (!termIds.has(ref)) err(at, `\`see\` points at unknown term "${ref}"`);
}

/* -- rich text ------------------------------------------------------------ */

const PALI_REF = /\[\[pali:([a-z0-9-]+)\]\]/g;
const TOPIC_REF = /\[\[ref:([a-z0-9-]+)\]\]/g;

function checkRich(text, where) {
  if (typeof text !== "string") return;
  for (const m of text.matchAll(PALI_REF))
    if (!termIds.has(m[1]))
      err(where, `references unknown glossary term "${m[1]}"`);
  for (const m of text.matchAll(TOPIC_REF))
    if (!refSlugs.has(m[1]))
      err(where, `references unknown reference topic "${m[1]}"`);

  // Unbalanced emphasis is the most common authoring slip.
  const bold = (text.match(/\*\*/g) ?? []).length;
  if (bold % 2 !== 0) warn(where, "odd number of ** markers");
}

/** Walk every string in a block so no field escapes the reference check. */
function walk(value, where) {
  if (typeof value === "string") return checkRich(value, where);
  if (Array.isArray(value)) return value.forEach((v) => walk(v, where));
  if (value && typeof value === "object")
    for (const v of Object.values(value)) walk(v, where);
}

/* -- lessons -------------------------------------------------------------- */

const seenSlug = new Set();
const seenNumber = new Map();

for (const lesson of lessons) {
  const at = `lesson "${lesson.slug}"`;

  if (seenSlug.has(lesson.slug)) err(at, "duplicate slug");
  seenSlug.add(lesson.slug);

  if (!/^[a-z0-9-]+$/.test(lesson.slug))
    err(at, "slug must be lowercase ASCII, digits and hyphens only");

  if (seenNumber.has(lesson.number))
    err(at, `number ${lesson.number} already used by "${seenNumber.get(lesson.number)}"`);
  seenNumber.set(lesson.number, lesson.slug);

  if (!lesson.sections.length) err(at, "has no sections");
  if (!lesson.objectives?.length) warn(at, "has no objectives");

  if (lesson.status === "published" && !lesson.sources?.length)
    err(at, "published lessons must cite sources");

  for (const p of lesson.prerequisites ?? [])
    if (!lessons.some((l) => l.slug === p))
      err(at, `prerequisite "${p}" is not a known lesson`);

  for (const k of lesson.keyTerms ?? [])
    if (!termIds.has(k)) err(at, `keyTerm "${k}" is not in the glossary`);

  const seenSection = new Set();
  for (const section of lesson.sections) {
    const sat = `${at} / section "${section.id}"`;

    if (seenSection.has(section.id)) err(sat, "duplicate section id");
    seenSection.add(section.id);

    if (!/^[a-z0-9-]+$/.test(section.id))
      err(sat, "section id must be lowercase ASCII, digits and hyphens only");
    if (!section.blocks.length) err(sat, "has no blocks");

    section.blocks.forEach((block, i) => {
      const bat = `${sat} / block ${i} (${block.type})`;
      walk(block, bat);

      switch (block.type) {
        case "paliTerm":
          if (!termIds.has(block.term))
            err(bat, `unknown glossary term "${block.term}"`);
          break;

        case "quiz": {
          const correct = block.options.filter((o) => o.correct).length;
          if (correct !== 1)
            err(bat, `has ${correct} correct options - it must have exactly 1`);
          if (block.options.length < 2) err(bat, "needs at least 2 options");
          if (!block.explanation) err(bat, "missing explanation");
          break;
        }

        case "sortGame": {
          const bucketIds = new Set(block.buckets.map((b) => b.id));
          for (const item of block.items)
            if (!bucketIds.has(item.bucketId))
              err(bat, `item "${item.label}" targets unknown bucket "${item.bucketId}"`);
          if (block.buckets.length < 2) err(bat, "needs at least 2 buckets");
          if (new Set(block.items.map((i) => i.id)).size !== block.items.length)
            err(bat, "item ids must be unique");
          break;
        }

        case "taxonomy": {
          const sum = (n) =>
            n.children?.length
              ? n.children.reduce((a, c) => a + sum(c), 0)
              : (n.count ?? 0);
          const total = block.root.reduce((a, n) => a + sum(n), 0);
          if (block.total !== undefined && block.total !== total)
            err(bat, `stated total ${block.total} but leaves sum to ${total}`);
          break;
        }

        case "shelf": {
          // A shelf's whole point is the ordering, so one volume is a list of
          // one dressed up as a sequence.
          if (!block.volumes?.length || block.volumes.length < 2)
            err(bat, "a shelf needs at least two volumes");

          const seenVolume = new Set();
          for (const volume of block.volumes ?? []) {
            if (!volume.id) err(bat, "a volume is missing its `id`");
            if (seenVolume.has(volume.id))
              err(bat, `duplicate volume id "${volume.id}"`);
            seenVolume.add(volume.id);

            if (!volume.label) err(bat, `volume "${volume.id}" has no label`);
            if (!volume.text) err(bat, `volume "${volume.id}" has no text`);

            // The "full entry" link would 404 into the glossary otherwise.
            if (volume.term && !termIds.has(volume.term))
              err(bat, `volume "${volume.id}" links unknown glossary term "${volume.term}"`);
          }
          break;
        }

        case "figure": {
          if (!block.alt)
            err(bat, "missing `alt` - a figure nobody can read is not a figure");
          if (!block.width || !block.height)
            err(bat, "missing `width`/`height` - the page must reserve the space");
          // Artwork is mirrored per language. The authored locale must be on
          // disk; a missing translation is a warning until that build exists.
          for (const locale of LOCALES) {
            const file = imageFile(block.src, locale);
            if (!existsSync(join(root, file)))
              (locale === AUTHORED_LOCALE ? err : warn)(
                bat,
                `image not on disk: ${file}`,
              );
          }
          break;
        }

        case "plates": {
          // One plate is a `figure` wearing a stepper.
          if (!block.plates?.length || block.plates.length < 2)
            err(bat, "a deck needs at least two plates");
          if (!block.width || !block.height)
            err(bat, "missing `width`/`height` - the page must reserve the space");

          for (const plate of block.plates ?? []) {
            if (!plate.alt) err(bat, `plate "${plate.src}" has no \`alt\``);
            for (const locale of LOCALES) {
              const file = imageFile(plate.src, locale);
              if (!existsSync(join(root, file)))
                (locale === AUTHORED_LOCALE ? err : warn)(
                  bat,
                  `image not on disk: ${file}`,
                );
            }
          }
          break;
        }

        case "structure": {
          // Ids address nodes, so a duplicate silently keys two bands alike.
          const seen = new Set();
          const walkNode = (n) => {
            if (seen.has(n.id)) err(bat, `duplicate node id "${n.id}"`);
            seen.add(n.id);
            for (const c of n.children ?? []) walkNode(c);
          };
          walkNode(block.root);
          if (!block.root.children?.length)
            err(bat, "root has no children - nothing is being divided");
          break;
        }

        case "derivation": {
          if (!block.steps.length) err(bat, "needs at least one step");
          if (!block.conclusion?.value)
            err(bat, "missing the conclusion the steps arrive at");
          break;
        }

        case "timeline":
          if (!block.events.length) err(bat, "needs at least one event");
          break;

        case "speechSpeed":
          if (!block.sample) err(bat, "missing `sample` - the phrase being timed");
          if (!block.speakers.length) err(bat, "needs at least one speaker");
          break;

        case "comparison":
          if (block.columns.length < 2) err(bat, "needs at least 2 columns");
          break;

        case "table":
          for (const [r, row] of block.rows.entries())
            if (row.length !== block.headers.length)
              err(bat, `row ${r} has ${row.length} cells, expected ${block.headers.length}`);
          break;

        case "octad": {
          if (block.items.length !== 8)
            err(bat, `has ${block.items.length} items - a suddhatthaka has exactly 8`);
          const maha = block.items.filter((i) => i.group === "maha").length;
          const upada = block.items.filter((i) => i.group === "upada").length;
          if (maha !== 4) err(bat, `has ${maha} mahabhuta - there are 4`);
          if (upada !== 4) err(bat, `has ${upada} upada-rupa - there are 4`);
          break;
        }

        case "timeConverter": {
          if (!block.realms.length) err(bat, "needs at least one realm");
          for (const r of block.realms) {
            if (!(r.humanDaysPerRealmDay > 0))
              err(bat, `realm "${r.id}" needs a positive humanDaysPerRealmDay`);
            if (!(r.minutesPerRealmDay > 0))
              err(bat, `realm "${r.id}" needs a positive minutesPerRealmDay`);
          }
          for (const p of block.presets)
            if (!(p.humanDays > 0))
              err(bat, `preset "${p.label}" needs a positive humanDays`);
          break;
        }

        case "elementMixer": {
          const total = block.elements.reduce((n, e) => n + e.start, 0);
          if (Math.abs(total - 100) > 0.01)
            err(bat, `starting shares total ${total}, expected 100`);
          const ids = new Set(block.elements.map((e) => e.id));
          for (const o of block.outcomes)
            if (!ids.has(o.when))
              err(bat, `outcome targets unknown element "${o.when}"`);
          break;
        }

        case "slicer":
          if (!block.materials.length) err(bat, "needs at least one material");
          for (const m of block.materials)
            if (m.density < 0 || m.density > 1)
              err(bat, `material "${m.id}" density must be between 0 and 1`);
          break;

        case "speechSpeed": {
          if (!(block.baselineWordsPerSecond > 0))
            err(bat, "baselineWordsPerSecond must be positive");
          for (const sp of block.speakers)
            if (!(sp.multiplier > 0))
              err(bat, `speaker "${sp.id}" needs a positive multiplier`);
          break;
        }

        case "deconstruct": {
          if (!block.objects.length) err(bat, "needs at least one object");
          for (const o of block.objects)
            if (o.stages.length < 2)
              err(bat, `object "${o.id}" needs at least 2 stages`);
          break;
        }

        case "paramatthaTable": {
          // `groups` omitted means "render the course's own 82", which is
          // validated once on its own below rather than per block.
          for (const g of block.groups ?? []) {
            if (g.cells.length > g.count)
              err(bat, `group "${g.id}" names ${g.cells.length} cells but count is ${g.count}`);
            for (const c of g.cells) {
              if (c.unlockedBy && !lessons.some((l) => l.slug === c.unlockedBy))
                err(bat, `cell "${c.id}" unlockedBy unknown lesson "${c.unlockedBy}"`);
              if (c.term && !termIds.has(c.term))
                err(bat, `cell "${c.id}" links unknown glossary term "${c.term}"`);
            }
          }
          const ids = (block.groups ?? []).flatMap((g) =>
            g.cells.map((c) => c.id),
          );
          if (new Set(ids).size !== ids.length)
            err(bat, "cell ids must be unique across all groups");
          break;
        }

        case "hierarchy": {
          const seen = new Set();
          const walkNodes = (nodes) => {
            for (const n of nodes) {
              if (seen.has(n.id)) err(bat, `duplicate node id "${n.id}"`);
              seen.add(n.id);
              walkNodes(n.children ?? []);
            }
          };
          walkNodes(block.root);
          break;
        }
      }
    });
  }
}

/* -- the 82 ---------------------------------------------------------------- */
/*
 * The course's own paramattha registry, which `/paramattha` indexes and every
 * `paramatthaTable` block without its own `groups` renders. Checked here once
 * rather than wherever it happens to be drawn.
 */
{
  const { paramatthaGroups, paramatthaTotal } = await load(
    "src/content/paramattha.ts",
  );
  const at = "paramattha registry";

  if (paramatthaTotal !== 82)
    err(at, `groups total ${paramatthaTotal} — the paramatthas are 82`);

  const seenCell = new Set();
  for (const g of paramatthaGroups) {
    if (g.cells.length > g.count)
      err(at, `group "${g.id}" names ${g.cells.length} cells but count is ${g.count}`);

    for (const c of g.cells) {
      if (seenCell.has(c.id)) err(at, `duplicate cell id "${c.id}"`);
      seenCell.add(c.id);

      if (c.unlockedBy && !lessons.some((l) => l.slug === c.unlockedBy))
        err(at, `cell "${c.id}" unlockedBy unknown lesson "${c.unlockedBy}"`);
      if (c.term && !termIds.has(c.term))
        err(at, `cell "${c.id}" links unknown glossary term "${c.term}"`);

      walk(c, `${at} / cell "${c.id}"`);
    }
  }
}

/* -- component lab --------------------------------------------------------- */
/*
 * The lab is a .tsx page, not content, so it escapes the walk above — yet it
 * references glossary terms and will silently render blank cards when one is
 * renamed. A regex scan is crude but catches exactly that rot.
 */
{
  const labPath = join(root, "src/app/(app)/lab/page.tsx");
  const lab = readFileSync(labPath, "utf8");

  for (const m of lab.matchAll(/\[\[pali:([a-z0-9-]+)\]\]/g)) {
    // `[[pali:id]]` appears in the authoring notes as literal documentation.
    if (m[1] === "id") continue;
    if (!termIds.has(m[1]))
      err("lab", `references unknown glossary term "${m[1]}"`);
  }
  for (const m of lab.matchAll(/type:\s*"paliTerm",\s*term:\s*"([a-z0-9-]+)"/g))
    if (!termIds.has(m[1]))
      err("lab", `paliTerm block uses unknown glossary term "${m[1]}"`);
  for (const m of lab.matchAll(/term:\s*"([a-z0-9-]+)"\s*\}/g))
    if (!termIds.has(m[1]))
      err("lab", `paliTerm block uses unknown glossary term "${m[1]}"`);
}

/* -- chapters ------------------------------------------------------------- */

const seenChapterSlug = new Set();
const lessonSlugs = new Set(lessons.map((l) => l.slug));
const claimed = new Map();

for (const chapter of chapters) {
  const at = `chapter "${chapter.slug}"`;

  if (seenChapterSlug.has(chapter.slug)) err(at, "duplicate slug");
  seenChapterSlug.add(chapter.slug);

  if (!/^[a-z0-9-]+$/.test(chapter.slug))
    err(at, "slug must be lowercase ASCII, digits and hyphens only");

  if (!chapter.lessons.length) err(at, "lists no lessons");

  for (const slug of chapter.lessons) {
    if (!lessonSlugs.has(slug))
      err(at, `lists unknown lesson "${slug}"`);
    if (claimed.has(slug))
      err(at, `lesson "${slug}" is already in chapter "${claimed.get(slug)}"`);
    claimed.set(slug, chapter.slug);
  }

  if (chapter.status === "published" && !chapter.sources?.length)
    err(at, "published chapters must cite sources");

  // Chapter artwork is mirrored per language like every other image. A card
  // with a broken src is worse than a card with the drawn fallback, so the
  // authored locale must be on disk.
  if (chapter.image) {
    for (const locale of LOCALES) {
      const file = imageFile(chapter.image, locale);
      if (!existsSync(join(root, file)))
        (locale === AUTHORED_LOCALE ? err : warn)(at, `image not on disk: ${file}`);
    }
  }

  if (chapter.reading)
    err(at, "`reading` was removed - fold the content into the lessons");
}

/* -- reference topics ------------------------------------------------------ */

const seenRefSlug = new Set();

for (const topic of references) {
  const at = `reference "${topic.slug}"`;

  if (seenRefSlug.has(topic.slug)) err(at, "duplicate slug");
  seenRefSlug.add(topic.slug);

  if (!/^[a-z0-9-]+$/.test(topic.slug))
    err(at, "slug must be lowercase ASCII, digits and hyphens only");
  if (!topic.summary) err(at, "missing summary");
  if (topic.summary && topic.summary.length > 160)
    warn(at, `summary is ${topic.summary.length} chars - it must fit an inline chip`);
  if (!topic.category) err(at, "missing category");
  if (!topic.sections.length) err(at, "has no sections");

  for (const s of topic.see ?? [])
    if (!refSlugs.has(s)) err(at, `\`see\` points at unknown topic "${s}"`);

  const seenSection = new Set();
  for (const section of topic.sections) {
    const sat = `${at} / section "${section.id}"`;
    if (seenSection.has(section.id)) err(sat, "duplicate section id");
    seenSection.add(section.id);
    if (!/^[a-z0-9-]+$/.test(section.id))
      err(sat, "section id must be lowercase ASCII, digits and hyphens only");
    if (!section.blocks.length) err(sat, "has no blocks");
    section.blocks.forEach((block, i) => {
      walk(block, `${sat} / block ${i} (${block.type})`);
    });
  }
}

for (const lesson of lessons)
  if (!claimed.has(lesson.slug))
    warn(`lesson "${lesson.slug}"`, "does not belong to any chapter");


/* -- blog posts ------------------------------------------------------------
   Posts are not part of the course, but they use the same block tree and the
   same content-integrity rules: a post that makes a claim cites it. */

const seenPostSlug = new Set();

for (const post of posts) {
  const at = `post "${post.slug}"`;

  if (seenPostSlug.has(post.slug)) err(at, "duplicate slug");
  seenPostSlug.add(post.slug);

  if (!/^[a-z0-9-]+$/.test(post.slug))
    err(at, "slug must be lowercase ASCII, digits and hyphens only");
  if (!post.summary) err(at, "missing summary");
  if (post.summary && post.summary.length > 200)
    warn(at, `summary is ${post.summary.length} chars - keep it to a sentence or two`);
  if (!post.sections?.length) err(at, "has no sections");
  if (!Number.isFinite(post.readingMin) || post.readingMin <= 0)
    err(at, "`readingMin` must be a positive number of minutes");

  if (!/^\d{4}-\d{2}-\d{2}$/.test(post.published ?? ""))
    err(at, "`published` must be an ISO date (YYYY-MM-DD)");
  if (post.updated && !/^\d{4}-\d{2}-\d{2}$/.test(post.updated))
    err(at, "`updated` must be an ISO date (YYYY-MM-DD)");

  if (post.status === "published" && !post.sources?.length)
    warn(at, "published post cites no sources - add them if it makes a claim");

  const seenSection = new Set();
  for (const section of post.sections ?? []) {
    const sat = `${at} / section "${section.id}"`;
    if (seenSection.has(section.id)) err(sat, "duplicate section id");
    seenSection.add(section.id);
    if (!/^[a-z0-9-]+$/.test(section.id))
      err(sat, "section id must be lowercase ASCII, digits and hyphens only");
    if (!section.blocks.length) err(sat, "has no blocks");
    section.blocks.forEach((block, i) => {
      walk(block, `${sat} / block ${i} (${block.type})`);
    });
  }
}

/* -- report --------------------------------------------------------------- */

const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;

console.log(
  dim(
    `checked ${chapters.length} chapter(s), ${lessons.length} lesson(s), ` +
      `${references.length} reference topic(s), ${posts.length} post(s) ` +
      `and ${glossary.length} glossary term(s)`,
  ),
);

for (const w of warnings) console.log(yellow("warn "), w);
for (const e of errors) console.log(red("error"), e);

if (errors.length) {
  console.log(red(`\n${errors.length} error(s). Content is not valid.`));
  process.exit(1);
}
console.log(
  green(`\nContent is valid.${warnings.length ? ` ${warnings.length} warning(s).` : ""}`),
);
