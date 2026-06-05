export function createEmptyState({
  container,
  icon = "📭",
  title = "Nothing here yet",
  description = "",
  actionText = null,
  onAction = null,
}) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("empty-state");

  const iconEl = document.createElement("div");
  iconEl.classList.add("empty-icon");
  iconEl.textContent = icon;

  const titleEl = document.createElement("span");
  titleEl.classList.add("empty-title");
  titleEl.textContent = title;

  wrapper.appendChild(iconEl);
  wrapper.appendChild(titleEl);

  if (description) {
    const descEl = document.createElement("p");
    descEl.classList.add("empty-description");
    descEl.textContent = description;
    wrapper.appendChild(descEl);
  }

  if (actionText) {
    const btn = document.createElement("button");
    btn.classList.add("empty-action");
    btn.textContent = actionText;

    btn.addEventListener("click", onAction);
    wrapper.appendChild(btn);
  }


  container.appendChild(wrapper);
}
