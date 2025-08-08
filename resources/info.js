//const { ipcRenderer } = require("electron");

function e(el, attr, ...children) {
  let element = document.createElement(el);
  Object.assign(element, attr);
  element.append(...children);
  return element;
}

(async () => {
  const { version, plugins } = await ipcRenderer.invoke("get-info");
  document.querySelector(".title").innerHTML = "LiteloaderZMLearn - " + version;
  plugins.forEach((plugin) => {
    document.querySelector(".plugins").append(
      e(
        "div",
        { className: "plugin" },
        plugin.icon
          ? e("img", {
              className: "plugin-icon",
              src: `plugin://${plugin.packageName}/${plugin.icon}`,
            })
          : "",
        e(
          "div",
          { className: "plugin-info" },
          e(
            "div",
            { className: "plugin-info-title" },
            e("h3", { innerHTML: plugin.name }),
            e("span", {
              innerHTML: "&nbsp;" + plugin.packageName + ":" + plugin.version,
            })
          ),
          e("p", { innerHTML: plugin.description })
        )
      )
    );
  });
})();
