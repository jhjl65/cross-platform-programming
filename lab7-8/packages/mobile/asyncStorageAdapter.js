import { TrackStorageAdapter, sanitizeTracks } from "@wavely/core";

const KEY = "wavely-tracks";

// Адаптер для мобільного застосунку. Сховище (AsyncStorage) передається ззовні.
export class AsyncStorageAdapter extends TrackStorageAdapter {
  #storage;

  constructor(storage) {
    super();
    this.#storage = storage;
  }

  async load() {
    try {
      const raw = await this.#storage.getItem(KEY);
      return sanitizeTracks(JSON.parse(raw ?? "[]"));
    } catch {
      return [];
    }
  }

  async save(tracks) {
    await this.#storage.setItem(KEY, JSON.stringify(tracks));
  }
}
