import { test } from "node:test";
import assert from "node:assert/strict";
import { TrackService, MemoryStorageAdapter, ERROR_EMPTY } from "@wavely/core";
import { createHandlers } from "../ipcHandlers.js";

const setup = () => createHandlers(new TrackService(new MemoryStorageAdapter(), () => 1000));
const good = { title: "Rain", artist: "Wavely", category: "rain" };

test("додавання коректного треку повертає ok і запис", async () => {
  const h = setup();
  const r = await h.add(good);
  assert.equal(r.ok, true);
  const list = await h.list();
  assert.equal(list.length, 1);
  assert.ok(list[0].dateLabel);
});

test("некоректні типи даних відхиляються", async () => {
  const h = setup();
  assert.equal((await h.add("рядок")).ok, false);
  assert.equal((await h.add(null)).ok, false);
});

test("порожній трек відхиляється з повідомленням ядра", async () => {
  const r = await setup().add({ ...good, title: " " });
  assert.equal(r.ok, false);
  assert.equal(r.error, ERROR_EMPTY);
});

test("пошук повертає відфільтрований список", async () => {
  const h = setup();
  await h.add(good);
  await h.add({ title: "Forest", artist: "Nature", category: "ambient" });
  assert.equal((await h.list("forest")).length, 1);
  assert.equal((await h.list(42)).length, 0);
});

test("перемикання і видалення; некоректний id відхиляється", async () => {
  const h = setup();
  const { track } = { track: (await h.add(good)).track };
  assert.equal((await h.toggle(track.id)).ok, true);
  assert.equal((await h.toggle(123)).ok, false);
  assert.equal((await h.remove(track.id)).ok, true);
  assert.equal((await h.remove(track.id)).ok, false);
});
