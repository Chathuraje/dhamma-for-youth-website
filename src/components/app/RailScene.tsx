/**
 * The foot of the sidebar: a stūpa under a night sky.
 *
 * Drawn rather than photographed so it costs nothing to load, tints itself
 * from the rail tokens, and stays crisp at any density. Purely decorative —
 * `aria-hidden`, no layout influence beyond its own box.
 */
export function RailScene({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 200"
      className={className}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden
      focusable="false"
    >
      <defs>
        <linearGradient id="rail-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-rail)" />
          <stop offset="48%" stopColor="#16233f" />
          <stop offset="80%" stopColor="#27406e" />
          <stop offset="100%" stopColor="#3f5f9c" />
        </linearGradient>
        <radialGradient id="rail-moon" cx="0.64" cy="0.82" r="0.44">
          <stop offset="0%" stopColor="#cfe0ff" stopOpacity="0.75" />
          <stop offset="55%" stopColor="#6e90f0" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#3563e9" stopOpacity="0" />
        </radialGradient>
        {/* Fades the whole scene into the rail so it has no visible top edge. */}
        <linearGradient id="rail-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="32%" stopColor="#000" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#000" stopOpacity="1" />
        </linearGradient>
        <mask id="rail-mask">
          <rect width="240" height="200" fill="url(#rail-fade)" />
        </mask>
      </defs>

      <g mask="url(#rail-mask)">
        <rect width="240" height="200" fill="url(#rail-sky)" />
        <circle cx="149" cy="168" r="88" fill="url(#rail-moon)" />

        {/* Far hills */}
        <path
          d="M0 168 L52 146 L96 162 L138 138 L186 158 L240 140 L240 200 L0 200 Z"
          fill="#101b31"
          opacity="0.7"
        />

        {/* The stūpa: hemispherical dome, harmikā, spire. */}
        <g fill="#080e1a" opacity="0.94">
          <path d="M112 200 L112 160 Q112 128 138 128 Q164 128 164 160 L164 200 Z" />
          <rect x="128" y="118" width="20" height="12" rx="2" />
          <path d="M134 118 L138 78 L142 118 Z" />
          <circle cx="138" cy="74" r="3.2" />
          <rect x="104" y="158" width="68" height="6" rx="3" />
          <rect x="99" y="168" width="78" height="6" rx="3" />
        </g>

        {/* Foreground treeline */}
        <path
          d="M0 200 L0 176 Q14 162 26 178 Q38 160 52 180 Q62 168 74 184 L74 200 Z"
          fill="#060b15"
        />
        <path
          d="M240 200 L240 170 Q226 156 214 176 Q202 162 190 182 L190 200 Z"
          fill="#060b15"
        />
      </g>
    </svg>
  );
}
