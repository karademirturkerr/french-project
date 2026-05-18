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

const contactCopy = {
  tr: {
    title: "Dimitri ile nasÄ±l iletiÅŸime geÃ§mek istersin?",
    body: "Telegram hesabÄ±n yoksa sorun deÄŸil. Sana en uygun kanalÄ± seÃ§, Dimitri seni orada karÅŸÄ±lasÄ±n.",
    telegramLabel: "Telegram ile yaz",
    telegramText: "HÄ±zlÄ± ve doÄŸrudan Ã¶zel mesaj",
    instagramLabel: "Instagram ile yaz",
    instagramText: "DM Ã¼zerinden iletiÅŸime geÃ§",
    closeLabel: "Kapat"
  },
  fr: {
    title: "Par quel canal souhaitez-vous Ã©crire Ã  Dimitri ?",
    body: "Si vous n'avez pas Telegram, aucun souci. Choisissez simplement le canal qui vous convient le mieux.",
    telegramLabel: "Ã‰crire via Telegram",
    telegramText: "Message privÃ© rapide et direct",
    instagramLabel: "Ã‰crire via Instagram",
    instagramText: "Prise de contact en message privÃ©",
    closeLabel: "Fermer"
  }
};

const contactTargets = {
  tr: {
    telegram: "https://t.me/ruhsaldanismandimitri?text=Merhaba%20Dimitri%2C%20NasÄ±lsÄ±n%3F",
    instagram: "https://ig.me/m/dimitrispiritual"
  },
  fr: {
    telegram: "https://t.me/ruhsaldanismandimitri?text=Bonjour%20Dimitri%2C%20comment%20allez-vous%20%3F",
    instagram: "https://ig.me/m/dimitrispiritual"
  }
};

