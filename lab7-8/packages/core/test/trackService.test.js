import { test } from "node:test";
import assert from "node:assert/strict";
import { TrackService } from "../trackService.js";
import { MemoryStorageAdapter, TrackStorageAdapter } from "../storageAdapter.js";
import { ERROR_EMPTY } from "../trackValidation.js";

const input = { title: "Rain", artist: "Wavely", category: "rain" };

test("додавання валідного треку зберігає його через адаптер", async () => {
  const adapter = new MemoryStorageAdapter();
  const svc = new TrackService(adapter, () => 1000);
  const r = await svc.add(input);
  assert.equal(r.ok, true);
  assert.equal((await adapter.load()).length, 1);
});

test("некоректний трек відхиляється і не записується", async () => {
  const adapter = new MemoryStorageAdapter();
  const svc = new TrackService(adapter);
  const r = await svc.add({ ...input, title: " " });
  assert.deepEqual(r, { ok: false, error: ERROR_EMPTY });
  assert.equal((await adapter.load()).length, 0);
});

test("id треків унікальні", async () => {
  const svc = new TrackService(new MemoryStorageAdapter(), () => 1000);
  const a = await svc.add(input);
  const b = await svc.add(input);
  assert.notEqual(a.track.id, b.track.id);
});

test("перемикання і видалення наявного треку", async () => {
  const adapter = new MemoryStorageAdapter();
  const svc = new TrackService(adapter);
  const { track } = await svc.add(input);
  assert.equal((await svc.toggle(track.id)).ok, true);
  assert.equal((await adapter.load())[0].isDownloaded, true);
  assert.equal((await svc.remove(track.id)).ok, true);
  assert.equal((await adapter.load()).length, 0);
});

test("дії з відсутнім треком повертають помилку", async () => {
  const svc = new TrackService(new MemoryStorageAdapter());
  assert.deepEqual(await svc.toggle("немає"), { ok: false, error: "Трек не знайдено." });
  assert.deepEqual(await svc.remove("немає"), { ok: false, error: "Трек не знайдено." });
});

test("stats рахує всі і завантажені треки", async () => {
  const svc = new TrackService(new MemoryStorageAdapter());
  const { track } = await svc.add(input);
  await svc.add(input);
  await svc.toggle(track.id);
  assert.deepEqual(await svc.stats(), { total: 2, downloaded: 1 });
});

test("list повертає відфільтровані треки від новіших", async () => {
  let t = 0;
  const svc = new TrackService(new MemoryStorageAdapter(), () => ++t);
  await svc.add({ ...input, title: "Перший" });
  await svc.add({ ...input, title: "Другий" });
  const list = await svc.list("");
  assert.deepEqual(list.map((x) => x.title), ["Другий", "Перший"]);
});

test("базовий адаптер не реалізовано: load і save кидають помилку", async () => {
  const base = new TrackStorageAdapter();
  await assert.rejects(() => base.load(), /не реалізовано/);
  await assert.rejects(() => base.save([]), /не реалізовано/);
});

test("MemoryStorageAdapter не ділить масив із викликачем", async () => {
  const a = new MemoryStorageAdapter();
  const list = [{ id: "1" }];
  await a.save(list);
  list.push({ id: "2" });
  assert.equal((await a.load()).length, 1);
});
