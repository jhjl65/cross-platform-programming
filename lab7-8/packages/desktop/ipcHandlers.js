import { formatDateLabel } from "@wavely/core";

const BAD_DATA = "Некоректні дані.";

// Обробники IPC: перевіряють типи даних з рендер-процесу і викликають сервіс ядра.
export function createHandlers(service) {
  return {
    async list(query) {
      if (query !== undefined && typeof query !== "string") return [];
      const tracks = await service.list(query ?? "");
      return tracks.map((t) => ({ ...t, dateLabel: formatDateLabel(t.createdAt) }));
    },
    async add(input) {
      if (!input || typeof input !== "object") return { ok: false, error: BAD_DATA };
      return service.add(input);
    },
    async toggle(id) {
      if (typeof id !== "string") return { ok: false, error: BAD_DATA };
      return service.toggle(id);
    },
    async remove(id) {
      if (typeof id !== "string") return { ok: false, error: BAD_DATA };
      return service.remove(id);
    },
  };
}
