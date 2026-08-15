# Pro Fitness Uygulaması — Kurulum ve Geliştirme Rehberi

Bu doküman, **Pro Fitness (FitApp)** uygulamasının yerel bilgisayara nasıl kurulacağını, nasıl çalıştırılacağını ve kod/tasarım yapısının nasıl değiştirileceğini adım adım anlatır.

> **Proje türü:** TanStack Start + React 19 + Tailwind CSS v4 + TypeScript
> **Paket yöneticisi:** `bun` (önerilen) veya `npm` / `pnpm` / `yarn`
> **Veri saklama:** Tarayıcı `localStorage` (çevrimdışı çalışır, hesap gerekmez)

---

## 1. Gereksinimler

Aşağıdaki programların bilgisayarınızda kurulu olması gerekir:

| Program | Minimum Sürüm | Kontrol Komutu |
|---------|----------------|----------------|
| Node.js | 18.x | `node -v` |
| Bun | 1.0+ | `bun -v` |
| Git | 2.x | `git -v` |

### 1.1 Node.js kurulumu

https://nodejs.org adresinden **LTS** sürümünü indirip kurun.

### 1.2 Bun kurulumu

```bash
# macOS / Linux
curl -fsSL https://bun.sh/install | bash

# Windows (PowerShell)
powershell -c "irm bun.sh/install.ps1 | iex"
```

Kurulumdan sonra terminali yeniden açın ve `bun -v` yazarak kontrol edin.

---

## 2. Projeyi İndirme

### 2.1 Git ile klonlama

```bash
# Depo adresini kendi proje adresinizle değiştirin
git clone <proje-url> pro-fitness
cd pro-fitness
```

### 2.2 ZIP olarak indirdiyseniz

İndirdiğiniz `.zip` dosyasını açın ve terminalden o klasöre girin:

```bash
cd pro-fitness
```

---

## 3. Bağımlılıkları Yükleme

Proje klasöründeyken şu komutu çalıştırın:

```bash
bun install
```

> **İlk kurulumda internet gereklidir.** Bu komut `node_modules` klasörünü oluşturur ve tüm kütüphaneleri indirir.

Eğer `bun` kullanmak istemiyorsanız alternatifler:

```bash
# npm ile
npm install

# pnpm ile
pnpm install

# yarn ile
yarn install
```

Ancak bu proje `bun` üzerinde test edilmiştir; önerilen yöntem `bun install`dur.

---

## 4. Geliştirme Sunucusunu Başlatma

Bağımlılıklar yüklendikten sonra:

```bash
bun dev
```

Komut çalıştıktan sonra tarayıcınızda şu adresi açın:

```
http://localhost:8080
```

Sayfa otomatik olarak güncellenir (Hot Module Replacement). Kodda yaptığınız değişiklikler kaydetmenizle birlikte tarayıcıda hemen görünür.

### 4.1 Diğer paket yöneticileriyle

```bash
npm run dev
# veya
pnpm dev
# veya
yarn dev
```

---

## 5. Üretim Sürümü Oluşturma

Uygulamayı yayınlamadan önce statik dosyalar üretilir:

```bash
bun run build
```

Oluşan dosyalar `dist/` klasörüne gider.

### 5.1 Üretim sürümünü yerelden önizleme

```bash
bun run preview
```

Bu komut `dist/` içeriğini `http://localhost:8080` adresinde çalıştırır.

### 5.2 Geliştirme modunda derleme

```bash
bun run build:dev
```

---

## 6. Proje Klasör Yapısı

