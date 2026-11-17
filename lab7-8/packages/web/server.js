import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const WEB_DIR = path.dirname(fileURLToPath(import.meta.url));
// Тека пакета ядра: import.meta.resolve повертає шлях до index.js пакета @wavely/core.
const CORE_DIR = path.dirname(fileURLToPath(import.meta.resolve("@wavely/core")));
const WEB_FILES = new Set(["index.html", "script.js", "style.css", "localStorageAdapter.js"]);
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8" };

// Повертає шлях до файлу або null, якщо запит не дозволено.
export function resolveRequest(urlPath) {
  if (urlPath.includes("..")) return null;
  if (urlPath === "/") return path.join(WEB_DIR, "index.html");
  const core = urlPath.match(/^\/node_modules\/@wavely\/core\/([A-Za-z0-9._-]+\.js)$/);
  if (core) return path.join(CORE_DIR, core[1]);
  const web = urlPath.match(/^\/([A-Za-z0-9._-]+)$/);
  if (web && WEB_FILES.has(web[1])) return path.join(WEB_DIR, web[1]);
  return null;
}

export function createServer() {
  return http.createServer((req, res) => {
    const pathname = new URL(req.url, "http://localhost").pathname;
    const filePath = resolveRequest(pathname);
    if (!filePath || !fs.existsSync(filePath)) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Не знайдено");
      return;
    }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(filePath)] || "application/octet-stream" });
    fs.createReadStream(filePath).pipe(res);
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const PORT = Number(process.env.PORT) || 3000;
  createServer().listen(PORT, () => console.log(`Wavely веб: http://localhost:${PORT}`));
}
