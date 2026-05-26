const adminElements = {
  authMessage: document.querySelector("[data-admin-auth-message]"),
  loginForm: document.querySelector("[data-admin-login-form]"),
  sessionBox: document.querySelector("[data-admin-session-box]"),
  sessionEmail: document.querySelector("[data-admin-session-email]"),
  logoutButton: document.querySelector("[data-admin-logout]"),
  dashboard: document.querySelector("[data-admin-dashboard]"),
  summary: document.querySelector("[data-admin-summary]"),
  visitorsCount: document.querySelector("[data-admin-visitors-count]"),
  visitorsTable: document.querySelector("[data-admin-visitors-table]"),
  leadsCount: document.querySelector("[data-admin-leads-count]"),
  leadsTable: document.querySelector("[data-admin-leads-table]"),
  yildiznameCount: document.querySelector("[data-admin-yildizname-count]"),
  yildiznameTable: document.querySelector("[data-admin-yildizname-table]")
};

const adminState = {
  client: null,
  config: null
};

const escapeHtml = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

const formatDateTime = (value) => {
  if (!value) return "—";

  try {
    return new Intl.DateTimeFormat("tr-TR", {
      dateStyle: "short",
      timeStyle: "short"
    }).format(new Date(value));
  } catch (error) {
    return value;
  }
};

const formatBirthdate = (value) => {
  if (!value) return "—";

  try {
    return new Intl.DateTimeFormat("tr-TR", {
      dateStyle: "long"
    }).format(new Date(value));
  } catch (error) {
    return value;
  }
};

const formatBirthTime = (value) => {
  if (!value) return "—";

  const normalized = String(value).trim();
  return normalized.slice(0, 5) || normalized;
};

const getHostLabel = (value) => {
  if (!value) return "Doğrudan";

  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch (error) {
    return value;
  }
};

const normalizeLeadName = (value) => String(value || "")
  .trim()
  .toLocaleLowerCase("tr-TR")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/ı/g, "i")
  .replace(/ş/g, "s")
  .replace(/ğ/g, "g")
  .replace(/ç/g, "c")
  .replace(/ö/g, "o")
  .replace(/ü/g, "u")
  .replace(/\s+/g, " ");

const setAuthMessage = (message, tone = "default") => {
  if (!adminElements.authMessage) return;

  adminElements.authMessage.textContent = message;
  adminElements.authMessage.dataset.tone = tone;
};

const loadPanelConfig = async () => {
  const response = await fetch("panel-config.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("panel-config.json yüklenemedi.");
  }

  return response.json();
};

const isAuthorizedSession = (session) => {
  const sessionEmail = session?.user?.email?.toLowerCase();
  const adminEmail = adminState.config?.adminEmail?.toLowerCase();

  return Boolean(sessionEmail && adminEmail && sessionEmail === adminEmail);
};

const resolveQueryRows = (result, tableName) => {
  if (!result?.error) {
    return result?.data || [];
  }

  const errorCode = result.error.code;
  const errorMessage = String(result.error.message || "");

  if (errorCode === "42P01" || (errorMessage.includes(tableName) && errorMessage.toLowerCase().includes("does not exist"))) {
    return [];
  }

  throw result.error;
};

const renderSummary = (visitors, numerologyLeads, yildiznameLeads) => {
  if (!adminElements.summary) return;

  const sourceMap = new Map();
  visitors.forEach((item) => {
    const label = item.source_label || "Doğrudan";
    sourceMap.set(label, (sourceMap.get(label) || 0) + 1);
  });

  const topSource = [...sourceMap.entries()]
    .sort((first, second) => second[1] - first[1])[0];
  const latestNumerologyLead = numerologyLeads[0];
  const latestYildiznameLead = yildiznameLeads[0];

  const cards = [
    {
      title: "Toplam ziyaret",
      value: String(visitors.length),
      note: "Panelde gösterilen son kayıt sayısı"
    },
    {
      title: "Numeroloji kayıtları",
      value: String(numerologyLeads.length),
      note: "İsim ve doğum tarihi bırakanlar"
    },
    {
      title: "Yıldızname kayıtları",
      value: String(yildiznameLeads.length),
      note: "Yıldızname formunu dolduranlar"
    },
    {
      title: "En güçlü kaynak",
      value: topSource ? topSource[0] : "Henüz yok",
      note: topSource ? `${topSource[1]} kayıt` : "Kaynak verisi gelmedi"
    },
    {
      title: "Son numeroloji kaydı",
      value: latestNumerologyLead ? escapeHtml(latestNumerologyLead.full_name) : "Henüz yok",
      note: latestNumerologyLead ? `Yaşam yolu ${latestNumerologyLead.life_path_number}` : "Yeni form bekleniyor"
    },
    {
      title: "Son yıldızname kaydı",
      value: latestYildiznameLead ? escapeHtml(latestYildiznameLead.full_name) : "Henüz yok",
      note: latestYildiznameLead ? `${escapeHtml(latestYildiznameLead.birth_place || "Yer yok")} · ${escapeHtml(formatBirthTime(latestYildiznameLead.birth_time))}` : "Yeni yıldızname bekleniyor"
    }
  ];

  adminElements.summary.innerHTML = cards.map((card) => `
    <article class="admin-summary-card">
      <span class="card-tag">${card.title}</span>
      <strong class="admin-summary-value${String(card.value).length > 14 ? " admin-summary-value--compact" : ""}">${card.value}</strong>
      <p>${card.note}</p>
    </article>
  `).join("");
};

