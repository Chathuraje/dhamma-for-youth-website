import type { Metadata, Viewport } from "next";
import {
  Fraunces,
  Inter,
  Noto_Sans_Sinhala,
  Noto_Serif,
  Noto_Serif_Sinhala,
} from "next/font/google";
import "./globals.css";

import { ReferenceViewer } from "@/components/lesson/ReferenceViewer";
import { ThemeSync, themeInitScript } from "@/components/site/Theme";
import { site } from "@/lib/site";
import { t } from "@/lib/strings";

/**
 * TYPE STACK
 * ==========
 * The site is authored in Sinhala with Pāli terms in Latin script, so every
 * stack needs a Sinhala face behind a Latin one. Browsers resolve fonts
 * per glyph in stack order: Latin characters are found in the first face,
 * Sinhala characters fall through to the second. That gives each script the
 * face designed for it without any markup.
 */

/** Latin UI and body copy. */
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

/** Sinhala body copy. Carries the site's reading load. */
const notoSansSinhala = Noto_Sans_Sinhala({
  subsets: ["sinhala"],
  variable: "--font-sinhala",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

/** Latin display. */
const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

/** Sinhala display — headings need weight the sans face cannot give them. */
const notoSerifSinhala = Noto_Serif_Sinhala({
  subsets: ["sinhala"],
  variable: "--font-sinhala-serif",
  display: "swap",
  weight: ["400", "600", "700"],
});

/**
 * Pāli only. Noto Serif is the one face here guaranteed to carry every
 * Latin Extended Additional mark the language needs (ṃ ṭ ḍ ṇ ḷ ā ī ū ñ ṅ),
 * so terms never fall back to a mismatched font mid-word.
 */
const notoSerif = Noto_Serif({
  subsets: ["latin", "latin-ext"],
  variable: "--font-noto-serif",
  display: "swap",
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} (${site.tagline})`,
    template: `%s (${site.name})`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.name,
    description: site.description,
    locale: "si_LK",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f7f9fc",
  colorScheme: "light dark",
};

const fontVars = [
  inter.variable,
  notoSansSinhala.variable,
  fraunces.variable,
  notoSerifSinhala.variable,
  notoSerif.variable,
].join(" ");

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={site.locale}
      data-theme="light"
      className={`${fontVars} h-full`}
      suppressHydrationWarning
    >
      <head>
        {/* Applies the saved theme before first paint - avoids a colour flash. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="grain min-h-full">
        <ThemeSync />

        {/* Keyboard users land here first. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-60 focus:rounded-full focus:bg-cobalt-500 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-on-brand"
        >
          {t.nav.skipToContent}
        </a>

        {/*
          No chrome here. The two route groups wrap themselves: `(site)` in the
          marketing header and footer, `(app)` in the dashboard shell. Keeping
          them apart is what lets the learning app drop the marketing furniture
          entirely rather than hiding it with CSS.
        */}
        {children}

        {/*
          Not chrome — an overlay either group can raise. `[[ref:slug]]` is a
          rich-text construct, and rich text renders in lessons and in posts,
          so the one mount point that covers both is here. It loads nothing
          until a chip is clicked.
        */}
        <ReferenceViewer />
      </body>
    </html>
  );
}
