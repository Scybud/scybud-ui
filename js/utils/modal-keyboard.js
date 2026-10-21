const FOCUSABLE =
  'a[href],button:not(:disabled),input:not([type="hidden"]),select,textarea,[tabindex]:not([tabindex="-1"])';

// Focus trap, Esc, focus restore, Enter or Ctrl+Enter on [data-primary]
export function enableModalKeyboard(containerId = "modalContainer") {
  const box = document.getElementById(containerId);
  if (!box || box.dataset.kbd) return;
  box.dataset.kbd = "1";
  let opener = null;

  new MutationObserver(() => {
    const isOpen = box.children.length > 0;
    if (isOpen && !opener) {
      opener = document.activeElement;
      (
        box.querySelector("[autofocus]") || box.querySelector(FOCUSABLE)
      )?.focus();
    } else if (!isOpen && opener) {
      opener.focus?.();
      opener = null;
    }
  }).observe(box, { childList: true });

  box.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      const closeBtn = box.querySelector(".closeModalBtn");
      if (closeBtn) closeBtn.click();
      else box.replaceChildren();
      return;
    }

    if (e.key === "Tab") {
      const items = [...box.querySelectorAll(FOCUSABLE)];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
      return;
    }

    // Forms already submit on Enter, so skip them
    const inForm = e.target.closest("form");
    const singleLine =
      e.target.tagName === "INPUT" && e.target.type !== "checkbox";
    if (
      e.key === "Enter" &&
      !inForm &&
      (e.ctrlKey || e.metaKey || singleLine)
    ) {
      const primary = box.querySelector("[data-primary]");
      if (primary && !primary.disabled) {
        e.preventDefault();
        primary.click();
      }
    }
  });
}
