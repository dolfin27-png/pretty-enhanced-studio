import { sessionSets, sessionVolume, type FitState, type useDerived } from "@/lib/fit/store";
import { Bar, Metric, Panel, Pill, SectionHead } from "./ui";

export default function StatsView({
  state,
  derived,
}: {
  state: FitState;
  derived: ReturnType<typeof useDerived>;
}) {
  const max = Math.max(1, ...derived.week.map((w) => w.volume));
  const prList = Object.entries(derived.prs).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const unlocked = derived.badges.filter((b) => b.unlocked).length;

  return (
    <div className="animate-rise space-y-3">
      <Panel hero>
        <SectionHead
          kicker="Haftalık ilerleme"
          title={`${Math.round(derived.weekVolume).toLocaleString("tr-TR")} kg hacim`}
          right={<Pill tone="lime">7 gün</Pill>}
        />
        <div className="flex h-40 items-end gap-2">
          {derived.week.map((w) => (
            <div key={w.key} className="flex flex-1 flex-col items-center gap-1">
              <span className="font-display text-[0.55rem] text-muted-foreground">
                {w.volume ? Math.round(w.volume / 100) / 10 + "t" : ""}
              </span>
              <div
                className="w-full rounded-t-lg transition-all duration-500"
                style={{
                  height: `${Math.max(4, (w.volume / max) * 120)}px`,
                  background: w.volume
                    ? "linear-gradient(180deg, var(--cyan), var(--violet))"
                    : "var(--muted)",
                }}
              />
              <span className="text-[0.6rem] text-muted-foreground">{w.label}</span>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid grid-cols-2 gap-2">
        <Metric icon="🏋️" label="Antrenman" value={`${derived.workouts}`} />
        <Metric icon="✅" label="Toplam Set" value={`${derived.totalSets}`} color="var(--lime)" />
        <Metric
          icon="📦"
          label="Hacim"
          value={`${(derived.totalVolume / 1000).toFixed(1)} ton`}
          color="var(--cyan)"
        />
        <Metric icon="🏅" label="Level / XP" value={`${derived.level} • ${derived.xp}`} color="var(--amber)" />
      </div>

      <Panel>
        <SectionHead
          kicker="Level"
          title={`Seviye ${derived.level}`}
          right={<Pill tone="violet">{derived.xpInLevel} / 300 XP</Pill>}
        />
        <Bar percent={(derived.xpInLevel / 300) * 100} />
      </Panel>

      <Panel>
        <SectionHead kicker="PR takibi" title="Kişisel rekorlar" right={<Pill tone="cyan">{prList.length}</Pill>} />
        {prList.length === 0 ? (
          <p className="text-xs text-muted-foreground">Set kaydettikçe rekorların burada listelenir.</p>
        ) : (
          <div className="space-y-2">
            {prList.map(([name, kg], i) => (
              <div
                key={name}
                className="flex items-center gap-3 rounded-xl border border-border bg-background/40 p-3"
              >
                <span className="font-display text-xs text-muted-foreground">#{i + 1}</span>
                <span className="min-w-0 flex-1 truncate text-sm font-semibold">{name}</span>
                <span className="font-display text-sm font-bold text-amber">{kg} kg</span>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <Panel>
        <SectionHead
          kicker="Rozetler"
          title="Başarımlar"
          right={<Pill tone="lime">{unlocked}/{derived.badges.length}</Pill>}
        />
        <div className="grid grid-cols-3 gap-2">
          {derived.badges.map((b) => (
            <div
              key={b.id}
              className="rounded-2xl border p-3 text-center transition"
              style={{
                borderColor: b.unlocked
                  ? "color-mix(in oklab, var(--lime) 40%, transparent)"
                  : "var(--border)",
                background: b.unlocked
                  ? "color-mix(in oklab, var(--lime) 10%, transparent)"
                  : "color-mix(in oklab, var(--surface) 60%, transparent)",
                opacity: b.unlocked ? 1 : 0.45,
              }}
            >
              <div className="text-xl">{b.emoji}</div>
              <div className="mt-1 text-[0.6rem] leading-tight font-semibold">{b.label}</div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <SectionHead kicker="Geçmiş" title="Son antrenmanlar" />
        <div className="space-y-2">
          {Object.keys(state.sessions)
            .sort()
            .reverse()
            .slice(0, 8)
            .map((k) => {
              const s = state.sessions[k];
              const day = state.program.find((d) => d.id === s.dayId);
              return (
                <div
                  key={k}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background/40 p-3"
                >
                  <span className="text-lg">{day?.emoji ?? "🏋️"}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{day?.name ?? "Antrenman"}</span>
                    <span className="block text-[0.65rem] text-muted-foreground">
                      {k} • {sessionSets(s)} set
                    </span>
                  </span>
                  <span className="font-display text-xs font-bold text-cyan">
                    {Math.round(sessionVolume(s))} kg
                  </span>
                </div>
              );
            })}
          {Object.keys(state.sessions).length === 0 && (
            <p className="text-xs text-muted-foreground">Henüz kayıt yok. İlk setini kaydet!</p>
          )}
        </div>
      </Panel>
    </div>
  );
}