const renderVisitors = (visitors) => {
  if (!adminElements.visitorsTable || !adminElements.visitorsCount) return;

  adminElements.visitorsCount.textContent = `${visitors.length} kayıt`;

  if (!visitors.length) {
    adminElements.visitorsTable.innerHTML = '<p class="admin-empty">Henüz ziyaret kaydı düşmedi.</p>';
    return;
  }

  adminElements.visitorsTable.innerHTML = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>Zaman</th>
          <th>Kaynak</th>
          <th>Sayfa</th>
          <th>Cihaz</th>
          <th>Çerez</th>
        </tr>
      </thead>
      <tbody>
        ${visitors.map((item) => `
          <tr>
            <td>${formatDateTime(item.created_at)}</td>
            <td>
              <strong>${escapeHtml(item.source_label || "Doğrudan")}</strong>
              <span>${escapeHtml(getHostLabel(item.referrer))}</span>
            </td>
            <td>
              <code>${escapeHtml(item.page_path || "/")}</code>
              <span>${escapeHtml(item.utm_source || "UTM yok")}</span>
            </td>
            <td>
              <strong>${escapeHtml(item.platform || "Bilinmiyor")}</strong>
              <span>${escapeHtml(item.viewport_width || "?")} x ${escapeHtml(item.viewport_height || "?")}</span>
            </td>
            <td>${item.cookie_snapshot ? "Var" : "Yok"}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
};

const renderLeads = (leads) => {
  if (!adminElements.leadsTable || !adminElements.leadsCount) return;

  adminElements.leadsCount.textContent = `${leads.length} kayıt`;

  if (!leads.length) {
    adminElements.leadsTable.innerHTML = '<p class="admin-empty">Henüz numeroloji formu gönderilmedi.</p>';
    return;
  }

  adminElements.leadsTable.innerHTML = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>Zaman</th>
          <th>İsim</th>
          <th>Doğum tarihi</th>
          <th>Yaşam yolu</th>
          <th>Kaynak</th>
        </tr>
      </thead>
      <tbody>
        ${leads.map((item) => `
          <tr>
            <td>${formatDateTime(item.created_at)}</td>
            <td>
              <strong>${escapeHtml(item.full_name)}</strong>
              <span><code>${escapeHtml(item.page_path || "/numeroloji.html")}</code></span>
            </td>
            <td>${formatBirthdate(item.birthdate)}</td>
            <td>${escapeHtml(item.life_path_number)}</td>
            <td>
              <strong>${escapeHtml(item.source_label || "Doğrudan")}</strong>
              <span>${escapeHtml(getHostLabel(item.referrer))}</span>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
};

const renderYildiznameLeads = (leads) => {
  if (!adminElements.yildiznameTable || !adminElements.yildiznameCount) return;

  adminElements.yildiznameCount.textContent = `${leads.length} kayıt`;

  if (!leads.length) {
    adminElements.yildiznameTable.innerHTML = '<p class="admin-empty">Henüz yıldızname formu gönderilmedi.</p>';
    return;
  }

  adminElements.yildiznameTable.innerHTML = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>Zaman</th>
          <th>Kişi</th>
          <th>Doğum bilgisi</th>
          <th>Niyet</th>
          <th>Kaynak</th>
        </tr>
      </thead>
      <tbody>
        ${leads.map((item) => `
          <tr>
            <td>${formatDateTime(item.created_at)}</td>
            <td>
              <strong>${escapeHtml(item.full_name)}</strong>
              <span>Anne adı: ${escapeHtml(item.mother_name || "—")}</span>
            </td>
            <td>
              <strong>${formatBirthdate(item.birthdate)}</strong>
              <span>${escapeHtml(formatBirthTime(item.birth_time))} · ${escapeHtml(item.birth_place || "Yer yok")}</span>
            </td>
            <td>
              <strong>${escapeHtml(item.zodiac_sign || "Yıldızname")}</strong>
              <span>${escapeHtml((item.intention || "").slice(0, 88) || "Niyet yok")}${item.intention && item.intention.length > 88 ? "..." : ""}</span>
            </td>
            <td>
              <strong>${escapeHtml(item.source_label || "Doğrudan")}</strong>
              <span>${escapeHtml(getHostLabel(item.referrer))}</span>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
};

const fetchDashboardData = async () => {
  const visitorsQuery = adminState.client
    .from("visitor_events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(120);

  const leadsQuery = adminState.client
    .from("numerology_leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(120);

  const yildiznameQuery = adminState.client
    .from("yildizname_leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(120);

  const [visitorsResult, leadsResult, yildiznameResult] = await Promise.all([
    visitorsQuery,
    leadsQuery,
    yildiznameQuery
  ]);

  const safeVisitors = resolveQueryRows(visitorsResult, "visitor_events");
  const safeLeads = resolveQueryRows(leadsResult, "numerology_leads")
    .filter((item) => normalizeLeadName(item.full_name) !== "turker karademir");
  const safeYildiznameLeads = resolveQueryRows(yildiznameResult, "yildizname_leads")
    .filter((item) => normalizeLeadName(item.full_name) !== "turker karademir");

  renderSummary(safeVisitors, safeLeads, safeYildiznameLeads);
  renderVisitors(safeVisitors);
  renderLeads(safeLeads);
  renderYildiznameLeads(safeYildiznameLeads);
};

const showAuthorizedState = async (session) => {
  if (!adminElements.dashboard || !adminElements.sessionBox || !adminElements.sessionEmail) return;

  adminElements.sessionBox.hidden = false;
  adminElements.dashboard.hidden = false;
  adminElements.sessionEmail.textContent = session.user.email || "";
  setAuthMessage("Yetkili oturum doğrulandı. Canlı veriler yükleniyor.", "success");

  await fetchDashboardData();
};

const hideAuthorizedState = () => {
  if (adminElements.sessionBox) adminElements.sessionBox.hidden = true;
  if (adminElements.dashboard) adminElements.dashboard.hidden = true;
};

const initializeAdminPanel = async () => {
  try {
    adminState.config = await loadPanelConfig();
  } catch (error) {
    setAuthMessage("panel-config.json bulunamadı. Önce Supabase yapılandırmasını tamamla.", "error");
    return;
  }

  if (!adminState.config.supabaseUrl || !adminState.config.supabaseAnonKey || !adminState.config.adminEmail) {
    setAuthMessage("panel-config.json içinde Supabase URL, anon key ve admin e-postasını doldurman gerekiyor.", "error");
    return;
  }

  if (!window.supabase?.createClient) {
    setAuthMessage("Supabase istemcisi yüklenemedi.", "error");
    return;
  }

  adminState.client = window.supabase.createClient(
    adminState.config.supabaseUrl,
    adminState.config.supabaseAnonKey
  );

  adminState.client.auth.onAuthStateChange(async (_event, session) => {
    if (!session) {
      hideAuthorizedState();
      setAuthMessage("Giriş yaparak paneli açabilirsin.", "default");
      return;
    }

    if (!isAuthorizedSession(session)) {
      await adminState.client.auth.signOut();
      hideAuthorizedState();
      setAuthMessage("Bu oturum yönetici e-postasıyla eşleşmiyor.", "error");
      return;
    }

    try {
      await showAuthorizedState(session);
    } catch (error) {
      setAuthMessage(`Veriler çekilirken hata oluştu: ${error.message}`, "error");
    }
  });

  const { data: { session } } = await adminState.client.auth.getSession();
  if (session && isAuthorizedSession(session)) {
    await showAuthorizedState(session);
  }
};

adminElements.loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!adminState.client) {
    setAuthMessage("Panel yapılandırması tamamlanmadan giriş yapılamaz.", "error");
    return;
  }

  const formData = new FormData(adminElements.loginForm);
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  setAuthMessage("Oturum açılıyor, birkaç saniye bekle.", "default");

  const { data, error } = await adminState.client.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    setAuthMessage(`Giriş başarısız: ${error.message}`, "error");
    return;
  }

  if (!isAuthorizedSession(data.session)) {
    await adminState.client.auth.signOut();
    setAuthMessage("Bu e-posta panel erişimi için yetkili değil.", "error");
    return;
  }

  await showAuthorizedState(data.session);
});

adminElements.logoutButton?.addEventListener("click", async () => {
  if (!adminState.client) return;
  await adminState.client.auth.signOut();
  hideAuthorizedState();
  setAuthMessage("Oturum kapatıldı.", "default");
});

initializeAdminPanel();
