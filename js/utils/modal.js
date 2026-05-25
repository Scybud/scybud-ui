export async function loadComponent(path, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const response = await fetch(path);
  const html = await response.text();

  container.innerHTML = html;

  attachCloseModal();
}

export function closeModal() {
  const modalContainer = document.getElementById("modalContainer");

  modalContainer.innerHTML = "";
}

function attachCloseModal() {
  //Close modal button
  const closeModalBtn = document.querySelector(".closeModalBtn");

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      closeModal();
    });
  }
}
