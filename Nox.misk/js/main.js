/* No.misk – Frontend Demo (ohne Backend) */

const STORAGE = {
  cookie: "nomisk_cookie_consent_v1",
  auth: "nomisk_auth_v1",
  newsletter: "nomisk_newsletter_v1",
  favorites: "nomisk_favorites_v1",
  cookieSettingsOpen: "nomisk_cookie_settings_open_v1",
};

const SOCIAL_LINKS = {
  tiktok: "https://www.tiktok.com", 
  snapchat: "https://www.snapchat.com", 
};

const PRODUCTS = [
  { id: "nm-oud-01", name: "No.misk Oud Noir", category: "oud", audience: "unisex", tags: ["oud", "amber", "warm"], price: 89 },
  { id: "nm-men-01", name: "No.misk Steel", category: "men", audience: "men", tags: ["fresh", "clean"], price: 59 },
  { id: "nm-women-01", name: "No.misk Bloom", category: "women", audience: "women", tags: ["floral", "soft"], price: 64 },
  { id: "nm-fresh-01", name: "No.misk Citrus Mist", category: "fresh", audience: "unisex", tags: ["fresh", "citrus"], price: 52 },
  { id: "nm-floral-01", name: "No.misk Rose Veil", category: "floral", audience: "women", tags: ["floral", "rose"], price: 72 },
  { id: "nm-unisex-01", name: "No.misk Signature", category: "unisex", audience: "unisex", tags: ["vanilla", "amber"], price: 79 },
];

function $(selector, root = document) {
  return root.querySelector(selector);
}
function $all(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

function safeJsonParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function readStorage(key, fallback) {
  return safeJsonParse(localStorage.getItem(key), fallback);
}
function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function readSession(key, fallback) {
  return safeJsonParse(sessionStorage.getItem(key), fallback);
}
function writeSession(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

function showToast(message) {
  const toast = $('[data-toast]');
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(showToast._t);
  showToast._t = window.setTimeout(() => {
    toast.hidden = true;
    toast.textContent = "";
  }, 3500);
}

function setSocialLinks() {
  $all('[data-social="tiktok"]').forEach((el) => el.setAttribute("href", SOCIAL_LINKS.tiktok));
  $all('[data-social="snapchat"]').forEach((el) => el.setAttribute("href", SOCIAL_LINKS.snapchat));
}

function initYear() {
  const el = $("[data-year]");
  if (el) el.textContent = String(new Date().getFullYear());
}

function initNav() {
  const toggle = $("[data-nav-toggle]");
  const nav = $("[data-nav]");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const open = nav.getAttribute("data-open") === "true";
    nav.setAttribute("data-open", String(!open));
    toggle.setAttribute("aria-label", !open ? "Menü schließen" : "Menü öffnen");
  });

  nav.addEventListener("click", (e) => {
    const target = e.target;
    if (target instanceof HTMLAnchorElement && nav.getAttribute("data-open") === "true") {
      nav.setAttribute("data-open", "false");
      toggle.setAttribute("aria-label", "Menü öffnen");
    }
  });
}

function getConsent() {
  return readStorage(STORAGE.cookie, null);
}

function setConsent(level) {
  writeStorage(STORAGE.cookie, { level, at: new Date().toISOString() });
}

function initCookieBanner() {
  const banner = $("[data-cookie-banner]");
  if (!banner) return;

  const consent = getConsent();
  if (!consent) banner.hidden = false;

  const accept = $("[data-cookie-accept]");
  const necessary = $("[data-cookie-necessary]");
  accept?.addEventListener("click", () => {
    setConsent("all");
    banner.hidden = true;
    showToast("Cookies akzeptiert.");
  });
  necessary?.addEventListener("click", () => {
    setConsent("necessary");
    banner.hidden = true;
    showToast("Nur notwendige Einstellungen aktiviert.");
  });

  $all("[data-open-cookie-settings]").forEach((btn) => {
    btn.addEventListener("click", () => {
      banner.hidden = false;
      writeStorage(STORAGE.cookieSettingsOpen, { at: new Date().toISOString() });
    });
  });
}

function initAuthUi() {
  const link = $("[data-auth-link]");
  if (!link) return;
  const auth = readSession(STORAGE.auth, null) || readStorage(STORAGE.auth, null);
  if (auth?.loggedIn) {
    link.textContent = "Logout";
    link.setAttribute("href", "#");
    link.addEventListener("click", (e) => {
      e.preventDefault();
      writeStorage(STORAGE.auth, { loggedIn: false });
      writeSession(STORAGE.auth, { loggedIn: false });
      showToast("Du bist abgemeldet.");
      window.location.reload();
    });
  }
}

