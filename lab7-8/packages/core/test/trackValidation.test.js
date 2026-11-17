import { test } from "node:test";
import assert from "node:assert/strict";
import { validateTrack, TRACK_TITLE_MAX, ERROR_EMPTY, ERROR_TOO_LONG, ERROR_CATEGORY } from "../trackValidation.js";

const ok = { title: "Rain", artist: "Wavely", category: "rain" };

test("коректний трек проходить перевірку", () => {
  assert.deepEqual(validateTrack(ok), { isValid: true, error: null });
});

test("порожня назва або виконавець — помилка", () => {
  assert.equal(validateTrack({ ...ok, title: "" }).error, ERROR_EMPTY);
  assert.equal(validateTrack({ ...ok, artist: "" }).error, ERROR_EMPTY);
});

test("самі пробіли вважаються порожнім полем", () => {
  assert.equal(validateTrack({ ...ok, title: "   " }).isValid, false);
});

test("не рядок у полі назви — помилка, без падіння", () => {
  assert.equal(validateTrack({ ...ok, title: 42 }).isValid, false);
});

test("межа довжини: рівно TRACK_TITLE_MAX символів — допустимо", () => {
  assert.equal(validateTrack({ ...ok, title: "a".repeat(TRACK_TITLE_MAX) }).isValid, true);
});

test("межа довжини: TRACK_TITLE_MAX + 1 символ — помилка", () => {
  const r = validateTrack({ ...ok, title: "a".repeat(TRACK_TITLE_MAX + 1) });
  assert.equal(r.isValid, false);
  assert.equal(r.error, ERROR_TOO_LONG);
});

test("довжина рахується після обрізання пробілів", () => {
  assert.equal(validateTrack({ ...ok, title: "  " + "a".repeat(TRACK_TITLE_MAX) + "  " }).isValid, true);
});

test("категорія поза списком — помилка", () => {
  assert.equal(validateTrack({ ...ok, category: "jazz" }).error, ERROR_CATEGORY);
});
