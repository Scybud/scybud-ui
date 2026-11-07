// Cross promo card that rotates through all ads on a shuffled cycle
(function () {
  const BASE = "https://ui.scybud.com";
  const GAP_HOURS = 1;
  const RULES = {
    trytasty: { seconds: 120, events: { recipe_open: 2 } },
    zefeed: { seconds: 180, events: { article_read: 5 } },
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
  // Site name from the script tag, falls back to hostname matching
const SITE = (document.currentScript && document.currentScript.dataset.site) || '';
  const host = location.hostname.replace(/^www\./, "");
  const key = RULES[SITE] ? SITE : Object.keys(RULES).find(k => k !== 'default' && host.includes(k));
  const rule = RULES[key] || RULES.default;

  // One card per gap across all ads
  if (Date.now() - (+store.get("promoLast") || 0) < GAP_HOURS * 36e5) return;

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
    const card = document.createElement("div");
    card.style.cssText =
      "position:fixed;right:16px;bottom:16px;width:180px;height:320px;z-index:9999;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,.4);background:#000;opacity:0;transform:translateY(16px);transition:all .5s ease";

    const frame = document.createElement("iframe");
    frame.src =
      (ad.src.startsWith("http") ? ad.src : BASE + ad.src) + "?autoplay=1";
    frame.title = "Scybud";
    frame.setAttribute("sandbox", "allow-scripts");
    frame.style.cssText = "width:100%;height:100%;border:0";

    const open = document.createElement("a");
    open.href = ad.link;
    open.target = "_blank";
    open.rel = "noopener";
    open.setAttribute("aria-label", "Open product");
    open.style.cssText = "position:absolute;inset:0;z-index:1";

    const close = document.createElement("button");
    close.textContent = "\u00d7";
    close.setAttribute("aria-label", "Close");
    close.style.cssText =
      "position:absolute;top:6px;right:6px;width:28px;height:28px;border:0;color:#fff;cursor:pointer;z-index:2";
    close.onclick = () => card.remove();

    card.append(frame, open, close);
    document.body.appendChild(card);
    requestAnimationFrame(() => {
      card.style.opacity = 1;
      card.style.transform = "none";
    });
  }

  let shown = false;
  async function show() {
    if (shown) return;
    shown = true;
    try {
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
})();
