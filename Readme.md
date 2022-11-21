# 介绍

在 nestjs 中使用 tsx 作为模板引擎，将通过 nestjs 处理的数据塞入到 tsx 的模板的中进行渲染。

安装：

```shell
npm i --save nestjs-tsx-render
```

## 基本用法

1. 在项目根目录下新建名为：`webpack.config.override.js` 的文件
   指定需要编译的前端入口：

```js
module.exports = {
  entry: {
    // 这里的key就是下面render时的name
    home: "/path/to/page/index",
  },
};
```

2. 配置后端模块

Module 中：

```tsx
import { Module } from "@nestjs/common";
import { TsxViewsModule } from "nestjs-tsx-render";
import XXXController from "./xxx.controller";

@Global()
@Module({
  imports: [
    TsxViewsModule.register({
      forRoutes: [XXXController],
    }),
  ],
  controllers: [XXXController],
  providers: [],
  exports: [],
})
export default class XXXModule {}
```

Controller:

```tsx
@Controller('')
export default class XXXController {
  @Get('/path/to/rote')
  @Render('home')
  home() {
    return (
      msg: '这是一条来自于服务端的消息'
    )
  }
}
```

3. 启动编译

前端：

```shell
# 前端编译
npx ntr build
# 或：前端编译（watch模式）
npx ntr build -w
```

后端：

```shell
# 一般借助nestjs cli
nest start --watch
```

## 高级用法

### 多入口

修改 webpack.config.override.js 文件

```js
module.exports = {
  entry: {
    // 这里的key就是下面render时的name
    home: "/path/to/page/index",
    home2: "/path/to/page/index2",
  },
};
```

在后端 controller 中即可：

```tsx
@Controller('')
export default class XXXController {
  @Get('/path/to/rote')
  @Render('home')
  home() {
    return (
      msg: '这是一条来自于服务端的消息'
    )
  }
  @Get('/path/to/rote2')
  @Render('home2')
  home() {
    return (
      msg: '这是一条来自于服务端的消息2'
    )
  }
}
```

### 往页面中资源

修改 webpack.config.override.js 文件

```js
{
  // 注入style
  injectStyle: [
    '<link rel="stylesheet" type="text/css" href="xxx.css" />',
  ],
  // 注入script
  injectScript: [
    '<script src="xxx.js"></script>'
  ]
}
```

### 修改 webpack 配置

修改 webpack.config.override.js 文件，直接添加你想修改的字段，内部采用的是 `webpack-merge`进行配置的合并

```js
{
  mode: process.env.NODE_ENV === 'dev' ? 'development' : 'production',
}
```

### splitChunks

修改 splitChunks 的生成规则，并指定 publicPath，目的是生成的静态资源前缀

```js
{
  publicPath: '/build/static/',
  optimization: {
    maxSize: 300 * 1000,
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          // 这里name必须是vendors
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
}

```

在 nestjs 的 APPModule 中指定静态目录：

```tsx
import { ServeStaticModule } from "@nestjs/serve-static";
@Module({
  imports: [
    ServeStaticModule.forRoot({
      // 这里的目录需要是构建生成的前端资源目录
      rootPath: path.join(__dirname, "..", "buildfe"),
      // 这里的值需要时上面配置的publicPath的值
      serveRoot: "/build/static/",
    }),
  ],
})
export class AppModule {}
```