function initNewsletter() {
  const form = $("[data-newsletter-form]");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const consent = formData.get("consent") === "on";
    if (!consent) {
      showToast("Bitte Zustimmung aktivieren.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast("Bitte gültige E-Mail eingeben.");
      return;
    }

    const list = readStorage(STORAGE.newsletter, []);
    if (list.some((x) => x.email === email)) {
      showToast("Diese E-Mail ist schon registriert.");
      return;
    }
    list.push({ email, at: new Date().toISOString() });
    writeStorage(STORAGE.newsletter, list);
    form.reset();
    showToast("Danke! Du bekommst Updates, wenn es Neuigkeiten gibt.");
  });
}

function getFavorites() {
  return new Set(readStorage(STORAGE.favorites, []));
}
function setFavorites(set) {
  writeStorage(STORAGE.favorites, Array.from(set));
}

function renderProducts(items) {
  const host = $("[data-products]");
  if (!host) return;
  const favorites = getFavorites();

  host.innerHTML = "";
  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "card";
    empty.innerHTML = `<div class="card-body"><h3>Keine Treffer</h3><p class="muted">Passe Filter oder Suche an.</p></div>`;
    host.appendChild(empty);
    return;
  }

  for (const p of items) {
    const card = document.createElement("article");
    card.className = "card product-card";
    card.setAttribute("data-product-id", p.id);

    const pressed = favorites.has(p.id);
    card.innerHTML = `
      <div class="card-media image-placeholder small"><span>Foto</span></div>
      <div class="card-body">
        <div class="product-top">
          <h3>${escapeHtml(p.name)}</h3>
          <span class="price">€ ${p.price}</span>
        </div>
        <p class="muted">${escapeHtml(formatTags(p.tags))}</p>
        <div class="product-actions">
          <span class="pill">${escapeHtml(formatCategory(p.category))}</span>
          <button class="icon-btn" type="button" aria-pressed="${pressed ? "true" : "false"}" data-fav>
            ${pressed ? "★ Favorit" : "☆ Favorit"}
          </button>
        </div>
      </div>
    `;

    card.querySelector("[data-fav]")?.addEventListener("click", (e) => {
      const btn = e.currentTarget;
      if (!(btn instanceof HTMLButtonElement)) return;
      const next = getFavorites();
      if (next.has(p.id)) next.delete(p.id);
      else next.add(p.id);
      setFavorites(next);
      const isOn = next.has(p.id);
      btn.setAttribute("aria-pressed", String(isOn));
      btn.textContent = isOn ? "★ Favorit" : "☆ Favorit";
      showToast(isOn ? "Zu Favoriten hinzugefügt." : "Aus Favoriten entfernt.");
    });

    host.appendChild(card);
  }
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatCategory(category) {
  const map = {
    women: "Women",
    men: "Men",
    unisex: "Unisex",
    oud: "Oud",
    fresh: "Fresh",
    floral: "Floral",
  };
  return map[category] || category;
}

function formatTags(tags) {
  return tags.map((t) => `#${t}`).join(" ");
}

function initCatalog() {
  const categorySelect = $("[data-category-select]");
  const sortSelect = $("[data-sort-select]");
  const search = $("[data-search]");
  if (!categorySelect || !sortSelect || !search) {
    renderProducts(PRODUCTS);
    return;
  }

  const apply = () => {
    const category = String(categorySelect.value || "all");
    const sort = String(sortSelect.value || "featured");
    const q = String(search.value || "").trim().toLowerCase();

    let items = PRODUCTS.slice();

    if (category !== "all") {
      items = items.filter((p) => p.category === category || p.audience === category);
    }
    if (q) {
      items = items.filter((p) => {
        const hay = `${p.name} ${p.category} ${p.audience} ${p.tags.join(" ")}`.toLowerCase();
        return hay.includes(q);
      });
    }

    items = sortItems(items, sort);
    renderProducts(items);
  };

  categorySelect.addEventListener("change", apply);
  sortSelect.addEventListener("change", apply);
  search.addEventListener("input", () => {
    window.clearTimeout(initCatalog._t);
    initCatalog._t = window.setTimeout(apply, 120);
  });

  apply();
}

function sortItems(items, sort) {
  const byName = (a, b) => a.name.localeCompare(b.name, "de");
  const byPrice = (a, b) => a.price - b.price;

  switch (sort) {
    case "name_asc":
      return items.sort(byName);
    case "name_desc":
      return items.sort((a, b) => byName(b, a));
    case "price_asc":
      return items.sort(byPrice);
    case "price_desc":
      return items.sort((a, b) => byPrice(b, a));
    default:
      return items;
  }
}

function initFavoriteDemoButton() {
  const btn = $("[data-favorite-demo]");
  if (!btn) return;
  btn.addEventListener("click", () => showToast("Demo: Favoriten sind in der Produktliste verfügbar."));
}

document.addEventListener("DOMContentLoaded", () => {
  initYear();
  initNav();
  setSocialLinks();
  initCookieBanner();
  initAuthUi();
  initNewsletter();
  initCatalog();
  initFavoriteDemoButton();
});
