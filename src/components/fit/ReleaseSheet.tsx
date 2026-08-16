import { toast } from "sonner";
import { Overlay } from "./Sheets";
import { Btn, Pill } from "./ui";
import {
  APP_VERSION,
  CHANGELOG,
  changelogMarkdown,
  markVersionSeen,
  type ReleaseType,
} from "@/lib/fit/version";

const tone: Record<ReleaseType, "violet" | "cyan" | "muted"> = {
  major: "violet",
  minor: "cyan",
  patch: "muted",
};

export default function ReleaseSheet({ onClose }: { onClose: () => void }) {
  const download = () => {
    const blob = new Blob([changelogMarkdown()], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `pro-fitness-degisiklik-notlari-v${APP_VERSION}.md`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast.success("Değişiklik notları indirildi");
  };

  const close = () => {
    markVersionSeen();
    onClose();
  };

  return (
    <Overlay title={`Sürüm geçmişi • v${APP_VERSION}`} onClose={close}>
      <div className="space-y-3">
        {CHANGELOG.map((r, i) => (
          <div
            key={r.version}
            className="rounded-2xl border border-border bg-background/40 p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="font-display text-sm font-bold">
                  v{r.version} {i === 0 && <span className="text-gradient">• güncel</span>}
                </div>
                <div className="text-[0.65rem] text-muted-foreground">
                  {r.date} — {r.title}
                </div>
              </div>
              <Pill tone={tone[r.type]}>{r.type}</Pill>
            </div>
            <ul className="mt-2 space-y-1">
              {r.notes.map((n) => (
                <li key={n} className="flex gap-2 text-xs text-muted-foreground">
                  <span className="text-violet">›</span>
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <Btn variant="soft" className="w-full" onClick={download}>
          ⤓ Notları .md indir
        </Btn>
      </div>
    </Overlay>
  );
}
