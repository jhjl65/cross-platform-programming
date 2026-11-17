import { TrackService, formatDateLabel } from "@wavely/core";
import { LocalStorageAdapter } from "./localStorageAdapter.js";

const service = new TrackService(new LocalStorageAdapter());
const withDate = (list) => list.map((t) => ({ ...t, dateLabel: formatDateLabel(t.createdAt) }));
const api = {
  list: async (query) => withDate(await service.list(query)),
  add: (input) => service.add(input),
  toggle: (id) => service.toggle(id),
  remove: (id) => service.remove(id),
};

const titleInput = document.getElementById("titleInput");
const artistInput = document.getElementById("artistInput");
const addTrackButton = document.getElementById("addTrackButton");
const searchInput = document.getElementById("searchInput");
const message = document.getElementById("message");
const tracksList = document.getElementById("tracksList");
const hint = document.getElementById("hint");
const totalCount = document.getElementById("totalCount");
const downloadedCount = document.getElementById("downloadedCount");
const chips = document.querySelectorAll(".chip");

const COLOR_ERROR = "#dc2626";
const COLOR_SUCCESS = "#15803d";
const DEFAULT_CATEGORY = "ambient";
let selectedCategory = DEFAULT_CATEGORY;

function showMessage(text, color) {
  message.textContent = text;
  message.style.color = color;
}

function setCategory(key) {
  selectedCategory = key;
  chips.forEach((chip) => {
    const active = chip.dataset.category === key;
    chip.classList.toggle("active", active);
    chip.setAttribute("aria-pressed", String(active));
  });
}

// Вся перевірка даних — у ядрі; тут лише показ результату.
async function render() {
  const all = await api.list("");
  const shown = await api.list(searchInput.value);
  totalCount.textContent = String(all.length);
  downloadedCount.textContent = String(all.filter((t) => t.isDownloaded).length);
  hint.hidden = all.length === 0;
  tracksList.innerHTML = "";

  if (all.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.textContent = "Треків поки немає. Додайте перший для релаксу чи сну!";
    tracksList.appendChild(empty);
    return;
  }
  if (shown.length === 0) {
    const none = document.createElement("li");
    none.className = "empty-state";
    none.textContent = "Нічого не знайдено.";
    tracksList.appendChild(none);
    return;
  }

  shown.forEach((track) => {
    const li = document.createElement("li");
    li.className = "track-item" + (track.isDownloaded ? " done" : "");

    const info = document.createElement("button");
    info.type = "button";
    info.className = "track-info";
    info.addEventListener("click", () => toggleTrack(track.id));

    const title = document.createElement("span");
    title.className = "track-title";
    title.textContent = track.title;

    const meta = document.createElement("span");
    meta.className = "track-meta";
    meta.textContent = `${track.artist} · ${track.category.toUpperCase()} · ${track.dateLabel}`;

    info.appendChild(title);
    info.appendChild(meta);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Видалити";
    deleteButton.addEventListener("click", () => deleteTrack(track.id));

    li.appendChild(info);
    li.appendChild(deleteButton);
    tracksList.appendChild(li);
  });
}

async function addTrack() {
  const result = await api.add({ title: titleInput.value, artist: artistInput.value, category: selectedCategory });
  if (!result.ok) {
    showMessage(result.error, COLOR_ERROR);
    return false;
  }
  titleInput.value = "";
  artistInput.value = "";
  setCategory(DEFAULT_CATEGORY);
  await render();
  showMessage("Трек успішно додано до медіатеки.", COLOR_SUCCESS);
  return true;
}

async function toggleTrack(id) {
  await api.toggle(id);
  await render();
}

async function deleteTrack(id) {
  const result = await api.remove(id);
  await render();
  showMessage(result.ok ? "Трек видалено з бібліотеки." : result.error, result.ok ? COLOR_SUCCESS : COLOR_ERROR);
}

chips.forEach((chip) => chip.addEventListener("click", () => setCategory(chip.dataset.category)));
addTrackButton.addEventListener("click", addTrack);
artistInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") addTrack();
});
searchInput.addEventListener("input", () => render());
document.addEventListener("DOMContentLoaded", () => render());
