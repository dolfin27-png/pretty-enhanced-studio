import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BADGES, DEFAULT_PROGRAM, type ProgramDay } from "./data";

const KEY = "fit_elite_v3";

export type SetLog = { weight: number; reps: number };
export type Session = {
  dayId: number;
  entries: Record<string, SetLog[]>;
  seconds: number;
  finished?: boolean;
};
export type Measure = {
  date: string;
  weight?: number;
  chest?: number;
  waist?: number;
  arm?: number;
  leg?: number;
};

export type FitState = {
  program: ProgramDay[];
  sessions: Record<string, Session>;
  measures: Measure[];
  water: Record<string, number>;
  kcal: Record<string, number>;
  kcalGoal: number;
  waterGoal: number;
  name: string;
  selectedDayId: number;
};

const initial: FitState = {
  program: DEFAULT_PROGRAM,
  sessions: {},
  measures: [],
  water: {},
  kcal: {},
  kcalGoal: 2600,
  waterGoal: 3000,
  name: "Şampiyon",
  selectedDayId: 1,
};

export const pad = (n: number) => String(n).padStart(2, "0");
export const dateKey = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const todayKey = () => dateKey(new Date());
export const fmtHMS = (s: number) => {
  s = Math.max(0, Math.floor(s));
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
};
export const fmtMS = (s: number) => {
  s = Math.max(0, Math.floor(s));
  return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
};

function load(): FitState {
  if (typeof window === "undefined") return initial;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return initial;
    return { ...initial, ...(JSON.parse(raw) as FitState) };
  } catch {
    return initial;
  }
}

export function useFit() {
  const [state, setState] = useState<FitState>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage full */
    }
  }, [state, hydrated]);

  const update = useCallback((fn: (s: FitState) => FitState) => setState((s) => fn(s)), []);

  return { state, update, hydrated, setState };
}

export function sessionVolume(s?: Session) {
  if (!s) return 0;
  return Object.values(s.entries)
    .flat()
    .reduce((t, x) => t + (x.weight || 0) * (x.reps || 0), 0);
}

export function sessionSets(s?: Session) {
  if (!s) return 0;
  return Object.values(s.entries).reduce((t, x) => t + x.length, 0);
}

export function useDerived(state: FitState) {
  return useMemo(() => {
    const keys = Object.keys(state.sessions).sort();
    const totalVolume = keys.reduce((t, k) => t + sessionVolume(state.sessions[k]), 0);
    const totalSets = keys.reduce((t, k) => t + sessionSets(state.sessions[k]), 0);
    const workouts = keys.filter((k) => sessionSets(state.sessions[k]) > 0).length;

    const prs: Record<string, number> = {};
    keys.forEach((k) => {
      const s = state.sessions[k];
      if (!s) return;
      Object.entries(s.entries).forEach(([ex, logs]) => {
        logs.forEach((l) => {
          if (l.weight > (prs[ex] ?? 0)) prs[ex] = l.weight;
        });
      });
    });
    const pr = Math.max(0, ...Object.values(prs), 0);

    let streak = 0;
    const d = new Date();
    for (;;) {
      const k = dateKey(d);
      if (sessionSets(state.sessions[k]) > 0) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else if (k === todayKey()) {
        d.setDate(d.getDate() - 1);
      } else break;
      if (streak > 400) break;
    }

    const xp = totalSets * 12 + workouts * 40;
    const level = Math.floor(xp / 300) + 1;
    const xpInLevel = xp % 300;

    const week: { label: string; volume: number; key: string }[] = [];
    for (let i = 6; i >= 0; i--) {
      const dt = new Date();
      dt.setDate(dt.getDate() - i);
      const k = dateKey(dt);
      week.push({
        key: k,
        label: ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"][dt.getDay()] ?? "",
        volume: sessionVolume(state.sessions[k]),
      });
    }
    const weekVolume = week.reduce((t, w) => t + w.volume, 0);
    const weekWorkouts = week.filter((w) => w.volume > 0).length;
    const weekSets = week.reduce((t, w) => t + sessionSets(state.sessions[w.key]), 0);

    const stats = { workouts, streak, volume: totalVolume, pr, sets: totalSets, level };
    const badges = BADGES.map((b) => ({ ...b, unlocked: b.test(stats) }));

    const last3 = [0, 1, 2].map((i) => {
      const dt = new Date();
      dt.setDate(dt.getDate() - i);
      return sessionSets(state.sessions[dateKey(dt)]);
    });
    const fatigue = Math.min(100, last3.reduce((t, x) => t + x, 0) * 3);
    const recovery = Math.max(20, 100 - fatigue);

    return {
      totalVolume,
      totalSets,
      workouts,
      prs,
      pr,
      streak,
      xp,
      level,
      xpInLevel,
      week,
      weekVolume,
      weekWorkouts,
      weekSets,
      badges,
      recovery,
    };
  }, [state.sessions]);
}

export function useTimer(running: boolean) {
  const [seconds, setSeconds] = useState(0);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, [running]);
  return { seconds, setSeconds };
}
