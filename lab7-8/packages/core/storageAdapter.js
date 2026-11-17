// Контракт адаптера: ядро знає лише про load() і save(), а не про платформу.
export class TrackStorageAdapter {
  async load() {
    throw new Error("load() не реалізовано");
  }
  async save(tracks) {
    throw new Error("save() не реалізовано");
  }
}

// Адаптер у пам'яті: для тестів і прототипів, на диск нічого не пишеться.
export class MemoryStorageAdapter extends TrackStorageAdapter {
  constructor(initial = []) {
    super();
    this.data = [...initial];
  }
  async load() {
    return [...this.data];
  }
  async save(tracks) {
    this.data = [...tracks];
  }
}
