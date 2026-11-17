import { test } from "node:test";
import assert from "node:assert/strict";
import { formatDateLabel } from "../trackUtils.js";

test("дата у форматі дд.мм.рррр", () => {
  const ts = new Date(2026, 10, 5).getTime(); // 5 листопада 2026
  assert.equal(formatDateLabel(ts), "05.11.2026");
});

test("некоректна дата дає порожній рядок", () => {
  assert.equal(formatDateLabel("не дата"), "");
});
