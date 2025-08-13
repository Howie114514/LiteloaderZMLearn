# 创建一个插件

首先打开LLZML安装目录下的plugins文件夹，在里面创建一个新的文件夹。用你喜欢的IDE打开这个文件夹，创建plugins.json，根据以下模板填写

```jsonc
{
  "name": "<名称>",
  //"author": "[作者]",
  "description": "<简介>",
  "version": "<版本>",
  /* 入口文件 */
  "entry": {
    "preload": "./src/preload.js", //可随你的渲染进程（网页内）代码路径改变，若没有渲染进程相关代码可省略
    "main":"./src/main.js" //可随你的主进程代码路径改变，若没有主进程相关代码可省略
  },
  "packageName": "<包名>",//必须为xx.xx的域名格式，例如com.example.exampleplugin
  //"icon": "[图标路径]",
  //dependencies:[] //依赖的包，这些包会在本包之前加载。内部每项都填写包名。
}
```
---
接下来根据上文plugin.json文件内entry中写的入口文件的相对路径创建入口文件，分别为主进程和渲染进程。

例：
preload中填的是`./src/preload.js`，则在`插件目录/src/`下创建preload.js
preload中填的是`./dist/preload.js`，则在`插件目录/dist/`下创建preload.js
main部分同理

> [!NOTE]
>
> 掌门1对1客户端使用非常老的Node 12和chrome 78，故不支持一部分新的js语法，如果你习惯了新的语法建议使用webpack一类的打包器配合babel将您的代码打包为旧版js（webpack配置文件中需要添加`externalsPresets: { node: true }`以使用node api）。在使用打包器的同时，请切记修改你的入口文件路径。


每一个入口文件都要严格遵守以下格式：
```javascript
module.exports = {
    onload(ctx){
        //启用时执行...
    }
    ondisable(){
        //禁用时执行...
    }
}
```

onload不同类型的入口文件的调用时机不同，渲染进程在页面加载前调用，可用于修改全局变量等操作。ctx参数被用于传递API。包含LiteloaderZMLearn内置的API和其他依赖库的API（编写依赖库时应该将api放到这个对象内）。

ondisable在程序终止时被调用。

---
# 插件调试技巧

创建完第一个插件后，你就可以开始插件开发之旅了！这里是一些有用的技巧与提示：

1. 你可以重载页面来刷新你的渲染进程部分
2. 你可以按下F12打开Devtools
3. 当你的插件出现问题时可以关注控制台窗口和Devtools内的日志。这会记录部分问题。
4. 在主进程部分用`ctx.log`代替`console.log`，这会将你的日志输出到控制台。
---
尽情享受开发吧！
