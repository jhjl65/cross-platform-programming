// Чисті функції: без DOM, localStorage, файлів і платформних API.

export function createTrack({ title, artist, category }, id, createdAt) {
  return {
    id,
    title: title.trim(),
    artist: artist.trim(),
    category,
    isDownloaded: false,
    createdAt,
  };
}

// Нові треки — спочатку. Вихідний масив не змінюється.
export function sortTracksNewestFirst(tracks) {
  return [...tracks].sort((a, b) => b.createdAt - a.createdAt);
}

// Пошук без урахування регістру за назвою або виконавцем.
export function filterTracksByQuery(tracks, query = "") {
  const q = String(query).trim().toLowerCase();
  if (!q) return [...tracks];
  return tracks.filter(
    (t) => t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q)
  );
}

// Повертає новий масив; вихідний не змінюється.
export function toggleDownloaded(tracks, id) {
  return tracks.map((t) => (t.id === id ? { ...t, isDownloaded: !t.isDownloaded } : t));
}

export function countDownloaded(tracks) {
  return tracks.filter((t) => t.isDownloaded).length;
}

// Відкидає записи, які не відповідають формату треку (наприклад, пошкоджений файл).
export function sanitizeTracks(list) {
  if (!Array.isArray(list)) return [];
  return list.filter(
    (t) =>
      t &&
      typeof t.id === "string" &&
      typeof t.title === "string" &&
      typeof t.artist === "string" &&
      typeof t.category === "string" &&
      typeof t.isDownloaded === "boolean" &&
      typeof t.createdAt === "number"
  );
}

// Дата для показу у форматі дд.мм.рррр; для некоректного значення — порожній рядок.
export function formatDateLabel(timestamp) {
  const d = new Date(timestamp);
  if (Number.isNaN(d.getTime())) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${d.getFullYear()}`;
}
