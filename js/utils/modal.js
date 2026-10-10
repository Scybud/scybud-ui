export async function loadComponent(path, containerId = "modalContainer") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const response = await fetch(path);
  if (!response.ok) throw new Error(`Failed to load ${path}`);
  container.innerHTML = await response.text();

  container.querySelectorAll(".closeModalBtn").forEach((btn) => {
    btn.addEventListener("click", () => closeModal(containerId));
  });
}

export function closeModal(containerId = "modalContainer") {
  const container = document.getElementById(containerId);
  if (container) container.innerHTML = "";
}
