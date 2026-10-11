// Builds the shared frame for every example page: sidebar, page header and
// mobile drawer. All page data comes from examples.js.
import { home, groups, repoSourceBase } from "./examples.js";

const pages = groups.flatMap((group) =>
  group.examples.map((example) => ({ ...example, group: group.title })),
);

// Works with and without .html in the URL
function currentFile() {
  const name = location.pathname.split("/").pop() || "index.html";
  return name.includes(".") ? name : `${name}.html`;
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function navLink(file, label, current) {
  const link = el("a", "nav-btn", label);
  link.href = file;
  if (file === current) {
    link.style.background = "var(--active)";
    link.setAttribute("aria-current", "page");
  }
  return link;
}

function buildFrame(current) {
  const frame = el("div");
  frame.id = "scybud-ui-frame";
  frame.innerHTML = `
    <button class="toggle-sidebar" id="globalToggleBtn" type="button" aria-label="Toggle navigation" aria-expanded="false" aria-controls="globalSidebar">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </button>
    <div class="sidebar-overlay" id="globalOverlay"></div>
    <aside class="sidebar" id="globalSidebar">
      <a class="example-brand" href="index.html">Scybud <span>UI</span></a>
      <nav class="sidebarNav" id="sidebarLinksContainer" aria-label="Examples"></nav>
    </aside>
  `;

  const nav = frame.querySelector("#sidebarLinksContainer");
  nav.append(navLink(home.file, "Overview", current));
  groups.forEach((group) => {
    nav.append(el("p", "nav-group-label", group.title));
    group.examples.forEach((example) =>
      nav.append(navLink(example.file, example.title, current)),
    );
  });
  return frame;
}

function buildHeader(page, showSource) {
  const header = el("header", "example-header");
  header.append(
    el("p", "example-eyebrow", page.group),
    el("h1", "", page.title),
    el("p", "example-lede", page.description),
  );
  if (showSource) {
    const link = el("a", "example-source", "View source on GitHub");
    link.href = repoSourceBase + page.file;
    link.target = "_blank";
    link.rel = "noopener";
    header.append(link);
  }
  return header;
}

function buildWarning(file) {
  const warning = el(
    "p",
    "example-warning",
    `${file} is not listed in examples.js, so it has no title and is missing from the sidebar.`,
  );
  console.warn(`[examples] ${file} is not listed in examples.js`);
  return warning;
}

// Cards on the overview page, one group at a time
function renderIndex(list) {
  groups.forEach((group) => {
    const section = el("section", "example-group");
    section.append(el("h2", "", group.title));
    const grid = el("div", "example-grid");
    group.examples.forEach((example) => {
      const card = el("a", "example-card");
      card.href = example.file;
      card.append(
        el("h3", "", example.title),
        el("p", "", example.description),
      );
      grid.append(card);
    });
    section.append(grid);
    list.append(section);
  });
}

function setupDrawer() {
  const sidebar = document.getElementById("globalSidebar");
  const toggle = document.getElementById("globalToggleBtn");
  const overlay = document.getElementById("globalOverlay");

  const setOpen = (open) => {
    sidebar.classList.toggle("open", open);
    document.body.classList.toggle("sidebar-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };

  toggle.addEventListener("click", () =>
    setOpen(!sidebar.classList.contains("open")),
  );
  overlay.addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
}

function init() {
  // ?embed renders the bare page, for iframes in the docs
  if (new URLSearchParams(location.search).has("embed")) return;

  const current = currentFile();
  const isHome = current === home.file;
  const page = isHome
    ? { ...home, group: "Scybud UI" }
    : pages.find((p) => p.file === current);

  // Move the page content into the main area without losing listeners
  const content = el("div");
  content.style.maxWidth = "1000px";
  content.style.margin = "0 auto";
  while (document.body.firstChild)
    content.appendChild(document.body.firstChild);

  if (page) {
    const header = buildHeader(page, !isHome);
    content.prepend(header);
    document.title = `${page.title} | Scybud UI`;
  } else {
    content.prepend(buildWarning(current));
  }

  const list = content.querySelector("#example-list");
  if (list) renderIndex(list);

  const main = el("main", "main-content");
  main.append(content);
  document.body.append(buildFrame(current), main);
  setupDrawer();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