const contactTriggers = Array.from(
  document.querySelectorAll('a[href*="t.me/ruhsaldanismandimitri"]')
).filter((link) => /Dimitri'ye Yaz|Dimitriâ€™ye Yaz|Ã‰crire Ã  Dimitri/i.test(link.textContent.trim()));

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
        text1: "BugÃ¼n henÃ¼z tam netleÅŸmemiÅŸ ama derinden hissedilen her ÅŸeyi gÃ¶rÃ¼nÃ¼r kÄ±lÄ±yor. Bu; Ä±srarla geri gelen bir sezgi, tekrarlayan bir rÃ¼ya ya da form arayan iÃ§sel bir hareket olabilir.",
        text2: "KesinliÄŸi zorlayacaÄŸÄ±n bir gÃ¼n deÄŸil; nÃ¼anslarÄ± dinleyeceÄŸin, iÅŸaretleri gÃ¶zlemleyeceÄŸin ve bilincinin Ã§oktan bildiÄŸi ÅŸeyi yavaÅŸÃ§a aÃ§Ä±ÄŸa Ã§Ä±karacaÄŸÄ±n bir gÃ¼n.",
        audienceTitle: "Kimlerde yankÄ± uyandÄ±rÄ±r",
        audienceText: "YÃ¼kselen bir duyguyu hissedip yine de onun sebebini ya da yÃ¶nÃ¼nÃ¼ hemen tanÄ±mlayamayan kiÅŸilerde.",
        questionTitle: "Sorulacak soru",
        questionText: "Son zamanlarda tekrar tekrar gelen hangi hissi kÃ¼Ã§Ã¼msedim?",
        ctaTitle: "OkumayÄ± derinleÅŸtirmek",
        ctaText: "EÄŸer bu kart sende gÃ¼Ã§lÃ¼ bir karÅŸÄ±lÄ±k bulduysa, Ã¶zel mesajla daha kiÅŸisel bir yorum isteyebilirsin."
      },
      {
        name: "GÃ¼neÅŸ",
        text1: "BugÃ¼n gÃ¶rÃ¼nÃ¼rlÃ¼k, aÃ§Ä±klÄ±k ve yaÅŸam enerjisi Ã¶ne Ã§Ä±kÄ±yor. Ä°Ã§inde tuttuÄŸun bir ÅŸey artÄ±k daha net biÃ§imde adÄ±nÄ± isteyebilir.",
        text2: "Kendini kÃ¼Ã§Ã¼ltmek yerine Ä±ÅŸÄ±ÄŸÄ±nÄ± daha dÃ¼rÃ¼stÃ§e taÅŸÄ±man gereken bir gÃ¼n. Sevincin de en az korkularÄ±n kadar ciddiye alÄ±nmalÄ±.",
        audienceTitle: "Kimlerde yankÄ± uyandÄ±rÄ±r",
        audienceText: "Uzun sÃ¼redir beklediÄŸi netliÄŸi sonunda hissetmeye baÅŸlayan kiÅŸilerde.",
        questionTitle: "Sorulacak soru",
        questionText: "BugÃ¼n hangi tarafÄ±mÄ± saklamadan gÃ¶rÃ¼nÃ¼r kÄ±labilirim?",
        ctaTitle: "OkumayÄ± derinleÅŸtirmek",
        ctaText: "Bu kart sende yeni bir aÃ§Ä±klÄ±k alanÄ± aÃ§tÄ±ysa, Dimitri ile bunu daha kiÅŸisel bir Ã§erÃ§evede konuÅŸabilirsin."
      },
      {
        name: "ErmiÅŸ",
        text1: "BugÃ¼n cevap dÄ±ÅŸarÄ±da deÄŸil, daha Ã§ok iÃ§ sessizlikte bulunuyor. Geri Ã§ekilmek, kaybolmak deÄŸil; daha doÄŸru duymak anlamÄ±na geliyor.",
        text2: "Her davete yetiÅŸmen gerekmiyor. BazÄ± hakikatler ancak yalnÄ±zlÄ±kla temas ettiÄŸinde ÅŸekil kazanÄ±r.",
        audienceTitle: "Kimlerde yankÄ± uyandÄ±rÄ±r",
        audienceText: "KalabalÄ±ÄŸÄ±n iÃ§inde bile iÃ§sel mesafe ihtiyacÄ± hisseden kiÅŸilerde.",
        questionTitle: "Sorulacak soru",
        questionText: "BugÃ¼n gerÃ§ekten neyi duymak iÃ§in yavaÅŸlamam gerekiyor?",
        ctaTitle: "OkumayÄ± derinleÅŸtirmek",
        ctaText: "Ä°Ã§ine dÃ¶nme isteÄŸin arttÄ±ysa, Dimitri bu sessizliÄŸin ne anlattÄ±ÄŸÄ±nÄ± birlikte yorumlayabilir."
      },
      {
        name: "AÅŸÄ±klar",
        text1: "BugÃ¼n kalp, seÃ§im ve iÃ§sel uyum temalarÄ± Ã¶ne Ã§Ä±kÄ±yor. Mesele yalnÄ±zca biri deÄŸil; neyle gerÃ§ekten hizalandÄ±ÄŸÄ±n.",
        text2: "Bir baÄŸÄ±n sana ne hissettirdiÄŸi kadar, sende hangi parÃ§ayÄ± uyandÄ±rdÄ±ÄŸÄ± da Ã¶nemli. SeÃ§im bazen bir kiÅŸiyi deÄŸil, kendi yÃ¶nÃ¼nÃ¼ seÃ§mektir.",
        audienceTitle: "Kimlerde yankÄ± uyandÄ±rÄ±r",
        audienceText: "Ä°liÅŸkiler, duygusal kararlar ve baÄŸlanma biÃ§imleri Ã¼zerine dÃ¼ÅŸÃ¼nen kiÅŸilerde.",
        questionTitle: "Sorulacak soru",
        questionText: "BugÃ¼n kalbim ile korkum arasÄ±nda hangi seÃ§imde duruyorum?",
        ctaTitle: "OkumayÄ± derinleÅŸtirmek",
        ctaText: "Bu kart duygusal hayatÄ±nda bir dÃ¼ÄŸÃ¼me dokunduysa, Dimitri ile bunu daha yakÄ±ndan ele alabilirsin."
      },
      {
        name: "Kule",
        text1: "BugÃ¼n saÄŸlam sandÄ±ÄŸÄ±n bir ÅŸeyin Ã§atladÄ±ÄŸÄ±nÄ± fark edebilirsin. Bu yÄ±kÄ±m deÄŸil; artÄ±k taÅŸÄ±namayan yapÄ±nÄ±n dÃ¼rÃ¼stÃ§e gÃ¶rÃ¼nmesidir.",
        text2: "GerÃ§eÄŸi geciktiren her ÅŸey bir noktada Ã§Ã¶zÃ¼lÃ¼r. SarsÄ±lmak bazen Ã¶zgÃ¼rleÅŸmenin ilk biÃ§imidir.",
        audienceTitle: "Kimlerde yankÄ± uyandÄ±rÄ±r",
        audienceText: "HayatÄ±nda ani kopuÅŸlar, fark ediÅŸler ya da sert yÃ¼zleÅŸmeler yaÅŸayan kiÅŸilerde.",
        questionTitle: "Sorulacak soru",
        questionText: "BugÃ¼n Ã§Ã¶ken ÅŸey gerÃ§ekten kayÄ±p mÄ±, yoksa fazlalÄ±k mÄ±?",
        ctaTitle: "OkumayÄ± derinleÅŸtirmek",
        ctaText: "SarsÄ±cÄ± bir sÃ¼reÃ§ten geÃ§iyorsan, Dimitri bu kartÄ±n sende neyi dÃ¶nÃ¼ÅŸtÃ¼rdÃ¼ÄŸÃ¼nÃ¼ birlikte okuyabilir."
      },
      {
        name: "YÄ±ldÄ±z",
        text1: "BugÃ¼n iyileÅŸme, umut ve zarif bir yeniden doÄŸuÅŸ enerjisi taÅŸÄ±yor. Kalbin uzun zamandÄ±r beklediÄŸi yumuÅŸaklÄ±k gÃ¶rÃ¼nÃ¼r olabilir.",
        text2: "Her ÅŸey bir anda dÃ¼zelmek zorunda deÄŸil. Bazen sadece yeniden inanabilmek bile yÃ¶n deÄŸiÅŸtiren bir mucizedir.",
        audienceTitle: "Kimlerde yankÄ± uyandÄ±rÄ±r",
        audienceText: "YorgunluÄŸun ardÄ±ndan yeniden nefes almaya baÅŸlayan kiÅŸilerde.",
        questionTitle: "Sorulacak soru",
        questionText: "BugÃ¼n iÃ§imde yeniden filizlenen o ince umut ne sÃ¶ylÃ¼yor?",
        ctaTitle: "OkumayÄ± derinleÅŸtirmek",
        ctaText: "Bu kart sana bir toparlanma hissi veriyorsa, Dimitri ile bu iyileÅŸme Ã§izgisini daha net okuyabilirsin."
      }
    ],
    fr: [
      {
        name: "La Lune",
        text1: "Cette journÃ©e met en relief ce qui n'est pas encore entiÃ¨rement clair, mais dÃ©jÃ  profondÃ©ment ressenti. Il peut s'agir d'une intuition persistante, d'un rÃªve rÃ©current ou d'un mouvement intÃ©rieur qui cherche encore sa forme.",
        text2: "Ce n'est pas un moment pour forcer la certitude ; c'est un temps pour Ã©couter les nuances, observer les signes et laisser Ã©merger ce que votre conscience sait dÃ©jÃ  sans encore l'avoir pleinement formulÃ©.",
        audienceTitle: "Pour qui ce tirage rÃ©sonne",
        audienceText: "Pour celles et ceux qui sentent monter une Ã©motion sans parvenir encore Ã  en dÃ©finir l'origine ou la destination.",
        questionTitle: "Question Ã  se poser",
        questionText: "Quel ressenti ai-je minimisÃ© rÃ©cemment alors qu'il revenait avec insistance ?",
        ctaTitle: "Prolonger la lecture",
        ctaText: "Si cette carte vous touche avec intensitÃ©, vous pouvez demander Ã  Dimitri une lecture plus personnelle par message privÃ©."
      },
      {
        name: "Le Soleil",
        text1: "Aujourd'hui, la clartÃ©, la visibilitÃ© et l'Ã©nergie vitale prennent davantage de place. Quelque chose que vous reteniez en vous pourrait demander Ã  Ãªtre nommÃ© plus franchement.",
        text2: "C'est un jour pour cesser de vous rÃ©duire. Votre joie mÃ©rite autant d'Ãªtre prise au sÃ©rieux que vos peurs.",
        audienceTitle: "Pour qui ce tirage rÃ©sonne",
        audienceText: "Pour les personnes qui commencent enfin Ã  ressentir la clartÃ© qu'elles attendaient depuis longtemps.",
        questionTitle: "Question Ã  se poser",
        questionText: "Quelle part de moi puis-je laisser apparaÃ®tre aujourd'hui sans me diminuer ?",
        ctaTitle: "Prolonger la lecture",
        ctaText: "Si cette carte ouvre un espace plus lumineux en vous, Dimitri peut vous aider Ã  en lire le sens plus intimement."
      },
      {
        name: "L'Hermite",
        text1: "Aujourd'hui, la rÃ©ponse ne se trouve pas Ã  l'extÃ©rieur, mais dans un silence plus intÃ©rieur. Se retirer n'est pas se perdre ; c'est parfois la seule maniÃ¨re d'entendre plus juste.",
        text2: "Vous n'avez pas besoin de rÃ©pondre Ã  toutes les sollicitations. Certaines vÃ©ritÃ©s ne prennent forme qu'au contact de la solitude.",
        audienceTitle: "Pour qui ce tirage rÃ©sonne",
        audienceText: "Pour celles et ceux qui ressentent le besoin de garder une distance intÃ©rieure, mÃªme au milieu du monde.",
        questionTitle: "Question Ã  se poser",
        questionText: "Que dois-je ralentir aujourd'hui pour entendre ce qui cherche vraiment Ã  se dire ?",
        ctaTitle: "Prolonger la lecture",
        ctaText: "Si le besoin de retour Ã  vous-mÃªme devient plus fort, Dimitri peut vous aider Ã  comprendre ce que ce silence cherche Ã  rÃ©vÃ©ler."
      },
      {
        name: "Les Amoureux",
        text1: "Aujourd'hui, le cÅ“ur, le choix et l'accord intÃ©rieur prennent le devant de la scÃ¨ne. La question n'est pas seulement de savoir avec qui, mais avec quoi vous Ãªtes rÃ©ellement alignÃ©.",
        text2: "Ce qu'un lien Ã©veille en vous compte autant que ce qu'il promet. Choisir, ce n'est pas toujours choisir une personne ; c'est parfois choisir sa propre direction.",
        audienceTitle: "Pour qui ce tirage rÃ©sonne",
        audienceText: "Pour les personnes qui rÃ©flÃ©chissent Ã  leurs liens, Ã  leurs dÃ©cisions affectives et Ã  leur maniÃ¨re de s'attacher.",
        questionTitle: "Question Ã  se poser",
        questionText: "Entre mon cÅ“ur et ma peur, dans quel choix suis-je en train de me tenir ?",
        ctaTitle: "Prolonger la lecture",
        ctaText: "Si cette carte touche un nÅ“ud dans votre vie affective, Dimitri peut vous aider Ã  le lire avec plus de prÃ©cision."
      },
      {
        name: "La Tour",
        text1: "Aujourd'hui, quelque chose que vous croyiez stable peut rÃ©vÃ©ler sa fissure. Ce n'est pas forcÃ©ment une destruction, mais la vÃ©ritÃ© d'une structure qui ne pouvait plus tenir ainsi.",
        text2: "Tout ce qui retarde le rÃ©el finit un jour par cÃ©der. ÃŠtre secouÃ© est parfois la premiÃ¨re forme de libÃ©ration.",
        audienceTitle: "Pour qui ce tirage rÃ©sonne",
        audienceText: "Pour celles et ceux qui traversent une rupture soudaine, une prise de conscience forte ou un face-Ã -face brutal avec le rÃ©el.",
        questionTitle: "Question Ã  se poser",
        questionText: "Ce qui s'effondre aujourd'hui est-il rÃ©ellement une perte, ou une charge devenue inutile ?",
        ctaTitle: "Prolonger la lecture",
        ctaText: "Si vous traversez un moment de bascule, Dimitri peut vous aider Ã  comprendre ce que cette carte transforme en vous."
      },
      {
        name: "L'Ã‰toile",
        text1: "Aujourd'hui porte une Ã©nergie de rÃ©paration, d'espÃ©rance et de renaissance dÃ©licate. La douceur que votre cÅ“ur attendait depuis longtemps peut devenir plus visible.",
        text2: "Tout n'a pas besoin d'Ãªtre rÃ©glÃ© d'un seul coup. Parfois, retrouver simplement la capacitÃ© d'espÃ©rer change dÃ©jÃ  la direction d'une vie.",
        audienceTitle: "Pour qui ce tirage rÃ©sonne",
        audienceText: "Pour les personnes qui recommencent Ã  respirer aprÃ¨s une longue fatigue intÃ©rieure.",
        questionTitle: "Question Ã  se poser",
        questionText: "Que cherche Ã  me dire ce mince espoir qui recommence Ã  naÃ®tre en moi aujourd'hui ?",
        ctaTitle: "Prolonger la lecture",
        ctaText: "Si cette carte vous apporte un sentiment de rÃ©paration, Dimitri peut vous aider Ã  lire plus finement cette ligne de guÃ©rison."
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

