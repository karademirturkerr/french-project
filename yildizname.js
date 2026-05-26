const yildiznameForm = document.querySelector("#yildiznameForm");
const yildiznameStatus = document.querySelector("#yildiznameStatus");
const yildiznameResultState = document.querySelector("#yildiznameResultState");
const yildiznameResultCard = document.querySelector("#yildiznameResultCard");
const yildiznameResultText = document.querySelector("#yildiznameResultText");
const yildiznameResultTime = document.querySelector("#yildiznameResultTime");
const yildiznameGenerateButton = document.querySelector("#yildiznameGenerateButton");

const yildiznameConfigPromise = fetch("panel-config.json", { cache: "no-store" })
  .then((response) => (response.ok ? response.json() : null))
  .catch(() => null);

if (yildiznameForm) {
  yildiznameForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = {
      full_name: document.querySelector("#yildiznameFullName")?.value.trim() || "",
      mother_name: document.querySelector("#yildiznameMotherName")?.value.trim() || "",
      birth_date: document.querySelector("#yildiznameBirthDate")?.value || "",
      birth_time: document.querySelector("#yildiznameBirthTime")?.value || "",
      birth_place: document.querySelector("#yildiznameBirthPlace")?.value.trim() || "",
      intention: document.querySelector("#yildiznameIntention")?.value.trim() || ""
    };

    if (!payload.full_name || !payload.mother_name || !payload.birth_date || !payload.birth_place || !payload.intention) {
      setYildiznameStatus("Tüm zorunlu alanları doldurman gerekiyor.", true);
      return;
    }

    const config = await yildiznameConfigPromise;

    if (!config?.supabaseUrl || !config?.supabaseAnonKey || !config?.yildiznameFunctionName) {
      setYildiznameStatus("AI bağlantısı henüz tamamlanmamış. Supabase function ayarı eksik görünüyor.", true);
      return;
    }

    try {
      setYildiznameLoading(true);
      setYildiznameStatus("Yıldızname hazırlanıyor...");

      const response = await fetch(
        `${config.supabaseUrl}/functions/v1/${config.yildiznameFunctionName}`,
        {
          method: "POST",
          headers: {
            apikey: config.supabaseAnonKey,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data?.result) {
        throw new Error(data?.error || "Yıldızname sonucu alınamadı.");
      }

      yildiznameResultState.classList.add("hidden");
      yildiznameResultCard.classList.remove("hidden");
      yildiznameResultText.textContent = data.result;
      yildiznameResultTime.textContent = new Intl.DateTimeFormat("tr-TR", {
        dateStyle: "medium",
        timeStyle: "short"
      }).format(new Date());

      setYildiznameStatus("Yıldızname hazır.");
    } catch (error) {
      console.error(error);
      setYildiznameStatus(String(error?.message || error), true);
    } finally {
      setYildiznameLoading(false);
    }
  });
}

function setYildiznameStatus(message, isError = false) {
  if (!yildiznameStatus) return;
  yildiznameStatus.textContent = message;
  yildiznameStatus.dataset.state = isError ? "error" : "default";
}

function setYildiznameLoading(isLoading) {
  if (!yildiznameGenerateButton) return;
  yildiznameGenerateButton.disabled = isLoading;
  yildiznameGenerateButton.textContent = isLoading ? "Yorum Hazırlanıyor..." : "Yıldıznameyi Oluştur";
}
