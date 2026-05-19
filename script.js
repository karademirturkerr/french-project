const sliders = document.querySelectorAll("[data-slider]");

sliders.forEach((slider) => {
  const track = slider.querySelector(".slider-track");
  const prev = slider.querySelector("[data-slider-prev]");
  const next = slider.querySelector("[data-slider-next]");

  if (!track || !prev || !next) return;

  const scrollAmount = () => {
    const firstCard = track.querySelector(".slide-card");
    return firstCard ? firstCard.getBoundingClientRect().width + 20 : 320;
  };

  prev.addEventListener("click", () => {
    track.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
  });

  next.addEventListener("click", () => {
    track.scrollBy({ left: scrollAmount(), behavior: "smooth" });
  });
});

const reveals = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  reveals.forEach((element) => observer.observe(element));
} else {
  reveals.forEach((element) => element.classList.add("is-visible"));
}

const menuToggles = document.querySelectorAll("[data-menu-toggle]");

menuToggles.forEach((button) => {
  const targetId = button.getAttribute("aria-controls");
  const menu = targetId ? document.getElementById(targetId) : null;

  if (!menu) return;

  button.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    button.classList.toggle("is-active", isOpen);
    button.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });
});

const htmlLang = document.documentElement.lang === "fr" ? "fr" : "tr";

try {
  window.localStorage.setItem("dimitriPreferredLang", htmlLang);
} catch (error) {
  // Ignore storage issues and keep the current page language.
}

const languageLinks = document.querySelectorAll(".lang-link");

languageLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const href = link.getAttribute("href") || "";
    const nextLang = /(?:^|\/)(?:index|articles|tirage|privacy|legal|about)(-tr)?\.html$/i.test(href)
      ? (href.includes("-tr") ? "tr" : "fr")
      : (link.textContent.trim().toLowerCase() === "tr" ? "tr" : "fr");

    try {
      window.localStorage.setItem("dimitriPreferredLang", nextLang);
    } catch (error) {
      // Ignore storage issues and allow normal navigation.
    }
  });
});

const contactCopy = {
  tr: {
    title: "Dimitri ile nasıl iletişime geçmek istersin?",
    body: "Telegram hesabın yoksa sorun değil. Sana en uygun kanalı seç, Dimitri seni orada karşılasın.",
    telegramLabel: "Telegram ile yaz",
    telegramText: "Hızlı ve doğrudan özel mesaj",
    instagramLabel: "Instagram ile yaz",
    instagramText: "DM üzerinden iletişime geç",
    closeLabel: "Kapat"
  },
  fr: {
    title: "Par quel canal souhaitez-vous écrire à Dimitri ?",
    body: "Si vous n'avez pas Telegram, aucun souci. Choisissez simplement le canal qui vous convient le mieux.",
    telegramLabel: "Écrire via Telegram",
    telegramText: "Message privé rapide et direct",
    instagramLabel: "Écrire via Instagram",
    instagramText: "Prise de contact en message privé",
    closeLabel: "Fermer"
  }
};

const contactTargets = {
  tr: {
    telegram: "https://t.me/ruhsaldanismandimitri?text=Merhaba%20Dimitri%2C%20Nasılsın%3F",
    instagram: "https://ig.me/m/dimitrispiritual"
  },
  fr: {
    telegram: "https://t.me/ruhsaldanismandimitri?text=Bonjour%20Dimitri%2C%20comment%20allez-vous%20%3F",
    instagram: "https://ig.me/m/dimitrispiritual"
  }
};

