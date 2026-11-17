import { test } from "node:test";
import assert from "node:assert/strict";
import { sortTracksNewestFirst, filterTracksByQuery, toggleDownloaded, countDownloaded, sanitizeTracks, createTrack } from "../trackUtils.js";

const tracks = [
  { id: "a", title: "Ambient Rain", artist: "Wavely Sounds", category: "rain", isDownloaded: false, createdAt: 1 },
  { id: "b", title: "Midnight Lo-Fi", artist: "Chill Beats", category: "lofi", isDownloaded: true, createdAt: 3 },
  { id: "c", title: "Forest", artist: "Nature Lab", category: "ambient", isDownloaded: false, createdAt: 2 },
];

test("сортування: новіші спочатку і вихідний масив не змінюється", () => {
  const before = tracks.map((t) => t.id);
  assert.deepEqual(sortTracksNewestFirst(tracks).map((t) => t.id), ["b", "c", "a"]);
  assert.deepEqual(tracks.map((t) => t.id), before);
});

test("пошук без урахування регістру за назвою", () => {
  assert.deepEqual(filterTracksByQuery(tracks, "AMBIENT").map((t) => t.id), ["a"]);
});

test("пошук за виконавцем і порожній запит повертає всі треки", () => {
  assert.deepEqual(filterTracksByQuery(tracks, "chill").map((t) => t.id), ["b"]);
  assert.equal(filterTracksByQuery(tracks, "  ").length, 3);
});

test("перемикання завантаження повертає новий масив", () => {
  const next = toggleDownloaded(tracks, "a");
  assert.equal(next.find((t) => t.id === "a").isDownloaded, true);
  assert.equal(tracks.find((t) => t.id === "a").isDownloaded, false);
});

test("підрахунок завантажених треків", () => {
  assert.equal(countDownloaded(tracks), 1);
});

test("sanitizeTracks відкидає некоректні записи та не-масиви", () => {
  const dirty = [tracks[0], { id: 1, title: "x" }, null, "рядок"];
  assert.deepEqual(sanitizeTracks(dirty).map((t) => t.id), ["a"]);
  assert.deepEqual(sanitizeTracks({ not: "array" }), []);
});

test("createTrack обрізає пробіли і ставить isDownloaded = false", () => {
  const t = createTrack({ title: " Rain ", artist: " Wavely ", category: "rain" }, "x1", 10);
  assert.deepEqual(t, { id: "x1", title: "Rain", artist: "Wavely", category: "rain", isDownloaded: false, createdAt: 10 });
});
