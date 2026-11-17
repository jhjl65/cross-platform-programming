import { test } from "node:test";
import assert from "node:assert/strict";
import { AsyncStorageAdapter } from "../asyncStorageAdapter.js";
import { TrackService } from "@wavely/core";

// Підставний асинхронний сховище замість AsyncStorage (у Node.js його немає).
function fakeAsyncStorage(initial = {}) {
  const data = { ...initial };
  return {
    getItem: async (k) => (k in data ? data[k] : null),
    setItem: async (k, v) => { data[k] = String(v); },
  };
}

test("порожнє сховище — порожній список", async () => {
  assert.deepEqual(await new AsyncStorageAdapter(fakeAsyncStorage()).load(), []);
});

test("запис через TrackService читається після перезапуску застосунку", async () => {
  const storage = fakeAsyncStorage();
  await new TrackService(new AsyncStorageAdapter(storage)).add({ title: "Rain", artist: "Wavely", category: "rain" });
  const list = await new TrackService(new AsyncStorageAdapter(storage)).list();
  assert.equal(list.length, 1);
  assert.equal(list[0].title, "Rain");
});

test("пошкоджений JSON — порожній список", async () => {
  assert.deepEqual(await new AsyncStorageAdapter(fakeAsyncStorage({ "wavely-tracks": "{зламано" })).load(), []);
});
