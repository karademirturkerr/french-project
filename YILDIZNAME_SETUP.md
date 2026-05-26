# AI Yıldızname Kurulumu

Bu proje artık `yildizname.html` sayfası üzerinden AI destekli yıldızname üretebilir.

## Dosyalar

- `yildizname.html`
- `yildizname.js`
- `panel-config.json`
- `supabase/functions/generate-yildizname/index.ts`

## Nasıl çalışır

1. Kullanıcı yıldızname formunu doldurur.
2. Form verisi Supabase Edge Function'a gider.
3. Function, `OPENAI_API_KEY` ile OpenAI Responses API'ye istek atar.
4. Dönen yorum metni aynı sayfada kullanıcıya gösterilir.

## Gerekli ayarlar

`panel-config.json` içinde şu alan hazır olmalı:

```json
{
  "supabaseUrl": "https://aqucglxdlakcridgjimc.supabase.co",
  "supabaseAnonKey": "SENIN_PUBLISHABLE_KEY",
  "yildiznameFunctionName": "generate-yildizname"
}
```

## Supabase secret'ları

Function için Supabase tarafında şu secret'ları ekle:

- `OPENAI_API_KEY`
- `OPENAI_MODEL`

Önerilen model:

- `gpt-5-mini`

## Deploy

```powershell
supabase functions deploy generate-yildizname
supabase secrets set OPENAI_API_KEY=senin_keyin
supabase secrets set OPENAI_MODEL=gpt-5-mini
```

## Not

Bu yapı OpenAI anahtarını frontend'e koymaz. Statik sitede güvenli AI entegrasyonu için Edge Function zorunludur.
