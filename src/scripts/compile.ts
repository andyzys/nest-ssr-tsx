const webpack = require("webpack");
const { merge } = require("webpack-merge");
const { getClientWebpack } = require("./config/index");
const path = require("path");
const fs = require("fs");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
import {
  CLIENT_BUILD_PATH,
  BUILD_TEMP_FOLDER_NAME,
  WEBPACK_MERGED_CONFIG_TMP,
  WEBPACK_EXTERNAL_CONFIG,
} from "../common/constant";
import { wrapClientConfig } from "./entry/util";

let compileWatcher: any = null;

function initTempFolder({ baseFolder }: any) {
  const tmpFolder = path.join(baseFolder, `./${BUILD_TEMP_FOLDER_NAME}`);
  if (!fs.existsSync(tmpFolder)) {
    fs.mkdirSync(tmpFolder);
  }
}

function clearTempFolder({ baseFolder }: any) {
  const tmpFolder = path.join(baseFolder, `./${BUILD_TEMP_FOLDER_NAME}`);
  if (fs.existsSync(tmpFolder)) {
    const files = fs.readdirSync(tmpFolder);
    for (let filePath of files) {
      fs.unlinkSync(path.join(tmpFolder, filePath));
    }
    fs.rmdirSync(tmpFolder);
  }
}

function storeResult(statJson: any, { baseFolder }: { baseFolder: string }) {
  const chunkMap = statJson.assetsByChunkName;
  let chunkPathMap: any = {};
  for (let entryKey in chunkMap) {
    const chunkList = chunkMap[entryKey];
    chunkPathMap[entryKey] = {};
    for (let chunkName of chunkList) {
      if (chunkName.indexOf(".js") !== -1) {
        chunkPathMap[entryKey]["js"] = path.join(
          baseFolder,
          CLIENT_BUILD_PATH,
          chunkName
        );
      } else if (chunkName.indexOf(".css") !== -1) {
        chunkPathMap[entryKey]["css"] = path.join(
          baseFolder,
          CLIENT_BUILD_PATH,
          chunkName
        );
      }
    }
  }
  fs.writeFileSync(
    path.join(baseFolder, CLIENT_BUILD_PATH, "buildInfo.json"),
    JSON.stringify(chunkPathMap, null, 4)
  );
}

function calcWebpackConfig({ baseFolder }: { baseFolder: string }) {
  let userConfig = {};
  initTempFolder({ baseFolder });
  const userWebpackConfigPath = path.join(
    baseFolder,
    `./${WEBPACK_EXTERNAL_CONFIG}`
  );
  const buildPath = path.join(baseFolder, CLIENT_BUILD_PATH);
  if (fs.existsSync(userWebpackConfigPath)) {
    try {
      userConfig = require(userWebpackConfigPath);
    } catch (e) {
      console.error(JSON.stringify(e));
    }
  }
  const defaultConfig = getClientWebpack({
    baseFolder: baseFolder,
    userConfig: userConfig,
  });
  const mergedConfig = merge(defaultConfig, userConfig);
  // 持久化后删除多余配置
  if (!fs.existsSync(buildPath)) {
    fs.mkdirSync(buildPath);
  }
  if (!fs.existsSync(path.join(baseFolder, CLIENT_BUILD_PATH))) {
    fs.mkdirSync(path.join(baseFolder, CLIENT_BUILD_PATH));
  }
  fs.writeFileSync(
    path.join(baseFolder, CLIENT_BUILD_PATH, WEBPACK_MERGED_CONFIG_TMP),
    JSON.stringify(mergedConfig, null, 4)
  );
  delete mergedConfig["injectStyle"];
  delete mergedConfig["injectScript"];
  delete mergedConfig["template"];
  delete mergedConfig["publicPath"];
  // 返回标准配置
  const wrapperMergedConfig = wrapClientConfig(mergedConfig, { baseFolder });
  return wrapperMergedConfig;
}

function buildClient({ analyze }: { analyze: boolean }) {
  const index = process.argv.indexOf("--folder");
  const baseFolder =
    index === -1
      ? `${process.cwd()}`
      : path.join(process.cwd(), process.argv[index + 1]);

  try {
    const wrapperMergedConfig = calcWebpackConfig({ baseFolder });
    if (analyze) {
      wrapperMergedConfig.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: "static",
        })
      );
    }
    const compiler = webpack(wrapperMergedConfig);
    compiler.run((err: any, stats: any) => {
      console.log(
        stats.toString({
          chunks: false, // 使构建过程更静默无输出
          colors: true, // 在控制台展示颜色
        })
      );
      storeResult(stats.toJson(), { baseFolder });
      compiler.close((closeErr: any) => {
        console.log("编译完毕");
        clearTempFolder({ baseFolder });
      });
    });
  } catch (e: any) {
    console.warn(e.message);
  }
}

function checkIsWatching() {
  if (compileWatcher) {
    return true;
  } else {
    false;
  }
}

function closeWatching() {
  if (compileWatcher) {
    compileWatcher.close();
    compileWatcher = null;
    console.log("watcher关闭成功");
  }
}

function watchClient() {
  const baseFolder = process.cwd();
  try {
    const wrapperMergedConfig = calcWebpackConfig({ baseFolder });
    const compiler = webpack(wrapperMergedConfig);
    if (checkIsWatching()) {
      console.log("存在历史watching，正在尝试关闭");
      closeWatching();
    }
    compileWatcher = compiler.watch(
      {
        aggregateTimeout: 300,
        poll: 300,
      },
      (err: any, stats: any) => {
        console.log(
          stats.toString({
            chunks: false, // 使构建过程更静默无输出
            colors: true, // 在控制台展示颜色
          })
        );
        storeResult(stats.toJson(), { baseFolder });
      }
    );
  } catch (e: any) {
    console.warn(e.message);
  }
}

export { buildClient, watchClient };
