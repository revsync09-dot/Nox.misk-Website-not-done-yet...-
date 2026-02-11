const STORAGE = {
  auth: "nomisk_auth_v1",
};

function $(selector, root = document) {
  return root.querySelector(selector);
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
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

function initYear() {
  const el = $("[data-year]");
  if (el) el.textContent = String(new Date().getFullYear());
}

document.addEventListener("DOMContentLoaded", () => {
  initYear();
  const form = $("[data-login-form]");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const email = String(fd.get("email") || "").trim().toLowerCase();
    const password = String(fd.get("password") || "");
    const remember = fd.get("remember") === "on";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast("Bitte gültige E-Mail eingeben.");
      return;
    }
    if (password.length < 6) {
      showToast("Passwort muss mindestens 6 Zeichen haben.");
      return;
    }

    const payload = {
      loggedIn: true,
      email,
      remember,
      at: new Date().toISOString(),
    };
    if (remember) writeStorage(STORAGE.auth, payload);
    else writeSession(STORAGE.auth, payload);

    showToast("Login erfolgreich.");
    window.setTimeout(() => (window.location.href = "../index.html"), 550);
  });
});
