import { TrackStorageAdapter, sanitizeTracks } from "@wavely/core";

const KEY = "wavely-tracks";

// Адаптер для браузера. Сховище передається ззовні; за замовчуванням — localStorage.
export class LocalStorageAdapter extends TrackStorageAdapter {
  #storage;

  constructor(storage = globalThis.localStorage) {
    super();
    this.#storage = storage;
  }

  async load() {
    try {
      return sanitizeTracks(JSON.parse(this.#storage.getItem(KEY) ?? "[]"));
    } catch {
      return [];
    }
  }

  async save(tracks) {
    this.#storage.setItem(KEY, JSON.stringify(tracks));
  }
}
