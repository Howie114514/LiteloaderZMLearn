const { ipcRenderer } = require("electron");
const { PluginManager } = require("../shared/pluginManager");

window.ipcRenderer = ipcRenderer;
document.addEventListener("keydown", (e) => {
  if (e.key.toUpperCase() == "F12") {
    ipcRenderer.send("ll-open-devtools");
  }
});

const { EventEmitter } = require("events");
const { VERSION } = require("../shared/constants");

let events = new EventEmitter();

function createMenuItem(txt, onclick) {
  let e = document.createElement("div");
  e.className = "person-center-menu";
  e.innerHTML = txt;
  e.onclick = onclick;
  return e;
}

HTMLElement.prototype.appendChild = new Proxy(
  HTMLElement.prototype.appendChild,
  {
    apply(t, ta, aa) {
      let canceled = false;
      if (aa[0].className == "person-tip iGdlgU") {
        console.log("菜单创建：", aa[0]);
        events.emit("menuCreated", aa[0]);
      } else {
        events.emit("elementRendered", {
          element: aa[0],
          cancel() {
            canceled = true;
          },
        });
      }
      return canceled ? aa[0] : t.apply(ta, aa);
    },
  }
);

module.exports = {
  manager: new PluginManager("renderer", { version: VERSION, events }),
};
module.exports.manager.loadAll();

let manager = module.exports.manager;
events.on("menuCreated", (e) => {
  e.appendChild(
    createMenuItem("LiteloaderZMLearn", () => {
      ipcRenderer.send("create-plugins-info-window");
    })
  );
});
