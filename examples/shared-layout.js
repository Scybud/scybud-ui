// examples/shared-layout.js

const exampleFiles = [
  { name: "Typography Home", url: "index.html" },
  { name: "Dashboard Layout", url: "dashboard.html" },
  { name: "Fluid Lightbox", url: "lightbox.html" },
  { name: "Empty States", url: "empty-state.html" },
];

document.addEventListener("DOMContentLoaded", () => {
  const currentFilename =
    window.location.pathname.split("/").pop() || "index.html";

  // 1. Create a clean wrapper for the sidebar layout framework
  const sidebarFrame = document.createElement("div");
  sidebarFrame.id = "scybud-ui-frame";

  sidebarFrame.innerHTML = `
    <button class="toggle-sidebar" id="globalToggleBtn" aria-label="Toggle Navigation">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </button>

    <div class="sidebar-overlay" id="globalOverlay"></div>

    <aside class="sidebar" id="globalSidebar">
      <div style="padding: var(--space-md); border-bottom: 1px solid var(--border-primary); width: 100%;">
        <h3 style="margin: 0; text-align: center; font-size: var(--text-lg); font-weight: var(--font-bold); class="text-center">Scybud UI 🛠️</h3>
      </div>
      <nav class="sidebarNav" id="sidebarLinksContainer"></nav>
    </aside>
  `;

  // 2. Wrap all original content cleanly into your main-content area
  const mainContentWrapper = document.createElement("main");
  mainContentWrapper.className = "main-content";

  const contentLimiter = document.createElement("div");
  contentLimiter.style.maxWidth = "1000px";
  contentLimiter.style.margin = "0 auto";

  // Safely move all original elements into the wrapper without destroying them or their listeners
  while (document.body.firstChild) {
    contentLimiter.appendChild(document.body.firstChild);
  }

  mainContentWrapper.appendChild(contentLimiter);

  // 3. Append the new navigation frames directly into the body
  document.body.appendChild(sidebarFrame);
  document.body.appendChild(mainContentWrapper);

  // 4. Populate your navigation link buttons
  const linksContainer = document.getElementById("sidebarLinksContainer");
  exampleFiles.forEach((file) => {
    const link = document.createElement("a");
    link.href = file.url;
    link.className = "nav-btn";
    link.textContent = file.name;

    if (currentFilename === file.url) {
      link.style.background = "var(--active)";
    }

    linksContainer.appendChild(link);
  });

  // 5. Setup mobile responsive drawer triggers
  const sidebar = document.getElementById("globalSidebar");
  const toggleBtn = document.getElementById("globalToggleBtn");
  const overlay = document.getElementById("globalOverlay");

  function toggleSidebarMenu() {
    sidebar.classList.toggle("open");
    document.body.classList.toggle("sidebar-open");
  }

  if (toggleBtn) toggleBtn.addEventListener("click", toggleSidebarMenu);
  if (overlay) overlay.addEventListener("click", toggleSidebarMenu);
});
