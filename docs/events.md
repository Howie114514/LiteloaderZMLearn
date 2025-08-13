# 订阅和上报事件

[创建一个插件](./create.md)中讲到了入口函数中ctx参数的作用。这里细讲内置事件API的使用方法。

事件API是一个EventEmitter对象，通过ctx.events获得。

订阅事件：
```javascript
ctx.events.on("事件",(/*参数*/)=>{
    //处理
});
```

上报事件：
```javascript
ctx.events.emit("事件",/*参数*/);
```

示例：
```javascript
module.exports = {
    onload(ctx){
        ctx.events.on("menuCreated",(e)=>{
            e.append("Hello World!")
        })
    }
    ondisable(){
        //...
    }
}
```

# 参考

- [内置事件](./references/events.md)