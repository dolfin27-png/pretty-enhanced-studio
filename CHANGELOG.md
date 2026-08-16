# Pro Fitness — Değişiklik Notları

## v1.4.0 — Otomatik sürümleme ve sürümlü yedek
_2026-08-16 • minor_

- `bun run release` ile sürüm numarası otomatik artıyor ve CHANGELOG'a kayıt ekleniyor
- Yedek JSON dosyasına sürüm bilgisi ve tüm değişiklik notları yazılıyor
- Yedek geri yüklenirken dosyanın hangi sürümden geldiği bildiriliyor
- CHANGELOG.md dosyası sürümle birlikte otomatik güncelleniyor

## v1.3.0 — Sürümleme ve değişiklik notları
_2026-08-16 • minor_

- Otomatik sürüm numarası ve sürüm geçmişi paneli eklendi
- Yeni sürüm çıktığında profilde bildirim rozeti gösteriliyor
- Yedek dosyaları sürüm damgasıyla indiriliyor (fit-program-v1.3.0-...json)
- Sürüm notlarını .md olarak indirme seçeneği

## v1.2.0 — Kalıcı antrenman süresi
_2026-08-15 • minor_

- Sayfa yenilenince antrenman süresi ve set kayıtları korunuyor
- Dinlenme sayacı zaman damgasıyla arka planda da doğru sayıyor
- Kurulum rehberi (KURULUM_REHBERI.md) eklendi

## v1.1.0 — Kişiselleştirme paneli
_2026-08-14 • minor_

- 6 renk teması, yazı boyutu ve kompakt yerleşim
- 4 progres halkası stili ve ayarlanabilir kalınlık
- Varsayılan set/tekrar/dinlenme ile su ve kalori hedefleri
- 1RM hesaplayıcı ve JSON yedeği içe aktarma

## v1.0.0 — İlk sürüm
_2026-08-13 • major_

- 6 günlük program, set kaydı ve dinlenme sayacı
- PR, hacim, seri ve level–XP takibi
- İstatistik grafikleri, rozetler ve takvim ısı haritası
- 163 hareketlik kütüphane ve plaka hesaplayıcı
