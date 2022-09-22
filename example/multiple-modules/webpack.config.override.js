const path = require("path")
const baseFolder = process.cwd()
module.exports = {
  entry: {
    feature1: `${path.join(baseFolder, 'pages/feature1/index.tsx')}`,
    feature2: `${path.join(baseFolder, 'pages/feature2/index.tsx')}`,
  }
}