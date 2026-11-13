// Cross promo card that rotates through all ads on a shuffled cycle
(function () {
  const BASE = "https://ui.scybud.com";
  const GAP_HOURS = 1;
  const RULES = {
    trytasty: { seconds: 120, events: { recipe_open: 2 } },
    zefeed: { seconds: 180, events: { history_read: 5 } },
    default: { seconds: 240 },
  };

  const store = {
    get: (k) => {
      try {
        return localStorage.getItem(k);
      } catch (e) {
        return null;
      }
    },
    set: (k, v) => {
      try {
        localStorage.setItem(k, v);
      } catch (e) {}
    },
  };


  function start() {
    // Site name from the script tag, falls back to hostname matching
  const SITE =
    (document.currentScript && document.currentScript.dataset.site) || "";
  const host = location.hostname.replace(/^www\./, "");
  const key = RULES[SITE]
    ? SITE
    : Object.keys(RULES).find((k) => k !== "default" && host.includes(k));
  const rule = RULES[key] || RULES.default;

  // True when the gap since the last card has passed
  const gapOk = () =>
    Date.now() - (+store.get("promoLast") || 0) >= GAP_HOURS * 36e5;

  const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // True when the visitor is already on the ad's own site or a subdomain of it
  const sameSite = (a) => {
    const h = new URL(a.link).hostname.replace(/^www\./, "");
    return host === h || host.endsWith("." + h);
  };

  // Pick the next ad from the shuffled bag, refill when empty
  function pick(ads) {
    const ok = ads.filter(
      (a) => !sameSite(a) && (!a.only || a.only.some((o) => host.includes(o))),
    );
    if (!ok.length) return null;
    let bag = JSON.parse(store.get("promoBag") || "[]").filter((id) =>
      ok.some((a) => a.id === id),
    );
    if (!bag.length) {
      bag = shuffle(ok.map((a) => a.id));
      // Avoid repeating the last ad right after a refill
      if (bag.length > 1 && bag[0] === store.get("promoPrev"))
        bag.push(bag.shift());
    }
    const id = bag.shift();
    store.set("promoBag", JSON.stringify(bag));
    store.set("promoPrev", id);
    return ok.find((a) => a.id === id);
  }

  function render(ad) {
    // Holder with a closed shadow root so page CSS cannot reach the card
    const holder = document.createElement("div");
    holder.setAttribute("data-scybud-promo", "");
    const root = holder.attachShadow({ mode: "closed" });

    const style = document.createElement("style");
    style.textContent = `
      :host { all: initial; }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      .card {
        position: fixed;
        right: max(16px, env(safe-area-inset-right));
        bottom: max(16px, env(safe-area-inset-bottom));
        width: 180px;
        aspect-ratio: 9 / 16;
        z-index: 2147483000;
        border-radius: 20px;
        overflow: hidden;
        background: #000;
        box-shadow: 0 12px 40px rgba(0, 0, 0, .45);
        opacity: 0;
        transform: translateY(16px) scale(.97);
        transition: opacity .4s ease, transform .4s cubic-bezier(.2, .8, .2, 1), box-shadow .2s ease;
      }
      .card.in { opacity: 1; transform: none; }
      .card:hover { box-shadow: 0 16px 48px rgba(0, 0, 0, .55); }
      iframe { display: block; width: 100%; height: 100%; border: 0; pointer-events: none; }
      .open { position: absolute; inset: 0; z-index: 1; border-radius: inherit; }
      .open:focus-visible { outline: 3px solid #fff; outline-offset: -3px; }
      .close {
        position: absolute; top: 8px; right: 8px; z-index: 2;
        width: 28px; height: 28px; border: 0; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        background: rgba(0, 0, 0, .6); color: #fff; cursor: pointer;
        backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
        transition: background .2s ease;
      }
      .close:hover { background: rgba(0, 0, 0, .85); }
      .close:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
      .close svg { width: 14px; height: 14px; }
            .label {
        position: absolute; top: 8px; left: 8px; z-index: 2;
        height: 22px; padding: 0 9px; border-radius: 999px;
        display: flex; align-items: center;
        background: rgba(0, 0, 0, .6); color: #fff;
        font: 600 11px/1 system-ui, sans-serif; letter-spacing: .4px;
        pointer-events: none;
        backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
      }
      @media (max-width: 480px) { .card { width: 132px; border-radius: 16px; } }
      @media (prefers-reduced-motion: reduce) { .card { transform: none; transition: opacity .2s ease; } }
      @media print { .card { display: none; } }
    `;

    const card = document.createElement("div");
    card.className = "card";

    const frame = document.createElement("iframe");
    frame.src =
      (ad.src.startsWith("http") ? ad.src : BASE + ad.src) + "?autoplay=1";
    frame.title = "Scybud";
    frame.tabIndex = -1;
    frame.setAttribute("sandbox", "allow-scripts");
    frame.setAttribute("referrerpolicy", "no-referrer");

    const open = document.createElement("a");
    open.className = "open";
    open.href = ad.link;
    open.target = "_blank";
    open.rel = "noopener";
    open.setAttribute("aria-label", "Ad: open product");
    
    const close = document.createElement("button");
    close.className = "close";
    close.type = "button";
    close.setAttribute("aria-label", "Close");
    close.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>';
    close.onclick = () => holder.remove();

    // Label in German on German pages, otherwise English
    const label = document.createElement("span");
    label.className = "label";
    label.textContent = (document.documentElement.lang || "")
      .toLowerCase()
      .startsWith("de")
      ? "Anzeige"
      : "Ad";

    card.append(frame, open, label, close);
    card.append(frame, open, close);
    root.append(style, card);
    // Attach to the root element so a transformed body cannot break fixed positioning
    document.documentElement.appendChild(holder);
    requestAnimationFrame(() => card.classList.add("in"));
  }

  let shown = false;
  async function show() {
    if (shown || !gapOk()) return;
    shown = true;
    try {
      const ads = await (
        await fetch(BASE + "/ads/ads.json", { cache: "no-cache" })
      ).json();
      const ad = pick(ads);
      if (!ad) {
        console.info("[promo] no eligible ad for", host);
        return;
      }
      store.set("promoLast", Date.now());
      render(ad);
    } catch (e) {
      console.warn("[promo] failed", e);
    }
  }

  // Count an action and show once its threshold is reached
  function track(name) {
    const k = "promoCount:" + name;
    const n = (+store.get(k) || 0) + 1;
    store.set(k, n);
    const need = rule.events && rule.events[name];
    if (need && n >= need) setTimeout(show, 1500);
  }

  // Time trigger, only counted while the tab is visible
  if (rule.seconds) {
    let left = rule.seconds;
    const tick = setInterval(() => {
      if (document.hidden) return;
      if (--left <= 0) {
        clearInterval(tick);
        show();
      }
    }, 1000);
  }

  window.ScybudPromo = { track };
}

// Run only after the visitor accepted
const consented = () => store.get("consent-preferences") === "granted";
window.ScybudPromo = { track() {} };
if (consented()) start();
else window.addEventListener("scybud:consent", start, { once: true });
})();