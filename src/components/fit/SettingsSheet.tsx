import { toast } from "sonner";
import { RING_STYLES, THEMES, DEFAULT_SETTINGS, type Settings } from "@/lib/fit/theme";
import type { FitState } from "@/lib/fit/store";
import { Overlay } from "./Sheets";
import { Btn, NumField, Pill, Ring, SectionHead } from "./ui";

type Props = {
  state: FitState;
  update: (fn: (s: FitState) => FitState) => void;
  onClose: () => void;
};

export default function SettingsSheet({ state, update, onClose }: Props) {
  const s = state.settings;
  const set = (patch: Partial<Settings>) =>
    update((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }));

  return (
    <Overlay title="🎨 Kişiselleştirme" onClose={onClose}>
      <div className="space-y-4 pb-6">
        {/* Canlı önizleme */}
        <div className="card-hero flex items-center gap-4 p-4">
          <Ring percent={68} size={86} style={s.ringStyle} thickness={s.ringThickness} />
          <div className="min-w-0">
            <div className="kicker">Canlı önizleme</div>
            <h3 className="font-display text-lg font-bold">
              Fit Program <span className="text-gradient">ELITE</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Tema, yazı boyutu ve halka stili anında uygulanır.
            </p>
          </div>
        </div>

        {/* Tema */}
        <section>
          <SectionHead kicker="Renk gradyanı" title="Tema" right={<Pill tone="violet">{THEMES.length} tema</Pill>} />
          <div className="grid grid-cols-2 gap-2">
            {THEMES.map((t) => {
              const active = s.theme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => set({ theme: t.id })}
                  className="flex items-center gap-3 rounded-2xl border p-3 text-left transition active:scale-[0.98]"
                  style={{
                    borderColor: active ? "var(--violet)" : "var(--border)",
                    background: active
                      ? "color-mix(in oklab, var(--violet) 12%, transparent)"
                      : "color-mix(in oklab, var(--surface) 65%, transparent)",
                  }}
                >
                  <span
                    className="size-8 shrink-0 rounded-xl"
                    style={{ background: `linear-gradient(135deg, ${t.swatch[0]}, ${t.swatch[1]})` }}
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-bold">{t.label}</span>
                    <span className="block text-[0.6rem] text-muted-foreground">
                      {active ? "Seçili" : "Dokun"}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Yazı boyutu */}
        <section>
          <SectionHead
            kicker="Tipografi"
            title="Yazı boyutu"
            right={<Pill tone="cyan">%{s.fontScale}</Pill>}
          />
          <input
            type="range"
            min={85}
            max={125}
            step={5}
            value={s.fontScale}
            onChange={(e) => set({ fontScale: Number(e.target.value) })}
            className="w-full accent-[var(--violet)]"
          />
          <div className="mt-1 flex justify-between text-[0.6rem] text-muted-foreground">
            <span>Küçük</span>
            <span>Normal</span>
            <span>Büyük</span>
          </div>
          <div className="mt-3 flex items-center justify-between rounded-xl border border-border bg-background/40 px-3 py-2">
            <span className="text-xs font-semibold">Kompakt yerleşim</span>
            <button
              type="button"
              onClick={() => set({ compact: !s.compact })}
              className="relative h-6 w-11 rounded-full transition"
              style={{
                background: s.compact ? "var(--violet)" : "var(--muted)",
              }}
              aria-label="Kompakt yerleşim"
            >
              <span
                className="absolute top-0.5 size-5 rounded-full bg-background transition-all"
                style={{ left: s.compact ? "1.4rem" : "0.15rem" }}
              />
            </button>
          </div>
        </section>

        {/* Halka */}
        <section>
          <SectionHead kicker="Progres halkası" title="Stil & kalınlık" />
          <div className="grid grid-cols-2 gap-2">
            {RING_STYLES.map((r) => {
              const active = s.ringStyle === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => set({ ringStyle: r.id })}
                  className="flex items-center gap-3 rounded-2xl border p-2 text-left transition active:scale-[0.98]"
                  style={{
                    borderColor: active ? "var(--cyan)" : "var(--border)",
                    background: active
                      ? "color-mix(in oklab, var(--cyan) 10%, transparent)"
                      : "color-mix(in oklab, var(--surface) 65%, transparent)",
                  }}
                >
                  <Ring percent={72} size={46} style={r.id} thickness={s.ringThickness} label="" />
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-bold">{r.label}</span>
                    <span className="block text-[0.58rem] leading-tight text-muted-foreground">
                      {r.hint}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-3">
            <div className="mb-1 flex justify-between text-[0.6rem] tracking-widest text-muted-foreground uppercase">
              <span>Kalınlık</span>
              <span>{s.ringThickness}px</span>
            </div>
            <input
              type="range"
              min={3}
              max={12}
              step={1}
              value={s.ringThickness}
              onChange={(e) => set({ ringThickness: Number(e.target.value) })}
              className="w-full accent-[var(--violet)]"
            />
          </div>
        </section>

        {/* Varsayılan hedefler */}
        <section>
          <SectionHead kicker="Varsayılan hedefler" title="Yeni hareketler & günlük" />
          <div className="grid grid-cols-2 gap-2">
            <NumField label="Set" value={s.defaultSets} onChange={(v) => set({ defaultSets: Math.max(1, v) })} />
            <NumField
              label="Dinlenme"
              suffix="sn"
              step={15}
              value={s.defaultRest}
              onChange={(v) => set({ defaultRest: Math.max(15, v) })}
            />
            <label className="block">
              <span className="mb-1 block text-[0.6rem] font-semibold tracking-widest text-muted-foreground uppercase">
                Tekrar aralığı
              </span>
              <input
                value={s.defaultReps}
                onChange={(e) => set({ defaultReps: e.target.value })}
                placeholder="8-12"
                className="min-h-11 w-full rounded-xl border border-border bg-background/60 px-3 font-display text-sm font-bold outline-none"
              />
            </label>
            <NumField
              label="Su hedefi"
              suffix="ml"
              step={250}
              value={state.waterGoal}
              onChange={(v) => update((p) => ({ ...p, waterGoal: Math.max(500, v) }))}
            />
            <NumField
              label="Kalori hedefi"
              suffix="kcal"
              step={50}
              value={state.kcalGoal}
              onChange={(v) => update((p) => ({ ...p, kcalGoal: Math.max(800, v) }))}
            />
          </div>
          <p className="mt-2 text-[0.65rem] text-muted-foreground">
            Kütüphaneden eklenen her hareket bu set / tekrar / dinlenme değerleriyle gelir.
          </p>
        </section>

        <div className="grid grid-cols-2 gap-2">
          <Btn
            variant="soft"
            onClick={() => {
              set(DEFAULT_SETTINGS);
              toast.success("Varsayılanlara dönüldü");
            }}
          >
            ↺ Sıfırla
          </Btn>
          <Btn variant="primary" onClick={onClose}>
            ✓ Bitti
          </Btn>
        </div>
      </div>
    </Overlay>
  );
}
