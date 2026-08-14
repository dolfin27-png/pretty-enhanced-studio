import { useMemo, useState } from "react";
import { toast } from "sonner";
import { MOVE_LIBRARY, MUSCLES, PLATES } from "@/lib/fit/data";
import type { FitState } from "@/lib/fit/store";
import { Btn, NumField, Pill } from "./ui";

function Overlay({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-sm">
      <div className="card-elite animate-rise flex max-h-[88vh] w-full max-w-[560px] flex-col rounded-b-none p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-base font-bold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-xl border border-border bg-secondary text-sm"
          >
            ✕
          </button>
        </div>
        <div className="no-scrollbar flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export function LibrarySheet({
  targetDay,
  update,
  onClose,
}: {
  targetDay: number | null;
  update: (fn: (s: FitState) => FitState) => void;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const [muscle, setMuscle] = useState<string>("Tümü");

  const list = useMemo(
    () =>
      MOVE_LIBRARY.filter(
        (m) =>
          (muscle === "Tümü" || m.muscle === muscle) &&
          m.name.toLowerCase().includes(q.toLowerCase().trim()),
      ).slice(0, 60),
    [q, muscle],
  );

  const add = (name: string) => {
    if (!targetDay) {
      toast("Program sekmesinden bir gün seç");
      return;
    }
    update((s) => ({
      ...s,
      program: s.program.map((d) =>
        d.id === targetDay && !d.exercises.some((e) => e.name === name)
          ? { ...d, exercises: [...d.exercises, { name, sets: 3, reps: "8-12", rest: 90 }] }
          : d,
      ),
    }));
    toast.success(`${name} → Gün ${targetDay}`);
  };

  return (
    <Overlay title="🏋️ Hareket Kütüphanesi" onClose={onClose}>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Hareket ara…"
        className="min-h-11 w-full rounded-xl border border-border bg-background/60 px-3 text-sm outline-none"
      />
      <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto pb-1">
        {["Tümü", ...MUSCLES].map((mm) => (
          <button
            key={mm}
            type="button"
            onClick={() => setMuscle(mm)}
            className="shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition"
            style={{
              borderColor: muscle === mm ? "var(--violet)" : "var(--border)",
              background:
                muscle === mm ? "color-mix(in oklab, var(--violet) 16%, transparent)" : "transparent",
            }}
          >
            {mm}
          </button>
        ))}
      </div>
      <div className="mt-3 space-y-2 pb-4">
        {list.map((m) => (
          <div key={m.name} className="rounded-2xl border border-border bg-background/40 p-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{m.emoji}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold">{m.name}</span>
                <span className="block text-[0.65rem] text-muted-foreground">
                  {m.muscle} • {m.level}
                </span>
              </span>
              <Btn variant="soft" className="min-h-9 px-3 text-xs" onClick={() => add(m.name)}>
                + Ekle
              </Btn>
            </div>
            <p className="mt-2 text-[0.68rem] leading-snug text-muted-foreground">{m.tips}</p>
          </div>
        ))}
        {list.length === 0 && <p className="text-xs text-muted-foreground">Sonuç bulunamadı.</p>}
      </div>
    </Overlay>
  );
}

export function PlateSheet({ onClose }: { onClose: () => void }) {
  const [target, setTarget] = useState(100);
  const [bar, setBar] = useState(20);

  const perSide = Math.max(0, (target - bar) / 2);
  const plates: number[] = [];
  let left = perSide;
  PLATES.forEach((p) => {
    while (left >= p - 0.001) {
      plates.push(p);
      left = Math.round((left - p) * 100) / 100;
    }
  });

  return (
    <Overlay title="⚖️ Plaka Hesaplayıcı" onClose={onClose}>
      <div className="grid grid-cols-2 gap-2">
        <NumField label="Hedef ağırlık" suffix="kg" value={target} step={2.5} onChange={setTarget} />
        <NumField label="Bar ağırlığı" suffix="kg" value={bar} step={5} onChange={setBar} />
      </div>
      <div className="card-elite mt-3 p-4 text-center">
        <div className="kicker">Tek tarafa</div>
        <div className="font-display text-2xl font-bold text-gradient">{perSide} kg</div>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {plates.map((p, i) => (
            <Pill key={i} tone="violet">
              {p} kg
            </Pill>
          ))}
          {plates.length === 0 && <span className="text-xs text-muted-foreground">Plaka gerekmiyor</span>}
        </div>
        {left > 0 && (
          <p className="mt-3 text-[0.65rem] text-rose">{left} kg tam plakalarla tamamlanamıyor.</p>
        )}
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2 pb-4">
        {[60, 80, 100, 120].map((t) => (
          <Btn key={t} variant="soft" onClick={() => setTarget(t)}>
            {t}
          </Btn>
        ))}
      </div>
    </Overlay>
  );
}