```
pro-fitness/
├── public/                  # Statik dosyalar (favicon, görseller vb.)
├── src/
│   ├── components/
│   │   ├── fit/             # Uygulamanın kendi ekranları ve bileşenleri
│   │   │   ├── FitApp.tsx       # Ana uygulama kabı ve sekmeler
│   │   │   ├── TodayView.tsx    # Bugün / antrenman ekranı
│   │   │   ├── ProgramView.tsx  # Program düzenleyici
│   │   │   ├── StatsView.tsx    # İstatistikler, grafikler, PR'lar
│   │   │   ├── CalendarView.tsx # Takvim ısı haritası
│   │   │   ├── ProfileView.tsx  # Profil, dışa/içe aktarma
│   │   │   ├── SettingsSheet.tsx# Kişiselleştirme paneli
│   │   │   ├── Sheets.tsx       # 1RM, su, kalori, ölçüm sayfaları
│   │   │   └── ui.tsx           # Özel UI bileşenleri (Ring, kartlar vb.)
│   │   └── ui/                # shadcn/ui bileşenleri (button, card, sheet...)
│   ├── lib/
│   │   ├── fit/
│   │   │   ├── store.ts         # Tüm uygulama durumu (localStorage)
│   │   │   ├── theme.ts         # Renk temaları ve tema mantığı
│   │   │   ├── data.ts          # Veri işleme fonksiyonları
│   │   │   ├── program-types.ts # Program tip tanımları
│   │   │   └── library.json     # 160+ egzersiz kütüphanesi
│   │   └── utils.ts           # Yardımcı fonksiyonlar
│   ├── routes/
│   │   ├── __root.tsx         # Tüm sayfaları saran kök şablon
│   │   ├── index.tsx          # Ana sayfa (/) — uygulamayı mount eder
│   │   └── api/               # Sunucu uç noktaları (gerekirse)
│   ├── router.tsx             # TanStack Router yapılandırması
│   ├── styles.css             # Tasarım sistemi, CSS değişkenleri, fontlar
│   └── server.ts / start.ts   # TanStack Start sunucu yapılandırması
├── package.json               # Bağımlılıklar ve komutlar
├── vite.config.ts             # Vite derleyici ayarları
├── tsconfig.json              # TypeScript ayarları
├── tailwind.config (yok)      # Tailwind v4: ayarlar styles.css içindedir
└── README.md / KURULUM_REHBERI.md
```

---

## 7. Tasarım Sistemini Anlamak ve Değiştirmek

### 7.1 Temel stil dosyası: `src/styles.css`

Uygulamanın tüm renkleri, fontları, animasyonları ve genel stilleri bu dosyada tanımlanır.

```css
/* src/styles.css */
@import "tailwindcss";

@theme {
  --font-heading: 'Space Grotesk', sans-serif;
  --font-body: 'DM Sans', sans-serif;
  --color-bg: oklch(0.12 0.02 260);
  --color-card: oklch(0.18 0.03 260);
  /* ... */
}
```

### 7.2 Temalar: `src/lib/fit/theme.ts`

Uygulamada 6 hazır tema bulunur:

- **Elite** (varsayılan): koyu lacivert + mor/mavi
- **Sunset**: koyu arka plan + turuncu/pembe
- **Emerald**: koyu arka plan + yeşil
- **Crimson**: koyu arka plan + kırmızı
- **Arctic**: açık arka plan + mavi
- **Mono**: siyah-beyaz minimalist

Yeni tema eklemek için `theme.ts` içindeki `themes` dizisine bir obje ekleyin. Örnek:

```ts
{
  id: "ocean",
  name: "Ocean",
  gradient: "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)",
  primary: "#0ea5e9",
  secondary: "#3b82f6",
  background: "#0c1222",
  surface: "#152238",
  text: "#f8fafc",
  muted: "#94a3b8",
  accent: "#38bdf8",
  ring: "conic-gradient(#0ea5e9, #38bdf8, #0ea5e9)"
}
```

### 7.3 Fontları değiştirmek

Fontlar `<link>` etiketiyle `src/routes/__root.tsx` içinde yüklenir. Orada Google Fonts linkini değiştirerek farklı fontlar kullanabilirsiniz.

### 7.4 Renkleri değiştirmek

- **Tüm uygulama için:** `src/styles.css` içindeki `@theme` bloğundaki `oklch` değerlerini değiştirin.
- **Sadece tema seçeneklerini değiştirmek için:** `src/lib/fit/theme.ts` dosyasını düzenleyin.
- **Koyu/aydınlık mod:** `SettingsSheet` içindeki toggle ve `theme.ts` içindeki `applyTheme` fonksiyonunu genişletin.

---

## 8. Varsayılan Hedefleri ve Ayarları Değiştirmek

Kullanıcının ayarlarını `src/lib/fit/store.ts` içindeki `defaultSettings` objesi belirler:

