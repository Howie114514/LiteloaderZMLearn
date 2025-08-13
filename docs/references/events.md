# 事件列表

## 渲染进程
### elementRendered
##### 简介
在元素被添加到DOM时触发。使用event.cancel()取消。
##### 参数
```typescript
(event:{element:HTMLElement,cancel():void})
```

### menuCreated
##### 简介
在主页菜单被创建的时候触发。可用于向菜单中添加按钮
##### 参数
```typescript
(element:HTMLDivElement)
```