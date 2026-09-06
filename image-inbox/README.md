# Image inbox

**Drop images here and ask Claude to place them.** Nothing in this folder is
served or shipped — it sits outside `public/`, so an unplaced file never reaches
the site.

## How to use it

1. Save the file here. **Any name will do** — `WhatsApp Image 2026-09-06.png`,
   `Screenshot (14).png`, `final-final-2.png`. Renaming is Claude's job.
2. Say which lesson, chapter or reference topic it belongs to, and what it
   shows. If you have both language versions, say which is which.
3. Claude renames it to the project's convention, moves it into
   `public/images/…`, wires it into the content as a `figure` block (or a
   chapter's `image`), fills in the real `width`/`height`, writes the `alt`, and
   deletes it from here.

If you do not say where it goes, Claude will ask rather than guess.

## What Claude checks before placing one

- **Real pixel size** goes into `width`/`height`. A wrong number makes the page
  reserve the wrong box and the layout jumps when the file lands.
- **`alt` is required** and is authored in the lesson, not baked into the file,
  so it translates with the lesson.
- **Both themes.** The site is light by default and flips to dark. A diagram
  with a baked-in white background looks like a hole in the page at night;
  transparent background and mid-tone strokes survive both.
- **Same shape in both languages.** One `width`/`height` serves the Sinhala and
  the English file, so the two exports must have the same dimensions.
- **Nothing hotlinked.** Every image is a local file. The footer promises there
  are no third-party requests.

See `public/images/README.md` for the naming convention and the tree.
