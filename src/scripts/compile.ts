const webpack = require('webpack')
const { getServerWebpack } = require('./config/index')
const path = require('path')
const fs = require('fs')


export const buildInfoPath = path.join(process.cwd(), './buildinfo.json');

function setBuildInfo(content: any) {
  fs.writeFileSync(
    buildInfoPath,
    content || ""
  );
}

function build() {
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
