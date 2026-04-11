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
