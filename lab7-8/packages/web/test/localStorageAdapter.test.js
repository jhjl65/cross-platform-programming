import { test } from "node:test";
import assert from "node:assert/strict";
import { LocalStorageAdapter } from "../localStorageAdapter.js";
import { TrackService } from "@wavely/core";

// Підставний об'єкт замість localStorage (у Node.js його немає).
function fakeStorage(initial = {}) {
  const data = { ...initial };
  return { getItem: (k) => (k in data ? data[k] : null), setItem: (k, v) => { data[k] = String(v); }, data };
}

test("порожнє сховище — порожній список", async () => {
  assert.deepEqual(await new LocalStorageAdapter(fakeStorage()).load(), []);
});

test("запис і читання через адаптер і TrackService", async () => {
  const storage = fakeStorage();
  const svc = new TrackService(new LocalStorageAdapter(storage));
  await svc.add({ title: "Rain", artist: "Wavely", category: "rain" });
  const again = new TrackService(new LocalStorageAdapter(storage));
  const list = await again.list();
  assert.equal(list.length, 1);
  assert.equal(list[0].title, "Rain");
});

test("пошкоджений JSON не ламає застосунок — повертається []", async () => {
  assert.deepEqual(await new LocalStorageAdapter(fakeStorage({ "wavely-tracks": "{зламано" })).load(), []);
});
