import fs from "node:fs";
import path from "node:path";
import { TrackStorageAdapter, sanitizeTracks } from "@wavely/core";

// Адаптер для Electron: треки зберігаються у JSON-файлі. Модуль не імпортує electron.
export class FileStorageAdapter extends TrackStorageAdapter {
  #filePath;

  constructor(filePath) {
    super();
    this.#filePath = filePath;
  }

  async load() {
    if (!fs.existsSync(this.#filePath)) return [];
    try {
      return sanitizeTracks(JSON.parse(fs.readFileSync(this.#filePath, "utf-8")));
    } catch {
      return [];
    }
  }

  async save(tracks) {
    fs.mkdirSync(path.dirname(this.#filePath), { recursive: true });
    fs.writeFileSync(this.#filePath, JSON.stringify(tracks, null, 2), "utf-8");
  }
}
