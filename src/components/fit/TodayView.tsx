import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ACCENT_VAR, DEFAULT_PROGRAM, MOVE_LIBRARY } from "@/lib/fit/data";
import {
  fmtHMS,
  fmtMS,
  sessionSets,
  sessionVolume,
  todayKey,
  useDerived,
  useTimer,
  type FitState,
} from "@/lib/fit/store";
import { Bar, Btn, Metric, Panel, Pill, Ring, SectionHead } from "./ui";

type Props = {
  state: FitState;
  update: (fn: (s: FitState) => FitState) => void;
  derived: ReturnType<typeof useDerived>;
  onOpenLibrary: () => void;
  onOpenPlates: () => void;
  onGoProgram: () => void;
  onOpenOneRm: () => void;
};

const tipFor = (name: string) => MOVE_LIBRARY.find((m) => m.name === name)?.tips;

export default function TodayView({
  state,
  update,
  derived,
  onOpenLibrary,
  onOpenPlates,
  onGoProgram,
  onOpenOneRm,
}: Props) {
  const key = todayKey();
  const day = state.program.find((d) => d.id === state.selectedDayId) ?? DEFAULT_PROGRAM[0]!;
  const session = state.sessions[key];
  const accent = ACCENT_VAR[day.accent];

  const [running, setRunning] = useState(false);
  const { seconds, setSeconds } = useTimer(running);
  const [rest, setRest] = useState(0);

  useEffect(() => {
    if (session?.seconds && seconds === 0) setSeconds(session.seconds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (rest <= 0) return;
    const t = setInterval(() => setRest((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(t);
  }, [rest]);

  const targetSets = useMemo(() => day.exercises.reduce((t, e) => t + e.sets, 0), [day]);
  const doneSets = sessionSets(session);
  const percent = targetSets ? (doneSets / targetSets) * 100 : 0;

  const logSet = (exName: string, weight: number, reps: number, rst: number) => {
    if (!reps) {
      toast.error("Tekrar sayısı gir");
      return;
    }
    update((s) => {
      const prev = s.sessions[key] ?? { dayId: day.id, entries: {}, seconds: 0 };
      const entries = { ...prev.entries, [exName]: [...(prev.entries[exName] ?? []), { weight, reps }] };
      return { ...s, sessions: { ...s.sessions, [key]: { ...prev, dayId: day.id, entries } } };
    });
    setRest(rst);
    if (!running) setRunning(true);
    const pr = derived.prs[exName] ?? 0;
    toast.success(weight > pr && weight > 0 ? `🏆 Yeni PR: ${weight} kg!` : "Set kaydedildi");
  };

  const undoSet = (exName: string) =>
    update((s) => {
      const prev = s.sessions[key];
      if (!prev) return s;
      const list = [...(prev.entries[exName] ?? [])];
      list.pop();
      return {
        ...s,
        sessions: { ...s.sessions, [key]: { ...prev, entries: { ...prev.entries, [exName]: list } } },
      };
    });

  const finishDay = () => {
    update((s) => {
      const prev = s.sessions[key];
      if (!prev) return s;
      return { ...s, sessions: { ...s.sessions, [key]: { ...prev, seconds, finished: true } } };
    });
    setRunning(false);
    toast.success("Gün tamamlandı, harika iş! 💪");
  };

  const resetDay = () => {
    update((s) => {
      const next = { ...s.sessions };
      delete next[key];
      return { ...s, sessions: next };
    });
    setRunning(false);
    setSeconds(0);
    toast("Bugünün kaydı sıfırlandı");
  };

  return (
    <div className="animate-rise space-y-3">
      <Panel hero className="relative overflow-hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="kicker">Bugünün antrenmanı</div>
            <h1 className="mt-1 font-display text-xl leading-tight font-bold">
              {day.emoji} {day.name}
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              {day.focus} • {day.exercises.length} hareket • {targetSets} set
            </p>
          </div>
          <Ring
            percent={percent}
            style={state.settings.ringStyle}
            thickness={state.settings.ringThickness}
          />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            ["SET", `${doneSets} / ${targetSets}`],
            ["HACİM", `${Math.round(sessionVolume(session))} kg`],
            ["SÜRE", fmtHMS(seconds)],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl border border-border/60 bg-background/40 p-2 text-center">
              <div className="text-[0.55rem] tracking-widest text-muted-foreground">{k}</div>
              <div className="font-display text-sm font-bold">{v}</div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <Btn variant="primary" className="flex-1" onClick={() => setRunning((r) => !r)}>
            {running ? "⏸ Duraklat" : "▶ Antrenmanı Başlat"}
          </Btn>
          <Btn onClick={finishDay}>✓ Bitir</Btn>
          <Btn variant="danger" onClick={resetDay}>
            ↺
          </Btn>
        </div>
      </Panel>

      {rest > 0 && (
        <Panel className="flex items-center justify-between border-cyan/40">
          <div>
            <div className="kicker">Dinlenme</div>
            <div className="font-display text-2xl font-bold text-cyan">{fmtMS(rest)}</div>
          </div>
          <div className="flex gap-2">
            <Btn onClick={() => setRest((r) => r + 30)}>+30sn</Btn>
            <Btn variant="danger" onClick={() => setRest(0)}>
              Atla
            </Btn>
          </div>
        </Panel>
      )}

      <Panel>
        <SectionHead
          kicker="Haftalık plan"
          title="Bugünkü odağını seç"
          right={<Pill tone="violet">{doneSets}/{targetSets}</Pill>}
        />
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {state.program.map((d) => {
            const active = d.id === day.id;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => update((s) => ({ ...s, selectedDayId: d.id }))}
                className="min-w-28 shrink-0 rounded-2xl border p-3 text-left transition"
                style={{
                  borderColor: active ? ACCENT_VAR[d.accent] : "var(--border)",
                  background: active
                    ? `color-mix(in oklab, ${ACCENT_VAR[d.accent]} 14%, transparent)`
                    : "color-mix(in oklab, var(--surface) 70%, transparent)",
                }}
              >
                <div className="text-lg">{d.emoji}</div>
                <div className="mt-1 text-[0.65rem] tracking-widest text-muted-foreground">
                  GÜN {d.id}
                </div>
                <div className="truncate text-xs font-bold">{d.focus}</div>
              </button>
            );
          })}
        </div>
      </Panel>

      <div className="grid grid-cols-2 gap-2">
        <Metric icon="🔥" label="Seri" value={`${derived.streak} gün`} color="var(--rose)" />
        <Metric icon="🏆" label="En Yüksek PR" value={`${derived.pr} kg`} color="var(--amber)" />
        <Metric
          icon="📦"
          label="Toplam Hacim"
          value={`${(derived.totalVolume / 1000).toFixed(1)} ton`}
          color="var(--cyan)"
        />
        <Metric icon="🧬" label="Recovery" value={`${derived.recovery}%`} color="var(--lime)" />
      </div>

      <Panel>
        <SectionHead
          kicker="Recovery"
          title={derived.recovery > 70 ? "Bugün antrenmana hazırsın" : "Yorgunluk birikiyor"}
          right={
            <Pill tone={derived.recovery > 70 ? "lime" : "rose"}>
              {derived.recovery > 70 ? "Hazır" : "Dikkat"}
            </Pill>
          }
        />
        <Bar percent={derived.recovery} color="var(--lime)" />
        <div className="mt-2 flex justify-between text-[0.65rem] text-muted-foreground">
          <span>Toparlanma skoru</span>
          <span>
            Bu hafta {derived.weekWorkouts} antrenman • {derived.weekSets} set
          </span>
        </div>
      </Panel>

      <Panel>
        <SectionHead kicker="Hızlı erişim" title="Tek dokunuşla" />
        <div className="grid grid-cols-2 gap-2">
          <Btn variant="soft" onClick={onGoProgram}>
            🛠️ Program
          </Btn>
          <Btn variant="soft" onClick={onOpenLibrary}>
            🏋️ Kütüphane
          </Btn>
          <Btn variant="soft" onClick={onOpenPlates}>
            ⚖️ Plaka Hesap
          </Btn>
          <Btn variant="soft" onClick={onOpenOneRm}>
            🧮 1RM Hesap
          </Btn>
          <Btn
            variant="soft"
            className="col-span-2"
            onClick={() => toast(`Seviye ${derived.level} • ${derived.xp} XP`)}
          >
            🏅 Level {derived.level}
          </Btn>
        </div>
      </Panel>

      <Panel>
        <SectionHead
          kicker="Bugün"
          title="Hareketlerin"
          right={<Pill tone="cyan">{day.exercises.length} hareket</Pill>}
        />
        <div className="space-y-2">
          {day.exercises.map((ex) => (
            <ExerciseCard
              key={ex.name}
              name={ex.name}
              sets={ex.sets}
              reps={ex.reps}
              rest={ex.rest}
              accent={accent}
              logs={session?.entries[ex.name] ?? []}
              pr={derived.prs[ex.name] ?? 0}
              onLog={logSet}
              onUndo={() => undoSet(ex.name)}
            />
          ))}
        </div>
      </Panel>
    </div>
  );
}

function ExerciseCard({
  name,
  sets,
  reps,
  rest,
  accent,
  logs,
  pr,
  onLog,
  onUndo,
}: {
  name: string;
  sets: number;
  reps: string;
  rest: number;
  accent: string;
  logs: { weight: number; reps: number }[];
  pr: number;
  onLog: (n: string, w: number, r: number, rest: number) => void;
  onUndo: () => void;
}) {
  const last = logs[logs.length - 1];
  const [weight, setWeight] = useState<number>(last?.weight ?? pr ?? 0);
  const [rp, setRp] = useState<number>(last?.reps ?? (parseInt(reps, 10) || 10));
  const [open, setOpen] = useState(false);
  const done = logs.length >= sets;

  return (
    <div
      className="rounded-2xl border p-3 transition"
      style={{
        borderColor: done ? `color-mix(in oklab, var(--lime) 45%, transparent)` : "var(--border)",
        background: done
          ? "color-mix(in oklab, var(--lime) 8%, transparent)"
          : "color-mix(in oklab, var(--surface) 60%, transparent)",
      }}
    >
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-3 text-left">
        <span
          className="grid size-10 shrink-0 place-items-center rounded-xl font-display text-xs font-bold"
          style={{ background: `color-mix(in oklab, ${accent} 18%, transparent)` }}
        >
          {logs.length}/{sets}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-bold">{name}</span>
          <span className="block text-[0.68rem] text-muted-foreground">
            {reps} tekrar • {rest}sn dinlenme{pr ? ` • PR ${pr} kg` : ""}
          </span>
        </span>
        <span className="text-xs text-muted-foreground">{open ? "▲" : "▼"}</span>
      </button>

      {logs.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {logs.map((l, i) => (
            <span
              key={i}
              className="rounded-lg border border-border/60 bg-background/50 px-2 py-1 font-display text-[0.65rem] font-semibold"
            >
              {l.weight}kg × {l.reps}
            </span>
          ))}
        </div>
      )}

      {open && (
        <div className="mt-3 space-y-2 border-t border-border/60 pt-3">
          <div className="flex items-end gap-2">
            <label className="flex-1">
              <span className="mb-1 block text-[0.55rem] tracking-widest text-muted-foreground">KG</span>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="min-h-11 w-full rounded-xl border border-border bg-background/60 px-3 font-display font-bold outline-none"
              />
            </label>
            <label className="flex-1">
              <span className="mb-1 block text-[0.55rem] tracking-widest text-muted-foreground">TEKRAR</span>
              <input
                type="number"
                value={rp}
                onChange={(e) => setRp(Number(e.target.value))}
                className="min-h-11 w-full rounded-xl border border-border bg-background/60 px-3 font-display font-bold outline-none"
              />
            </label>
            <Btn variant="primary" onClick={() => onLog(name, weight, rp, rest)}>
              + Set
            </Btn>
          </div>
          <div className="flex items-center justify-between gap-2">
            <p className="text-[0.65rem] leading-snug text-muted-foreground">{tipFor(name) ?? "Kontrollü tempo, tam hareket açıklığı."}</p>
            {logs.length > 0 && (
              <Btn variant="danger" className="min-h-9 px-3 text-xs" onClick={onUndo}>
                Geri al
              </Btn>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
