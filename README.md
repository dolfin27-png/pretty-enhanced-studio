# Pro Fitness — Kişisel Antrenman Takip Uygulaması

Modern, mobil öncelikli, karanlık temalı bir fitness/antrenman takip uygulaması.

Bu proje [Lovable](https://lovable.dev) ile geliştirilmiştir.

**Canlı uygulama:** https://pretty-enhanced-studio.lovable.app

---

## Özellikler

- 🏋️ **Bugünün Antrenmanı:** Set, tekrar, ağırlık kaydı + otomatik dinlenme sayacı
- 📅 **Program Düzenleyici:** 6 günlük bölünmüş program sistemi
- 📊 **İstatistikler:** Haftalık hacim grafikleri, PR takibi, rozetler
- 🎨 **Kişiselleştirme:** 6 tema, yazı boyutu, progres halkası stili/kalınlığı
- 🧮 **Araçlar:** 1RM hesaplayıcı, plaka hesaplayıcı, su/kalori ve vücut ölçümleri
- 📚 **Egzersiz Kütüphanesi:** 160+ aranabilir hareket
- 💾 **Çevrimdışı Çalışır:** Tüm veriler tarayıcıda `localStorage` ile saklanır

---

## Hızlı Başlangıç

```bash
# Depoyu klonla
git clone <proje-url>
cd pro-fitness

# Bağımlılıkları yükle (bun önerilir)
bun install

# Geliştirme sunucusunu başlat
bun dev
```

Ardından tarayıcınızda `http://localhost:8080` adresini açın.

> Detaylı kurulum, geliştirme, tema değiştirme ve veri yedekleme bilgileri için **[KURULUM_REHBERI.md](./KURULUM_REHBERI.md)** dosyasına bakın.

---

## Teknolojiler

- [TanStack Start](https://tanstack.com/start) — Tam yığın React framework
- [React 19](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [TypeScript](https://typescriptlang.org)

---

## Geliştirme Komutları

| Komut | Açıklama |
|-------|----------|
| `bun dev` | Geliştirme sunucusu |
| `bun run build` | Üretim sürümü üret |
| `bun run preview` | Üretim sürümünü yerelden önizle |
| `bun run lint` | ESLint ile kontrol |
| `bun run format` | Prettier ile formatla |

---

## Lovable'da Düzenleme

Projeyi Lovable editöründe açmak için:  
https://lovable.dev/projects/dc40169f-337e-4373-9c1d-eef7597d8e47

---

**Detaylı rehber:** [KURULUM_REHBERI.md](./KURULUM_REHBERI.md)
