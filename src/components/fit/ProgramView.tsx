import { useState } from "react";
import { toast } from "sonner";
import { ACCENT_VAR, DEFAULT_PROGRAM, type FitProgramDayPatch } from "@/lib/fit/program-types";
import type { FitState } from "@/lib/fit/store";
import { Btn, Panel, Pill, SectionHead } from "./ui";

type Props = {
  state: FitState;
  update: (fn: (s: FitState) => FitState) => void;
  onOpenLibrary: (dayId: number) => void;
  onOpenPlates: () => void;
};

export default function ProgramView({ state, update, onOpenLibrary, onOpenPlates }: Props) {
  const [openDay, setOpenDay] = useState<number | null>(state.selectedDayId);

  const patchExercise = (dayId: number, name: string, patch: FitProgramDayPatch) =>
    update((s) => ({
      ...s,
      program: s.program.map((d) =>
        d.id === dayId
          ? { ...d, exercises: d.exercises.map((e) => (e.name === name ? { ...e, ...patch } : e)) }
          : d,
      ),
    }));

  const removeExercise = (dayId: number, name: string) =>
    update((s) => ({
      ...s,
      program: s.program.map((d) =>
        d.id === dayId ? { ...d, exercises: d.exercises.filter((e) => e.name !== name) } : d,
      ),
    }));

  return (
    <div className="animate-rise space-y-3">
      <Panel hero>
        <SectionHead
          kicker="Program merkezi"
          title="6 günlük sistemini yönet"
          right={<Pill tone="violet">{state.program.length} gün</Pill>}
        />
        <p className="text-xs leading-relaxed text-muted-foreground">
          Hareket ekle/çıkar, set–tekrar–dinlenme değerlerini kendi seviyene göre ayarla.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Btn variant="soft" onClick={() => onOpenLibrary(openDay ?? 1)}>
            🏋️ Hareket ekle
          </Btn>
          <Btn variant="soft" onClick={onOpenPlates}>
            ⚖️ Plaka hesap
          </Btn>
          <Btn
            variant="danger"
            className="col-span-2"
            onClick={() => {
              update((s) => ({ ...s, program: DEFAULT_PROGRAM }));
              toast("Program varsayılana döndü");
            }}
          >
            ↺ Varsayılan programa dön
          </Btn>
        </div>
      </Panel>

      {state.program.map((d) => {
        const open = openDay === d.id;
        const accent = ACCENT_VAR[d.accent];
        return (
          <Panel key={d.id} className="p-0">
            <button
              type="button"
              onClick={() => setOpenDay(open ? null : d.id)}
              className="flex w-full items-center gap-3 p-4 text-left"
            >
              <span
                className="grid size-11 place-items-center rounded-2xl text-lg"
                style={{ background: `color-mix(in oklab, ${accent} 18%, transparent)` }}
              >
                {d.emoji}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.6rem] tracking-widest text-muted-foreground">
                  GÜN {d.id} • {d.focus.toUpperCase()}
                </span>
                <span className="block truncate text-sm font-bold">{d.name}</span>
              </span>
              <Pill>{d.exercises.length}</Pill>
            </button>

            {open && (
              <div className="space-y-2 px-4 pb-4">
                {d.exercises.map((e) => (
                  <div
                    key={e.name}
                    className="rounded-2xl border border-border bg-background/40 p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold">{e.name}</span>
                      <button
                        type="button"
                        onClick={() => removeExercise(d.id, e.name)}
                        className="rounded-lg border border-rose/30 bg-rose/10 px-2 py-1 text-[0.65rem] font-semibold text-rose"
                      >
                        Sil
                      </button>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      <MiniField
                        label="Set"
                        value={e.sets}
                        onChange={(v) => patchExercise(d.id, e.name, { sets: Number(v) })}
                      />
                      <MiniField
                        label="Tekrar"
                        text
                        value={e.reps}
                        onChange={(v) => patchExercise(d.id, e.name, { reps: String(v) })}
                      />
                      <MiniField
                        label="Dinlenme"
                        value={e.rest}
                        onChange={(v) => patchExercise(d.id, e.name, { rest: Number(v) })}
                      />
                    </div>
                  </div>
                ))}
                <Btn variant="soft" className="w-full" onClick={() => onOpenLibrary(d.id)}>
                  + Kütüphaneden hareket ekle
                </Btn>
              </div>
            )}
          </Panel>
        );
      })}
    </div>
  );
}

function MiniField({
  label,
  value,
  onChange,
  text,
}: {
  label: string;
  value: string | number;
  onChange: (v: string | number) => void;
  text?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[0.55rem] tracking-widest text-muted-foreground uppercase">
        {label}
      </span>
      <input
        type={text ? "text" : "number"}
        value={value}
        onChange={(ev) => onChange(ev.target.value)}
        className="min-h-10 w-full rounded-xl border border-border bg-background/60 px-2 text-center font-display text-sm font-bold outline-none"
      />
    </label>
  );
}
