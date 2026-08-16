import { useEffect, useState } from "react";
import { toast } from "sonner";
import { todayKey, type FitState, type useDerived } from "@/lib/fit/store";
import { Bar, Btn, NumField, Panel, Pill, SectionHead } from "./ui";
import {
  APP_RELEASE_DATE,
  APP_VERSION,
  LATEST_RELEASE,
  getSeenVersion,
} from "@/lib/fit/version";

export default function ProfileView({
  state,
  update,
  derived,
  onOpenSettings,
  onOpenReleases,
}: {
  state: FitState;
  update: (fn: (s: FitState) => FitState) => void;
  derived: ReturnType<typeof useDerived>;
  onOpenSettings: () => void;
  onOpenReleases: () => void;
}) {
  const key = todayKey();
  const [m, setM] = useState({ weight: 0, chest: 0, waist: 0, arm: 0, leg: 0 });
  const [isNew, setIsNew] = useState(false);
  useEffect(() => {
    setIsNew(getSeenVersion() !== APP_VERSION);
  }, []);
  const water = state.water[key] ?? 0;
  const kcal = state.kcal[key] ?? 0;
  const last = state.measures[0];

  const save = () => {
    if (!m.weight && !m.chest && !m.waist && !m.arm && !m.leg) {
      toast.error("En az bir ölçü gir");
      return;
    }
    update((s) => ({ ...s, measures: [{ date: key, ...m }, ...s.measures].slice(0, 60) }));
    toast.success("Ölçüler kaydedildi");
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `fit-program-v${APP_VERSION}-${key}.json`;
    a.click();
    toast.success("Veriler indirildi");
  };

  const importData = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as Partial<FitState>;
        if (!parsed.program || !parsed.sessions) throw new Error("bad");
        update((s) => ({ ...s, ...parsed, settings: { ...s.settings, ...(parsed.settings ?? {}) } }));
        toast.success("Yedek geri yüklendi");
      } catch {
        toast.error("Dosya okunamadı");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="animate-rise space-y-3">
      <Panel hero>
        <SectionHead
          kicker="Profil"
          title={state.name}
          right={<Pill tone="violet">Level {derived.level}</Pill>}
        />
        <input
          value={state.name}
          onChange={(e) => update((s) => ({ ...s, name: e.target.value }))}
          className="min-h-11 w-full rounded-xl border border-border bg-background/60 px-3 text-sm outline-none"
          placeholder="Adın"
        />
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          {[
            ["ANTRENMAN", derived.workouts],
            ["SERİ", `${derived.streak}🔥`],
            ["PR", `${derived.pr} kg`],
          ].map(([k, v]) => (
            <div key={String(k)} className="rounded-xl border border-border/60 bg-background/40 p-2">
              <div className="text-[0.55rem] tracking-widest text-muted-foreground">{k}</div>
              <div className="font-display text-sm font-bold">{v}</div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <SectionHead
          kicker="Su takibi"
          title={`${water} / ${state.waterGoal} ml`}
          right={<Pill tone="cyan">{Math.round((water / state.waterGoal) * 100)}%</Pill>}
        />
        <Bar percent={(water / state.waterGoal) * 100} color="var(--cyan)" />
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[250, 500, -250].map((v) => (
            <Btn
              key={v}
              variant={v > 0 ? "soft" : "danger"}
              onClick={() =>
                update((s) => ({
                  ...s,
                  water: { ...s.water, [key]: Math.max(0, (s.water[key] ?? 0) + v) },
                }))
              }
            >
              {v > 0 ? `+${v}` : v} ml
            </Btn>
          ))}
        </div>
      </Panel>

      <Panel>
        <SectionHead
          kicker="Kalori"
          title={`${kcal} / ${state.kcalGoal} kcal`}
          right={<Pill tone="lime">{Math.round((kcal / state.kcalGoal) * 100)}%</Pill>}
        />
        <Bar percent={(kcal / state.kcalGoal) * 100} color="var(--lime)" />
        <div className="mt-3 grid grid-cols-2 gap-2">
          <NumField
            label="Bugün alınan"
            value={kcal}
            suffix="kcal"
            step={50}
            onChange={(v) => update((s) => ({ ...s, kcal: { ...s.kcal, [key]: v } }))}
          />
          <NumField
            label="Hedef"
            value={state.kcalGoal}
            suffix="kcal"
            step={50}
            onChange={(v) => update((s) => ({ ...s, kcalGoal: v || 2000 }))}
          />
        </div>
      </Panel>

      <Panel>
        <SectionHead
          kicker="Ölçümler"
          title="Vücut takibi"
          right={last ? <Pill>{last.date}</Pill> : undefined}
        />
        <div className="grid grid-cols-2 gap-2">
          <NumField label="Kilo" suffix="kg" value={m.weight} onChange={(v) => setM({ ...m, weight: v })} />
          <NumField label="Göğüs" suffix="cm" value={m.chest} onChange={(v) => setM({ ...m, chest: v })} />
          <NumField label="Bel" suffix="cm" value={m.waist} onChange={(v) => setM({ ...m, waist: v })} />
          <NumField label="Kol" suffix="cm" value={m.arm} onChange={(v) => setM({ ...m, arm: v })} />
        </div>
        <Btn variant="primary" className="mt-3 w-full" onClick={save}>
          Ölçüleri kaydet
        </Btn>
        <div className="mt-3 space-y-2">
          {state.measures.slice(0, 6).map((x, i) => (
            <div
              key={`${x.date}-${i}`}
              className="flex items-center justify-between rounded-xl border border-border bg-background/40 p-3 text-xs"
            >
              <span className="text-muted-foreground">{x.date}</span>
              <span className="font-display font-bold">
                {[x.weight && `${x.weight}kg`, x.chest && `G${x.chest}`, x.waist && `B${x.waist}`, x.arm && `K${x.arm}`]
                  .filter(Boolean)
                  .join(" • ")}
              </span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <SectionHead kicker="Görünüm" title="Kişiselleştirme" right={<Pill tone="violet">Tema</Pill>} />
        <p className="mb-3 text-xs text-muted-foreground">
          Renk gradyanı, yazı boyutu, progres halkası stili ve varsayılan hedefler.
        </p>
        <Btn variant="primary" className="w-full" onClick={onOpenSettings}>
          🎨 Paneli aç
        </Btn>
      </Panel>

      <Panel>
        <SectionHead kicker="Veri" title="Yedekle & sıfırla" />
        <div className="grid grid-cols-2 gap-2">
          <Btn variant="soft" onClick={exportData}>
            ⤓ Dışa aktar
          </Btn>
          <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-cyan/25 bg-cyan/12 px-4 text-sm font-semibold text-cyan transition active:scale-[0.98]">
            ⤒ İçe aktar
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) importData(f);
              }}
            />
          </label>
          <Btn
            variant="danger"
            className="col-span-2"
            onClick={() => {
              if (!window.confirm("Tüm veriler silinsin mi? Bu işlem geri alınamaz.")) return;
              window.localStorage.removeItem("fit_elite_v3");
              window.location.reload();
            }}
          >
            Tüm veriyi sil
          </Btn>
        </div>
      </Panel>

      <Panel>
        <SectionHead
          kicker="Sürüm"
          title={`Pro Fitness v${APP_VERSION}`}
          right={isNew ? <Pill tone="lime">Yeni</Pill> : <Pill>{APP_RELEASE_DATE}</Pill>}
        />
        <p className="text-xs font-semibold text-foreground">{LATEST_RELEASE.title}</p>
        <ul className="mt-2 space-y-1">
          {LATEST_RELEASE.notes.slice(0, 3).map((n) => (
            <li key={n} className="flex gap-2 text-xs text-muted-foreground">
              <span className="text-violet">›</span>
              <span>{n}</span>
            </li>
          ))}
        </ul>
        <Btn variant="soft" className="mt-3 w-full" onClick={onOpenReleases}>
          🧾 Değişiklik notları
        </Btn>
      </Panel>
    </div>
  );
}
