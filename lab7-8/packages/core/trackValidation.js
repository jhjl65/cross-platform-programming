// Правила перевірки треку. Єдине місце, де вони описані для всіх клієнтів.
export const TRACK_TITLE_MAX = 100;
export const ERROR_EMPTY = "Будь ласка, заповніть назву треку та виконавця.";
export const ERROR_TOO_LONG = `Назва треку не повинна перевищувати ${TRACK_TITLE_MAX} символів.`;
export const ERROR_CATEGORY = "Оберіть категорію зі списку.";

export const CATEGORIES = ["ambient", "lofi", "rain", "whitenoise"];

export function validateTrack({ title, artist, category } = {}) {
  if (typeof title !== "string" || typeof artist !== "string") {
    return { isValid: false, error: ERROR_EMPTY };
  }
  const cleanTitle = title.trim();
  const cleanArtist = artist.trim();
  if (!cleanTitle || !cleanArtist) {
    return { isValid: false, error: ERROR_EMPTY };
  }
  if (cleanTitle.length > TRACK_TITLE_MAX) {
    return { isValid: false, error: ERROR_TOO_LONG };
  }
  if (!CATEGORIES.includes(category)) {
    return { isValid: false, error: ERROR_CATEGORY };
  }
  return { isValid: true, error: null };
}
