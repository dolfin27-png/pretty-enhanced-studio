import { useEffect, useState } from "react";
import { useDerived, useFit } from "@/lib/fit/store";
import CalendarView from "./CalendarView";
import ProfileView from "./ProfileView";
import ProgramView from "./ProgramView";
import StatsView from "./StatsView";
import TodayView from "./TodayView";
import { LibrarySheet, OneRmSheet, PlateSheet } from "./Sheets";
import SettingsSheet from "./SettingsSheet";
import ReleaseSheet from "./ReleaseSheet";
import { APP_VERSION, getSeenVersion } from "@/lib/fit/version";

const TABS = [
  { id: "today", label: "Bugün", icon: "🏠" },
  { id: "program", label: "Program", icon: "📅" },
  { id: "stats", label: "İstatistik", icon: "📊" },
  { id: "calendar", label: "Takvim", icon: "🗓️" },
  { id: "profile", label: "Profil", icon: "👤" },
] as const;

export default function FitApp() {
  const { state, update, hydrated } = useFit();
  const derived = useDerived(state);
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("today");
  const [libraryDay, setLibraryDay] = useState<number | null>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [platesOpen, setPlatesOpen] = useState(false);
  const [oneRmOpen, setOneRmOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [releasesOpen, setReleasesOpen] = useState(false);
  const [newVersion, setNewVersion] = useState(false);

  useEffect(() => {
    setNewVersion(getSeenVersion() !== APP_VERSION);
  }, []);

  return (
    <div className="mx-auto min-h-screen w-full max-w-[560px] pb-24">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 px-4 pt-4 pb-3 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl font-display text-base font-bold text-primary-foreground [background:var(--gradient-brand)]">
              F
            </span>
            <div>
              <h1 className="font-display text-base leading-none font-bold">
                Fit Program <span className="text-gradient">ELITE</span>
              </h1>
              <p className="mt-1 text-[0.65rem] text-muted-foreground">
                6 günlük profesyonel sistem · v{APP_VERSION}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-[0.55rem] tracking-widest text-muted-foreground">LEVEL</div>
              <div className="font-display text-lg leading-none font-bold text-violet">
                {derived.level}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setReleasesOpen(true)}
              aria-label="Sürüm notları"
              className="relative grid size-10 place-items-center rounded-2xl border border-border bg-secondary/60 text-base transition active:scale-95"
            >
              🧾
              {newVersion && (
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-lime" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              aria-label="Kişiselleştirme"
              className="grid size-10 place-items-center rounded-2xl border border-border bg-secondary/60 text-base transition active:scale-95"
            >
              ⚙️
            </button>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {[
            ["Seri", `${derived.streak}🔥`],
            ["PR", `${derived.pr} kg`],
            ["Hacim", `${(derived.totalVolume / 1000).toFixed(1)}t`],
            ["Rozet", `${derived.badges.filter((b) => b.unlocked).length}/12`],
          ].map(([k, v]) => (
            <div
              key={k}
              className="rounded-xl border border-border/60 bg-secondary/50 px-2 py-1.5 text-center"
            >
              <div className="text-[0.5rem] tracking-widest text-muted-foreground uppercase">{k}</div>
              <div className="font-display text-xs font-bold">{v}</div>
            </div>
          ))}
        </div>
      </header>

      <main className="px-3 py-3">
        {!hydrated ? (
          <div className="card-elite h-64 animate-pulse" />
        ) : tab === "today" ? (
          <TodayView
            state={state}
            update={update}
            derived={derived}
            onOpenLibrary={() => {
              setLibraryDay(state.selectedDayId);
              setLibraryOpen(true);
            }}
            onOpenPlates={() => setPlatesOpen(true)}
            onGoProgram={() => setTab("program")}
            onOpenOneRm={() => setOneRmOpen(true)}
          />
        ) : tab === "program" ? (
          <ProgramView
            state={state}
            update={update}
            onOpenLibrary={(dayId) => {
              setLibraryDay(dayId);
              setLibraryOpen(true);
            }}
            onOpenPlates={() => setPlatesOpen(true)}
          />
        ) : tab === "stats" ? (
          <StatsView state={state} derived={derived} />
        ) : tab === "calendar" ? (
          <CalendarView state={state} />
        ) : (
          <ProfileView
            state={state}
            update={update}
            derived={derived}
            onOpenSettings={() => setSettingsOpen(true)}
            onOpenReleases={() => setReleasesOpen(true)}
          />
        )}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-[560px] justify-between gap-1 border-t border-border/70 bg-background/90 px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] backdrop-blur-xl">
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className="relative flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 transition"
            >
              <span
                className="grid h-8 w-10 place-items-center rounded-xl text-base transition"
                style={{
                  background: active
                    ? "linear-gradient(145deg, color-mix(in oklab, var(--violet) 26%, transparent), color-mix(in oklab, var(--cyan) 10%, transparent))"
                    : "transparent",
                }}
              >
                {t.icon}
              </span>
              <span
                className={`text-[0.6rem] font-semibold ${active ? "text-foreground" : "text-muted-foreground"}`}
              >
                {t.label}
              </span>
            </button>
          );
        })}
      </nav>

      {libraryOpen && (
        <LibrarySheet targetDay={libraryDay} update={update} onClose={() => setLibraryOpen(false)} />
      )}
      {platesOpen && <PlateSheet onClose={() => setPlatesOpen(false)} />}
      {oneRmOpen && <OneRmSheet onClose={() => setOneRmOpen(false)} />}
      {settingsOpen && (
        <SettingsSheet state={state} update={update} onClose={() => setSettingsOpen(false)} />
      )}
      {releasesOpen && (
        <ReleaseSheet
          onClose={() => {
            setReleasesOpen(false);
            setNewVersion(false);
          }}
        />
      )}
    </div>
  );
}
