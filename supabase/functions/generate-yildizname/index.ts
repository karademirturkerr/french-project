const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

type YildiznameRequest = {
  full_name?: string;
  mother_name?: string;
  birth_date?: string;
  birth_time?: string;
  birth_place?: string;
  intention?: string;
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await request.json() as YildiznameRequest;
    validateBody(body);

    const openAiApiKey = requireEnv("OPENAI_API_KEY");
    const openAiModel = Deno.env.get("OPENAI_MODEL") ?? "gpt-5-mini";

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAiApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: openAiModel,
        input: buildPrompt(body)
      })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return jsonResponse({
        error: data?.error?.message || "OpenAI yanıtı alınamadı."
      }, response.status);
    }

    const result = extractOutputText(data);

    if (!result) {
      return jsonResponse({ error: "Model sonucu boş döndü." }, 502);
    }

    return jsonResponse({ ok: true, result });
  } catch (error) {
    console.error(error);
    return jsonResponse({ error: String(error) }, 500);
  }
});

function buildPrompt(body: YildiznameRequest) {
  return [
    "Sen Dimitri markası için Türkçe yıldızname ve ruhsal yorum hazırlayan, sakin ama etkileyici bir asistansın.",
    "Metin mistik hissedilmeli ama korku yaymamalı.",
    "Eğlence, içgörü ve manevi farkındalık çerçevesinde kal.",
    "Kesin kader iddiası kurma; tıbbi, hukuki ve finansal tavsiye verme.",
    "Cevabı düz metin olarak yaz.",
    "Başlıkları şu sırayla ver: Genel Enerji, Aşk ve İlişkiler, İş ve Para, Yakın Dönem, Kısa Tavsiye.",
    "Toplam uzunluk yaklaşık 350 ile 550 kelime arası olsun.",
    "Ton Dimitri sitesine uygun biçimde zarif, net ve içten olsun.",
    "",
    `Ad Soyad: ${body.full_name}`,
    `Anne Adı: ${body.mother_name}`,
    `Doğum Tarihi: ${body.birth_date}`,
    `Doğum Saati: ${body.birth_time || "Belirtilmedi"}`,
    `Doğum Yeri: ${body.birth_place}`,
    `Niyet veya Soru: ${body.intention}`
  ].join("\n");
}

function validateBody(body: YildiznameRequest) {
  if (!body.full_name || !body.mother_name || !body.birth_date || !body.birth_place || !body.intention) {
    throw new Error("Eksik bilgi var.");
  }
}

function extractOutputText(data: Record<string, unknown>) {
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const output = Array.isArray(data.output) ? data.output : [];
  const parts: string[] = [];

  for (const item of output) {
    if (!item || typeof item !== "object") continue;

    const content = Array.isArray((item as Record<string, unknown>).content)
      ? (item as Record<string, unknown>).content as Record<string, unknown>[]
      : [];

    for (const entry of content) {
      const textValue = typeof entry?.text === "string"
        ? entry.text
        : typeof entry?.output_text === "string"
          ? entry.output_text
          : "";

      if (textValue) {
        parts.push(textValue);
      }
    }
  }

  return parts.join("\n").trim();
}

function requireEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`${name} tanımlı değil.`);
  }

  return value;
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json"
    }
  });
}
