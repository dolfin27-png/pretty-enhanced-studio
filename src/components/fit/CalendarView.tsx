import { useState } from "react";
import { dateKey, sessionSets, sessionVolume, todayKey, type FitState } from "@/lib/fit/store";
import { Panel, Pill, SectionHead } from "./ui";

const WD = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

export default function CalendarView({ state }: { state: FitState }) {
  const now = new Date();
  const [cursor, setCursor] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [selected, setSelected] = useState(todayKey());

  const first = new Date(cursor.y, cursor.m, 1);
  const offset = (first.getDay() + 6) % 7;
  const days = new Date(cursor.y, cursor.m + 1, 0).getDate();
  const cells = [...Array(offset).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];

  const monthSessions = Object.keys(state.sessions).filter((k) =>
    k.startsWith(`${cursor.y}-${String(cursor.m + 1).padStart(2, "0")}`),
  );
  const sel = state.sessions[selected];
  const selDay = sel ? state.program.find((d) => d.id === sel.dayId) : undefined;

  const move = (delta: number) =>
    setCursor((c) => {
      const d = new Date(c.y, c.m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });

  return (
    <div className="animate-rise space-y-3">
      <Panel hero>
        <div className="mb-3 flex items-center justify-between">
          <button type="button" onClick={() => move(-1)} className="rounded-xl border border-border px-3 py-2 text-sm">
            ‹
          </button>
          <div className="text-center">
            <div className="kicker">Takvim</div>
            <div className="font-display text-base font-bold">
              {MONTHS[cursor.m]} {cursor.y}
            </div>
          </div>
          <button type="button" onClick={() => move(1)} className="rounded-xl border border-border px-3 py-2 text-sm">
            ›
          </button>
        </div>
        <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[0.55rem] tracking-widest text-muted-foreground">
          {WD.map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((n, i) => {
            if (!n) return <span key={`e${i}`} />;
            const k = dateKey(new Date(cursor.y, cursor.m, n));
            const sets = sessionSets(state.sessions[k]);
            const isToday = k === todayKey();
            const isSel = k === selected;
            return (
              <button
                key={k}
                type="button"
                onClick={() => setSelected(k)}
                className="flex aspect-square flex-col items-center justify-center rounded-xl border text-xs transition"
                style={{
                  borderColor: isSel
                    ? "var(--violet)"
                    : sets
                      ? "color-mix(in oklab, var(--lime) 40%, transparent)"
                      : isToday
                        ? "var(--cyan)"
                        : "var(--border)",
                  background: sets
                    ? "color-mix(in oklab, var(--lime) 12%, transparent)"
                    : "color-mix(in oklab, var(--surface) 55%, transparent)",
                }}
              >
                <span className="font-display font-bold">{n}</span>
                {sets ? <span className="text-[0.5rem] text-lime">{sets} set</span> : null}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex justify-between text-[0.65rem] text-muted-foreground">
          <span>Bu ay {monthSessions.length} antrenman</span>
          <span>
            {Math.round(monthSessions.reduce((t, k) => t + sessionVolume(state.sessions[k]), 0))} kg hacim
          </span>
        </div>
      </Panel>

      <Panel>
        <SectionHead
          kicker="Gün detayı"
          title={selected}
          right={sel ? <Pill tone="lime">{sessionSets(sel)} set</Pill> : <Pill>Boş</Pill>}
        />
        {!sel ? (
          <p className="text-xs text-muted-foreground">Bu günde kayıtlı antrenman yok.</p>
        ) : (
          <div className="space-y-2">
            <div className="rounded-xl border border-border bg-background/40 p-3 text-sm font-semibold">
              {selDay?.emoji} {selDay?.name ?? "Antrenman"}
            </div>
            {Object.entries(sel.entries)
              .filter(([, logs]) => logs.length)
              .map(([name, logs]) => (
                <div key={name} className="rounded-xl border border-border bg-background/40 p-3">
                  <div className="text-sm font-semibold">{name}</div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {logs.map((l, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-muted px-2 py-0.5 font-display text-[0.65rem] font-semibold"
                      >
                        {l.weight}kg × {l.reps}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
