import { createFileRoute } from "@tanstack/react-router";
import FitApp from "@/components/fit/FitApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fit Program ELITE — 6 Günlük Antrenman Takip" },
      {
        name: "description",
        content:
          "6 günlük profesyonel antrenman programı, set takibi, PR ve hacim istatistikleri, takvim ve vücut ölçüm takibi.",
      },
      { property: "og:title", content: "Fit Program ELITE — 6 Günlük Antrenman Takip" },
      {
        property: "og:description",
        content:
          "Antrenmanlarını kaydet, PR'larını kır, hacmini ve serini takip et. Mobil için tasarlanmış pro antrenman koçu.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FitApp,
});
