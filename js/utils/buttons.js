export function setButtonLoading(button, isLoading) {
  if (!button) return;

  if (isLoading) {
    button.classList.add("loading");
    button.setAttribute("aria-busy", "true");
    if (
      button instanceof HTMLButtonElement ||
      button instanceof HTMLInputElement
    ) {
      button.disabled = true;
    } else {
      button.style.pointerEvents = "none";
    }
    return;
  }

  button.classList.remove("loading");
  button.removeAttribute("aria-busy");
  if (
    button instanceof HTMLButtonElement ||
    button instanceof HTMLInputElement
  ) {
    button.disabled = false;
  } else {
    button.style.pointerEvents = "";
  }
}

export function handleBackBtn() {
  const backBtn = document.querySelectorAll(".backBtn");
  backBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      window.history.back();
    });
  });
}
