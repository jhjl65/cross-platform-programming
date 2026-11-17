import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer, resolveRequest } from "../server.js";

test("дозволені файли веб-клієнта і ядра", () => {
  assert.ok(resolveRequest("/script.js"));
  assert.ok(resolveRequest("/node_modules/@wavely/core/index.js"));
});

test("заборонені шляхи повертають null", () => {
  assert.equal(resolveRequest("/server.js"), null);
  assert.equal(resolveRequest("/package.json"), null);
  assert.equal(resolveRequest("/node_modules/@wavely/core/../../package.json"), null);
});

test("сервер віддає сторінку, файл ядра і 404 для заборонених", async () => {
  const server = createServer();
  await new Promise((r) => server.listen(0, r));
  const base = `http://localhost:${server.address().port}`;
  try {
    const page = await fetch(base + "/");
    assert.equal(page.status, 200);
    assert.match(page.headers.get("content-type"), /text\/html/);
    const core = await fetch(base + "/node_modules/@wavely/core/index.js");
    assert.equal(core.status, 200);
    assert.equal((await fetch(base + "/server.js")).status, 404);
  } finally {
    server.close();
  }
});
