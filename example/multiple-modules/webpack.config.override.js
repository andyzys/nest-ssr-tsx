const path = require("path")
const baseFolder = process.cwd()
module.exports = {
  // mode: "production",
  entry: {
    feature1: `${path.join(baseFolder, 'pages/feature1/index.tsx')}`,
    feature2: `${path.join(baseFolder, 'pages/feature2/index.tsx')}`,
  },
  externals: {
    xlsx: 'XLSX'
  },
  injectStyle: [
    '<link rel="stylesheet" href="https://alifd.alicdn.com/npm/@alilc/lowcode-engine@latest/dist/css/engine-core.css" />',
    '<link rel="stylesheet" href="https://alifd.alicdn.com/npm/@alifd/theme-lowcode-light/0.2.0/next.min.css">',
    '<link rel="stylesheet" href="https://alifd.alicdn.com/npm/@alilc/lowcode-engine-ext@latest/dist/css/engine-ext.css" />'
  ],
  injectScript: [
    // '<script crossorigin="anonymous" src="https://alifd.alicdn.com/npm/@alilc/lowcode-engine@latest/dist/js/engine-core.js"></script>',
    // '<script crossorigin="anonymous" src="https://alifd.alicdn.com/npm/@alilc/lowcode-engine-ext@latest/dist/js/engine-ext.js"></script>'
  ],
  // template: `
  //   <html lang="zh-CN" class="no-js">
  //     <head>
  //       <link rel="stylesheet" href="https://alifd.alicdn.com/npm/@alilc/lowcode-engine@latest/dist/css/engine-core.css" />
  //       <link rel="stylesheet" href="https://alifd.alicdn.com/npm/@alifd/theme-lowcode-light/0.2.0/next.min.css">
  //       <link rel="stylesheet" href="https://alifd.alicdn.com/npm/@alilc/lowcode-engine-ext@latest/dist/css/engine-ext.css" />

  //       <script crossorigin="anonymous" src="//f2.eckwai.com/udata/pkg/eshop/fangzhou/pub/pkg/react@17.0.2/umd/react.production.min.js"></script>
  //       <script crossorigin="anonymous" src="//f2.eckwai.com/udata/pkg/eshop/fangzhou/pub/pkg/react-dom@17.0.2/umd/react-dom.production.min.js"></script>
  //       <script crossorigin="anonymous" src="//f2.eckwai.com/udata/pkg/eshop/fangzhou/pub/pkg/mybricks/rxui-1.0.84/index.js"></script>
  //       <!-- CSS_MARKUP -->
  //     </head>
  //     <body>
  //       <!-- JS_MARKUP -->
  //     </body>
  //   </html>
  // `
}