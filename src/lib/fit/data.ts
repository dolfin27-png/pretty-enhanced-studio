import libraryJson from "./library.json";

export type LibraryMove = {
  name: string;
  muscle: string;
  equipment: string;
  level: string;
  emoji: string;
  desc: string;
  tips: string;
};

export const MOVE_LIBRARY = libraryJson as LibraryMove[];

export const MUSCLES = ["Göğüs", "Sırt", "Bacak", "Omuz", "Biceps", "Triceps", "Karın"] as const;

export type Exercise = { name: string; sets: number; reps: string; rest: number };
export type ProgramDay = {
  id: number;
  name: string;
  focus: string;
  accent: "violet" | "cyan" | "lime" | "amber" | "rose";
  emoji: string;
  exercises: Exercise[];
};

export const DEFAULT_PROGRAM: ProgramDay[] = [
  {
    id: 1,
    name: "Göğüs & Triceps",
    focus: "İtiş Gücü",
    accent: "violet",
    emoji: "🏋️",
    exercises: [
      { name: "Bench Press", sets: 4, reps: "6-10", rest: 120 },
      { name: "Incline DB Press", sets: 4, reps: "8-12", rest: 90 },
      { name: "Chest Fly", sets: 3, reps: "12-15", rest: 75 },
      { name: "Triceps Pushdown", sets: 4, reps: "10-14", rest: 75 },
      { name: "Overhead Extension", sets: 3, reps: "10-12", rest: 75 },
    ],
  },
  {
    id: 2,
    name: "Sırt & Biceps",
    focus: "Çekiş Gücü",
    accent: "lime",
    emoji: "🚣",
    exercises: [
      { name: "Lat Pulldown", sets: 4, reps: "8-12", rest: 90 },
      { name: "Barbell Row", sets: 4, reps: "6-10", rest: 120 },
      { name: "Face Pull", sets: 3, reps: "12-15", rest: 60 },
      { name: "Biceps Curl", sets: 4, reps: "10-12", rest: 75 },
      { name: "Hammer Curl", sets: 3, reps: "10-12", rest: 60 },
    ],
  },
  {
    id: 3,
    name: "Bacak & Karın",
    focus: "Alt Vücut",
    accent: "amber",
    emoji: "🦵",
    exercises: [
      { name: "Squat", sets: 5, reps: "5-8", rest: 150 },
      { name: "Romanian Deadlift", sets: 4, reps: "8-10", rest: 120 },
      { name: "Leg Press", sets: 3, reps: "10-14", rest: 90 },
      { name: "Leg Extension", sets: 3, reps: "12-15", rest: 60 },
      { name: "Plank", sets: 3, reps: "45-60sn", rest: 60 },
    ],
  },
  {
    id: 4,
    name: "Omuz & Göğüs",
    focus: "Omuz Hacim",
    accent: "cyan",
    emoji: "🎯",
    exercises: [
      { name: "Shoulder Press", sets: 4, reps: "6-10", rest: 120 },
      { name: "Lateral Raise", sets: 4, reps: "12-15", rest: 60 },
      { name: "Incline DB Press", sets: 3, reps: "8-12", rest: 90 },
      { name: "Cable Fly", sets: 3, reps: "12-15", rest: 75 },
      { name: "Face Pull", sets: 3, reps: "15-20", rest: 60 },
    ],
  },
  {
    id: 5,
    name: "Sırt Derinlik & Kol",
    focus: "Sırt Detay",
    accent: "violet",
    emoji: "🔙",
    exercises: [
      { name: "Barbell Row", sets: 4, reps: "8-10", rest: 120 },
      { name: "Lat Pulldown", sets: 4, reps: "10-12", rest: 90 },
      { name: "Deadlift", sets: 3, reps: "5-6", rest: 180 },
      { name: "Biceps Curl", sets: 3, reps: "8-10", rest: 75 },
      { name: "Overhead Extension", sets: 3, reps: "10-12", rest: 75 },
    ],
  },
  {
    id: 6,
    name: "Bacak Güç & Pump",
    focus: "Güç & Pump",
    accent: "rose",
    emoji: "🔥",
    exercises: [
      { name: "Romanian Deadlift", sets: 4, reps: "6-8", rest: 120 },
      { name: "Squat", sets: 4, reps: "6-10", rest: 120 },
      { name: "Triceps Pushdown", sets: 4, reps: "12-15", rest: 60 },
      { name: "Hammer Curl", sets: 4, reps: "10-12", rest: 60 },
      { name: "Crunch", sets: 3, reps: "15-20", rest: 60 },
    ],
  },
];

export const BADGES = [
  { id: "first", label: "İlk Antrenman", emoji: "🎯", test: (s: BadgeStats) => s.workouts >= 1 },
  { id: "w5", label: "5 Antrenman", emoji: "✋", test: (s: BadgeStats) => s.workouts >= 5 },
  { id: "w20", label: "20 Antrenman", emoji: "💯", test: (s: BadgeStats) => s.workouts >= 20 },
  { id: "w50", label: "50 Antrenman", emoji: "👑", test: (s: BadgeStats) => s.workouts >= 50 },
  { id: "streak3", label: "3 Gün Seri", emoji: "🔥", test: (s: BadgeStats) => s.streak >= 3 },
  { id: "streak7", label: "7 Gün Seri", emoji: "⚡", test: (s: BadgeStats) => s.streak >= 7 },
  { id: "vol10k", label: "10 Ton Hacim", emoji: "📦", test: (s: BadgeStats) => s.volume >= 10000 },
  { id: "vol50k", label: "50 Ton Hacim", emoji: "🏗️", test: (s: BadgeStats) => s.volume >= 50000 },
  { id: "pr100", label: "100 kg PR", emoji: "🏆", test: (s: BadgeStats) => s.pr >= 100 },
  { id: "sets100", label: "100 Set", emoji: "✅", test: (s: BadgeStats) => s.sets >= 100 },
  { id: "sets500", label: "500 Set", emoji: "🧱", test: (s: BadgeStats) => s.sets >= 500 },
  { id: "lvl10", label: "Level 10", emoji: "🏅", test: (s: BadgeStats) => s.level >= 10 },
];

export type BadgeStats = {
  workouts: number;
  streak: number;
  volume: number;
  pr: number;
  sets: number;
  level: number;
};

export const PLATES = [25, 20, 15, 10, 5, 2.5, 1.25];

export const ACCENT_VAR: Record<ProgramDay["accent"], string> = {
  violet: "var(--violet)",
  cyan: "var(--cyan)",
  lime: "var(--lime)",
  amber: "var(--amber)",
  rose: "var(--rose)",
};
