const { ipcRenderer } = require("electron");

window.ipcRenderer = ipcRenderer;

document.addEventListener("keydown", (e) => {
  if (e.key.toUpperCase() == "F12") {
    ipcRenderer.send("ll-open-devtools");
  }
});
