import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  experimental: {
    // Every /lessons/[slug] and /reference/[slug] has generateStaticParams, so
    // the client Router Cache treats them as static and reuses a prefetched RSC
    // payload for 5 minutes. While content is being edited that means an in-app
    // <Link> navigation shows the pre-edit render with no sign anything is
    // stale. Dev only — production keeps the defaults that make prefetch worth
    // having.
    ...(isDev ? { staleTimes: { static: 0, dynamic: 0 } } : {}),
  },
};

export default nextConfig;
