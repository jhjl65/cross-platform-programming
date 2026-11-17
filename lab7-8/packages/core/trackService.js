import { validateTrack } from "./trackValidation.js";
import { createTrack, sortTracksNewestFirst, filterTracksByQuery, toggleDownloaded, countDownloaded } from "./trackUtils.js";

// Сервіс працює з адаптером, який передано ззовні (впровадження залежності).
export class TrackService {
  #adapter;
  #counter = 0;
  #now;

  constructor(adapter, now = () => Date.now()) {
    this.#adapter = adapter;
    this.#now = now;
  }

  #nextId() {
    this.#counter += 1;
    return `${this.#now()}-${this.#counter}`;
  }

  async list(query = "") {
    const tracks = await this.#adapter.load();
    return filterTracksByQuery(sortTracksNewestFirst(tracks), query);
  }

  async add(input) {
    const check = validateTrack(input);
    if (!check.isValid) return { ok: false, error: check.error };
    const tracks = await this.#adapter.load();
    const track = createTrack(input, this.#nextId(), this.#now());
    await this.#adapter.save([track, ...tracks]);
    return { ok: true, track };
  }

  async toggle(id) {
    const tracks = await this.#adapter.load();
    if (!tracks.some((t) => t.id === id)) return { ok: false, error: "Трек не знайдено." };
    await this.#adapter.save(toggleDownloaded(tracks, id));
    return { ok: true };
  }

  async remove(id) {
    const tracks = await this.#adapter.load();
    if (!tracks.some((t) => t.id === id)) return { ok: false, error: "Трек не знайдено." };
    await this.#adapter.save(tracks.filter((t) => t.id !== id));
    return { ok: true };
  }

  async stats() {
    const tracks = await this.#adapter.load();
    return { total: tracks.length, downloaded: countDownloaded(tracks) };
  }
}
