import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { TrackService } from "@wavely/core";
import { FileStorageAdapter } from "./fileStorageAdapter.js";
import { createHandlers } from "./ipcHandlers.js";

// У модулях ES немає __dirname: теку файлу беремо з import.meta.url.
const here = path.dirname(fileURLToPath(import.meta.url));

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    title: "Wavely",
    webPreferences: {
      preload: path.join(here, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  win.loadFile(path.join(here, "renderer", "index.html"));
}

app.whenReady().then(() => {
  const adapter = new FileStorageAdapter(path.join(app.getPath("userData"), "tracks.json"));
  const handlers = createHandlers(new TrackService(adapter));
  ipcMain.handle("tracks:list", (_event, query) => handlers.list(query));
  ipcMain.handle("tracks:add", (_event, input) => handlers.add(input));
  ipcMain.handle("tracks:toggle", (_event, id) => handlers.toggle(id));
  ipcMain.handle("tracks:remove", (_event, id) => handlers.remove(id));
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
