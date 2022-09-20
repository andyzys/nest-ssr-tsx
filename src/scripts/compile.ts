const webpack = require('webpack')
const { getServerWebpack } = require('./config/index')
const path = require('path')
const fs = require('fs')
import { SERVER_BUILD_PATH } from '../common/constant'

export const buildInfoPath = path.join(process.cwd(), './buildinfo.json');

function setBuildInfo(content: any) {
  fs.writeFileSync(
    buildInfoPath,
    content || ""
  );
}

function build() {
  const index = process.argv.indexOf('--folder')
  const baseFolder = index === -1 ? `${process.cwd()}/src` : process.argv[index + 1]
  console.log(`开始编译，编译目录是：${baseFolder}`)
  try {
    const compiler = webpack(getServerWebpack({
      baseFolder: baseFolder
    }));
    compiler.run((err: any, stats: any) => {
      console.log(stats.toString({
        chunks: false,  // 使构建过程更静默无输出
        colors: true    // 在控制台展示颜色
      }))
      const statJson = stats.toJson()
      const chunkMap = statJson.assetsByChunkName
      const buildInfoStr = fs.readFileSync(path.join(baseFolder, 'buildInfo.json'), 'utf8') || '{}'
      const buildInfoMap = JSON.parse(buildInfoStr)
      for(let uiBaseFolderPath in buildInfoMap) {
        const fileObj = buildInfoMap[uiBaseFolderPath]
        const sourcePath = uiBaseFolderPath
        const chunkList = chunkMap[fileObj.fileName]
        for(let i=0; i<chunkList.length; i++) {
          const chunkName = chunkList[i]
          const chunkNameChunks = chunkName.split('.')
          const destName = chunkNameChunks[0] + '.' + chunkNameChunks[chunkNameChunks.length - 1]
          fs.copyFileSync(path.join(baseFolder, SERVER_BUILD_PATH, chunkName), path.join(sourcePath, destName))
        }
      }
      compiler.close((closeErr: any) => {
        console.log('编译完毕')
      });
    });
  } catch (e: any) {
    console.warn(e.message);
  }
}

function watch() {
  let prevHash = "";
  try {
    console.log('开始编译')
    const compiler = webpack(getServerWebpack());
    compiler.watch({
      aggregateTimeout: 300,
      poll: 300,
    }, (e: any, s: any) => {
      const curHash = s.toJson().hash;
      if (curHash === prevHash) return;
      prevHash = curHash;

      if (e) {
        console.warn(e.message);
        console.log('webpack 构建 e 错误')
        return;
      }
      if (s.hasErrors() && s.compilation.errors[0]) {
        console.log(s.compilation.errors[0].message)
      }

      let chunkMap = s.toJson().assetsByChunkName;
      let jsChunkMap: any = {};
      for (let name in chunkMap) {
        let output = chunkMap[name];

        if (typeof chunkMap[name] === 'string') {
          output = [].concat(output)
        }

        if (Array.isArray(output)) {
          let css = output.filter(
            name => name.search(/\.css$/) !== -1
          );
          let js = output.filter(
            name => name.search(/\.js$/) !== -1
          );

          css = css.length ? css[0] : "";
          js = js.length ? js[0] : "";

          jsChunkMap[name] = {
            css,
            js
          };
        }
      }

      setBuildInfo(JSON.stringify(jsChunkMap));

      console.log(s.toString({
        modules: false,
        colors: true,
        chunks: false,
        assets: true,
        assetsSort: "field",
        builtAt: true,
        cached: false,
        cachedAssets: false,
        children: false,
        chunkGroups: true,
        chunkModules: false,
        chunkOrigins: false,
        moduleTrace: false,
        performance: true,
        providedExports: false,
        publicPath: false,
        reasons: false,
        source: false,
        entrypoints: false,
        warnings: false,
      }));

    })
  } catch (e: any) {
    console.warn(e.message);
  }
}

build()
