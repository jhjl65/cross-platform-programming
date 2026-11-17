const { contextBridge, ipcRenderer } = require("electron");

// Міст між сторінкою і головним процесом: лише чотири дозволені функції.
contextBridge.exposeInMainWorld("tracksAPI", {
  list: (query) => ipcRenderer.invoke("tracks:list", query),
  add: (input) => ipcRenderer.invoke("tracks:add", input),
  toggle: (id) => ipcRenderer.invoke("tracks:toggle", id),
  remove: (id) => ipcRenderer.invoke("tracks:remove", id),
});
