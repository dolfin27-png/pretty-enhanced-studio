export type ReleaseType = "major" | "minor" | "patch";

export type Release = {
  version: string;
  date: string;
  type: ReleaseType;
  title: string;
  notes: string[];
};

/** En yeni sürüm en üstte. Yeni sürüm eklemek için buraya bir kayıt ekle. */
export const CHANGELOG: Release[] = [
  {
    version: "1.3.0",
    date: "2026-08-16",
    type: "minor",
    title: "Sürümleme ve değişiklik notları",
    notes: [
      "Otomatik sürüm numarası ve sürüm geçmişi paneli eklendi",
      "Yeni sürüm çıktığında profilde bildirim rozeti gösteriliyor",
      "Yedek dosyaları sürüm damgasıyla indiriliyor (fit-program-v1.3.0-...json)",
      "Sürüm notlarını .md olarak indirme seçeneği",
    ],
  },
  {
    version: "1.2.0",
    date: "2026-08-15",
    type: "minor",
    title: "Kalıcı antrenman süresi",
    notes: [
      "Sayfa yenilenince antrenman süresi ve set kayıtları korunuyor",
      "Dinlenme sayacı zaman damgasıyla arka planda da doğru sayıyor",
      "Kurulum rehberi (KURULUM_REHBERI.md) eklendi",
    ],
  },
  {
    version: "1.1.0",
    date: "2026-08-14",
    type: "minor",
    title: "Kişiselleştirme paneli",
    notes: [
      "6 renk teması, yazı boyutu ve kompakt yerleşim",
      "4 progres halkası stili ve ayarlanabilir kalınlık",
      "Varsayılan set/tekrar/dinlenme ile su ve kalori hedefleri",
      "1RM hesaplayıcı ve JSON yedeği içe aktarma",
    ],
  },
  {
    version: "1.0.0",
    date: "2026-08-13",
    type: "major",
    title: "İlk sürüm",
    notes: [
      "6 günlük program, set kaydı ve dinlenme sayacı",
      "PR, hacim, seri ve level–XP takibi",
      "İstatistik grafikleri, rozetler ve takvim ısı haritası",
      "163 hareketlik kütüphane ve plaka hesaplayıcı",
    ],
  },
];

export const APP_VERSION = CHANGELOG[0]!.version;
export const APP_RELEASE_DATE = CHANGELOG[0]!.date;
export const LATEST_RELEASE = CHANGELOG[0]!;

const SEEN_KEY = "fit_seen_version";

export function getSeenVersion(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(SEEN_KEY);
}

export function markVersionSeen() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SEEN_KEY, APP_VERSION);
}

export function versionStamp() {
  return `v${APP_VERSION}`;
}

export function changelogMarkdown() {
  return [
    "# Pro Fitness — Değişiklik Notları",
    "",
    ...CHANGELOG.flatMap((r) => [
      `## v${r.version} — ${r.title}`,
      `_${r.date} • ${r.type}_`,
      "",
      ...r.notes.map((n) => `- ${n}`),
      "",
    ]),
  ].join("\n");
}
