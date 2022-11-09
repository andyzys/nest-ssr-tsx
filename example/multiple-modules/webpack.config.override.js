const path = require("path")
const baseFolder = process.cwd()
module.exports = {
  // mode: "production",
  entry: {
    // feature1: `${path.join(baseFolder, 'pages/feature1/index.tsx')}`,
    // feature2: `${path.join(baseFolder, 'pages/feature2/index.tsx')}`,
    home: `${path.join(baseFolder, 'pages/home/Home.tsx')}`,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  externals: {
    xlsx: 'XLSX'
  },
  publicPath: '/build/static/',
  injectStyle: [
    '<link rel="stylesheet" type="text/css" href="//f2.eckwai.com/udata/pkg/eshop/fangzhou/pub/pkg/antd-4.16.13/dist/antd.min.css"/>',
    '<link rel="stylesheet" href="https://alifd.alicdn.com/npm/@alilc/lowcode-engine@latest/dist/css/engine-core.css" />',
    '<link rel="stylesheet" href="https://alifd.alicdn.com/npm/@alifd/theme-lowcode-light/0.2.0/next.min.css">',
    '<link rel="stylesheet" href="https://alifd.alicdn.com/npm/@alilc/lowcode-engine-ext@latest/dist/css/engine-ext.css" />'
  ],
  injectScript: [
    '<script crossorigin="anonymous" src="//f2.eckwai.com/udata/pkg/eshop/fangzhou/pub/pkg/react@17.0.2/umd/react.production.min.js"></script>',
    '<script crossorigin="anonymous" src="//f2.eckwai.com/udata/pkg/eshop/fangzhou/pub/pkg/react-dom@17.0.2/umd/react-dom.production.min.js"></script>',
    '<script crossorigin="anonymous" src="//f2.eckwai.com/udata/pkg/eshop/fangzhou/pub/pkg/antd-4.16.13/dist/antd.min.js"></script>',
    '<script crossorigin="anonymous" src="//f2.eckwai.com/udata/pkg/eshop/fangzhou/pub/pkg/mybricks/rxui-1.0.84/index.js"></script>',
    '<script crossorigin="anonymous" src="//f2.eckwai.com/udata/pkg/eshop/fangzhou/pub/pkg/compiler-js/0.0.15/index.min.js"></script>',
    '<script crossorigin="anonymous" src="//f2.eckwai.com/kos/nlav12333/fangzhou/pkg/xlsx.full.min.80e1ddf43c5aa310.js"></script>',
    '<script crossorigin="anonymous" src="//f2.eckwai.com/udata/pkg/eshop/fangzhou/pub/pkg/dayjs-1.10.7/dayjs.min.js"></script>',
    '<script crossorigin="anonymous" src="//f2.eckwai.com/udata/pkg/eshop/fangzhou/pub/pkg/axios/axios.min.js"></script>',
    // '<script crossorigin="anonymous" src="https://alifd.alicdn.com/npm/@alilc/lowcode-engine@latest/dist/js/engine-core.js"></script>',
    // '<script crossorigin="anonymous" src="https://alifd.alicdn.com/npm/@alilc/lowcode-engine-ext@latest/dist/js/engine-ext.js"></script>'
    '<script crossorigin="anonymous" src="/static/vendors.js"></script>',
  ],
  // renderMode: 'rxui',
  // template: `
  // <html lang="zh-CN" class="no-js">
  //   <head>
  //     <link rel="stylesheet" href="https://alifd.alicdn.com/npm/@alilc/lowcode-engine@latest/dist/css/engine-core.css" />
  //     <link rel="stylesheet" href="https://g.alicdn.com/code/lib/alifd__next/1.23.24/next.min.css">
  //     <link rel="stylesheet" href="https://alifd.alicdn.com/npm/@alifd/theme-lowcode-light/0.2.0/next.min.css">
  //     <link rel="stylesheet" href="https://alifd.alicdn.com/npm/@alilc/lowcode-engine-ext@latest/dist/css/engine-ext.css" />
  //     <script crossorigin="anonymous" src="//f2.eckwai.com/udata/pkg/eshop/fangzhou/pub/pkg/react@17.0.2/umd/react.production.min.js"></script>
  //     <script crossorigin="anonymous" src="//f2.eckwai.com/udata/pkg/eshop/fangzhou/pub/pkg/react-dom@17.0.2/umd/react-dom.production.min.js"></script>
  //     <script crossorigin="anonymous" src="//f2.eckwai.com/udata/pkg/eshop/fangzhou/pub/pkg/mybricks/rxui-1.0.84/index.js"></script>
  //     <script crossorigin="anonymous" src="https://g.alicdn.com/code/lib/prop-types/15.7.2/prop-types.js"></script>
  //     <script crossorigin="anonymous" src="https://g.alicdn.com/code/lib/moment.js/2.29.1/moment-with-locales.min.js"></script>
  //     <script crossorigin="anonymous" src="https://g.alicdn.com/code/lib/alifd__next/1.23.24/next.min.js"></script>
  //     <script crossorigin="anonymous" src="https://g.alicdn.com/platform/c/lodash/4.6.1/lodash.min.js"></script>
  //     <script crossorigin="anonymous" src="https://alifd.alicdn.com/npm/@alilc/lowcode-engine@latest/dist/js/engine-core.js"></script>
  //     <script crossorigin="anonymous" src="https://alifd.alicdn.com/npm/@alilc/lowcode-engine-ext@latest/dist/js/engine-ext.js"></script>
  //     <!-- CSS_MARKUP -->
  //   </head>
  //   <body>
  //     <!-- JS_MARKUP -->
  //   </body>
  // </html>
  // `
}