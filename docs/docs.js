// I implemented navigation and copy support with vanilla JavaScript so the docs remain framework-free.

const sidebarToggle = document.getElementById("sidebar-toggle");
const navLinks = document.querySelectorAll(".docs-nav a");
const sectionIds = Array.from(document.querySelectorAll("main section[id]"));
const toast = document.getElementById("docs-toast");

function setActiveLink() {
  const fromTop = window.scrollY + 120;
  let currentId = sectionIds[0].id;

  for (const section of sectionIds) {
    if (section.offsetTop <= fromTop) {
      currentId = section.id;
    }
  }

  navLinks.forEach((link) => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === `#${currentId}`,
    );
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.classList.remove("visible");
  }, 2200);
}

function copyCode(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;
  const code = target.textContent.trim();
  navigator.clipboard.writeText(code).then(
    () => {
      showToast("HTML copied to clipboard");
    },
    () => {
      showToast("Unable to copy automatically");
    },
  );
}

sidebarToggle.addEventListener("click", () => {
  const open = document.body.dataset.sidebarOpen === "true";
  document.body.dataset.sidebarOpen = String(!open);
  sidebarToggle.setAttribute("aria-expanded", String(!open));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 980) {
      document.body.dataset.sidebarOpen = "false";
      sidebarToggle.setAttribute("aria-expanded", "false");
    }
  });
});

document.querySelectorAll("[data-copy-target]").forEach((button) => {
  button.addEventListener("click", () => {
    copyCode(button.dataset.copyTarget);
  });
});

window.addEventListener("scroll", setActiveLink);
window.addEventListener("resize", setActiveLink);
setActiveLink();
