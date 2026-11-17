import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { FileStorageAdapter } from "../fileStorageAdapter.js";

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), "wavely-test-"));
const track = { id: "1", title: "Rain", artist: "Wavely", category: "rain", isDownloaded: false, createdAt: 5 };

test("якщо файлу немає — порожній список", async () => {
  const adapter = new FileStorageAdapter(path.join(tmp(), "tracks.json"));
  assert.deepEqual(await adapter.load(), []);
});

test("запис створює теку, а читання повертає ті самі дані", async () => {
  const file = path.join(tmp(), "nested", "tracks.json");
  const adapter = new FileStorageAdapter(file);
  await adapter.save([track]);
  assert.deepEqual(await new FileStorageAdapter(file).load(), [track]);
});

test("пошкоджений файл — порожній список, без падіння", async () => {
  const file = path.join(tmp(), "tracks.json");
  fs.writeFileSync(file, "{не json");
  assert.deepEqual(await new FileStorageAdapter(file).load(), []);
});
