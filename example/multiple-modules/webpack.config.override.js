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
  injectScript: [
    '<script crossorigin="anonymous" src="//f2.eckwai.com/udata/pkg/eshop/fangzhou/pub/pkg/axios/axios.min.js"></script>',
    `<script crossorigin="anonymous" src="//f2.eckwai.com/udata/pkg/eshop/fangzhou/pub/pkg/lodash/4.17.21/lodash.min.js"></script>`
  ],
  injectStyle: [
    '<link rel="stylesheet" type="text/css" href="https://f2.eckwai.com/kos/nlav12333/fangzhou/pkg/global.f5c35c8eb11b875f.css" />',
    '<link rel="stylesheet" type="text/css" href="https://f2.eckwai.com/kos/nlav12333/fangzhou/pkg/theme.b478989e298790e0.css" />'
  ]
}