const contactTriggers = Array.from(
  document.querySelectorAll('a[href*="t.me/ruhsaldanismandimitri"]')
).filter((link) => /Dimitri'ye Yaz|Dimitri’ye Yaz|Écrire à Dimitri/i.test(link.textContent.trim()));

if (contactTriggers.length) {
  const copy = contactCopy[htmlLang];
  const targets = contactTargets[htmlLang];

  const modal = document.createElement("div");
  modal.className = "contact-modal";
  modal.setAttribute("hidden", "");
  modal.innerHTML = `
    <div class="contact-modal__backdrop" data-contact-close></div>
    <div class="contact-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
      <button class="contact-modal__close" type="button" aria-label="${copy.closeLabel}" data-contact-close>
        <span></span>
        <span></span>
      </button>
      <p class="contact-modal__eyebrow">Dimitri Spiritual</p>
      <h2 class="contact-modal__title" id="contact-modal-title">${copy.title}</h2>
      <p class="contact-modal__text">${copy.body}</p>
      <div class="contact-modal__actions">
        <a class="contact-option contact-option--telegram" href="${targets.telegram}" target="_blank" rel="noreferrer">
          <span class="contact-option__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="presentation" focusable="false">
              <path d="M20.2 5.2 17.9 18c-.16.91-.67 1.13-1.42.72l-4.13-3.05-1.99 1.92c-.22.22-.4.4-.83.4l.29-4.19 7.63-6.89c.33-.3-.07-.47-.52-.17l-9.42 5.93-4.06-1.27c-.88-.27-.9-.88.18-1.31L19 4.47c.75-.28 1.4.18 1.2.73Z"></path>
            </svg>
          </span>
          <span class="contact-option__content">
            <strong>${copy.telegramLabel}</strong>
            <span>${copy.telegramText}</span>
          </span>
        </a>
        <a class="contact-option contact-option--instagram" href="https://www.instagram.com/dimitrispiritual/" target="_blank" rel="noreferrer">
          <span class="contact-option__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="presentation" focusable="false">
              <rect x="4.25" y="4.25" width="15.5" height="15.5" rx="4.5"></rect>
              <circle cx="12" cy="12" r="3.6"></circle>
              <circle cx="17.3" cy="6.8" r="1.1" class="contact-option__dot"></circle>
            </svg>
          </span>
          <span class="contact-option__content">
            <strong>${copy.instagramLabel}</strong>
            <span>${copy.instagramText}</span>
          </span>
        </a>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const openContactModal = () => {
    modal.removeAttribute("hidden");
    document.body.classList.add("contact-modal-open");
  };

  const closeContactModal = () => {
    modal.setAttribute("hidden", "");
    document.body.classList.remove("contact-modal-open");
  };

  const openInstagramAppFirst = (event) => {
    event.preventDefault();
    closeContactModal();

    const appUrl = "instagram://user?username=dimitrispiritual";
    const fallbackUrl = "https://www.instagram.com/dimitrispiritual/";
    const startedAt = Date.now();

    window.location.href = appUrl;

    window.setTimeout(() => {
      if (Date.now() - startedAt < 1600) {
        window.open(fallbackUrl, "_blank", "noopener,noreferrer");
      }
    }, 900);
  };

  contactTriggers.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openContactModal();
    });
  });

  modal.querySelectorAll("[data-contact-close]").forEach((element) => {
    element.addEventListener("click", closeContactModal);
  });

  const instagramOption = modal.querySelector(".contact-option--instagram");
  if (instagramOption) {
    instagramOption.addEventListener("click", openInstagramAppFirst);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hasAttribute("hidden")) {
      closeContactModal();
    }
  });
}

const dailyDrawSection = document.querySelector("[data-daily-draw]");

if (dailyDrawSection) {
  const dailyDeck = {
    tr: [
      {
        name: "Ay",
        text1: "Bugün henüz tam netleşmemiş ama derinden hissedilen her şeyi görünür kılıyor. Bu; ısrarla geri gelen bir sezgi, tekrarlayan bir rüya ya da form arayan içsel bir hareket olabilir.",
        text2: "Kesinliği zorlayacağın bir gün değil; nüansları dinleyeceğin, işaretleri gözlemleyeceğin ve bilincinin çoktan bildiği şeyi yavaşça açığa çıkaracağın bir gün.",
        audienceTitle: "Kimlerde yankı uyandırır",
        audienceText: "Yükselen bir duyguyu hissedip yine de onun sebebini ya da yönünü hemen tanımlayamayan kişilerde.",
        questionTitle: "Sorulacak soru",
        questionText: "Son zamanlarda tekrar tekrar gelen hangi hissi küçümsedim?",
        ctaTitle: "Okumayı derinleştirmek",
        ctaText: "Eğer bu kart sende güçlü bir karşılık bulduysa, özel mesajla daha kişisel bir yorum isteyebilirsin."
      },
      {
        name: "Güneş",
        text1: "Bugün görünürlük, açıklık ve yaşam enerjisi öne çıkıyor. İçinde tuttuğun bir şey artık daha net biçimde adını isteyebilir.",
        text2: "Kendini küçültmek yerine ışığını daha dürüstçe taşıman gereken bir gün. Sevincin de en az korkuların kadar ciddiye alınmalı.",
        audienceTitle: "Kimlerde yankı uyandırır",
        audienceText: "Uzun süredir beklediği netliği sonunda hissetmeye başlayan kişilerde.",
        questionTitle: "Sorulacak soru",
        questionText: "Bugün hangi tarafımı saklamadan görünür kılabilirim?",
        ctaTitle: "Okumayı derinleştirmek",
        ctaText: "Bu kart sende yeni bir açıklık alanı açtıysa, Dimitri ile bunu daha kişisel bir çerçevede konuşabilirsin."
      },
      {
        name: "Ermiş",
        text1: "Bugün cevap dışarıda değil, daha çok iç sessizlikte bulunuyor. Geri çekilmek, kaybolmak değil; daha doğru duymak anlamına geliyor.",
        text2: "Her davete yetişmen gerekmiyor. Bazı hakikatler ancak yalnızlıkla temas ettiğinde şekil kazanır.",
        audienceTitle: "Kimlerde yankı uyandırır",
        audienceText: "Kalabalığın içinde bile içsel mesafe ihtiyacı hisseden kişilerde.",
        questionTitle: "Sorulacak soru",
        questionText: "Bugün gerçekten neyi duymak için yavaşlamam gerekiyor?",
        ctaTitle: "Okumayı derinleştirmek",
        ctaText: "İçine dönme isteğin arttıysa, Dimitri bu sessizliğin ne anlattığını birlikte yorumlayabilir."
      },
      {
        name: "Aşıklar",
        text1: "Bugün kalp, seçim ve içsel uyum temaları öne çıkıyor. Mesele yalnızca biri değil; neyle gerçekten hizalandığın.",
        text2: "Bir bağın sana ne hissettirdiği kadar, sende hangi parçayı uyandırdığı da önemli. Seçim bazen bir kişiyi değil, kendi yönünü seçmektir.",
        audienceTitle: "Kimlerde yankı uyandırır",
        audienceText: "İlişkiler, duygusal kararlar ve bağlanma biçimleri üzerine düşünen kişilerde.",
        questionTitle: "Sorulacak soru",
        questionText: "Bugün kalbim ile korkum arasında hangi seçimde duruyorum?",
        ctaTitle: "Okumayı derinleştirmek",
        ctaText: "Bu kart duygusal hayatında bir düğüme dokunduysa, Dimitri ile bunu daha yakından ele alabilirsin."
      },
      {
        name: "Kule",
        text1: "Bugün sağlam sandığın bir şeyin çatladığını fark edebilirsin. Bu yıkım değil; artık taşınamayan yapının dürüstçe görünmesidir.",
        text2: "Gerçeği geciktiren her şey bir noktada çözülür. Sarsılmak bazen özgürleşmenin ilk biçimidir.",
        audienceTitle: "Kimlerde yankı uyandırır",
        audienceText: "Hayatında ani kopuşlar, fark edişler ya da sert yüzleşmeler yaşayan kişilerde.",
        questionTitle: "Sorulacak soru",
        questionText: "Bugün çöken şey gerçekten kayıp mı, yoksa fazlalık mı?",
        ctaTitle: "Okumayı derinleştirmek",
        ctaText: "Sarsıcı bir süreçten geçiyorsan, Dimitri bu kartın sende neyi dönüştürdüğünü birlikte okuyabilir."
      },
      {
        name: "Yıldız",
        text1: "Bugün iyileşme, umut ve zarif bir yeniden doğuş enerjisi taşıyor. Kalbin uzun zamandır beklediği yumuşaklık görünür olabilir.",
        text2: "Her şey bir anda düzelmek zorunda değil. Bazen sadece yeniden inanabilmek bile yön değiştiren bir mucizedir.",
        audienceTitle: "Kimlerde yankı uyandırır",
        audienceText: "Yorgunluğun ardından yeniden nefes almaya başlayan kişilerde.",
        questionTitle: "Sorulacak soru",
        questionText: "Bugün içimde yeniden filizlenen o ince umut ne söylüyor?",
        ctaTitle: "Okumayı derinleştirmek",
        ctaText: "Bu kart sana bir toparlanma hissi veriyorsa, Dimitri ile bu iyileşme çizgisini daha net okuyabilirsin."
      }
    ],
    fr: [
      {
        name: "La Lune",
        text1: "Cette journée met en relief ce qui n'est pas encore entièrement clair, mais déjà profondément ressenti. Il peut s'agir d'une intuition persistante, d'un rêve récurrent ou d'un mouvement intérieur qui cherche encore sa forme.",
        text2: "Ce n'est pas un moment pour forcer la certitude ; c'est un temps pour écouter les nuances, observer les signes et laisser émerger ce que votre conscience sait déjà sans encore l'avoir pleinement formulé.",
        audienceTitle: "Pour qui ce tirage résonne",
        audienceText: "Pour celles et ceux qui sentent monter une émotion sans parvenir encore à en définir l'origine ou la destination.",
        questionTitle: "Question à se poser",
        questionText: "Quel ressenti ai-je minimisé récemment alors qu'il revenait avec insistance ?",
        ctaTitle: "Prolonger la lecture",
        ctaText: "Si cette carte vous touche avec intensité, vous pouvez demander à Dimitri une lecture plus personnelle par message privé."
      },
      {
        name: "Le Soleil",
        text1: "Aujourd'hui, la clarté, la visibilité et l'énergie vitale prennent davantage de place. Quelque chose que vous reteniez en vous pourrait demander à être nommé plus franchement.",
        text2: "C'est un jour pour cesser de vous réduire. Votre joie mérite autant d'être prise au sérieux que vos peurs.",
        audienceTitle: "Pour qui ce tirage résonne",
        audienceText: "Pour les personnes qui commencent enfin à ressentir la clarté qu'elles attendaient depuis longtemps.",
        questionTitle: "Question à se poser",
        questionText: "Quelle part de moi puis-je laisser apparaître aujourd'hui sans me diminuer ?",
        ctaTitle: "Prolonger la lecture",
        ctaText: "Si cette carte ouvre un espace plus lumineux en vous, Dimitri peut vous aider à en lire le sens plus intimement."
      },
      {
        name: "L'Hermite",
        text1: "Aujourd'hui, la réponse ne se trouve pas à l'extérieur, mais dans un silence plus intérieur. Se retirer n'est pas se perdre ; c'est parfois la seule manière d'entendre plus juste.",
        text2: "Vous n'avez pas besoin de répondre à toutes les sollicitations. Certaines vérités ne prennent forme qu'au contact de la solitude.",
        audienceTitle: "Pour qui ce tirage résonne",
        audienceText: "Pour celles et ceux qui ressentent le besoin de garder une distance intérieure, même au milieu du monde.",
        questionTitle: "Question à se poser",
        questionText: "Que dois-je ralentir aujourd'hui pour entendre ce qui cherche vraiment à se dire ?",
        ctaTitle: "Prolonger la lecture",
        ctaText: "Si le besoin de retour à vous-même devient plus fort, Dimitri peut vous aider à comprendre ce que ce silence cherche à révéler."
      },
      {
        name: "Les Amoureux",
        text1: "Aujourd'hui, le cœur, le choix et l'accord intérieur prennent le devant de la scène. La question n'est pas seulement de savoir avec qui, mais avec quoi vous êtes réellement aligné.",
        text2: "Ce qu'un lien éveille en vous compte autant que ce qu'il promet. Choisir, ce n'est pas toujours choisir une personne ; c'est parfois choisir sa propre direction.",
        audienceTitle: "Pour qui ce tirage résonne",
        audienceText: "Pour les personnes qui réfléchissent à leurs liens, à leurs décisions affectives et à leur manière de s'attacher.",
        questionTitle: "Question à se poser",
        questionText: "Entre mon cœur et ma peur, dans quel choix suis-je en train de me tenir ?",
        ctaTitle: "Prolonger la lecture",
        ctaText: "Si cette carte touche un nœud dans votre vie affective, Dimitri peut vous aider à le lire avec plus de précision."
      },
      {
        name: "La Tour",
        text1: "Aujourd'hui, quelque chose que vous croyiez stable peut révéler sa fissure. Ce n'est pas forcément une destruction, mais la vérité d'une structure qui ne pouvait plus tenir ainsi.",
        text2: "Tout ce qui retarde le réel finit un jour par céder. Être secoué est parfois la première forme de libération.",
        audienceTitle: "Pour qui ce tirage résonne",
        audienceText: "Pour celles et ceux qui traversent une rupture soudaine, une prise de conscience forte ou un face-à-face brutal avec le réel.",
        questionTitle: "Question à se poser",
        questionText: "Ce qui s'effondre aujourd'hui est-il réellement une perte, ou une charge devenue inutile ?",
        ctaTitle: "Prolonger la lecture",
        ctaText: "Si vous traversez un moment de bascule, Dimitri peut vous aider à comprendre ce que cette carte transforme en vous."
      },
      {
        name: "L'Étoile",
        text1: "Aujourd'hui porte une énergie de réparation, d'espérance et de renaissance délicate. La douceur que votre cœur attendait depuis longtemps peut devenir plus visible.",
        text2: "Tout n'a pas besoin d'être réglé d'un seul coup. Parfois, retrouver simplement la capacité d'espérer change déjà la direction d'une vie.",
        audienceTitle: "Pour qui ce tirage résonne",
        audienceText: "Pour les personnes qui recommencent à respirer après une longue fatigue intérieure.",
        questionTitle: "Question à se poser",
        questionText: "Que cherche à me dire ce mince espoir qui recommence à naître en moi aujourd'hui ?",
        ctaTitle: "Prolonger la lecture",
        ctaText: "Si cette carte vous apporte un sentiment de réparation, Dimitri peut vous aider à lire plus finement cette ligne de guérison."
      }
    ]
  };

  const getLocalDayNumber = () => {
    const now = new Date();
    const localMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.floor(localMidnight.getTime() / 86400000) + 2;
  };

  const setText = (selector, value) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  };

  const renderDailyDraw = () => {
    const lang = document.documentElement.lang === "tr" ? "tr" : "fr";
    const cards = dailyDeck[lang];
    const card = cards[getLocalDayNumber() % cards.length];

    setText("[data-draw-card-name]", card.name);
    setText("[data-draw-text-1]", card.text1);
    setText("[data-draw-text-2]", card.text2);
    setText("[data-draw-audience-title]", card.audienceTitle);
    setText("[data-draw-audience-text]", card.audienceText);
    setText("[data-draw-question-title]", card.questionTitle);
    setText("[data-draw-question-text]", card.questionText);
    setText("[data-draw-cta-title]", card.ctaTitle);
    setText("[data-draw-cta-text]", card.ctaText);
  };

  const scheduleNextDrawRefresh = () => {
    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const delay = nextMidnight.getTime() - now.getTime() + 1000;

    window.setTimeout(() => {
      renderDailyDraw();
      scheduleNextDrawRefresh();
    }, delay);
  };

  renderDailyDraw();
  scheduleNextDrawRefresh();
}

const numerologyForm = document.querySelector("[data-numerology-form]");
const numerologyResult = document.querySelector("[data-numerology-result]");

if (numerologyForm && numerologyResult) {
  const birthdateInput = numerologyForm.querySelector("#birthdate");
  const birthdatePicker = numerologyForm.querySelector("[data-birthdate-picker]");
  const birthdateToggle = numerologyForm.querySelector("[data-birthdate-toggle]");
  const birthdatePanel = numerologyForm.querySelector("[data-birthdate-panel]");
  const birthdateDisplay = numerologyForm.querySelector("[data-birthdate-display]");
  const birthDaySelect = numerologyForm.querySelector("[data-birth-day]");
  const birthMonthSelect = numerologyForm.querySelector("[data-birth-month]");
  const birthYearSelect = numerologyForm.querySelector("[data-birth-year]");
  const birthdateClear = numerologyForm.querySelector("[data-birthdate-clear]");
  const birthdateClose = numerologyForm.querySelector("[data-birthdate-close]");
  const monthNames = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık"
  ];

  const setPickerOpen = (isOpen) => {
    if (!birthdateToggle || !birthdatePanel) return;
    birthdateToggle.setAttribute("aria-expanded", String(isOpen));
    birthdatePanel.hidden = !isOpen;
  };

  const populateYearOptions = () => {
    if (!birthYearSelect) return;
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 120; year -= 1) {
      const option = document.createElement("option");
      option.value = String(year);
      option.textContent = String(year);
      birthYearSelect.append(option);
    }
  };

  const populateMonthOptions = () => {
    if (!birthMonthSelect) return;
    monthNames.forEach((month, index) => {
      const option = document.createElement("option");
      option.value = String(index + 1).padStart(2, "0");
      option.textContent = month;
      birthMonthSelect.append(option);
    });
  };

  const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();

  const populateDayOptions = () => {
    if (!birthDaySelect || !birthMonthSelect || !birthYearSelect) return;
    const selectedDay = birthDaySelect.value;
    const year = Number(birthYearSelect.value);
    const month = Number(birthMonthSelect.value);
    const totalDays = year && month ? getDaysInMonth(year, month) : 31;

    birthDaySelect.innerHTML = '<option value="">Gün</option>';

    for (let day = 1; day <= totalDays; day += 1) {
      const option = document.createElement("option");
      option.value = String(day).padStart(2, "0");
      option.textContent = String(day);
      birthDaySelect.append(option);
    }

    if (selectedDay && Number(selectedDay) <= totalDays) {
      birthDaySelect.value = selectedDay;
    }
  };

  const updateBirthdateValue = () => {
    if (!birthdateInput || !birthdateDisplay || !birthDaySelect || !birthMonthSelect || !birthYearSelect) return;
    const day = birthDaySelect.value;
    const month = birthMonthSelect.value;
    const year = birthYearSelect.value;

    if (day && month && year) {
      birthdateInput.value = `${year}-${month}-${day}`;
      birthdateDisplay.textContent = `${Number(day)} ${monthNames[Number(month) - 1]} ${year}`;
    } else {
      birthdateInput.value = "";
      birthdateDisplay.textContent = "Gün / Ay / Yıl";
    }
  };

  const resetBirthdatePicker = () => {
    if (!birthDaySelect || !birthMonthSelect || !birthYearSelect) return;
    birthDaySelect.value = "";
    birthMonthSelect.value = "";
    birthYearSelect.value = "";
    populateDayOptions();
    updateBirthdateValue();
  };

  populateYearOptions();
  populateMonthOptions();
  populateDayOptions();
  updateBirthdateValue();

  birthdateToggle?.addEventListener("click", () => {
    const isOpen = birthdateToggle.getAttribute("aria-expanded") === "true";
    setPickerOpen(!isOpen);
  });

  birthMonthSelect?.addEventListener("change", () => {
    populateDayOptions();
    updateBirthdateValue();
  });

  birthYearSelect?.addEventListener("change", () => {
    populateDayOptions();
    updateBirthdateValue();
  });

  birthDaySelect?.addEventListener("change", updateBirthdateValue);

  birthdateClear?.addEventListener("click", () => {
    resetBirthdatePicker();
    setPickerOpen(true);
  });

  birthdateClose?.addEventListener("click", () => {
    updateBirthdateValue();
    setPickerOpen(false);
  });

  document.addEventListener("click", (event) => {
    if (!birthdatePicker || !birthdatePanel || birthdatePanel.hidden) return;
    if (!birthdatePicker.contains(event.target)) {
      setPickerOpen(false);
    }
  });

  const numerologyArticles = {
    1: {
      href: "yasam-yolu-sayisi-1-liderlik-bagimsizlik-ve-oncu-ruh.html",
      label: "Yaşam yolu sayısı 1 makalesini oku"
    },
    2: {
      href: "yasam-yolu-sayisi-2-sezgi-diplomasi-ve-uyumun-gucu.html",
      label: "Yaşam yolu sayısı 2 makalesini oku"
    },
    3: {
      href: "yasam-yolu-sayisi-3-yaraticilik-iletisim-ve-yasam-sevinci.html",
      label: "Yaşam yolu sayısı 3 makalesini oku"
    },
    4: {
      href: "yasam-yolu-sayisi-4-istikrar-duzen-ve-caliskanlik.html",
      label: "Yaşam yolu sayısı 4 makalesini oku"
    },
    5: {
      href: "yasam-yolu-sayisi-5-ozgurluk-macera-ve-degisimin-ritmi.html",
      label: "Yaşam yolu sayısı 5 makalesini oku"
    },
    6: {
      href: "yasam-yolu-sayisi-6-sorumluluk-kosulsuz-sevgi-ve-sifa.html",
      label: "Yaşam yolu sayısı 6 makalesini oku"
    },
    7: {
      href: "yasam-yolu-sayisi-7-bilgelik-analiz-ve-mistisizmin-sirri.html",
      label: "Yaşam yolu sayısı 7 makalesini oku"
    },
    8: {
      href: "yasam-yolu-sayisi-8-guc-bolluk-ve-maddi-basari.html",
      label: "Yaşam yolu sayısı 8 makalesini oku"
    },
    9: {
      href: "yasam-yolu-sayisi-9-humanizm-evrensel-sevgi-ve-sifacilik.html",
      label: "Yaşam yolu sayısı 9 makalesini oku"
    },
    11: {
      href: "ustad-yasam-yolu-sayisi-11-sezgisellik-ilham-ve-psisik-guc.html",
      label: "Üstad yaşam yolu sayısı 11 makalesini oku"
    },
    22: {
      href: "ustad-yasam-yolu-sayisi-22-ustad-mimar-ve-hayalleri-insa-etmek.html",
      label: "Üstad yaşam yolu sayısı 22 makalesini oku"
    },
    33: {
      href: "ustad-yasam-yolu-sayisi-33-ustad-ogretmen-ve-sifa-enerjisi.html",
      label: "Üstad yaşam yolu sayısı 33 makalesini oku"
    }
  };

  const meanings = {
    1: {
      title: "1: Başlatan irade",
      text: "Bu sayı bağımsızlık, liderlik ve yeni yollar açma isteğiyle çalışır. Gölge tarafı acelecilik; hediyesi ise kendi yönünü cesaretle seçmektir."
    },
    2: {
      title: "2: Duygusal sezgi",
      text: "Bu frekans bağ kurma, hassasiyet ve uyum arayışı taşır. İlişkilerde denge kurmayı ve sezgiyi ciddiye almayı öğretir."
    },
    3: {
      title: "3: İfade ve yaratım",
      text: "Bu sayı söz, üretim ve görünür olma enerjisiyle ilgilidir. İçinde biriken duyguyu doğru forma dönüştürmeyi destekler."
    },
    4: {
      title: "4: Temel ve disiplin",
      text: "Bu titreşim düzen, emek ve sağlam zemin ister. Hayatın dağınık alanlarını yapılandırdığında gücün belirginleşir."
    },
    5: {
      title: "5: Değişim ve hareket",
      text: "Bu sayı özgürleşme, dönüşüm ve yeni deneyimlerle büyümeyi anlatır. Sabit kalmak zorlaştığında ruhun yön değiştirmek istiyor olabilir."
    },
    6: {
      title: "6: Kalp ve sorumluluk",
      text: "Bu frekans sevgi, aile, bakım ve şefkatli sorumluluk alanını açar. Kendini tüketmeden vermeyi öğrenmek ana derslerinden biridir."
    },
    7: {
      title: "7: İçsel bilgelik",
      text: "Bu sayı araştırma, yalnızlık, sezgi ve ruhsal derinlikle çalışır. Cevapları dışarıda değil, çoğu zaman sessizlikte bulursun."
    },
    8: {
      title: "8: Güç ve madde",
      text: "Bu frekans irade, para, otorite ve somut sonuçlarla ilgilidir. Gücü kontrol etmek yerine onu olgunlaştırmayı öğretir."
    },
    9: {
      title: "9: Tamamlanma ve şifa",
      text: "Bu sayı kapanışlar, affediş ve kolektif fayda alanını taşır. Geçmişi dönüştürdüğünde başkalarına da ışık tutabilirsin."
    },
    11: {
      title: "11: Sezgisel kapı",
      text: "Bu usta sayı yüksek sezgi, ilham ve içsel uyanışla ilişkilidir. Hassasiyetini yük değil, doğru kullanıldığında rehber bir kanal gibi okuyabilirsin."
    },
    22: {
      title: "22: Büyük inşa",
      text: "Bu usta sayı büyük fikirleri somut dünyaya taşıma potansiyeli verir. Vizyonun ancak sabır ve yapı ile gerçek bir forma kavuşur."
    },
    33: {
      title: "33: Şefkatli öğretmen",
      text: "Bu usta sayı iyileştirici sevgi, rehberlik ve sorumlulukla çalışır. Önce kendini korumayı öğrendiğinde başkalarına daha temiz dokunursun."
    }
  };

  const reduceNumber = (value) => {
    let total = value;
    while (total > 9 && total !== 11 && total !== 22 && total !== 33) {
      total = String(total)
        .split("")
        .reduce((sum, digit) => sum + Number(digit), 0);
    }
    return total;
  };

  numerologyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(numerologyForm);
    const dateValue = String(formData.get("birthdate") || "");
    const digits = dateValue.replace(/\D/g, "");

    if (!digits) {
      setPickerOpen(true);
      numerologyResult.innerHTML = `
        <span class="card-tag">Sonuç</span>
        <h3>Tarihi eksiksiz gir.</h3>
        <p>Yaşam yolu sayını hesaplayabilmem için doğum tarihini seçmen gerekiyor.</p>
      `;
      return;
    }

    const rawTotal = digits.split("").reduce((sum, digit) => sum + Number(digit), 0);
    const number = reduceNumber(rawTotal);
    const meaning = meanings[number];
    const article = numerologyArticles[number];

    numerologyResult.innerHTML = `
      <span class="card-tag">Yaşam yolu sayın</span>
      <span class="numerology-number">${number}</span>
      <h3>${meaning.title}</h3>
      <p>${meaning.text}</p>
      <p class="numerology-followup">Yaşam yolu sayın hakkındaki detaylı makaleyi okumak istersen aşağıdan devam edebilirsin.</p>
      <a class="button button-primary numerology-result-link" href="${article.href}">${article.label}</a>
    `;
  });
}
