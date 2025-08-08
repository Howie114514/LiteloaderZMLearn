const { app, ipcMain, protocol, BrowserWindow } = require("electron");
const { PluginManager, pluginPath } = require("./shared/pluginManager");
const path = require("path");
const { URL } = require("url");
const { forIn } = require("lodash");
const { mkdirSync, writeFileSync } = require("fs");
const { VERSION } = require("./shared/constants");
const { execSync } = require("child_process");

/**@type {NativeAddon} */
const native = __non_webpack_require__(
  path.join(__dirname, "./LiteloaderZMLearn.node")
);

native.createConsole();

app.on("browser-window-created", (e, w) => {});

ipcMain.on("ll-relaunch", (e) => {
  app.relaunch();
  app.exit();
});

ipcMain.on("ll-reload", (e) => {
  e.sender.reload();
});

ipcMain.on("ll-open-devtools", (e) => {
  e.sender.openDevTools();
});

/**
 * @type {BrowserWindow}
 */
let infoWindow;

ipcMain.on("create-plugins-info-window", (e) => {
  if (infoWindow && !infoWindow.isDestroyed()) {
    infoWindow.show();
    return;
  }
  infoWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "../resources/info.preload.js"),
    },
  });
  infoWindow.loadFile(path.join(__dirname, "../resources/info.html"));
  infoWindow.show();
});

ipcMain.handle("get-info", (e) => {
  return {
    plugins: Object.values(manager.plugins),
    version: VERSION,
  };
});

ipcMain.on("open-plugins-folder", () => {
  execSync(`start ${pluginPath}`);
});

module.exports = { manager: new PluginManager("main") };
let manager = module.exports.manager;
manager.loadAll();

app.on("ready", () => {
  protocol.registerFileProtocol("plugin", (req, cb) => {
    try {
      let url = new URL(req.url);
      cb({
        path: path.join(manager.pluginPaths[url.host], "./" + url.pathname),
      });
    } catch (e) {
      native.print(e.stack);
      cb({
        error: -404,
        statusCode: 404,
      });
    }
  });
  protocol.registerFileProtocol("ll", (req, cb) => {
    cb({ path: path.join(__dirname, "resources", new URL(req.url).pathname) });
  });
});
