const yildiznameForm = document.querySelector("#yildiznameForm");
const yildiznameStatus = document.querySelector("#yildiznameStatus");
const yildiznameResultState = document.querySelector("#yildiznameResultState");
const yildiznameResultCard = document.querySelector("#yildiznameResultCard");
const yildiznameResultText = document.querySelector("#yildiznameResultText");
const yildiznameResultTime = document.querySelector("#yildiznameResultTime");
const yildiznameGenerateButton = document.querySelector("#yildiznameGenerateButton");

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

    try {
      setYildiznameLoading(true);
      setYildiznameStatus("Yıldızname hazırlanıyor...");

      yildiznameResultState.classList.add("hidden");
      yildiznameResultCard.classList.remove("hidden");
      yildiznameResultText.textContent = buildYildizname(payload);
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

function buildYildizname(payload) {
  const zodiac = getZodiacInfo(payload.birth_date);
  const lifePathNumber = getLifePathNumber(payload.birth_date);
  const intentionProfile = getIntentionProfile(payload.intention);
  const birthTimeInsight = getBirthTimeInsight(payload.birth_time);
  const locationTone = getLocationTone(payload.birth_place);
  const closingEnergy = getClosingEnergy(lifePathNumber, zodiac.key);

  return [
    "Genel Enerji",
    `${payload.full_name}, annenin ismiyle birlikte açılan bu yıldızname akışında ilk hissedilen enerji ${zodiac.label.toLowerCase()} karakterinin ${zodiac.core} tarafı ile yaşam yolu ${lifePathNumber} titreşiminin birleşmesidir. Bu birleşim sende ${zodiac.general} bir ruh hali oluşturuyor. ${locationTone} ${birthTimeInsight} Şu dönem hayatında olanları sadece olay gibi değil, sana bir şey anlatan işaretler gibi okuman daha doğru olur.`,
    "",
    "Aşk ve İlişkiler",
    `${zodiac.relationships} Yaşam yolu ${lifePathNumber} ise ilişkilerde ${getRelationshipTone(lifePathNumber)} eğilimini güçlendiriyor. Sorunda öne çıkan tema "${intentionProfile.label}" olduğu için duygusal tarafta senden beklenen şey acele karar vermek değil; karşı tarafın niyetini olduğu kadar kendi iç sesini de berraklaştırmak. Bu süreçte açık ama kontrollü kalman, karmaşık bağları daha kolay çözmeni sağlar.`,
    "",
    "İş ve Para",
    `${zodiac.work} ${getWorkTone(lifePathNumber)} Özellikle ${intentionProfile.workFocus} alanında bir toparlanma enerjisi görünüyor. Dağınık kalan işleri yeniden sıraya koyduğunda önünde duran fırsatlar daha görünür hale gelecektir. Parasal tarafta ise dürtüyle değil stratejiyle hareket etmek kazanç enerjisini büyütür.`,
    "",
    "Yakın Dönem",
    `Önündeki kısa dönem ${intentionProfile.periodTone} bir döneme işaret ediyor. ${zodiac.period} Burada ana ders, dış gürültü arttığında bile kendi merkezini kaybetmemek. Annenin adı üzerinden açılan aile hattı da sana, geçmişten gelen bir duyguyu artık başka bir olgunlukla taşıyabileceğini söylüyor.`,
    "",
    "Kısa Tavsiye",
    `${closingEnergy} Niyetinde geçen "${intentionProfile.label}" teması için en doğru yaklaşım; önce iç işaretleri görmek, sonra küçük ama net bir adım atmaktır. Kendini fazla zorlamadan, ama ertelemeden ilerlersen bu yıldızname sana açılan kapıyı daha net gösterecektir.`
  ].join("\n");
}

function getZodiacInfo(dateString) {
  const [year, monthString, dayString] = String(dateString).split("-");
  const month = Number(monthString);
  const day = Number(dayString);
  const code = month * 100 + day;

  const signs = [
    {
      key: "oglak",
      label: "Oğlak",
      limit: 119,
      core: "disiplinli ve içten derinleşen",
      general: "kontrol etme, düzen kurma ve duygularını görünmeden yönetme",
      relationships: "Aşkta kolay açılmayan ama bağ kurduğunda oldukça sadık bir tarafın öne çıkıyor.",
      work: "İş ve para alanında sağlam zemin kurma isteğin baskın.",
      period: "Yakın dönemde ağır ama kalıcı sonuçlar getirecek görüşmeler ve kararlar var."
    },
    {
      key: "kova",
      label: "Kova",
      limit: 218,
      core: "özgürlük arayan ve sezgiyi zihinden geçiren",
      general: "yenilik ihtiyacı, mesafe koyarak düşünme ve farklı olana yönelme",
      relationships: "İlişkilerde hem yakınlık hem alan isteyen bir enerjin var; bu yüzden netlik senin için çok kıymetli.",
      work: "İş tarafında klasik olandan çok özgün ve bağımsız hareket alanı ararsın.",
      period: "Yakın dönemde sürpriz haberler ve zihinsel yön değişimleri belirginleşebilir."
    },
    {
      key: "balik",
      label: "Balık",
      limit: 320,
      core: "hassas, sezgisel ve görünmeyeni kolay hisseden",
      general: "duygusal yoğunluk, sezgisel açılma ve başkalarının enerjisinden etkilenme",
      relationships: "Aşkta idealize etmeye yatkınsın; bu yüzden kalbin kadar sınırlarını da koruman gerekiyor.",
      work: "İş alanında sezgisel kararların güçlüdür ama somut planla desteklenmesi gerekir.",
      period: "Yakın dönemde rüyalar, işaretler ve içe doğan hisler daha fazla anlam taşıyacak."
    },
    {
      key: "koc",
      label: "Koç",
      limit: 419,
      core: "atak, doğrudan ve hareket ettikçe güçlenen",
      general: "başlama cesareti, hızlı karar alma ve sabırsızlıkla ilerleme",
      relationships: "İlişkilerde sıcak, dürüst ve net olursun; belirsizlik seni yorar.",
      work: "İş ve para konusunda ilk hamleyi yapma cesaretin yüksek.",
      period: "Yakın dönemde bekleyen bir konuda hızlanma ve öncü tavır alma zamanı yaklaşıyor."
    },
    {
      key: "boga",
      label: "Boğa",
      limit: 520,
      core: "sabırlı, koruyucu ve güven duygusuyla hareket eden",
      general: "istikrar arayışı, somut güven ihtiyacı ve sakin güç",
      relationships: "Aşkta bağ kurduğunda sahiplenen ama aynı zamanda kalıcı olmak isteyen bir yapıdasın.",
      work: "İş alanında sağlam ilerlemek, elindekini büyütmek ve riskleri ölçmek senin doğana uygun.",
      period: "Yakın dönemde ağır ilerleyen ama güven veren gelişmeler dikkat çekecek."
    },
    {
      key: "ikizler",
      label: "İkizler",
      limit: 620,
      core: "hareketli, meraklı ve iletişimle yön bulan",
      general: "düşünce trafiği, haberleşme ve farklı olasılıklar arasında gidip gelme",
      relationships: "İlişkilerde zihinsel uyum senin için duygusal çekim kadar önemlidir.",
      work: "İş alanında iletişim, ticaret, bağlantılar ve hızlı kararlar öne çıkar.",
      period: "Yakın dönemde konuşmalar, mesajlar ve beklenmedik temaslar çok şey değiştirebilir."
    },
    {
      key: "yengec",
      label: "Yengeç",
      limit: 722,
      core: "korumacı, duygusal hafızası güçlü ve iç dünyası derin",
      general: "geçmişi taşıma, aidiyet arama ve duygusal güven ihtiyacı",
      relationships: "Aşkta sıcaklık, samimiyet ve korunmuş hissetmek senin için temel meseledir.",
      work: "İş alanında duygusal karar vermeye yatkın olsan da sezgilerin sana doğru kapıları gösterebilir.",
      period: "Yakın dönemde aile, ev veya geçmişten gelen bir konuyla ilgili içsel çözülme olabilir."
    },
    {
      key: "aslan",
      label: "Aslan",
      limit: 822,
      core: "görünür olmayı seven, yürekli ve karizması yüksek",
      general: "kendini ortaya koyma, değer görme ve iç ateşini yükseltme",
      relationships: "İlişkilerde sıcak, cömert ve koruyucu bir tarafın var; ilgisizlik seni hızla soğutabilir.",
      work: "İş ve para alanında kendini gösterebildiğin zaman daha hızlı açılırsın.",
      period: "Yakın dönemde dikkat çeken bir gelişme, seni yeniden sahneye davet edebilir."
    },
    {
      key: "basak",
      label: "Başak",
      limit: 922,
      core: "analitik, düzenleyici ve ince detaylara duyarlı",
      general: "ayrıntıları büyütme, çözüm arama ve fayda üretme",
      relationships: "Aşkta duygunu göstermeden önce güvenilirlik ve tutarlılık ararsın.",
      work: "İş alanında plan, analiz ve toparlama yeteneğin seni öne çıkarır.",
      period: "Yakın dönemde eksik bıraktığın bir şeyi temiz biçimde tamamlama enerjisi var."
    },
    {
      key: "terazi",
      label: "Terazi",
      limit: 1022,
      core: "denge arayan, zarif ve ilişki merkezli",
      general: "uyum kurma, estetik hassasiyet ve karar verirken iki tarafı da tartma",
      relationships: "İlişkilerde zarafet, karşılıklılık ve duygusal denge senin ana ihtiyacın.",
      work: "İş hayatında ortaklıklar, sunum dili ve insanlar arası denge kurmak seni güçlendirir.",
      period: "Yakın dönemde karar veremediğin bir mesele netlik kazanabilir."
    },
    {
      key: "akrep",
      label: "Akrep",
      limit: 1121,
      core: "yoğun, sezgisel ve dönüşümden korkmayan",
      general: "derine inme, sezgisel çözümleme ve gizli olanı görme",
      relationships: "Aşkta ya tam bağ kurarsın ya da uzaklaşırsın; yüzeysellik seni beslemez.",
      work: "İş ve para tarafında stratejik ve sezgisel hareket ettiğinde güçlü sonuçlar alırsın.",
      period: "Yakın dönemde saklı bir duygu ya da gizli bir bilgi görünür olabilir."
    },
    {
      key: "yay",
      label: "Yay",
      limit: 1221,
      core: "genişleyen, arayan ve umutla hareket eden",
      general: "ufuk açma, yeni anlam arayışı ve içsel özgürlük isteği",
      relationships: "İlişkilerde dürüstlük, hareket ve ortak bir vizyon ararsın.",
      work: "İş alanında yeni fırsatlar, uzak bağlantılar ve cesur yön değişimleri seni büyütebilir.",
      period: "Yakın dönemde önünü açan bir haber veya yeni bir perspektif belirebilir."
    },
    {
      key: "oglak",
      label: "Oğlak",
      limit: 1231,
      core: "disiplinli ve içten derinleşen",
      general: "kontrol etme, düzen kurma ve duygularını görünmeden yönetme",
      relationships: "Aşkta kolay açılmayan ama bağ kurduğunda oldukça sadık bir tarafın öne çıkıyor.",
      work: "İş ve para alanında sağlam zemin kurma isteğin baskın.",
      period: "Yakın dönemde ağır ama kalıcı sonuçlar getirecek görüşmeler ve kararlar var."
    }
  ];

  return signs.find((item) => code <= item.limit) || signs[0];
}

function getLifePathNumber(dateString) {
  const digits = String(dateString).replace(/\D/g, "");
  let total = digits.split("").reduce((sum, digit) => sum + Number(digit), 0);

  while (total > 9 && total !== 11 && total !== 22 && total !== 33) {
    total = String(total)
      .split("")
      .reduce((sum, digit) => sum + Number(digit), 0);
  }

  return total;
}

function getIntentionProfile(text) {
  const normalized = String(text || "").toLocaleLowerCase("tr-TR");

  if (/(aşk|sevgi|ilişki|eski sevgili|evlilik|kalp|partner)/.test(normalized)) {
    return {
      label: "aşk ve ilişki",
      workFocus: "ortaklık ve insan ilişkileri",
      periodTone: "duygusal çözülme ve yüzleşme"
    };
  }

  if (/(iş|kariyer|çalışma|patron|müşteri|meslek|başarı)/.test(normalized)) {
    return {
      label: "iş ve kariyer",
      workFocus: "iş düzeni ve maddi yön",
      periodTone: "karar alma ve yön değiştirme"
    };
  }

  if (/(para|kazanç|borç|bolluk|bereket|maddi)/.test(normalized)) {
    return {
      label: "para ve bereket",
      workFocus: "gelir düzeni ve kaynak yönetimi",
      periodTone: "toparlanma ve strateji kurma"
    };
  }

  if (/(nazar|büyü|enerji|aura|kısmet|şans|tılsım)/.test(normalized)) {
    return {
      label: "enerji ve korunma",
      workFocus: "enerji hijyeni ve karar berraklığı",
      periodTone: "arınma ve fark etme"
    };
  }

  return {
    label: "genel yaşam akışı",
    workFocus: "gündelik düzen ve uzun vadeli denge",
    periodTone: "iç sesini duyma ve yön toplama"
  };
}

function getBirthTimeInsight(timeString) {
  if (!timeString) {
    return "Doğum saati belirtilmemiş olduğu için yorum daha çok genel enerji ekseninden açılıyor.";
  }

  const hour = Number(String(timeString).split(":")[0]);

  if (hour < 6) {
    return "Gece doğumları sezgiyi ve görünmeyeni hissetme kabiliyetini artırır; sende de bu çizgi belirgin.";
  }

  if (hour < 12) {
    return "Sabah doğumları başlangıç enerjisini güçlendirir; sende yenilenme ve toparlama kapasitesi yüksek.";
  }

  if (hour < 18) {
    return "Gündüz doğumları dış dünyada görünür olma ve hareket ettikçe açılma eğilimini büyütür.";
  }

  return "Akşam doğumları ilişkiler, iç denge ve duyguların derin akışıyla kurulan bağı güçlendirir.";
}

function getLocationTone(place) {
  return `${place} hattı bu yorumda köklenme, aidiyet ve geçmişten gelen bir izi de öne çıkarıyor.`;
}

function getRelationshipTone(number) {
  const map = {
    1: "kontrolü elinde tutma",
    2: "uyum arama",
    3: "iletişimle bağ kurma",
    4: "güven isteme",
    5: "özgürlük alanı koruma",
    6: "fazla sahiplenme",
    7: "mesafe koyarak test etme",
    8: "güçlü durma",
    9: "fazla verme ve idealize etme",
    11: "ruhsal bağ arama",
    22: "ilişkiyi büyük bir yapı gibi kurma",
    33: "koşulsuz verme"
  };

  return map[number] || "denge kurma";
}

function getWorkTone(number) {
  const map = {
    1: "Kendi kararını kendin verdiğinde ve inisiyatif aldığında iş alanın açılır.",
    2: "İş tarafında doğru ortaklıklar ve uyumlu bağlantılar çok şey değiştirir.",
    3: "İletişim, görünürlük ve yaratıcı ifade seni maddi olarak da destekler.",
    4: "Planlı ve sakin ilerlediğinde kazanç daha güvenli biçimde yerleşir.",
    5: "Değişimden korkmadan ama dağılmadan ilerlemek bu döngüde anahtar.",
    6: "Hizmet, bakım ve sorumluluk taşıyan alanlar senin için daha bereketlidir.",
    7: "İçgörü, analiz ve sezgisel doğruluk seni doğru karar noktasına taşır.",
    8: "Maddi büyüme potansiyelin güçlü; fakat disiplin ile kontrolü ayırman gerekir.",
    9: "Kazanç kadar anlam arayışı da belirleyici; fayda gördüğün işte daha çok açılırsın.",
    11: "İlhamın ve sezgin iş seçimlerinde sandığından daha güçlü rol oynuyor.",
    22: "Büyük planları parçalara bölerek yürütmen seni ciddi sonuçlara taşıyabilir.",
    33: "İnsanlara dokunan üretimler ve rehberlik taşıyan işler sende daha çok karşılık bulur."
  };

  return map[number] || "İş tarafında sakin, dengeli ve dikkatli ilerlemek en doğru çizgi olacak.";
}

function getClosingEnergy(number, zodiacKey) {
  const zodiacLine = {
    koc: "Aceleyle değil cesaretini doğru yere koyarak ilerle.",
    boga: "Sabır gösterdiğin yerde kapı yavaş ama sağlam açılır.",
    ikizler: "Kararsızlığı uzatma; netleşen ilk iç sesi küçümseme.",
    yengec: "Geçmişi anlamak başka, onun içinde kalmak başkadır.",
    aslan: "Kendini geri çekmek yerine ışığını doğru yerde göster.",
    basak: "Her ayrıntıyı kontrol etmeye çalışma; bazen akış da cevap verir.",
    terazi: "Dengeni başkalarının tavrına değil, kendi merkezine göre kur.",
    akrep: "Korktuğun derinlik bazen tam da ihtiyacın olan dönüşümü taşır.",
    yay: "Ufuk açan ihtimalin peşinden giderken zemini ihmal etme.",
    oglak: "Yavaş ilerleyen şeylerin değersiz olduğunu sanma.",
    kova: "Farklı hissetmen, yanlış yolda olduğun anlamına gelmez.",
    balik: "Sezgini duy ama kendini sisin içinde bırakma."
  };

  const numberLine = {
    1: "Bu dönemde ilk adımı sen atarsan enerji cevap verir.",
    2: "Uyum ararken kendini yok sayma.",
    3: "Sözlerin ve niyetin aynı yere bakarsa akış hızlanır.",
    4: "Düzen kurduğun yerde iç huzur da büyür.",
    5: "Değişimi yönet, onun savurmasına izin verme.",
    6: "Başkaları için yük taşırken kendi kalbini ihmal etme.",
    7: "Cevapların bir kısmı sessizlikte oluşacak.",
    8: "Gücünü hırsla değil dengeyle kullandığında yol açılır.",
    9: "Biteni bırakmak, yeniyi çağırmanın ilk adımıdır.",
    11: "Hassasiyetini zayıflık sanma; o senin pusulan olabilir.",
    22: "Büyük resmi görüyorsun; şimdi onu yaşanabilir adımlara böl.",
    33: "Şifa vermek istiyorsan önce kendi alanını temiz tut."
  };

  return `${zodiacLine[zodiacKey] || "İç sesine güvenerek ilerle."} ${numberLine[number] || ""}`.trim();
}