```ts
const defaultSettings = {
  theme: "elite",
  fontScale: 100,
  compactLayout: false,
  ringStyle: "gradient",
  ringThickness: 12,
  defaultSets: 4,
  defaultReps: 10,
  defaultRest: 90,
  waterGoal: 3000,
  calorieGoal: 2500,
};
```

Bu değerleri değiştirerek uygulamanın ilk açılıştaki varsayılanlarını ayarlayabilirsiniz.

---

## 9. Veriler Nerede Saklanır?

Uygulama bir veritabanı kullanmaz. Tüm veriler tarayıcının **localStorage** alanında saklanır:

- Set kayıtları
- Programlar
- PR'lar (kişisel rekorlar)
- Seri (streak) ve XP
- Su / kalori / vücut ölçümleri
- Kişiselleştirme ayarları

### 9.1 Veriyi yedekleme

Profil ekranından **"Dışa Aktar"** butonuyla tüm verileri `.json` dosyası olarak bilgisayarınıza indirebilirsiniz.

### 9.2 Veriyi geri yükleme

Aynı ekrandaki **"İçe Aktar"** butonuyla daha önce indirdiğiniz `.json` dosyasını seçebilirsiniz.

### 9.3 Veriyi sıfırlama

Geliştirici konsolunda (F12 → Console) şunu yazabilirsiniz:

```js
localStorage.clear();
location.reload();
```

**Uyarı:** Bu işlem tüm antrenman geçmişinizi siler.

---

## 10. Sık Karşılaşılan Sorunlar

### 10.1 `bun: command not found`

Bun PATH'e eklenmemiş olabilir. Yeniden kurun veya terminali kapatıp açın.

### 10.2 `port 8080 is already in use`

Başka bir program 8080 portunu kullanıyor demektir. Vite farklı bir port önerecektir; ekranda beliren adresi açın.

### 10.3 `routeTree.gen.ts` hatası

Bu dosya TanStack Router tarafından otomatik oluşturulur. Elle düzenlemeyin. Hata alırsanız:

```bash
bun dev
```

komutunu yeniden çalıştırın; Vite otomatik olarak yeniden oluşturur.

### 10.4 Stil değişiklikleri görünmüyor

Tarayıcı önbelleğini temizleyin (Ctrl + Shift + R veya Cmd + Shift + R).

### 10.5 Kodda hata var ama derleme çalışıyor

Route bileşenlerinin üzerinde/atında **modül düzeyinde** `X.displayName = ...` gibi atamalar yapmamaya dikkat edin. Bu tür atamalar otomatik kod bölme nedeniyle çalışma zamanında hata verir.

---

## 11. Yayınlama (Opsiyonel)

Uygulamayı canlıya almak için desteklenen platformlar:

- **Lovable / Cloudflare Pages:** `bun run build` çıktısını `dist/` klasöründen yayınlayın.
- **Vercel:** `vite build` komutunu build script olarak ayarlayın.
- **Netlify:** `dist/` publish dizini olarak gösterin.

Canlı yayınlanan projede veriler yine kullanıcının tarayıcısında `localStorage` ile saklanır; sunucu tarafı gerekmez.

---

## 12. Hızlı Başlangıç Özeti

```bash
# 1. Depoyu klonla
git clone <proje-url> pro-fitness
cd pro-fitness

# 2. Bağımlılıkları yükle
bun install

# 3. Geliştirme sunucusunu başlat
bun dev

# 4. Tarayıcıda aç
# http://localhost:8080
```

---

## 13. Faydalı Komutlar

| Komut | Açıklama |
|-------|----------|
| `bun dev` | Geliştirme sunucusu |
| `bun run build` | Üretim sürümü üret |
| `bun run build:dev` | Gelişim modunda derle |
| `bun run preview` | Üretim sürümünü yerelden önizle |
| `bun run lint` | Kod kalite kontrolü |
| `bun run format` | Kodu otomatik formatla |

---

## 14. İletişim ve Destek

Bu proje Lovable platformunda geliştirilmiştir. Daha fazla bilgi için:

- Lovable Docs: https://docs.lovable.dev
- TanStack Start: https://tanstack.com/start
- Tailwind CSS v4: https://tailwindcss.com/docs/v4-beta

---

**Hazırlayan:** Lovable AI
**Son güncelleme:** 15 Ağustos 2026
