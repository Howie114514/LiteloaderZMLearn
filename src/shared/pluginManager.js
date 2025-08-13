/**
 *
 * @typedef {"renderer"|"main"} EnvType
 *
 * @typedef {{
 *  version:string;
 * }} LoaderContext
 *
 * @typedef {{
 *  onload:(ctx:LoaderContext)=>void;
 *  ondisable:()=>void;
 * }} PluginContext
 *
 * @typedef {{
 *  name:string;
 *  description:string;
 *  version:string;
 *  author?:string;
 *  icon?:string;
 *  packageName:string;
 *  entry:{
 *    preload?:string;
 *    main?:string;
 *  };
 *  dependencies:string[];
 *  loaded:boolean;
 * }} PluginManifest
 */

const {
  readFileSync,
  readdirSync,
  statSync,
  existsSync,
  mkdirSync,
} = require("fs");
const path = require("path");
const { VERSION } = require("./constants");
const { sprintf } = require("sprintf-js");
const JSON = require("comment-json");

const pluginsPath = path.join(__dirname, "../plugins");
if (!existsSync(pluginsPath)) {
  mkdirSync(pluginsPath, { recursive: true });
}
module.exports.pluginPath = pluginsPath;

class PluginManager {
  /**
   * @param {EnvType} type
   * @param {LoaderContext} [ctx={version:VERSION}]
   */
  constructor(type, ctx = { version: VERSION }) {
    this.type = type;
    ctx.pluginManager = this;
    this.loaderContext = ctx;
    if (type == "main") {
      this.log = (...args) => {
        __non_webpack_require__(
          path.join(__dirname, "./LiteloaderZMLearn.node")
        ).print(sprintf(...args), "\n");
      };
    } else {
      this.log = console.log;
    }
  }
  /**
   * @type {LoaderContext}
   */
  loaderContext;
  /**
   * @type {EnvType}
   */
  type;
  /**
   * @type {{[x:string]:(PluginManifest&{context:PluginContext})}}
   */
  plugins = {};
  /**
   * @type {{[x:string]:string}}
   */
  pluginPaths = {};
  /**
   *
   * @param {PluginManifest&{context:PluginContext}} ctx
   * @param {string} pp
   */
  load(ctx, pp) {
    try {
      if (ctx.loaded) return;
      if (ctx.dependencies) {
        ctx.dependencies.forEach((dep) => {
          this.load(this.plugins[dep], this.pluginPaths[dep]);
        });
      }
      if (this.type == "main" && ctx.entry.main) {
        ctx.context = __non_webpack_require__(path.join(pp, ctx.entry.main));
      } else if (this.type == "renderer" && ctx.entry.preload) {
        ctx.context = __non_webpack_require__(path.join(pp, ctx.entry.preload));
      }
      ctx.context?.onload(this.loaderContext);
      this.log(
        "[LiteloaderZMLearn] 加载插件%s(%s:%s)完成",
        ctx.name,
        ctx.packageName,
        ctx.version
      );
    } catch (e) {
      this.log("[!] 在加载插件%s时出错:%s", pp, e);
    }
    ctx.loaded = true;
  }
  loadAll() {
    for (let p of readdirSync(pluginsPath)) {
      let pl = path.join(pluginsPath, p);
      if (statSync(pl).isDirectory()) {
        try {
          /**
           * @type {PluginManifest&{context:PluginContext}}
           */
          let ctx = JSON.parse(
            readFileSync(path.join(pl, "plugin.json")).toString()
          );

          if (!ctx.packageName?.match(/^[a-zA-Z0-9\-\.]+$/)) {
            throw "插件包名无效";
          }
          if (
            this.plugins[ctx.packageName] &&
            this.pluginPaths[ctx.packageName] != pl
          ) {
            throw `冲突的插件（包名相同）：${ctx.packageName}:${ctx.version}与${
              ctx.packageName
            }:${this.plugins[ctx.packageName].version}`;
          }
          if (this.plugins[ctx.packageName]) return;
          this.pluginPaths[ctx.packageName] = pl;
          this.plugins[ctx.packageName] = ctx;
          // @ts-ignore
        } catch (/** @type {Error}*/ e) {
          this.log("[!] 插件%s的plugin.json中存在错误:%s", pl, e);
        }
      }
    }
    for (let pluginPkg in this.plugins) {
      let plugin = this.plugins[pluginPkg];
      this.load(plugin, this.pluginPaths[pluginPkg]);
    }
  }
}

module.exports.PluginManager = PluginManager;
