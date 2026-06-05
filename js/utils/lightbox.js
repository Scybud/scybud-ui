export function magnifyImg(img) {
  if (!img) return;

  img.addEventListener("click", () => {
    const rect = img.getBoundingClientRect();

    const overlay = document.createElement("div");
    overlay.className = "scybud-lightbox-overlay";

    const clone = img.cloneNode(true);
    clone.className = "scybud-lightbox-img";

    // Set layout anchor coordinates
    clone.style.left = `${rect.left}px`;
    clone.style.top = `${rect.top}px`;
    clone.style.width = `${rect.width}px`;
    clone.style.height = `${rect.height}px`;

    overlay.appendChild(clone);
    document.body.appendChild(overlay);

    // Force layout flush for smooth entry animation
    void clone.offsetWidth;

    requestAnimationFrame(() => {
      overlay.classList.add("active");
      clone.classList.add("open");
    });

    const closeLightbox = () => {
      overlay.classList.remove("active");
      clone.classList.remove("open");
      // Fallback matching your CSS transition speeds
      setTimeout(() => overlay.remove(), 250);
    };

    overlay.addEventListener("click", closeLightbox);
  });
}
