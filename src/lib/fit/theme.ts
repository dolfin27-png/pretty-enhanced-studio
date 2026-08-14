export type ThemeId = "elite" | "sunset" | "emerald" | "crimson" | "mono" | "arctic";
export type RingStyle = "gradient" | "segmented" | "glow" | "minimal";

export type ThemePreset = {
  id: ThemeId;
  label: string;
  swatch: [string, string];
  vars: Record<string, string>;
};

/** Every preset only overrides accent + surface tokens; components stay token-driven. */
export const THEMES: ThemePreset[] = [
  {
    id: "elite",
    label: "Elite Violet",
    swatch: ["#8b5cf6", "#22d3ee"],
    vars: {
      "--violet": "oklch(0.68 0.19 295)",
      "--cyan": "oklch(0.78 0.13 200)",
      "--background": "oklch(0.16 0.028 265)",
      "--surface": "oklch(0.21 0.03 265)",
      "--surface-2": "oklch(0.25 0.032 265)",
      "--card": "oklch(0.21 0.03 265)",
      "--secondary": "oklch(0.25 0.032 265)",
      "--muted": "oklch(0.25 0.032 265)",
      "--border": "oklch(0.3 0.03 265)",
    },
  },
  {
    id: "sunset",
    label: "Sunset Amber",
    swatch: ["#f59e0b", "#fb7185"],
    vars: {
      "--violet": "oklch(0.79 0.16 62)",
      "--cyan": "oklch(0.72 0.17 15)",
      "--background": "oklch(0.16 0.024 40)",
      "--surface": "oklch(0.21 0.028 40)",
      "--surface-2": "oklch(0.25 0.03 40)",
      "--card": "oklch(0.21 0.028 40)",
      "--secondary": "oklch(0.25 0.03 40)",
      "--muted": "oklch(0.25 0.03 40)",
      "--border": "oklch(0.31 0.03 40)",
    },
  },
  {
    id: "emerald",
    label: "Emerald Force",
    swatch: ["#34d399", "#a3e635"],
    vars: {
      "--violet": "oklch(0.76 0.16 162)",
      "--cyan": "oklch(0.85 0.18 130)",
      "--background": "oklch(0.15 0.024 175)",
      "--surface": "oklch(0.2 0.028 175)",
      "--surface-2": "oklch(0.24 0.03 175)",
      "--card": "oklch(0.2 0.028 175)",
      "--secondary": "oklch(0.24 0.03 175)",
      "--muted": "oklch(0.24 0.03 175)",
      "--border": "oklch(0.3 0.03 175)",
    },
  },
  {
    id: "crimson",
    label: "Crimson Beast",
    swatch: ["#f43f5e", "#f97316"],
    vars: {
      "--violet": "oklch(0.66 0.21 18)",
      "--cyan": "oklch(0.76 0.17 55)",
      "--background": "oklch(0.15 0.026 18)",
      "--surface": "oklch(0.2 0.03 18)",
      "--surface-2": "oklch(0.24 0.032 18)",
      "--card": "oklch(0.2 0.03 18)",
      "--secondary": "oklch(0.24 0.032 18)",
      "--muted": "oklch(0.24 0.032 18)",
      "--border": "oklch(0.3 0.032 18)",
    },
  },
  {
    id: "arctic",
    label: "Arctic Blue",
    swatch: ["#38bdf8", "#818cf8"],
    vars: {
      "--violet": "oklch(0.74 0.15 235)",
      "--cyan": "oklch(0.8 0.11 205)",
      "--background": "oklch(0.15 0.03 250)",
      "--surface": "oklch(0.2 0.034 250)",
      "--surface-2": "oklch(0.24 0.036 250)",
      "--card": "oklch(0.2 0.034 250)",
      "--secondary": "oklch(0.24 0.036 250)",
      "--muted": "oklch(0.24 0.036 250)",
      "--border": "oklch(0.3 0.036 250)",
    },
  },
  {
    id: "mono",
    label: "Mono Steel",
    swatch: ["#e5e7eb", "#9ca3af"],
    vars: {
      "--violet": "oklch(0.88 0.01 260)",
      "--cyan": "oklch(0.7 0.015 260)",
      "--background": "oklch(0.14 0.006 260)",
      "--surface": "oklch(0.19 0.007 260)",
      "--surface-2": "oklch(0.23 0.008 260)",
      "--card": "oklch(0.19 0.007 260)",
      "--secondary": "oklch(0.23 0.008 260)",
      "--muted": "oklch(0.23 0.008 260)",
      "--border": "oklch(0.29 0.008 260)",
    },
  },
];

export const RING_STYLES: { id: RingStyle; label: string; hint: string }[] = [
  { id: "gradient", label: "Gradyan", hint: "Yumuşak marka geçişi" },
  { id: "segmented", label: "Segment", hint: "Set set dolan çizgiler" },
  { id: "glow", label: "Neon", hint: "Parlayan kalın halka" },
  { id: "minimal", label: "Minimal", hint: "İnce ve sade" },
];

export type Settings = {
  theme: ThemeId;
  fontScale: number;
  ringStyle: RingStyle;
  ringThickness: number;
  compact: boolean;
  defaultSets: number;
  defaultReps: string;
  defaultRest: number;
};

export const DEFAULT_SETTINGS: Settings = {
  theme: "elite",
  fontScale: 100,
  ringStyle: "gradient",
  ringThickness: 6,
  compact: false,
  defaultSets: 3,
  defaultReps: "8-12",
  defaultRest: 90,
};

export function applySettings(s: Settings) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const theme = THEMES.find((t) => t.id === s.theme) ?? THEMES[0]!;
  Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v));
  root.style.setProperty("--primary", theme.vars["--violet"] ?? "");
  root.style.setProperty("--ring", theme.vars["--violet"] ?? "");
  root.style.setProperty("--accent", theme.vars["--cyan"] ?? "");
  root.style.setProperty("--popover", theme.vars["--surface"] ?? "");
  root.style.setProperty("--input", theme.vars["--border"] ?? "");
  root.style.setProperty(
    "--gradient-hero",
    `radial-gradient(680px 320px at 100% 0%, color-mix(in oklab, var(--violet) 22%, transparent), transparent 70%), linear-gradient(150deg, color-mix(in oklab, var(--surface) 90%, white 6%), var(--background))`,
  );
  root.style.setProperty("--radius", s.compact ? "0.9rem" : "1.15rem");
  root.style.fontSize = `${Math.round((16 * s.fontScale) / 100 * 100) / 100}px`;
}
