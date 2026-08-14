import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({
  className,
  children,
  hero,
}: {
  className?: string;
  children: ReactNode;
  hero?: boolean;
}) {
  return (
    <section className={cn(hero ? "card-hero" : "card-elite", "p-4", className)}>{children}</section>
  );
}

export function SectionHead({
  kicker,
  title,
  right,
}: {
  kicker: string;
  title: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div>
        <div className="kicker">{kicker}</div>
        <h2 className="text-base font-bold text-foreground">{title}</h2>
      </div>
      {right}
    </div>
  );
}

export function Pill({
  children,
  tone = "muted",
  className,
}: {
  children: ReactNode;
  tone?: "muted" | "violet" | "cyan" | "lime" | "rose";
  className?: string;
}) {
  const tones: Record<string, string> = {
    muted: "bg-muted text-muted-foreground",
    violet: "bg-violet/15 text-violet",
    cyan: "bg-cyan/15 text-cyan",
    lime: "bg-lime/15 text-lime",
    rose: "bg-rose/15 text-rose",
  };
  return (
    <span
      className={cn(
        "rounded-full border border-border/60 px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Btn({
  children,
  onClick,
  variant = "ghost",
  className,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger" | "soft";
  className?: string;
  disabled?: boolean;
}) {
  const variants: Record<string, string> = {
    primary:
      "text-primary-foreground border-transparent [background:var(--gradient-brand)] shadow-[var(--shadow-glow)]",
    ghost: "bg-secondary/70 text-foreground border-border hover:bg-secondary",
    soft: "bg-violet/12 text-violet border-violet/25 hover:bg-violet/20",
    danger: "bg-rose/12 text-rose border-rose/30 hover:bg-rose/20",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition active:scale-[0.98] disabled:opacity-50",
        variants[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Metric({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="card-elite flex items-center gap-3 p-3">
      <span
        className="grid size-9 shrink-0 place-items-center rounded-xl text-base"
        style={{
          background: `color-mix(in oklab, ${color ?? "var(--violet)"} 18%, transparent)`,
        }}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <div className="truncate text-[0.6rem] font-semibold tracking-widest text-muted-foreground uppercase">
          {label}
        </div>
        <div className="truncate font-display text-sm font-bold">{value}</div>
      </div>
    </div>
  );
}

export function Ring({
  percent,
  size = 74,
  style = "gradient",
  thickness = 6,
  label = "TAMAM",
}: {
  percent: number;
  size?: number;
  style?: RingStyle;
  thickness?: number;
  label?: string;
}) {
  const w = style === "minimal" ? Math.max(2, thickness - 3) : style === "glow" ? thickness + 3 : thickness;
  const r = size / 2 - w / 2 - 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, percent));
  const stroke =
    style === "minimal" ? "var(--violet)" : `url(#ringGrad-${style})`;
  const dash =
    style === "segmented"
      ? { strokeDasharray: `${c / 24 - 3} 3` }
      : { strokeDasharray: c, strokeDashoffset: c - (c * pct) / 100 };
  return (
    <div className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 overflow-visible">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="color-mix(in oklab, var(--border) 90%, transparent)"
          strokeWidth={w}
          fill="none"
        />
        {style === "segmented" ? (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={stroke}
            strokeWidth={w}
            fill="none"
            strokeLinecap="butt"
            pathLength={100}
            strokeDasharray={`${Math.max(0.001, pct)} 100`}
            className="transition-[stroke-dasharray] duration-500"
            style={{ strokeDasharray: undefined, ...({} as object) }}
          />
        ) : (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={stroke}
            strokeWidth={w}
            fill="none"
            strokeLinecap="round"
            {...dash}
            className="transition-[stroke-dashoffset] duration-500"
            style={
              style === "glow"
                ? { filter: "drop-shadow(0 0 6px color-mix(in oklab, var(--violet) 70%, transparent))" }
                : undefined
            }
          />
        )}
        {style === "segmented" && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="var(--background)"
            strokeWidth={w}
            fill="none"
            strokeDasharray={`${c / 24 - 4} 4`}
            style={{ mixBlendMode: "destination-out" as never }}
          />
        )}
        <defs>
          <linearGradient id={`ringGrad-${style}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--violet)" />
            <stop offset="100%" stopColor="var(--cyan)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <div className="font-display text-sm font-bold">{Math.round(pct)}%</div>
        <div className="text-[0.5rem] tracking-widest text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

export { dash as _unusedDash } from "./_noop";

export function Bar({ percent, color = "var(--violet)" }: { percent: number; color?: string }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${Math.min(100, Math.max(0, percent))}%`,
          background: `linear-gradient(90deg, ${color}, var(--cyan))`,
        }}
      />
    </div>
  );
}

export function NumField({
  label,
  value,
  onChange,
  suffix,
  step = 1,
}: {
  label: string;
  value: number | "";
  onChange: (v: number) => void;
  suffix?: string;
  step?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[0.6rem] font-semibold tracking-widest text-muted-foreground uppercase">
        {label}
      </span>
      <div className="flex items-center gap-2 rounded-xl border border-border bg-background/60 px-3">
        <input
          type="number"
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="min-h-11 w-full bg-transparent font-display text-sm font-bold outline-none"
        />
        {suffix ? <span className="text-xs text-muted-foreground">{suffix}</span> : null}
      </div>
    </label>
  );
}
