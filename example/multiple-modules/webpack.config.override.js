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
    '<script crossorigin="anonymous" src="//axios.min.js"></script>',
    `<script crossorigin="anonymous" src="//lodash.min.js"></script>`
  ],
  injectStyle: [
    '<link rel="stylesheet" type="text/css" href="//global.f5c35c8eb11b875f.css" />',
    '<link rel="stylesheet" type="text/css" href="//theme.b478989e298790e0.css" />'
  ]
}