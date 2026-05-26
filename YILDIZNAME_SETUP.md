# Yıldızname Kurulumu

Bu proje artık `yildizname.html` sayfası üzerinden doğrudan tarayıcı içinde yıldızname yorumu üretebilir.

## Dosyalar

- `yildizname.html`
- `yildizname.js`
- `panel-config.json`

## Nasıl çalışır

1. Kullanıcı yıldızname formunu doldurur.
2. Doğum tarihi, yaşam yolu sayısı, burç ve niyet teması birlikte okunur.
3. Sayfa, yıldızname metnini aynı anda tarayıcı içinde üretir.
4. Sonuç aynı sayfada kullanıcıya gösterilir.

## Gerekli ayarlar

`panel-config.json` mevcut panel ve takip sistemi için kullanılmaya devam eder; yıldızname sonucunun açılması için zorunlu değildir.

```json
{
  "supabaseUrl": "https://aqucglxdlakcridgjimc.supabase.co",
  "supabaseAnonKey": "SENIN_PUBLISHABLE_KEY"
}
```

## Not

Bu yapı ekstra API maliyeti veya backend kurulumuna ihtiyaç duymaz. İstersen ileride tekrar AI destekli özel yorum katmanı eklenebilir.
