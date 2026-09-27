// vite.config.ts
import path4 from "node:path";
import process4 from "node:process";
import Uni from "file:///E:/code/lijunxi/temp/resume/resume-app/node_modules/.pnpm/@uni-helper+plugin-uni@0.1._fe03c02a1160deabfb3d9f02af170b74/node_modules/@uni-helper/plugin-uni/src/index.js";
import { isMpWeixin } from "file:///E:/code/lijunxi/temp/resume/resume-app/node_modules/.pnpm/@uni-helper+uni-env@0.1.8/node_modules/@uni-helper/uni-env/dist/index.mjs";
import UniComponents from "file:///E:/code/lijunxi/temp/resume/resume-app/node_modules/.pnpm/@uni-helper+vite-plugin-uni-components@0.2.3_rollup@4.50.0/node_modules/@uni-helper/vite-plugin-uni-components/dist/index.mjs";
import UniLayouts from "file:///E:/code/lijunxi/temp/resume/resume-app/node_modules/.pnpm/@uni-helper+vite-plugin-uni-layouts@0.1.11_rollup@4.50.0/node_modules/@uni-helper/vite-plugin-uni-layouts/dist/index.mjs";
import UniManifest from "file:///E:/code/lijunxi/temp/resume/resume-app/node_modules/.pnpm/@uni-helper+vite-plugin-uni_b7102077f951b1fa858da63d5b249eff/node_modules/@uni-helper/vite-plugin-uni-manifest/dist/index.mjs";
import UniPages from "file:///E:/code/lijunxi/temp/resume/resume-app/node_modules/.pnpm/@uni-helper+vite-plugin-uni_cd9ba3e492c24fc35093810ecb91b5e8/node_modules/@uni-helper/vite-plugin-uni-pages/dist/index.mjs";
import UniPlatform from "file:///E:/code/lijunxi/temp/resume/resume-app/node_modules/.pnpm/@uni-helper+vite-plugin-uni-platform@0.0.5/node_modules/@uni-helper/vite-plugin-uni-platform/dist/index.mjs";
import UniOptimization from "file:///E:/code/lijunxi/temp/resume/resume-app/node_modules/.pnpm/@uni-ku+bundle-optimizer@1._29287b8402e2986acd9ba4043cc3e4ff/node_modules/@uni-ku/bundle-optimizer/dist/index.mjs";
import UniKuRoot from "file:///E:/code/lijunxi/temp/resume/resume-app/node_modules/.pnpm/@uni-ku+root@1.4.1_vite@5.2_c98d1e71c3e60fdb9cb7ea5871768afd/node_modules/@uni-ku/root/dist/index.mjs";
import dayjs from "file:///E:/code/lijunxi/temp/resume/resume-app/node_modules/.pnpm/dayjs@1.11.10/node_modules/dayjs/dayjs.min.js";
import { visualizer } from "file:///E:/code/lijunxi/temp/resume/resume-app/node_modules/.pnpm/rollup-plugin-visualizer@6.0.3_rollup@4.50.0/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import UnoCSS from "file:///E:/code/lijunxi/temp/resume/resume-app/node_modules/.pnpm/unocss@66.0.0_postcss@8.5.6_af9bf1e4400dcfd6fd9128b4178fe385/node_modules/unocss/dist/vite.mjs";
import AutoImport from "file:///E:/code/lijunxi/temp/resume/resume-app/node_modules/.pnpm/unplugin-auto-import@20.1.0/node_modules/unplugin-auto-import/dist/vite.js";
import { defineConfig, loadEnv } from "file:///E:/code/lijunxi/temp/resume/resume-app/node_modules/.pnpm/vite@5.2.8_@types+node@20.1_bef83caec11c45248f87cbd2a57274e5/node_modules/vite/dist/node/index.js";
import ViteRestart from "file:///E:/code/lijunxi/temp/resume/resume-app/node_modules/.pnpm/vite-plugin-restart@1.0.0_v_83e9d72230742d2bf7be141d7e414c62/node_modules/vite-plugin-restart/dist/index.js";
import { defineTypesPlugin } from "file:///E:/code/lijunxi/temp/resume/resume-app/node_modules/.pnpm/vite-plugin-define-types-dt_fbb671aae19d802b0df78049abd0bf63/node_modules/vite-plugin-define-types-dts/dist/index.mjs";

// scripts/open-dev-tools.js
import { exec } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
function _openDevTools(env = "dev", options = {}) {
  const { wechatDevtoolsCliPath } = options;
  const platform = process.platform;
  const { UNI_PLATFORM } = process.env;
  const uniPlatformText = UNI_PLATFORM === "mp-weixin" ? "\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F" : UNI_PLATFORM === "mp-alipay" ? "\u652F\u4ED8\u5B9D\u5C0F\u7A0B\u5E8F" : UNI_PLATFORM === "mp-lark" ? "\u6296\u97F3\u5C0F\u7A0B\u5E8F" : "\u5C0F\u7A0B\u5E8F";
  const outputDir = env === "build" ? `dist/build/${UNI_PLATFORM}` : `dist/dev/${UNI_PLATFORM}`;
  const projectPath = path.resolve(process.cwd(), outputDir);
  if (!fs.existsSync(projectPath)) {
    console.log(`\u274C ${uniPlatformText}\u6784\u5EFA\u76EE\u5F55\u4E0D\u5B58\u5728:`, projectPath);
    return;
  }
  console.log(`\u{1F680} \u6B63\u5728\u6253\u5F00${uniPlatformText}\u5F00\u53D1\u8005\u5DE5\u5177...`);
  let command = "";
  if (platform === "darwin") {
    if (UNI_PLATFORM === "mp-weixin") {
      const cliPath = wechatDevtoolsCliPath || "/Applications/wechatwebdevtools.app/Contents/MacOS/cli";
      command = `"${cliPath}" open --project "${projectPath}"`;
    } else if (UNI_PLATFORM === "mp-alipay") {
      command = `/Applications/\u5C0F\u7A0B\u5E8F\u5F00\u53D1\u8005\u5DE5\u5177.app/Contents/MacOS/\u5C0F\u7A0B\u5E8F\u5F00\u53D1\u8005\u5DE5\u5177 --p "${projectPath}"`;
    } else if (UNI_PLATFORM === "mp-lark") {
      command = `/Applications/\u6296\u97F3\u5F00\u53D1\u8005\u5DE5\u5177.app/Contents/MacOS/\u6296\u97F3\u5F00\u53D1\u8005\u5DE5\u5177 --p "${projectPath}"`;
    }
  } else if (platform === "win32" || platform === "win64") {
    if (UNI_PLATFORM === "mp-weixin") {
      const cliPath = wechatDevtoolsCliPath || "C:\\Program Files (x86)\\Tencent\\\u5FAE\u4FE1web\u5F00\u53D1\u8005\u5DE5\u5177\\cli.bat";
      command = `"${cliPath}" open --project "${projectPath}"`;
    }
  } else {
    console.log("\u274C \u5F53\u524D\u7CFB\u7EDF\u4E0D\u652F\u6301\u81EA\u52A8\u6253\u5F00\u5FAE\u4FE1\u5F00\u53D1\u8005\u5DE5\u5177");
    return;
  }
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log(`\u274C \u6253\u5F00${uniPlatformText}\u5F00\u53D1\u8005\u5DE5\u5177\u5931\u8D25:`, error.message);
      if (UNI_PLATFORM === "mp-weixin") {
        console.log("\u{1F4A1} \u5F53\u524D\u4F7F\u7528\u7684\u5FAE\u4FE1\u5F00\u53D1\u8005\u5DE5\u5177 CLI \u547D\u4EE4:", command);
        console.log("\u{1F4A1} \u5982\u679C\u5B89\u88C5\u4F4D\u7F6E\u4E0D\u540C\uFF0C\u53EF\u4EE5\u5728 env/.env \u914D\u7F6E WECHAT_DEVTOOLS_CLI_PATH \u4E3A\u672C\u673A\u5B9E\u9645 CLI \u8DEF\u5F84");
      }
      console.log(`\u{1F4A1} \u8BF7\u786E\u4FDD${uniPlatformText}\u5F00\u53D1\u8005\u5DE5\u5177\u670D\u52A1\u7AEF\u53E3\u5DF2\u542F\u7528`);
      console.log(`\u{1F4A1} \u53EF\u4EE5\u624B\u52A8\u6253\u5F00${uniPlatformText}\u5F00\u53D1\u8005\u5DE5\u5177\u5E76\u5BFC\u5165\u9879\u76EE:`, projectPath);
      return;
    }
    if (stderr) {
      console.log("\u26A0\uFE0F \u8B66\u544A:", stderr);
    }
    console.log(`\u2705 ${uniPlatformText}\u5F00\u53D1\u8005\u5DE5\u5177\u5DF2\u6253\u5F00`);
    if (stdout) {
      console.log(stdout);
    }
  });
}
function openDevTools(options = {}) {
  const { mode = "development", wechatDevtoolsCliPath } = options;
  const env = mode === "production" ? "build" : "dev";
  let isFirstBuild = true;
  return {
    name: "uni-devtools",
    writeBundle() {
      if (isFirstBuild && process.env.UNI_PLATFORM?.includes("mp")) {
        isFirstBuild = false;
        _openDevTools(env, { wechatDevtoolsCliPath });
      }
    }
  };
}

// scripts/vite-plugin-eruda.js
function vitePluginEruda(options = {}) {
  const { open = true, erudaOptions = {}, erudaUrl = "https://cdn.jsdelivr.net/npm/eruda" } = options;
  return {
    name: "vite-plugin-eruda",
    transformIndexHtml(html) {
      const tags = [
        {
          tag: "script",
          attrs: {
            src: erudaUrl
          },
          injectTo: "head"
        },
        {
          tag: "script",
          children: `eruda.init(${JSON.stringify(erudaOptions)});`,
          injectTo: "head"
        }
      ];
      if (!open) {
        return html;
      }
      return { html, tags };
    }
  };
}

// vite-plugins/copy-native-resources.ts
import path2 from "node:path";
import process2 from "node:process";
import fs2 from "file:///E:/code/lijunxi/temp/resume/resume-app/node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/index.js";
var DEFAULT_OPTIONS = {
  enable: true,
  sourceDir: "nativeplugins",
  targetDirName: "nativeplugins",
  verbose: true,
  logPrefix: "[copy-native-resources]"
};
function copyNativeResources(options = {}) {
  const config = { ...DEFAULT_OPTIONS, ...options };
  if (!config.enable) {
    return {
      name: "copy-native-resources-disabled",
      apply: "build",
      writeBundle() {
      }
    };
  }
  return {
    name: "copy-native-resources",
    apply: "build",
    // 只在构建时应用
    enforce: "post",
    // 在其他插件执行完毕后执行
    async writeBundle() {
      const { sourceDir, targetDirName, verbose, logPrefix } = config;
      try {
        const projectRoot = process2.cwd();
        const sourcePath = path2.resolve(projectRoot, sourceDir);
        const buildMode = process2.env.NODE_ENV === "production" ? "build" : "dev";
        const platform = process2.env.UNI_PLATFORM || "app";
        const targetPath = path2.resolve(
          projectRoot,
          "dist",
          buildMode,
          platform,
          targetDirName
        );
        const sourceExists = await fs2.pathExists(sourcePath);
        if (!sourceExists) {
          if (verbose) {
            console.warn(`${logPrefix} \u6E90\u76EE\u5F55\u4E0D\u5B58\u5728\uFF0C\u8DF3\u8FC7\u590D\u5236\u64CD\u4F5C`);
            console.warn(`${logPrefix} \u6E90\u76EE\u5F55\u8DEF\u5F84: ${sourcePath}`);
            console.warn(`${logPrefix} \u5982\u9700\u4F7F\u7528\u672C\u5730\u539F\u751F\u63D2\u4EF6\uFF0C\u8BF7\u5728\u9879\u76EE\u6839\u76EE\u5F55\u521B\u5EFA nativeplugins \u76EE\u5F55`);
            console.warn(`${logPrefix} \u5E76\u6309\u7167\u5B98\u65B9\u6587\u6863\u653E\u5165\u539F\u751F\u63D2\u4EF6\u6587\u4EF6`);
            console.warn(`${logPrefix} \u53C2\u8003: https://uniapp.dcloud.net.cn/plugin/native-plugin.html`);
          }
          return;
        }
        const sourceFiles = await fs2.readdir(sourcePath);
        if (sourceFiles.length === 0) {
          if (verbose) {
            console.warn(`${logPrefix} \u6E90\u76EE\u5F55\u4E3A\u7A7A\uFF0C\u8DF3\u8FC7\u590D\u5236\u64CD\u4F5C`);
            console.warn(`${logPrefix} \u6E90\u76EE\u5F55\u8DEF\u5F84: ${sourcePath}`);
            console.warn(`${logPrefix} \u8BF7\u5728 nativeplugins \u76EE\u5F55\u4E2D\u653E\u5165\u539F\u751F\u63D2\u4EF6\u6587\u4EF6`);
          }
          return;
        }
        await fs2.ensureDir(targetPath);
        if (verbose) {
          console.log(`${logPrefix} \u5F00\u59CB\u590D\u5236 UniApp \u672C\u5730\u539F\u751F\u63D2\u4EF6...`);
          console.log(`${logPrefix} \u6E90\u76EE\u5F55: ${sourcePath}`);
          console.log(`${logPrefix} \u76EE\u6807\u76EE\u5F55: ${targetPath}`);
          console.log(`${logPrefix} \u6784\u5EFA\u6A21\u5F0F: ${buildMode}`);
          console.log(`${logPrefix} \u76EE\u6807\u5E73\u53F0: ${platform}`);
          console.log(`${logPrefix} \u53D1\u73B0 ${sourceFiles.length} \u4E2A\u539F\u751F\u63D2\u4EF6\u6587\u4EF6/\u76EE\u5F55`);
        }
        await fs2.copy(sourcePath, targetPath, {
          overwrite: true,
          // 覆盖已存在的文件，确保使用最新版本
          errorOnExist: false,
          // 如果目标文件存在不报错
          preserveTimestamps: true
          // 保持文件的时间戳
        });
        console.log(`${logPrefix} \u2705 UniApp \u672C\u5730\u539F\u751F\u63D2\u4EF6\u590D\u5236\u5B8C\u6210: ${sourcePath} -> ${targetPath}`);
        console.log(`${logPrefix} \u5DF2\u6210\u529F\u590D\u5236 ${sourceFiles.length} \u4E2A\u6587\u4EF6/\u76EE\u5F55\u5230\u6784\u5EFA\u76EE\u5F55`);
      } catch (error) {
        console.error(`${config.logPrefix} \u274C \u590D\u5236 UniApp \u672C\u5730\u539F\u751F\u63D2\u4EF6\u5931\u8D25:`, error);
        console.error(`${config.logPrefix} \u9519\u8BEF\u8BE6\u60C5:`, error instanceof Error ? error.message : String(error));
        console.error(`${config.logPrefix} \u8BF7\u68C0\u67E5\u6E90\u76EE\u5F55\u6743\u9650\u548C\u78C1\u76D8\u7A7A\u95F4`);
      }
    }
  };
}
function createCopyNativeResourcesPlugin(enable = true, options = {}) {
  return copyNativeResources({ enable, ...options });
}

// vite-plugins/sync-manifest-plugins.ts
import fs3 from "node:fs";
import path3 from "node:path";
import process3 from "node:process";
function syncManifestPlugin() {
  return {
    name: "sync-manifest",
    apply: "build",
    enforce: "post",
    writeBundle: {
      order: "post",
      handler() {
        const srcManifestPath = path3.resolve(process3.cwd(), "./src/manifest.json");
        const distAppPath = path3.resolve(process3.cwd(), "./dist/dev/app/manifest.json");
        try {
          const srcManifest = JSON.parse(fs3.readFileSync(srcManifestPath, "utf8"));
          const distAppDir = path3.dirname(distAppPath);
          if (!fs3.existsSync(distAppDir)) {
            fs3.mkdirSync(distAppDir, { recursive: true });
          }
          let distManifest = {};
          if (fs3.existsSync(distAppPath)) {
            distManifest = JSON.parse(fs3.readFileSync(distAppPath, "utf8"));
          }
          if (srcManifest["app-plus"]?.distribute?.plugins) {
            if (!distManifest.plus)
              distManifest.plus = {};
            if (!distManifest.plus.distribute)
              distManifest.plus.distribute = {};
            distManifest.plus.distribute.plugins = srcManifest["app-plus"].distribute.plugins;
            fs3.writeFileSync(distAppPath, JSON.stringify(distManifest, null, 2));
            console.log("\u2705 Manifest plugins \u540C\u6B65\u6210\u529F");
          }
        } catch (error) {
          console.error("\u274C \u540C\u6B65 manifest plugins \u5931\u8D25:", error);
        }
      }
    }
  };
}

// vite.config.ts
var vite_config_default = defineConfig(({ command, mode }) => {
  console.log("command, mode -> ", command, mode);
  const { UNI_PLATFORM, SKIP_OPEN_DEVTOOLS } = process4.env;
  console.log("UNI_PLATFORM -> ", UNI_PLATFORM);
  const envDir = path4.resolve(process4.cwd(), "env");
  const env = loadEnv(mode, envDir);
  const localEnv = loadEnv(mode, envDir, "");
  const {
    VITE_APP_PORT,
    VITE_SERVER_BASEURL,
    VITE_APP_TITLE,
    VITE_DELETE_CONSOLE,
    VITE_APP_PUBLIC_BASE,
    VITE_APP_PROXY_ENABLE,
    VITE_APP_PROXY_PREFIX,
    VITE_COPY_NATIVE_RES_ENABLE
  } = env;
  const { WECHAT_DEVTOOLS_CLI_PATH } = localEnv;
  console.log("\u73AF\u5883\u53D8\u91CF env -> ", env);
  return defineConfig({
    envDir: "./env",
    // 自定义env目录
    base: VITE_APP_PUBLIC_BASE,
    plugins: [
      // UniXXX 需要在 Uni 之前引入
      UniLayouts(),
      UniPlatform(),
      UniManifest(),
      UniComponents({
        extensions: ["vue"],
        deep: true,
        // 是否递归扫描子目录，
        directoryAsNamespace: false,
        // 是否把目录名作为命名空间前缀，true 时组件名为 目录名+组件名，
        dts: "src/types/components.d.ts"
        // 自动生成的组件类型声明文件路径（用于 TypeScript 支持）
      }),
      UniPages({
        exclude: ["**/components/**/**.*", "**/sections/**/**.*"],
        // pages 目录为 src/pages，分包目录不能配置在pages目录下！！
        // 是个数组，可以配置多个，但是不能为pages里面的目录！！
        // "src/pages-demo" 是unibest demo 预留的，方便后续插入demo示例
        subPackages: ["src/pages-demo"],
        dts: "src/types/uni-pages.d.ts"
      }),
      // UniOptimization 插件需要 page.json 文件，故应在 UniPages 插件之后执行
      UniOptimization({
        enable: isMpWeixin,
        dts: {
          base: "src/types"
        },
        logger: false
      }),
      // 若存在改变 pages.json 的插件，请将 UniKuRoot 放置其后
      UniKuRoot({
        excludePages: ["**/components/**/**.*", "**/sections/**/**.*"]
      }),
      Uni(),
      {
        // 临时解决 dcloudio 官方的 @dcloudio/uni-mp-compiler 出现的编译 BUG
        // 参考 github issue: https://github.com/dcloudio/uni-app/issues/4952
        // 自定义插件禁用 vite:vue 插件的 devToolsEnabled，强制编译 vue 模板时 inline 为 true
        name: "fix-vite-plugin-vue",
        configResolved(config) {
          const plugin = config.plugins.find((p) => p.name === "vite:vue");
          if (plugin && plugin.api && plugin.api.options) {
            plugin.api.options.devToolsEnabled = false;
          }
        }
      },
      UnoCSS(),
      AutoImport({
        imports: ["vue", "uni-app"],
        dts: "src/types/auto-import.d.ts",
        dirs: ["src/hooks"],
        // 自动导入 hooks
        vueTemplate: true
        // default false
      }),
      ViteRestart({
        // 通过这个插件，在修改vite.config.js文件则不需要重新运行也生效配置
        restart: ["vite.config.js"]
      }),
      // h5环境增加 BUILD_TIME 和 BUILD_BRANCH
      UNI_PLATFORM === "h5" && {
        name: "html-transform",
        transformIndexHtml(html) {
          return html.replace("%BUILD_TIME%", dayjs().format("YYYY-MM-DD HH:mm:ss")).replace("%VITE_APP_TITLE%", VITE_APP_TITLE);
        }
      },
      // 打包分析插件，h5 + 生产环境才弹出
      UNI_PLATFORM === "h5" && mode === "production" && visualizer({
        filename: "./node_modules/.cache/visualizer/stats.html",
        open: true,
        gzipSize: true,
        brotliSize: true
      }),
      // 原生插件资源复制插件 - 仅在 app 平台且启用时生效
      createCopyNativeResourcesPlugin(
        UNI_PLATFORM === "app" && VITE_COPY_NATIVE_RES_ENABLE === "true",
        {
          verbose: mode === "development"
          // 开发模式显示详细日志
        }
      ),
      syncManifestPlugin(),
      vitePluginEruda({
        open: UNI_PLATFORM === "h5" && mode === "development"
      }),
      // 自动打开开发者工具插件 (必须修改 .env 文件中的 VITE_WX_APPID)
      // 上传时通过 SKIP_OPEN_DEVTOOLS=true 跳过
      SKIP_OPEN_DEVTOOLS !== "true" && openDevTools({
        mode,
        wechatDevtoolsCliPath: WECHAT_DEVTOOLS_CLI_PATH
      }),
      // 自动生成vite的define配置的类型声明文件
      // outputPath: 声明文件的输出路径
      // apply: 插件生效阶段 可选serve或build (默认值：serve 开发环境)
      // 具体参考：https://npmx.dev/package/vite-plugin-define-types-dts#user-content-api
      defineTypesPlugin({
        outputPath: "src/types/auto-vite-define-types.d.ts"
      })
    ],
    define: {
      __VITE_APP_PROXY__: VITE_APP_PROXY_ENABLE
    },
    css: {
      postcss: {
        plugins: [
          // autoprefixer({
          //   // 指定目标浏览器
          //   overrideBrowserslist: ['> 1%', 'last 2 versions'],
          // }),
        ]
      }
    },
    resolve: {
      alias: {
        "@": path4.join(process4.cwd(), "./src"),
        "@img": path4.join(process4.cwd(), "./src/static/images")
      }
    },
    server: {
      host: "0.0.0.0",
      hmr: true,
      port: Number.parseInt(VITE_APP_PORT, 10),
      // 仅 H5 端生效，其他端不生效（其他端走build，不走devServer)
      proxy: JSON.parse(VITE_APP_PROXY_ENABLE) ? {
        [VITE_APP_PROXY_PREFIX]: {
          target: VITE_SERVER_BASEURL,
          changeOrigin: true,
          // 后端有/api前缀则不做处理，没有则需要去掉
          rewrite: (path5) => path5.replace(new RegExp(`^${VITE_APP_PROXY_PREFIX}`), "")
        }
      } : void 0
    },
    esbuild: {
      drop: VITE_DELETE_CONSOLE === "true" ? ["console", "debugger"] : []
    },
    build: {
      sourcemap: false,
      // 方便非h5端调试
      // sourcemap: VITE_SHOW_SOURCEMAP === 'true', // 默认是false
      target: "es6",
      // 开发环境不用压缩
      minify: mode === "development" ? false : "esbuild"
    }
  });
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic2NyaXB0cy9vcGVuLWRldi10b29scy5qcyIsICJzY3JpcHRzL3ZpdGUtcGx1Z2luLWVydWRhLmpzIiwgInZpdGUtcGx1Z2lucy9jb3B5LW5hdGl2ZS1yZXNvdXJjZXMudHMiLCAidml0ZS1wbHVnaW5zL3N5bmMtbWFuaWZlc3QtcGx1Z2lucy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkU6XFxcXGNvZGVcXFxcbGlqdW54aVxcXFx0ZW1wXFxcXHJlc3VtZVxcXFxyZXN1bWUtYXBwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFxjb2RlXFxcXGxpanVueGlcXFxcdGVtcFxcXFxyZXN1bWVcXFxccmVzdW1lLWFwcFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovY29kZS9saWp1bnhpL3RlbXAvcmVzdW1lL3Jlc3VtZS1hcHAvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcGF0aCBmcm9tICdub2RlOnBhdGgnXHJcbmltcG9ydCBwcm9jZXNzIGZyb20gJ25vZGU6cHJvY2VzcydcclxuaW1wb3J0IFVuaSBmcm9tICdAdW5pLWhlbHBlci9wbHVnaW4tdW5pJ1xyXG5pbXBvcnQgeyBpc01wV2VpeGluIH0gZnJvbSAnQHVuaS1oZWxwZXIvdW5pLWVudidcclxuaW1wb3J0IFVuaUNvbXBvbmVudHMgZnJvbSAnQHVuaS1oZWxwZXIvdml0ZS1wbHVnaW4tdW5pLWNvbXBvbmVudHMnXHJcbi8vIEBzZWUgaHR0cHM6Ly91bmktaGVscGVyLmpzLm9yZy92aXRlLXBsdWdpbi11bmktbGF5b3V0c1xyXG5pbXBvcnQgVW5pTGF5b3V0cyBmcm9tICdAdW5pLWhlbHBlci92aXRlLXBsdWdpbi11bmktbGF5b3V0cydcclxuLy8gQHNlZSBodHRwczovL2dpdGh1Yi5jb20vdW5pLWhlbHBlci92aXRlLXBsdWdpbi11bmktbWFuaWZlc3RcclxuaW1wb3J0IFVuaU1hbmlmZXN0IGZyb20gJ0B1bmktaGVscGVyL3ZpdGUtcGx1Z2luLXVuaS1tYW5pZmVzdCdcclxuLy8gQHNlZSBodHRwczovL3VuaS1oZWxwZXIuanMub3JnL3ZpdGUtcGx1Z2luLXVuaS1wYWdlc1xyXG5pbXBvcnQgVW5pUGFnZXMgZnJvbSAnQHVuaS1oZWxwZXIvdml0ZS1wbHVnaW4tdW5pLXBhZ2VzJ1xyXG4vLyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS91bmktaGVscGVyL3ZpdGUtcGx1Z2luLXVuaS1wbGF0Zm9ybVxyXG4vLyBcdTk3MDBcdTg5ODFcdTRFMEUgQHVuaS1oZWxwZXIvdml0ZS1wbHVnaW4tdW5pLXBhZ2VzIFx1NjNEMlx1NEVGNlx1NEUwMFx1OEQ3N1x1NEY3Rlx1NzUyOFxyXG5pbXBvcnQgVW5pUGxhdGZvcm0gZnJvbSAnQHVuaS1oZWxwZXIvdml0ZS1wbHVnaW4tdW5pLXBsYXRmb3JtJ1xyXG5cclxuLyoqXHJcbiAqIFx1NTIwNlx1NTMwNVx1NEYxOFx1NTMxNlx1MzAwMVx1NkEyMVx1NTc1N1x1NUYwMlx1NkI2NVx1OERFOFx1NTMwNVx1OEMwM1x1NzUyOFx1MzAwMVx1N0VDNFx1NEVGNlx1NUYwMlx1NkI2NVx1OERFOFx1NTMwNVx1NUYxNVx1NzUyOFxyXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS91bmkta3UvYnVuZGxlLW9wdGltaXplclxyXG4gKi9cclxuaW1wb3J0IFVuaU9wdGltaXphdGlvbiBmcm9tICdAdW5pLWt1L2J1bmRsZS1vcHRpbWl6ZXInXHJcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS91bmkta3Uvcm9vdFxyXG5pbXBvcnQgVW5pS3VSb290IGZyb20gJ0B1bmkta3Uvcm9vdCdcclxuaW1wb3J0IGRheWpzIGZyb20gJ2RheWpzJ1xyXG5pbXBvcnQgeyB2aXN1YWxpemVyIH0gZnJvbSAncm9sbHVwLXBsdWdpbi12aXN1YWxpemVyJ1xyXG5pbXBvcnQgVW5vQ1NTIGZyb20gJ3Vub2Nzcy92aXRlJ1xyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgVml0ZVJlc3RhcnQgZnJvbSAndml0ZS1wbHVnaW4tcmVzdGFydCdcclxuLyoqXHJcbiAqIFx1ODFFQVx1NTJBOFx1NzUxRlx1NjIxMHZpdGVcdTc2ODRkZWZpbmVcdTkxNERcdTdGNkVcdTc2ODRcdTdDN0JcdTU3OEJcdTU4RjBcdTY2MEVcdTY1ODdcdTRFRjZcclxuICogQHNlZSBodHRwczovL25wbXguZGV2L3BhY2thZ2Uvdml0ZS1wbHVnaW4tZGVmaW5lLXR5cGVzLWR0c1xyXG4gKi9cclxuaW1wb3J0IHsgZGVmaW5lVHlwZXNQbHVnaW4gfSBmcm9tICd2aXRlLXBsdWdpbi1kZWZpbmUtdHlwZXMtZHRzJ1xyXG5pbXBvcnQgb3BlbkRldlRvb2xzIGZyb20gJy4vc2NyaXB0cy9vcGVuLWRldi10b29scydcclxuaW1wb3J0IHZpdGVQbHVnaW5FcnVkYSBmcm9tICcuL3NjcmlwdHMvdml0ZS1wbHVnaW4tZXJ1ZGEnXHJcbmltcG9ydCB7IGNyZWF0ZUNvcHlOYXRpdmVSZXNvdXJjZXNQbHVnaW4gfSBmcm9tICcuL3ZpdGUtcGx1Z2lucy9jb3B5LW5hdGl2ZS1yZXNvdXJjZXMnXHJcbmltcG9ydCBzeW5jTWFuaWZlc3RQbHVnaW4gZnJvbSAnLi92aXRlLXBsdWdpbnMvc3luYy1tYW5pZmVzdC1wbHVnaW5zJ1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IGNvbW1hbmQsIG1vZGUgfSkgPT4ge1xyXG4gIC8vIEBzZWUgaHR0cHM6Ly91bm9jc3MuZGV2L1xyXG4gIC8vIGNvbnN0IFVub0NTUyA9IChhd2FpdCBpbXBvcnQoJ3Vub2Nzcy92aXRlJykpLmRlZmF1bHRcclxuICAvLyBjb25zb2xlLmxvZyhtb2RlID09PSBwcm9jZXNzLmVudi5OT0RFX0VOVikgLy8gdHJ1ZVxyXG5cclxuICAvLyBtb2RlOiBcdTUzM0FcdTUyMDZcdTc1MUZcdTRFQTdcdTczQUZcdTU4ODNcdThGRDhcdTY2MkZcdTVGMDBcdTUzRDFcdTczQUZcdTU4ODNcclxuICBjb25zb2xlLmxvZygnY29tbWFuZCwgbW9kZSAtPiAnLCBjb21tYW5kLCBtb2RlKVxyXG4gIC8vIHBucG0gZGV2Omg1IFx1NjVGNlx1NUY5N1x1NTIzMCA9PiBzZXJ2ZSBkZXZlbG9wbWVudFxyXG4gIC8vIHBucG0gYnVpbGQ6aDUgXHU2NUY2XHU1Rjk3XHU1MjMwID0+IGJ1aWxkIHByb2R1Y3Rpb25cclxuICAvLyBwbnBtIGRldjptcC13ZWl4aW4gXHU2NUY2XHU1Rjk3XHU1MjMwID0+IGJ1aWxkIGRldmVsb3BtZW50IChcdTZDRThcdTYxMEZcdTUzM0FcdTUyMkJcdUZGMENjb21tYW5kXHU0RTNBYnVpbGQpXHJcbiAgLy8gcG5wbSBidWlsZDptcC13ZWl4aW4gXHU2NUY2XHU1Rjk3XHU1MjMwID0+IGJ1aWxkIHByb2R1Y3Rpb25cclxuICAvLyBwbnBtIGRldjphcHAgXHU2NUY2XHU1Rjk3XHU1MjMwID0+IGJ1aWxkIGRldmVsb3BtZW50IChcdTZDRThcdTYxMEZcdTUzM0FcdTUyMkJcdUZGMENjb21tYW5kXHU0RTNBYnVpbGQpXHJcbiAgLy8gcG5wbSBidWlsZDphcHAgXHU2NUY2XHU1Rjk3XHU1MjMwID0+IGJ1aWxkIHByb2R1Y3Rpb25cclxuICAvLyBkZXYgXHU1NDhDIGJ1aWxkIFx1NTQ3RFx1NEVFNFx1NTNFRlx1NEVFNVx1NTIwNlx1NTIyQlx1NEY3Rlx1NzUyOCAuZW52LmRldmVsb3BtZW50IFx1NTQ4QyAuZW52LnByb2R1Y3Rpb24gXHU3Njg0XHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXHJcbiAgLy8gXHU5NzVFIEg1IFx1N0FFRiBkZXYgXHU0RTVGXHU2NjJGIGJ1aWxkIGNvbW1hbmRcdUZGMENcdTY3MDBcdTdFQzhcdTUyQTBcdThGN0RcdTU0RUFcdTRFMkEgZW52IFx1NjU4N1x1NEVGNlx1NEVFNVx1NUI5RVx1OTY0NSBtb2RlIFx1NEUzQVx1NTFDNlx1MzAwMlxyXG5cclxuICBjb25zdCB7IFVOSV9QTEFURk9STSwgU0tJUF9PUEVOX0RFVlRPT0xTIH0gPSBwcm9jZXNzLmVudlxyXG4gIGNvbnNvbGUubG9nKCdVTklfUExBVEZPUk0gLT4gJywgVU5JX1BMQVRGT1JNKSAvLyBcdTVGOTdcdTUyMzAgbXAtd2VpeGluLCBoNSwgYXBwIFx1N0I0OVxyXG5cclxuICBjb25zdCBlbnZEaXIgPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgJ2VudicpXHJcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBlbnZEaXIpXHJcbiAgY29uc3QgbG9jYWxFbnYgPSBsb2FkRW52KG1vZGUsIGVudkRpciwgJycpXHJcbiAgY29uc3Qge1xyXG4gICAgVklURV9BUFBfUE9SVCxcclxuICAgIFZJVEVfU0VSVkVSX0JBU0VVUkwsXHJcbiAgICBWSVRFX0FQUF9USVRMRSxcclxuICAgIFZJVEVfREVMRVRFX0NPTlNPTEUsXHJcbiAgICBWSVRFX0FQUF9QVUJMSUNfQkFTRSxcclxuICAgIFZJVEVfQVBQX1BST1hZX0VOQUJMRSxcclxuICAgIFZJVEVfQVBQX1BST1hZX1BSRUZJWCxcclxuICAgIFZJVEVfQ09QWV9OQVRJVkVfUkVTX0VOQUJMRSxcclxuICB9ID0gZW52XHJcbiAgY29uc3QgeyBXRUNIQVRfREVWVE9PTFNfQ0xJX1BBVEggfSA9IGxvY2FsRW52XHJcbiAgY29uc29sZS5sb2coJ1x1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRiBlbnYgLT4gJywgZW52KVxyXG5cclxuICByZXR1cm4gZGVmaW5lQ29uZmlnKHtcclxuICAgIGVudkRpcjogJy4vZW52JywgLy8gXHU4MUVBXHU1QjlBXHU0RTQ5ZW52XHU3NkVFXHU1RjU1XHJcbiAgICBiYXNlOiBWSVRFX0FQUF9QVUJMSUNfQkFTRSxcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgLy8gVW5pWFhYIFx1OTcwMFx1ODk4MVx1NTcyOCBVbmkgXHU0RTRCXHU1MjREXHU1RjE1XHU1MTY1XHJcbiAgICAgIFVuaUxheW91dHMoKSxcclxuICAgICAgVW5pUGxhdGZvcm0oKSxcclxuICAgICAgVW5pTWFuaWZlc3QoKSxcclxuICAgICAgVW5pQ29tcG9uZW50cyh7XHJcbiAgICAgICAgZXh0ZW5zaW9uczogWyd2dWUnXSxcclxuICAgICAgICBkZWVwOiB0cnVlLCAvLyBcdTY2MkZcdTU0MjZcdTkwMTJcdTVGNTJcdTYyNkJcdTYzQ0ZcdTVCNTBcdTc2RUVcdTVGNTVcdUZGMENcclxuICAgICAgICBkaXJlY3RvcnlBc05hbWVzcGFjZTogZmFsc2UsIC8vIFx1NjYyRlx1NTQyNlx1NjI4QVx1NzZFRVx1NUY1NVx1NTQwRFx1NEY1Q1x1NEUzQVx1NTQ3RFx1NTQwRFx1N0E3QVx1OTVGNFx1NTI0RFx1N0YwMFx1RkYwQ3RydWUgXHU2NUY2XHU3RUM0XHU0RUY2XHU1NDBEXHU0RTNBIFx1NzZFRVx1NUY1NVx1NTQwRCtcdTdFQzRcdTRFRjZcdTU0MERcdUZGMENcclxuICAgICAgICBkdHM6ICdzcmMvdHlwZXMvY29tcG9uZW50cy5kLnRzJywgLy8gXHU4MUVBXHU1MkE4XHU3NTFGXHU2MjEwXHU3Njg0XHU3RUM0XHU0RUY2XHU3QzdCXHU1NzhCXHU1OEYwXHU2NjBFXHU2NTg3XHU0RUY2XHU4REVGXHU1Rjg0XHVGRjA4XHU3NTI4XHU0RThFIFR5cGVTY3JpcHQgXHU2NTJGXHU2MzAxXHVGRjA5XHJcbiAgICAgIH0pLFxyXG4gICAgICBVbmlQYWdlcyh7XHJcbiAgICAgICAgZXhjbHVkZTogWycqKi9jb21wb25lbnRzLyoqLyoqLionLCAnKiovc2VjdGlvbnMvKiovKiouKiddLFxyXG4gICAgICAgIC8vIHBhZ2VzIFx1NzZFRVx1NUY1NVx1NEUzQSBzcmMvcGFnZXNcdUZGMENcdTUyMDZcdTUzMDVcdTc2RUVcdTVGNTVcdTRFMERcdTgwRkRcdTkxNERcdTdGNkVcdTU3MjhwYWdlc1x1NzZFRVx1NUY1NVx1NEUwQlx1RkYwMVx1RkYwMVxyXG4gICAgICAgIC8vIFx1NjYyRlx1NEUyQVx1NjU3MFx1N0VDNFx1RkYwQ1x1NTNFRlx1NEVFNVx1OTE0RFx1N0Y2RVx1NTkxQVx1NEUyQVx1RkYwQ1x1NEY0Nlx1NjYyRlx1NEUwRFx1ODBGRFx1NEUzQXBhZ2VzXHU5MUNDXHU5NzYyXHU3Njg0XHU3NkVFXHU1RjU1XHVGRjAxXHVGRjAxXHJcbiAgICAgICAgLy8gXCJzcmMvcGFnZXMtZGVtb1wiIFx1NjYyRnVuaWJlc3QgZGVtbyBcdTk4ODRcdTc1NTlcdTc2ODRcdUZGMENcdTY1QjlcdTRGQkZcdTU0MEVcdTdFRURcdTYzRDJcdTUxNjVkZW1vXHU3OTNBXHU0RjhCXHJcbiAgICAgICAgc3ViUGFja2FnZXM6IFsnc3JjL3BhZ2VzLWRlbW8nXSxcclxuICAgICAgICBkdHM6ICdzcmMvdHlwZXMvdW5pLXBhZ2VzLmQudHMnLFxyXG4gICAgICB9KSxcclxuICAgICAgLy8gVW5pT3B0aW1pemF0aW9uIFx1NjNEMlx1NEVGNlx1OTcwMFx1ODk4MSBwYWdlLmpzb24gXHU2NTg3XHU0RUY2XHVGRjBDXHU2NTQ1XHU1RTk0XHU1NzI4IFVuaVBhZ2VzIFx1NjNEMlx1NEVGNlx1NEU0Qlx1NTQwRVx1NjI2N1x1ODg0Q1xyXG4gICAgICBVbmlPcHRpbWl6YXRpb24oe1xyXG4gICAgICAgIGVuYWJsZTogaXNNcFdlaXhpbixcclxuICAgICAgICBkdHM6IHtcclxuICAgICAgICAgIGJhc2U6ICdzcmMvdHlwZXMnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbG9nZ2VyOiBmYWxzZSxcclxuICAgICAgfSksXHJcbiAgICAgIC8vIFx1ODJFNVx1NUI1OFx1NTcyOFx1NjUzOVx1NTNEOCBwYWdlcy5qc29uIFx1NzY4NFx1NjNEMlx1NEVGNlx1RkYwQ1x1OEJGN1x1NUMwNiBVbmlLdVJvb3QgXHU2NTNFXHU3RjZFXHU1MTc2XHU1NDBFXHJcbiAgICAgIFVuaUt1Um9vdCh7XHJcbiAgICAgICAgZXhjbHVkZVBhZ2VzOiBbJyoqL2NvbXBvbmVudHMvKiovKiouKicsICcqKi9zZWN0aW9ucy8qKi8qKi4qJ10sXHJcbiAgICAgIH0pLFxyXG4gICAgICBVbmkoKSxcclxuICAgICAge1xyXG4gICAgICAgIC8vIFx1NEUzNFx1NjVGNlx1ODlFM1x1NTFCMyBkY2xvdWRpbyBcdTVCOThcdTY1QjlcdTc2ODQgQGRjbG91ZGlvL3VuaS1tcC1jb21waWxlciBcdTUxRkFcdTczQjBcdTc2ODRcdTdGMTZcdThCRDEgQlVHXHJcbiAgICAgICAgLy8gXHU1M0MyXHU4MDAzIGdpdGh1YiBpc3N1ZTogaHR0cHM6Ly9naXRodWIuY29tL2RjbG91ZGlvL3VuaS1hcHAvaXNzdWVzLzQ5NTJcclxuICAgICAgICAvLyBcdTgxRUFcdTVCOUFcdTRFNDlcdTYzRDJcdTRFRjZcdTc5ODFcdTc1Mjggdml0ZTp2dWUgXHU2M0QyXHU0RUY2XHU3Njg0IGRldlRvb2xzRW5hYmxlZFx1RkYwQ1x1NUYzQVx1NTIzNlx1N0YxNlx1OEJEMSB2dWUgXHU2QTIxXHU2NzdGXHU2NUY2IGlubGluZSBcdTRFM0EgdHJ1ZVxyXG4gICAgICAgIG5hbWU6ICdmaXgtdml0ZS1wbHVnaW4tdnVlJyxcclxuICAgICAgICBjb25maWdSZXNvbHZlZChjb25maWcpIHtcclxuICAgICAgICAgIGNvbnN0IHBsdWdpbiA9IGNvbmZpZy5wbHVnaW5zLmZpbmQocCA9PiBwLm5hbWUgPT09ICd2aXRlOnZ1ZScpXHJcbiAgICAgICAgICBpZiAocGx1Z2luICYmIHBsdWdpbi5hcGkgJiYgcGx1Z2luLmFwaS5vcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHBsdWdpbi5hcGkub3B0aW9ucy5kZXZUb29sc0VuYWJsZWQgPSBmYWxzZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIFVub0NTUygpLFxyXG4gICAgICBBdXRvSW1wb3J0KHtcclxuICAgICAgICBpbXBvcnRzOiBbJ3Z1ZScsICd1bmktYXBwJ10sXHJcbiAgICAgICAgZHRzOiAnc3JjL3R5cGVzL2F1dG8taW1wb3J0LmQudHMnLFxyXG4gICAgICAgIGRpcnM6IFsnc3JjL2hvb2tzJ10sIC8vIFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NSBob29rc1xyXG4gICAgICAgIHZ1ZVRlbXBsYXRlOiB0cnVlLCAvLyBkZWZhdWx0IGZhbHNlXHJcbiAgICAgIH0pLFxyXG4gICAgICBWaXRlUmVzdGFydCh7XHJcbiAgICAgICAgLy8gXHU5MDFBXHU4RkM3XHU4RkQ5XHU0RTJBXHU2M0QyXHU0RUY2XHVGRjBDXHU1NzI4XHU0RkVFXHU2NTM5dml0ZS5jb25maWcuanNcdTY1ODdcdTRFRjZcdTUyMTlcdTRFMERcdTk3MDBcdTg5ODFcdTkxQ0RcdTY1QjBcdThGRDBcdTg4NENcdTRFNUZcdTc1MUZcdTY1NDhcdTkxNERcdTdGNkVcclxuICAgICAgICByZXN0YXJ0OiBbJ3ZpdGUuY29uZmlnLmpzJ10sXHJcbiAgICAgIH0pLFxyXG4gICAgICAvLyBoNVx1NzNBRlx1NTg4M1x1NTg5RVx1NTJBMCBCVUlMRF9USU1FIFx1NTQ4QyBCVUlMRF9CUkFOQ0hcclxuICAgICAgVU5JX1BMQVRGT1JNID09PSAnaDUnICYmIHtcclxuICAgICAgICBuYW1lOiAnaHRtbC10cmFuc2Zvcm0nLFxyXG4gICAgICAgIHRyYW5zZm9ybUluZGV4SHRtbChodG1sKSB7XHJcbiAgICAgICAgICByZXR1cm4gaHRtbFxyXG4gICAgICAgICAgICAucmVwbGFjZSgnJUJVSUxEX1RJTUUlJywgZGF5anMoKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW06c3MnKSlcclxuICAgICAgICAgICAgLnJlcGxhY2UoJyVWSVRFX0FQUF9USVRMRSUnLCBWSVRFX0FQUF9USVRMRSlcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICAvLyBcdTYyNTNcdTUzMDVcdTUyMDZcdTY3OTBcdTYzRDJcdTRFRjZcdUZGMENoNSArIFx1NzUxRlx1NEVBN1x1NzNBRlx1NTg4M1x1NjI0RFx1NUYzOVx1NTFGQVxyXG4gICAgICBVTklfUExBVEZPUk0gPT09ICdoNSdcclxuICAgICAgJiYgbW9kZSA9PT0gJ3Byb2R1Y3Rpb24nXHJcbiAgICAgICYmIHZpc3VhbGl6ZXIoe1xyXG4gICAgICAgIGZpbGVuYW1lOiAnLi9ub2RlX21vZHVsZXMvLmNhY2hlL3Zpc3VhbGl6ZXIvc3RhdHMuaHRtbCcsXHJcbiAgICAgICAgb3BlbjogdHJ1ZSxcclxuICAgICAgICBnemlwU2l6ZTogdHJ1ZSxcclxuICAgICAgICBicm90bGlTaXplOiB0cnVlLFxyXG4gICAgICB9KSxcclxuICAgICAgLy8gXHU1MzlGXHU3NTFGXHU2M0QyXHU0RUY2XHU4RDQ0XHU2RTkwXHU1OTBEXHU1MjM2XHU2M0QyXHU0RUY2IC0gXHU0RUM1XHU1NzI4IGFwcCBcdTVFNzNcdTUzRjBcdTRFMTRcdTU0MkZcdTc1MjhcdTY1RjZcdTc1MUZcdTY1NDhcclxuICAgICAgY3JlYXRlQ29weU5hdGl2ZVJlc291cmNlc1BsdWdpbihcclxuICAgICAgICBVTklfUExBVEZPUk0gPT09ICdhcHAnICYmIFZJVEVfQ09QWV9OQVRJVkVfUkVTX0VOQUJMRSA9PT0gJ3RydWUnLFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHZlcmJvc2U6IG1vZGUgPT09ICdkZXZlbG9wbWVudCcsIC8vIFx1NUYwMFx1NTNEMVx1NkEyMVx1NUYwRlx1NjYzRVx1NzkzQVx1OEJFNlx1N0VDNlx1NjVFNVx1NUZEN1xyXG4gICAgICAgIH0sXHJcbiAgICAgICksXHJcbiAgICAgIHN5bmNNYW5pZmVzdFBsdWdpbigpLFxyXG4gICAgICB2aXRlUGx1Z2luRXJ1ZGEoe1xyXG4gICAgICAgIG9wZW46IFVOSV9QTEFURk9STSA9PT0gJ2g1JyAmJiBtb2RlID09PSAnZGV2ZWxvcG1lbnQnLFxyXG4gICAgICB9KSxcclxuICAgICAgLy8gXHU4MUVBXHU1MkE4XHU2MjUzXHU1RjAwXHU1RjAwXHU1M0QxXHU4MDA1XHU1REU1XHU1MTc3XHU2M0QyXHU0RUY2IChcdTVGQzVcdTk4N0JcdTRGRUVcdTY1MzkgLmVudiBcdTY1ODdcdTRFRjZcdTRFMkRcdTc2ODQgVklURV9XWF9BUFBJRClcclxuICAgICAgLy8gXHU0RTBBXHU0RjIwXHU2NUY2XHU5MDFBXHU4RkM3IFNLSVBfT1BFTl9ERVZUT09MUz10cnVlIFx1OERGM1x1OEZDN1xyXG4gICAgICBTS0lQX09QRU5fREVWVE9PTFMgIT09ICd0cnVlJyAmJiBvcGVuRGV2VG9vbHMoe1xyXG4gICAgICAgIG1vZGUsXHJcbiAgICAgICAgd2VjaGF0RGV2dG9vbHNDbGlQYXRoOiBXRUNIQVRfREVWVE9PTFNfQ0xJX1BBVEgsXHJcbiAgICAgIH0pLFxyXG4gICAgICAvLyBcdTgxRUFcdTUyQThcdTc1MUZcdTYyMTB2aXRlXHU3Njg0ZGVmaW5lXHU5MTREXHU3RjZFXHU3Njg0XHU3QzdCXHU1NzhCXHU1OEYwXHU2NjBFXHU2NTg3XHU0RUY2XHJcbiAgICAgIC8vIG91dHB1dFBhdGg6IFx1NThGMFx1NjYwRVx1NjU4N1x1NEVGNlx1NzY4NFx1OEY5M1x1NTFGQVx1OERFRlx1NUY4NFxyXG4gICAgICAvLyBhcHBseTogXHU2M0QyXHU0RUY2XHU3NTFGXHU2NTQ4XHU5NjM2XHU2QkI1IFx1NTNFRlx1OTAwOXNlcnZlXHU2MjE2YnVpbGQgKFx1OUVEOFx1OEJBNFx1NTAzQ1x1RkYxQXNlcnZlIFx1NUYwMFx1NTNEMVx1NzNBRlx1NTg4MylcclxuICAgICAgLy8gXHU1MTc3XHU0RjUzXHU1M0MyXHU4MDAzXHVGRjFBaHR0cHM6Ly9ucG14LmRldi9wYWNrYWdlL3ZpdGUtcGx1Z2luLWRlZmluZS10eXBlcy1kdHMjdXNlci1jb250ZW50LWFwaVxyXG4gICAgICBkZWZpbmVUeXBlc1BsdWdpbih7XHJcbiAgICAgICAgb3V0cHV0UGF0aDogJ3NyYy90eXBlcy9hdXRvLXZpdGUtZGVmaW5lLXR5cGVzLmQudHMnLFxyXG4gICAgICB9KSxcclxuICAgIF0sXHJcbiAgICBkZWZpbmU6IHtcclxuICAgICAgX19WSVRFX0FQUF9QUk9YWV9fOiBWSVRFX0FQUF9QUk9YWV9FTkFCTEUsXHJcbiAgICB9LFxyXG4gICAgY3NzOiB7XHJcbiAgICAgIHBvc3Rjc3M6IHtcclxuICAgICAgICBwbHVnaW5zOiBbXHJcbiAgICAgICAgICAvLyBhdXRvcHJlZml4ZXIoe1xyXG4gICAgICAgICAgLy8gICAvLyBcdTYzMDdcdTVCOUFcdTc2RUVcdTY4MDdcdTZENEZcdTg5QzhcdTU2NjhcclxuICAgICAgICAgIC8vICAgb3ZlcnJpZGVCcm93c2Vyc2xpc3Q6IFsnPiAxJScsICdsYXN0IDIgdmVyc2lvbnMnXSxcclxuICAgICAgICAgIC8vIH0pLFxyXG4gICAgICAgIF0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG5cclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgYWxpYXM6IHtcclxuICAgICAgICAnQCc6IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnLi9zcmMnKSxcclxuICAgICAgICAnQGltZyc6IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnLi9zcmMvc3RhdGljL2ltYWdlcycpLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHNlcnZlcjoge1xyXG4gICAgICBob3N0OiAnMC4wLjAuMCcsXHJcbiAgICAgIGhtcjogdHJ1ZSxcclxuICAgICAgcG9ydDogTnVtYmVyLnBhcnNlSW50KFZJVEVfQVBQX1BPUlQsIDEwKSxcclxuICAgICAgLy8gXHU0RUM1IEg1IFx1N0FFRlx1NzUxRlx1NjU0OFx1RkYwQ1x1NTE3Nlx1NEVENlx1N0FFRlx1NEUwRFx1NzUxRlx1NjU0OFx1RkYwOFx1NTE3Nlx1NEVENlx1N0FFRlx1OEQ3MGJ1aWxkXHVGRjBDXHU0RTBEXHU4RDcwZGV2U2VydmVyKVxyXG4gICAgICBwcm94eTogSlNPTi5wYXJzZShWSVRFX0FQUF9QUk9YWV9FTkFCTEUpXHJcbiAgICAgICAgPyB7XHJcbiAgICAgICAgICAgIFtWSVRFX0FQUF9QUk9YWV9QUkVGSVhdOiB7XHJcbiAgICAgICAgICAgICAgdGFyZ2V0OiBWSVRFX1NFUlZFUl9CQVNFVVJMLFxyXG4gICAgICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAvLyBcdTU0MEVcdTdBRUZcdTY3MDkvYXBpXHU1MjREXHU3RjAwXHU1MjE5XHU0RTBEXHU1MDVBXHU1OTA0XHU3NDA2XHVGRjBDXHU2Q0ExXHU2NzA5XHU1MjE5XHU5NzAwXHU4OTgxXHU1M0JCXHU2Mzg5XHJcbiAgICAgICAgICAgICAgcmV3cml0ZTogcGF0aCA9PlxyXG4gICAgICAgICAgICAgICAgcGF0aC5yZXBsYWNlKG5ldyBSZWdFeHAoYF4ke1ZJVEVfQVBQX1BST1hZX1BSRUZJWH1gKSwgJycpLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIDogdW5kZWZpbmVkLFxyXG4gICAgfSxcclxuICAgIGVzYnVpbGQ6IHtcclxuICAgICAgZHJvcDogVklURV9ERUxFVEVfQ09OU09MRSA9PT0gJ3RydWUnID8gWydjb25zb2xlJywgJ2RlYnVnZ2VyJ10gOiBbXSxcclxuICAgIH0sXHJcbiAgICBidWlsZDoge1xyXG4gICAgICBzb3VyY2VtYXA6IGZhbHNlLFxyXG4gICAgICAvLyBcdTY1QjlcdTRGQkZcdTk3NUVoNVx1N0FFRlx1OEMwM1x1OEJENVxyXG4gICAgICAvLyBzb3VyY2VtYXA6IFZJVEVfU0hPV19TT1VSQ0VNQVAgPT09ICd0cnVlJywgLy8gXHU5RUQ4XHU4QkE0XHU2NjJGZmFsc2VcclxuICAgICAgdGFyZ2V0OiAnZXM2JyxcclxuICAgICAgLy8gXHU1RjAwXHU1M0QxXHU3M0FGXHU1ODgzXHU0RTBEXHU3NTI4XHU1MzhCXHU3RjI5XHJcbiAgICAgIG1pbmlmeTogbW9kZSA9PT0gJ2RldmVsb3BtZW50JyA/IGZhbHNlIDogJ2VzYnVpbGQnLFxyXG4gICAgfSxcclxuICB9KVxyXG59KVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkU6XFxcXGNvZGVcXFxcbGlqdW54aVxcXFx0ZW1wXFxcXHJlc3VtZVxcXFxyZXN1bWUtYXBwXFxcXHNjcmlwdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXGNvZGVcXFxcbGlqdW54aVxcXFx0ZW1wXFxcXHJlc3VtZVxcXFxyZXN1bWUtYXBwXFxcXHNjcmlwdHNcXFxcb3Blbi1kZXYtdG9vbHMuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L2NvZGUvbGlqdW54aS90ZW1wL3Jlc3VtZS9yZXN1bWUtYXBwL3NjcmlwdHMvb3Blbi1kZXYtdG9vbHMuanNcIjtpbXBvcnQgeyBleGVjIH0gZnJvbSAnbm9kZTpjaGlsZF9wcm9jZXNzJ1xyXG5pbXBvcnQgZnMgZnJvbSAnbm9kZTpmcydcclxuaW1wb3J0IHBhdGggZnJvbSAnbm9kZTpwYXRoJ1xyXG5pbXBvcnQgcHJvY2VzcyBmcm9tICdub2RlOnByb2Nlc3MnXHJcblxyXG4vKipcclxuICogXHU2MjUzXHU1RjAwXHU1RjAwXHU1M0QxXHU4MDA1XHU1REU1XHU1MTc3XHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBlbnYgLSBcdTczQUZcdTU4ODNcdUZGMEMnZGV2JyBcdTYyMTYgJ2J1aWxkJ1xyXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyAtIFx1OTE0RFx1N0Y2RVx1OTAwOVx1OTg3OVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy53ZWNoYXREZXZ0b29sc0NsaVBhdGggLSBcdTVGQUVcdTRGRTFcdTVGMDBcdTUzRDFcdTgwMDVcdTVERTVcdTUxNzcgQ0xJIFx1OERFRlx1NUY4NFxyXG4gKi9cclxuZnVuY3Rpb24gX29wZW5EZXZUb29scyhlbnYgPSAnZGV2Jywgb3B0aW9ucyA9IHt9KSB7XHJcbiAgY29uc3QgeyB3ZWNoYXREZXZ0b29sc0NsaVBhdGggfSA9IG9wdGlvbnNcclxuICBjb25zdCBwbGF0Zm9ybSA9IHByb2Nlc3MucGxhdGZvcm0gLy8gZGFyd2luLCB3aW4zMiwgbGludXhcclxuICBjb25zdCB7IFVOSV9QTEFURk9STSB9ID0gcHJvY2Vzcy5lbnYgLy8gIG1wLXdlaXhpbiwgbXAtYWxpcGF5LCBtcC1sYXJrXHJcblxyXG4gIGNvbnN0IHVuaVBsYXRmb3JtVGV4dCA9IFVOSV9QTEFURk9STSA9PT0gJ21wLXdlaXhpbicgPyAnXHU1RkFFXHU0RkUxXHU1QzBGXHU3QTBCXHU1RThGJyA6IFVOSV9QTEFURk9STSA9PT0gJ21wLWFsaXBheScgPyAnXHU2NTJGXHU0RUQ4XHU1QjlEXHU1QzBGXHU3QTBCXHU1RThGJyA6IFVOSV9QTEFURk9STSA9PT0gJ21wLWxhcmsnID8gJ1x1NjI5Nlx1OTdGM1x1NUMwRlx1N0EwQlx1NUU4RicgOiAnXHU1QzBGXHU3QTBCXHU1RThGJ1xyXG5cclxuICAvLyBcdTk4NzlcdTc2RUVcdThERUZcdTVGODRcdUZGMDhcdTY3ODRcdTVFRkFcdThGOTNcdTUxRkFcdTc2RUVcdTVGNTVcdUZGMDlcdUZGMENcdTY4MzlcdTYzNkVcdTczQUZcdTU4ODNcdTkwMDlcdTYyRTlcdTRFMERcdTU0MENcdTc2RUVcdTVGNTVcclxuICBjb25zdCBvdXRwdXREaXIgPSBlbnYgPT09ICdidWlsZCcgPyBgZGlzdC9idWlsZC8ke1VOSV9QTEFURk9STX1gIDogYGRpc3QvZGV2LyR7VU5JX1BMQVRGT1JNfWBcclxuICBjb25zdCBwcm9qZWN0UGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCBvdXRwdXREaXIpXHJcblxyXG4gIC8vIFx1NjhDMFx1NjdFNVx1Njc4NFx1NUVGQVx1OEY5M1x1NTFGQVx1NzZFRVx1NUY1NVx1NjYyRlx1NTQyNlx1NUI1OFx1NTcyOFxyXG4gIGlmICghZnMuZXhpc3RzU3luYyhwcm9qZWN0UGF0aCkpIHtcclxuICAgIGNvbnNvbGUubG9nKGBcdTI3NEMgJHt1bmlQbGF0Zm9ybVRleHR9XHU2Nzg0XHU1RUZBXHU3NkVFXHU1RjU1XHU0RTBEXHU1QjU4XHU1NzI4OmAsIHByb2plY3RQYXRoKVxyXG4gICAgcmV0dXJuXHJcbiAgfVxyXG5cclxuICBjb25zb2xlLmxvZyhgXHVEODNEXHVERTgwIFx1NkI2M1x1NTcyOFx1NjI1M1x1NUYwMCR7dW5pUGxhdGZvcm1UZXh0fVx1NUYwMFx1NTNEMVx1ODAwNVx1NURFNVx1NTE3Ny4uLmApXHJcblxyXG4gIC8vIFx1NjgzOVx1NjM2RVx1NEUwRFx1NTQwQ1x1NjRDRFx1NEY1Q1x1N0NGQlx1N0VERlx1NjI2N1x1ODg0Q1x1NEUwRFx1NTQwQ1x1NTQ3RFx1NEVFNFxyXG4gIGxldCBjb21tYW5kID0gJydcclxuXHJcbiAgaWYgKHBsYXRmb3JtID09PSAnZGFyd2luJykge1xyXG4gICAgLy8gbWFjT1NcclxuICAgIGlmIChVTklfUExBVEZPUk0gPT09ICdtcC13ZWl4aW4nKSB7XHJcbiAgICAgIGNvbnN0IGNsaVBhdGggPSB3ZWNoYXREZXZ0b29sc0NsaVBhdGggfHwgJy9BcHBsaWNhdGlvbnMvd2VjaGF0d2ViZGV2dG9vbHMuYXBwL0NvbnRlbnRzL01hY09TL2NsaSdcclxuICAgICAgY29tbWFuZCA9IGBcIiR7Y2xpUGF0aH1cIiBvcGVuIC0tcHJvamVjdCBcIiR7cHJvamVjdFBhdGh9XCJgXHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChVTklfUExBVEZPUk0gPT09ICdtcC1hbGlwYXknKSB7XHJcbiAgICAgIGNvbW1hbmQgPSBgL0FwcGxpY2F0aW9ucy9cdTVDMEZcdTdBMEJcdTVFOEZcdTVGMDBcdTUzRDFcdTgwMDVcdTVERTVcdTUxNzcuYXBwL0NvbnRlbnRzL01hY09TL1x1NUMwRlx1N0EwQlx1NUU4Rlx1NUYwMFx1NTNEMVx1ODAwNVx1NURFNVx1NTE3NyAtLXAgXCIke3Byb2plY3RQYXRofVwiYFxyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoVU5JX1BMQVRGT1JNID09PSAnbXAtbGFyaycpIHtcclxuICAgICAgY29tbWFuZCA9IGAvQXBwbGljYXRpb25zL1x1NjI5Nlx1OTdGM1x1NUYwMFx1NTNEMVx1ODAwNVx1NURFNVx1NTE3Ny5hcHAvQ29udGVudHMvTWFjT1MvXHU2Mjk2XHU5N0YzXHU1RjAwXHU1M0QxXHU4MDA1XHU1REU1XHU1MTc3IC0tcCBcIiR7cHJvamVjdFBhdGh9XCJgXHJcbiAgICB9XHJcbiAgfVxyXG4gIGVsc2UgaWYgKHBsYXRmb3JtID09PSAnd2luMzInIHx8IHBsYXRmb3JtID09PSAnd2luNjQnKSB7XHJcbiAgICAvLyBXaW5kb3dzXHJcbiAgICBpZiAoVU5JX1BMQVRGT1JNID09PSAnbXAtd2VpeGluJykge1xyXG4gICAgICBjb25zdCBjbGlQYXRoID0gd2VjaGF0RGV2dG9vbHNDbGlQYXRoIHx8ICdDOlxcXFxQcm9ncmFtIEZpbGVzICh4ODYpXFxcXFRlbmNlbnRcXFxcXHU1RkFFXHU0RkUxd2ViXHU1RjAwXHU1M0QxXHU4MDA1XHU1REU1XHU1MTc3XFxcXGNsaS5iYXQnXHJcbiAgICAgIGNvbW1hbmQgPSBgXCIke2NsaVBhdGh9XCIgb3BlbiAtLXByb2plY3QgXCIke3Byb2plY3RQYXRofVwiYFxyXG4gICAgfVxyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIC8vIExpbnV4IFx1NjIxNlx1NTE3Nlx1NEVENlx1N0NGQlx1N0VERlxyXG4gICAgY29uc29sZS5sb2coJ1x1Mjc0QyBcdTVGNTNcdTUyNERcdTdDRkJcdTdFREZcdTRFMERcdTY1MkZcdTYzMDFcdTgxRUFcdTUyQThcdTYyNTNcdTVGMDBcdTVGQUVcdTRGRTFcdTVGMDBcdTUzRDFcdTgwMDVcdTVERTVcdTUxNzcnKVxyXG4gICAgcmV0dXJuXHJcbiAgfVxyXG5cclxuICBleGVjKGNvbW1hbmQsIChlcnJvciwgc3Rkb3V0LCBzdGRlcnIpID0+IHtcclxuICAgIGlmIChlcnJvcikge1xyXG4gICAgICBjb25zb2xlLmxvZyhgXHUyNzRDIFx1NjI1M1x1NUYwMCR7dW5pUGxhdGZvcm1UZXh0fVx1NUYwMFx1NTNEMVx1ODAwNVx1NURFNVx1NTE3N1x1NTkzMVx1OEQyNTpgLCBlcnJvci5tZXNzYWdlKVxyXG4gICAgICBpZiAoVU5JX1BMQVRGT1JNID09PSAnbXAtd2VpeGluJykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdcdUQ4M0RcdURDQTEgXHU1RjUzXHU1MjREXHU0RjdGXHU3NTI4XHU3Njg0XHU1RkFFXHU0RkUxXHU1RjAwXHU1M0QxXHU4MDA1XHU1REU1XHU1MTc3IENMSSBcdTU0N0RcdTRFRTQ6JywgY29tbWFuZClcclxuICAgICAgICBjb25zb2xlLmxvZygnXHVEODNEXHVEQ0ExIFx1NTk4Mlx1Njc5Q1x1NUI4OVx1ODhDNVx1NEY0RFx1N0Y2RVx1NEUwRFx1NTQwQ1x1RkYwQ1x1NTNFRlx1NEVFNVx1NTcyOCBlbnYvLmVudiBcdTkxNERcdTdGNkUgV0VDSEFUX0RFVlRPT0xTX0NMSV9QQVRIIFx1NEUzQVx1NjcyQ1x1NjczQVx1NUI5RVx1OTY0NSBDTEkgXHU4REVGXHU1Rjg0JylcclxuICAgICAgfVxyXG4gICAgICBjb25zb2xlLmxvZyhgXHVEODNEXHVEQ0ExIFx1OEJGN1x1Nzg2RVx1NEZERCR7dW5pUGxhdGZvcm1UZXh0fVx1NUYwMFx1NTNEMVx1ODAwNVx1NURFNVx1NTE3N1x1NjcwRFx1NTJBMVx1N0FFRlx1NTNFM1x1NURGMlx1NTQyRlx1NzUyOGApXHJcbiAgICAgIGNvbnNvbGUubG9nKGBcdUQ4M0RcdURDQTEgXHU1M0VGXHU0RUU1XHU2MjRCXHU1MkE4XHU2MjUzXHU1RjAwJHt1bmlQbGF0Zm9ybVRleHR9XHU1RjAwXHU1M0QxXHU4MDA1XHU1REU1XHU1MTc3XHU1RTc2XHU1QkZDXHU1MTY1XHU5ODc5XHU3NkVFOmAsIHByb2plY3RQYXRoKVxyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBpZiAoc3RkZXJyKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdcdTI2QTBcdUZFMEYgXHU4QjY2XHU1NDRBOicsIHN0ZGVycilcclxuICAgIH1cclxuXHJcbiAgICBjb25zb2xlLmxvZyhgXHUyNzA1ICR7dW5pUGxhdGZvcm1UZXh0fVx1NUYwMFx1NTNEMVx1ODAwNVx1NURFNVx1NTE3N1x1NURGMlx1NjI1M1x1NUYwMGApXHJcblxyXG4gICAgaWYgKHN0ZG91dCkge1xyXG4gICAgICBjb25zb2xlLmxvZyhzdGRvdXQpXHJcbiAgICB9XHJcbiAgfSlcclxufVxyXG5cclxuLyoqXHJcbiAqIFx1NTIxQlx1NUVGQSBWaXRlIFx1NjNEMlx1NEVGNlx1RkYwQ1x1NzUyOFx1NEU4RVx1ODFFQVx1NTJBOFx1NjI1M1x1NUYwMFx1NUYwMFx1NTNEMVx1ODAwNVx1NURFNVx1NTE3N1xyXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyAtIFx1OTE0RFx1N0Y2RVx1OTAwOVx1OTg3OVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5tb2RlIC0gXHU2Nzg0XHU1RUZBXHU2QTIxXHU1RjBGXHVGRjBDJ2RldmVsb3BtZW50JyBcdTYyMTYgJ3Byb2R1Y3Rpb24nXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLndlY2hhdERldnRvb2xzQ2xpUGF0aCAtIFx1NUZBRVx1NEZFMVx1NUYwMFx1NTNEMVx1ODAwNVx1NURFNVx1NTE3NyBDTEkgXHU4REVGXHU1Rjg0XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBvcGVuRGV2VG9vbHMob3B0aW9ucyA9IHt9KSB7XHJcbiAgY29uc3QgeyBtb2RlID0gJ2RldmVsb3BtZW50Jywgd2VjaGF0RGV2dG9vbHNDbGlQYXRoIH0gPSBvcHRpb25zXHJcbiAgLy8gXHU2ODM5XHU2MzZFIG1vZGUgXHU3ODZFXHU1QjlBXHU3M0FGXHU1ODgzXHVGRjFBZGV2ZWxvcG1lbnQgLT4gZGV2LCBwcm9kdWN0aW9uIC0+IGJ1aWxkXHJcbiAgY29uc3QgZW52ID0gbW9kZSA9PT0gJ3Byb2R1Y3Rpb24nID8gJ2J1aWxkJyA6ICdkZXYnXHJcblxyXG4gIC8vIFx1OTk5Nlx1NkIyMVx1Njc4NFx1NUVGQVx1NjgwN1x1OEJCMFxyXG4gIGxldCBpc0ZpcnN0QnVpbGQgPSB0cnVlXHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBuYW1lOiAndW5pLWRldnRvb2xzJyxcclxuICAgIHdyaXRlQnVuZGxlKCkge1xyXG4gICAgICBpZiAoaXNGaXJzdEJ1aWxkICYmIHByb2Nlc3MuZW52LlVOSV9QTEFURk9STT8uaW5jbHVkZXMoJ21wJykpIHtcclxuICAgICAgICBpc0ZpcnN0QnVpbGQgPSBmYWxzZVxyXG4gICAgICAgIF9vcGVuRGV2VG9vbHMoZW52LCB7IHdlY2hhdERldnRvb2xzQ2xpUGF0aCB9KVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH1cclxufVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkU6XFxcXGNvZGVcXFxcbGlqdW54aVxcXFx0ZW1wXFxcXHJlc3VtZVxcXFxyZXN1bWUtYXBwXFxcXHNjcmlwdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXGNvZGVcXFxcbGlqdW54aVxcXFx0ZW1wXFxcXHJlc3VtZVxcXFxyZXN1bWUtYXBwXFxcXHNjcmlwdHNcXFxcdml0ZS1wbHVnaW4tZXJ1ZGEuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L2NvZGUvbGlqdW54aS90ZW1wL3Jlc3VtZS9yZXN1bWUtYXBwL3NjcmlwdHMvdml0ZS1wbHVnaW4tZXJ1ZGEuanNcIjsvKipcclxuICogQGRlc2NyaXB0aW9uIFx1OTAxQVx1OEZDNyB2aXRlIFx1ODFFQVx1NUI5QVx1NEU0OVx1Njc2MVx1NEVGNlx1NTJBOFx1NjAwMVx1NUJGQ1x1NTE2NSBlcnVkYVxyXG4gKiBAZGVzY3JpcHRpb24gRXJ1ZGEgXHU5MTREXHU3RjZFXHU1M0MyXHU4MDAzIGh0dHBzOi8vZXJ1ZGEubGlyaWxpcmkuaW8vemgvZG9jcy9cclxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnNcclxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5vcGVuXSAtIFx1NjYyRlx1NTQyNlx1NUYwMFx1NTQyRiBlcnVkYVxyXG4gKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnMuZXJ1ZGFPcHRpb25zXSAtIGVydWRhIFx1OTE0RFx1N0Y2RVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuZXJ1ZGFVcmxdIC0gZXJ1ZGEgXHU1NzMwXHU1NzQwXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB2aXRlUGx1Z2luRXJ1ZGEob3B0aW9ucyA9IHt9KSB7XHJcbiAgY29uc3QgeyBvcGVuID0gdHJ1ZSwgZXJ1ZGFPcHRpb25zID0ge30sIGVydWRhVXJsID0gJ2h0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vZXJ1ZGEnIH0gPSBvcHRpb25zXHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBuYW1lOiAndml0ZS1wbHVnaW4tZXJ1ZGEnLFxyXG5cclxuICAgIHRyYW5zZm9ybUluZGV4SHRtbChodG1sKSB7XHJcbiAgICAgIGNvbnN0IHRhZ3MgPSBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdGFnOiAnc2NyaXB0JyxcclxuICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgIHNyYzogZXJ1ZGFVcmwsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgaW5qZWN0VG86ICdoZWFkJyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRhZzogJ3NjcmlwdCcsXHJcbiAgICAgICAgICBjaGlsZHJlbjogYGVydWRhLmluaXQoJHtKU09OLnN0cmluZ2lmeShlcnVkYU9wdGlvbnMpfSk7YCxcclxuICAgICAgICAgIGluamVjdFRvOiAnaGVhZCcsXHJcbiAgICAgICAgfSxcclxuICAgICAgXVxyXG5cclxuICAgICAgaWYgKCFvcGVuKSB7XHJcbiAgICAgICAgcmV0dXJuIGh0bWxcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4geyBodG1sLCB0YWdzIH1cclxuICAgIH0sXHJcbiAgfVxyXG59XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRTpcXFxcY29kZVxcXFxsaWp1bnhpXFxcXHRlbXBcXFxccmVzdW1lXFxcXHJlc3VtZS1hcHBcXFxcdml0ZS1wbHVnaW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFxjb2RlXFxcXGxpanVueGlcXFxcdGVtcFxcXFxyZXN1bWVcXFxccmVzdW1lLWFwcFxcXFx2aXRlLXBsdWdpbnNcXFxcY29weS1uYXRpdmUtcmVzb3VyY2VzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi9jb2RlL2xpanVueGkvdGVtcC9yZXN1bWUvcmVzdW1lLWFwcC92aXRlLXBsdWdpbnMvY29weS1uYXRpdmUtcmVzb3VyY2VzLnRzXCI7aW1wb3J0IHR5cGUgeyBQbHVnaW4gfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgcGF0aCBmcm9tICdub2RlOnBhdGgnXHJcbmltcG9ydCBwcm9jZXNzIGZyb20gJ25vZGU6cHJvY2VzcydcclxuaW1wb3J0IGZzIGZyb20gJ2ZzLWV4dHJhJ1xyXG5cclxuLyoqXHJcbiAqIFx1NTM5Rlx1NzUxRlx1NjNEMlx1NEVGNlx1OEQ0NFx1NkU5MFx1NTkwRFx1NTIzNlx1OTE0RFx1N0Y2RVx1NjNBNVx1NTNFM1xyXG4gKlxyXG4gKiBcdTY4MzlcdTYzNkUgVW5pQXBwIFx1NUI5OFx1NjVCOVx1NjU4N1x1Njg2M1x1RkYxQWh0dHBzOi8vdW5pYXBwLmRjbG91ZC5uZXQuY24vcGx1Z2luL25hdGl2ZS1wbHVnaW4uaHRtbCMlRTYlOUMlQUMlRTUlOUMlQjAlRTYlOEYlOTIlRTQlQkIlQjYtJUU5JTlEJTlFJUU1JTg2JTg1JUU3JUJEJUFFJUU1JThFJTlGJUU3JTk0JTlGJUU2JThGJTkyJUU0JUJCJUI2XHJcbiAqIFx1NjcyQ1x1NTczMFx1NjNEMlx1NEVGNlx1NUU5NFx1OEJFNVx1NUI1OFx1NTBBOFx1NTcyOFx1OTg3OVx1NzZFRVx1NjgzOVx1NzZFRVx1NUY1NVx1NzY4NCBuYXRpdmVwbHVnaW5zIFx1NzZFRVx1NUY1NVx1NEUwQlxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBDb3B5TmF0aXZlUmVzb3VyY2VzT3B0aW9ucyB7XHJcbiAgLyoqIFx1NjYyRlx1NTQyNlx1NTQyRlx1NzUyOFx1NjNEMlx1NEVGNiAqL1xyXG4gIGVuYWJsZT86IGJvb2xlYW5cclxuICAvKipcclxuICAgKiBcdTZFOTBcdTc2RUVcdTVGNTVcdThERUZcdTVGODRcdUZGMENcdTc2RjhcdTVCRjlcdTRFOEVcdTk4NzlcdTc2RUVcdTY4MzlcdTc2RUVcdTVGNTVcclxuICAgKiBcdTlFRDhcdThCQTRcdTRFM0EgJ25hdGl2ZXBsdWdpbnMnXHVGRjBDXHU3QjI2XHU1NDA4IFVuaUFwcCBcdTVCOThcdTY1QjlcdTg5QzRcdTgzMDNcclxuICAgKiBAc2VlIGh0dHBzOi8vdW5pYXBwLmRjbG91ZC5uZXQuY24vcGx1Z2luL25hdGl2ZS1wbHVnaW4uaHRtbCMlRTYlOUMlQUMlRTUlOUMlQjAlRTYlOEYlOTIlRTQlQkIlQjYtJUU5JTlEJTlFJUU1JTg2JTg1JUU3JUJEJUFFJUU1JThFJTlGJUU3JTk0JTlGJUU2JThGJTkyJUU0JUJCJUI2XHJcbiAgICovXHJcbiAgc291cmNlRGlyPzogc3RyaW5nXHJcbiAgLyoqXHJcbiAgICogXHU3NkVFXHU2ODA3XHU3NkVFXHU1RjU1XHU1NDBEXHU3OUYwXHVGRjBDXHU2Nzg0XHU1RUZBXHU1NDBFXHU1NzI4IGRpc3QgXHU3NkVFXHU1RjU1XHU0RTJEXHU3Njg0XHU2NTg3XHU0RUY2XHU1OTM5XHU1NDBEXHJcbiAgICogXHU5RUQ4XHU4QkE0XHU0RTNBICduYXRpdmVwbHVnaW5zJ1x1RkYwQ1x1NEUwRVx1NkU5MFx1NzZFRVx1NUY1NVx1NEZERFx1NjMwMVx1NEUwMFx1ODFGNFxyXG4gICAqL1xyXG4gIHRhcmdldERpck5hbWU/OiBzdHJpbmdcclxuICAvKiogXHU2NjJGXHU1NDI2XHU2NjNFXHU3OTNBXHU4QkU2XHU3RUM2XHU2NUU1XHU1RkQ3XHVGRjBDXHU0RkJGXHU0RThFXHU4QzAzXHU4QkQ1XHU1NDhDXHU3NkQxXHU2M0E3XHU1OTBEXHU1MjM2XHU4RkM3XHU3QTBCICovXHJcbiAgdmVyYm9zZT86IGJvb2xlYW5cclxuICAvKiogXHU4MUVBXHU1QjlBXHU0RTQ5XHU2NUU1XHU1RkQ3XHU1MjREXHU3RjAwXHVGRjBDXHU3NTI4XHU0RThFXHU1MzNBXHU1MjA2XHU0RTBEXHU1NDBDXHU2M0QyXHU0RUY2XHU3Njg0XHU2NUU1XHU1RkQ3XHU4RjkzXHU1MUZBICovXHJcbiAgbG9nUHJlZml4Pzogc3RyaW5nXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBcdTlFRDhcdThCQTRcdTkxNERcdTdGNkVcclxuICpcclxuICogXHU2ODM5XHU2MzZFIFVuaUFwcCBcdTVCOThcdTY1QjlcdTY1ODdcdTY4NjNcdTg5QzRcdTgzMDNcdThCQkVcdTdGNkVcdTlFRDhcdThCQTRcdTUwM0NcdUZGMUFcclxuICogLSBzb3VyY2VEaXI6ICduYXRpdmVwbHVnaW5zJyAtIFx1N0IyNlx1NTQwOFx1NUI5OFx1NjVCOVx1NjcyQ1x1NTczMFx1NjNEMlx1NEVGNlx1NUI1OFx1NTBBOFx1ODlDNFx1ODMwM1xyXG4gKiAtIHRhcmdldERpck5hbWU6ICduYXRpdmVwbHVnaW5zJyAtIFx1Njc4NFx1NUVGQVx1NTQwRVx1NEZERFx1NjMwMVx1NzZGOFx1NTQwQ1x1NzY4NFx1NzZFRVx1NUY1NVx1N0VEM1x1Njc4NFxyXG4gKi9cclxuY29uc3QgREVGQVVMVF9PUFRJT05TOiBSZXF1aXJlZDxDb3B5TmF0aXZlUmVzb3VyY2VzT3B0aW9ucz4gPSB7XHJcbiAgZW5hYmxlOiB0cnVlLFxyXG4gIHNvdXJjZURpcjogJ25hdGl2ZXBsdWdpbnMnLFxyXG4gIHRhcmdldERpck5hbWU6ICduYXRpdmVwbHVnaW5zJyxcclxuICB2ZXJib3NlOiB0cnVlLFxyXG4gIGxvZ1ByZWZpeDogJ1tjb3B5LW5hdGl2ZS1yZXNvdXJjZXNdJyxcclxufVxyXG5cclxuLyoqXHJcbiAqIFVuaUFwcCBcdTUzOUZcdTc1MUZcdTYzRDJcdTRFRjZcdThENDRcdTZFOTBcdTU5MERcdTUyMzZcdTYzRDJcdTRFRjZcclxuICpcclxuICogXHU1MjlGXHU4MEZEXHU4QkY0XHU2NjBFXHVGRjFBXHJcbiAqIDEuIFx1ODlFM1x1NTFCMyBVbmlBcHAgXHU0RjdGXHU3NTI4XHU2NzJDXHU1NzMwXHU1MzlGXHU3NTFGXHU2M0QyXHU0RUY2XHU2NUY2XHVGRjBDXHU2MjUzXHU1MzA1XHU1NDBFXHU1MzlGXHU3NTFGXHU2M0QyXHU0RUY2XHU4RDQ0XHU2RTkwXHU2MjdFXHU0RTBEXHU1MjMwXHU3Njg0XHU5NUVFXHU5ODk4XHJcbiAqIDIuIFx1NUMwNlx1OTg3OVx1NzZFRVx1NjgzOVx1NzZFRVx1NUY1NVx1NEUwQlx1NzY4NCBuYXRpdmVwbHVnaW5zIFx1NzZFRVx1NUY1NVx1NTkwRFx1NTIzNlx1NTIzMFx1Njc4NFx1NUVGQVx1OEY5M1x1NTFGQVx1NzZFRVx1NUY1NVx1NEUyRFxyXG4gKiAzLiBcdTY1MkZcdTYzMDEgQW5kcm9pZCBcdTU0OEMgaU9TIFx1NUU3M1x1NTNGMFx1NzY4NFx1NTM5Rlx1NzUxRlx1NjNEMlx1NEVGNlx1OEQ0NFx1NkU5MFx1NTkwRFx1NTIzNlxyXG4gKiA0LiBcdTRFQzVcdTU3MjggYXBwIFx1NUU3M1x1NTNGMFx1Njc4NFx1NUVGQVx1NjVGNlx1NzUxRlx1NjU0OFx1RkYwQ1x1NTE3Nlx1NEVENlx1NUU3M1x1NTNGMFx1RkYwOEg1XHUzMDAxXHU1QzBGXHU3QTBCXHU1RThGXHVGRjA5XHU0RTBEXHU2MjY3XHU4ODRDXHJcbiAqXHJcbiAqIFx1NEY3Rlx1NzUyOFx1NTczQVx1NjY2Rlx1RkYxQVxyXG4gKiAtIFx1NEY3Rlx1NzUyOFx1NEU4NiBVbmlBcHAgXHU2NzJDXHU1NzMwXHU1MzlGXHU3NTFGXHU2M0QyXHU0RUY2XHVGRjA4XHU5NzVFXHU0RTkxXHU3QUVGXHU2M0QyXHU0RUY2XHVGRjA5XHJcbiAqIC0gXHU1MzlGXHU3NTFGXHU2M0QyXHU0RUY2XHU1MzA1XHU1NDJCXHU5ODlEXHU1OTE2XHU3Njg0XHU4RDQ0XHU2RTkwXHU2NTg3XHU0RUY2XHVGRjA4XHU1OTgyIC5zbyBcdTVFOTNcdTY1ODdcdTRFRjZcdTMwMDFcdTkxNERcdTdGNkVcdTY1ODdcdTRFRjZcdTdCNDlcdUZGMDlcclxuICogLSBcdTk3MDBcdTg5ODFcdTU3MjhcdTYyNTNcdTUzMDVcdTU0MEVcdTRGRERcdTYzMDFcdTUzOUZcdTc1MUZcdTYzRDJcdTRFRjZcdTc2ODRcdTVCOENcdTY1NzRcdTc2RUVcdTVGNTVcdTdFRDNcdTY3ODRcclxuICpcclxuICogXHU1Qjk4XHU2NUI5XHU2NTg3XHU2ODYzXHU1M0MyXHU4MDAzXHVGRjFBXHJcbiAqIEBzZWUgaHR0cHM6Ly91bmlhcHAuZGNsb3VkLm5ldC5jbi9wbHVnaW4vbmF0aXZlLXBsdWdpbi5odG1sIyVFNiU5QyVBQyVFNSU5QyVCMCVFNiU4RiU5MiVFNCVCQiVCNi0lRTklOUQlOUUlRTUlODYlODUlRTclQkQlQUUlRTUlOEUlOUYlRTclOTQlOUYlRTYlOEYlOTIlRTQlQkIlQjZcclxuICogQHNlZSBodHRwczovL3VuaWFwcC5kY2xvdWQubmV0LmNuL3R1dG9yaWFsL252dWUtYXBpLmh0bWwjZG9tXHJcbiAqXHJcbiAqIEBwYXJhbSBvcHRpb25zIFx1NjNEMlx1NEVGNlx1OTE0RFx1N0Y2RVx1OTAwOVx1OTg3OVxyXG4gKiBAcmV0dXJucyBWaXRlIFx1NjNEMlx1NEVGNlx1NUJGOVx1OEM2MVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGNvcHlOYXRpdmVSZXNvdXJjZXMob3B0aW9uczogQ29weU5hdGl2ZVJlc291cmNlc09wdGlvbnMgPSB7fSk6IFBsdWdpbiB7XHJcbiAgY29uc3QgY29uZmlnID0geyAuLi5ERUZBVUxUX09QVElPTlMsIC4uLm9wdGlvbnMgfVxyXG5cclxuICAvLyBcdTU5ODJcdTY3OUNcdTYzRDJcdTRFRjZcdTg4QUJcdTc5ODFcdTc1MjhcdUZGMENcdThGRDRcdTU2REVcdTRFMDBcdTRFMkFcdTdBN0FcdTYzRDJcdTRFRjZcclxuICBpZiAoIWNvbmZpZy5lbmFibGUpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIG5hbWU6ICdjb3B5LW5hdGl2ZS1yZXNvdXJjZXMtZGlzYWJsZWQnLFxyXG4gICAgICBhcHBseTogJ2J1aWxkJyxcclxuICAgICAgd3JpdGVCdW5kbGUoKSB7XHJcbiAgICAgICAgLy8gXHU2M0QyXHU0RUY2XHU1REYyXHU3OTgxXHU3NTI4XHVGRjBDXHU0RTBEXHU2MjY3XHU4ODRDXHU0RUZCXHU0RjU1XHU2NENEXHU0RjVDXHJcbiAgICAgIH0sXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgbmFtZTogJ2NvcHktbmF0aXZlLXJlc291cmNlcycsXHJcbiAgICBhcHBseTogJ2J1aWxkJywgLy8gXHU1M0VBXHU1NzI4XHU2Nzg0XHU1RUZBXHU2NUY2XHU1RTk0XHU3NTI4XHJcbiAgICBlbmZvcmNlOiAncG9zdCcsIC8vIFx1NTcyOFx1NTE3Nlx1NEVENlx1NjNEMlx1NEVGNlx1NjI2N1x1ODg0Q1x1NUI4Q1x1NkJENVx1NTQwRVx1NjI2N1x1ODg0Q1xyXG5cclxuICAgIGFzeW5jIHdyaXRlQnVuZGxlKCkge1xyXG4gICAgICBjb25zdCB7IHNvdXJjZURpciwgdGFyZ2V0RGlyTmFtZSwgdmVyYm9zZSwgbG9nUHJlZml4IH0gPSBjb25maWdcclxuXHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgLy8gXHU4M0I3XHU1M0Q2XHU5ODc5XHU3NkVFXHU2ODM5XHU3NkVFXHU1RjU1XHU4REVGXHU1Rjg0XHJcbiAgICAgICAgY29uc3QgcHJvamVjdFJvb3QgPSBwcm9jZXNzLmN3ZCgpXHJcblxyXG4gICAgICAgIC8vIFx1Njc4NFx1NUVGQVx1NkU5MFx1NzZFRVx1NUY1NVx1N0VERFx1NUJGOVx1OERFRlx1NUY4NFx1RkYwOFx1OTg3OVx1NzZFRVx1NjgzOVx1NzZFRVx1NUY1NVx1NEUwQlx1NzY4NCBuYXRpdmVwbHVnaW5zIFx1NzZFRVx1NUY1NVx1RkYwOVxyXG4gICAgICAgIGNvbnN0IHNvdXJjZVBhdGggPSBwYXRoLnJlc29sdmUocHJvamVjdFJvb3QsIHNvdXJjZURpcilcclxuXHJcbiAgICAgICAgLy8gXHU2Nzg0XHU1RUZBXHU3NkVFXHU2ODA3XHU4REVGXHU1Rjg0XHVGRjFBZGlzdC9bYnVpbGR8ZGV2XS9bcGxhdGZvcm1dL25hdGl2ZXBsdWdpbnNcclxuICAgICAgICAvLyBidWlsZE1vZGU6ICdidWlsZCcgKFx1NzUxRlx1NEVBN1x1NzNBRlx1NTg4MykgXHU2MjE2ICdkZXYnIChcdTVGMDBcdTUzRDFcdTczQUZcdTU4ODMpXHJcbiAgICAgICAgLy8gcGxhdGZvcm06ICdhcHAnIChBcHBcdTVFNzNcdTUzRjApIFx1NjIxNlx1NTE3Nlx1NEVENlx1NUU3M1x1NTNGMFx1NjgwN1x1OEJDNlxyXG4gICAgICAgIGNvbnN0IGJ1aWxkTW9kZSA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicgPyAnYnVpbGQnIDogJ2RldidcclxuICAgICAgICBjb25zdCBwbGF0Zm9ybSA9IHByb2Nlc3MuZW52LlVOSV9QTEFURk9STSB8fCAnYXBwJ1xyXG4gICAgICAgIGNvbnN0IHRhcmdldFBhdGggPSBwYXRoLnJlc29sdmUoXHJcbiAgICAgICAgICBwcm9qZWN0Um9vdCxcclxuICAgICAgICAgICdkaXN0JyxcclxuICAgICAgICAgIGJ1aWxkTW9kZSxcclxuICAgICAgICAgIHBsYXRmb3JtLFxyXG4gICAgICAgICAgdGFyZ2V0RGlyTmFtZSxcclxuICAgICAgICApXHJcblxyXG4gICAgICAgIC8vIFx1NjhDMFx1NjdFNVx1NkU5MFx1NzZFRVx1NUY1NVx1NjYyRlx1NTQyNlx1NUI1OFx1NTcyOFxyXG4gICAgICAgIC8vIFx1NTk4Mlx1Njc5Q1x1NEUwRFx1NUI1OFx1NTcyOCBuYXRpdmVwbHVnaW5zIFx1NzZFRVx1NUY1NVx1RkYwQ1x1OEJGNFx1NjYwRVx1OTg3OVx1NzZFRVx1NkNBMVx1NjcwOVx1NEY3Rlx1NzUyOFx1NjcyQ1x1NTczMFx1NTM5Rlx1NzUxRlx1NjNEMlx1NEVGNlxyXG4gICAgICAgIGNvbnN0IHNvdXJjZUV4aXN0cyA9IGF3YWl0IGZzLnBhdGhFeGlzdHMoc291cmNlUGF0aClcclxuICAgICAgICBpZiAoIXNvdXJjZUV4aXN0cykge1xyXG4gICAgICAgICAgaWYgKHZlcmJvc2UpIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKGAke2xvZ1ByZWZpeH0gXHU2RTkwXHU3NkVFXHU1RjU1XHU0RTBEXHU1QjU4XHU1NzI4XHVGRjBDXHU4REYzXHU4RkM3XHU1OTBEXHU1MjM2XHU2NENEXHU0RjVDYClcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKGAke2xvZ1ByZWZpeH0gXHU2RTkwXHU3NkVFXHU1RjU1XHU4REVGXHU1Rjg0OiAke3NvdXJjZVBhdGh9YClcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKGAke2xvZ1ByZWZpeH0gXHU1OTgyXHU5NzAwXHU0RjdGXHU3NTI4XHU2NzJDXHU1NzMwXHU1MzlGXHU3NTFGXHU2M0QyXHU0RUY2XHVGRjBDXHU4QkY3XHU1NzI4XHU5ODc5XHU3NkVFXHU2ODM5XHU3NkVFXHU1RjU1XHU1MjFCXHU1RUZBIG5hdGl2ZXBsdWdpbnMgXHU3NkVFXHU1RjU1YClcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKGAke2xvZ1ByZWZpeH0gXHU1RTc2XHU2MzA5XHU3MTY3XHU1Qjk4XHU2NUI5XHU2NTg3XHU2ODYzXHU2NTNFXHU1MTY1XHU1MzlGXHU3NTFGXHU2M0QyXHU0RUY2XHU2NTg3XHU0RUY2YClcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKGAke2xvZ1ByZWZpeH0gXHU1M0MyXHU4MDAzOiBodHRwczovL3VuaWFwcC5kY2xvdWQubmV0LmNuL3BsdWdpbi9uYXRpdmUtcGx1Z2luLmh0bWxgKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBcdTY4QzBcdTY3RTVcdTZFOTBcdTc2RUVcdTVGNTVcdTY2MkZcdTU0MjZcdTRFM0FcdTdBN0FcclxuICAgICAgICAvLyBcdTU5ODJcdTY3OUNcdTc2RUVcdTVGNTVcdTVCNThcdTU3MjhcdTRGNDZcdTRFM0FcdTdBN0FcdUZGMENcdTRFNUZcdThERjNcdThGQzdcdTU5MERcdTUyMzZcdTY0Q0RcdTRGNUNcclxuICAgICAgICBjb25zdCBzb3VyY2VGaWxlcyA9IGF3YWl0IGZzLnJlYWRkaXIoc291cmNlUGF0aClcclxuICAgICAgICBpZiAoc291cmNlRmlsZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICBpZiAodmVyYm9zZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYCR7bG9nUHJlZml4fSBcdTZFOTBcdTc2RUVcdTVGNTVcdTRFM0FcdTdBN0FcdUZGMENcdThERjNcdThGQzdcdTU5MERcdTUyMzZcdTY0Q0RcdTRGNUNgKVxyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYCR7bG9nUHJlZml4fSBcdTZFOTBcdTc2RUVcdTVGNTVcdThERUZcdTVGODQ6ICR7c291cmNlUGF0aH1gKVxyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYCR7bG9nUHJlZml4fSBcdThCRjdcdTU3MjggbmF0aXZlcGx1Z2lucyBcdTc2RUVcdTVGNTVcdTRFMkRcdTY1M0VcdTUxNjVcdTUzOUZcdTc1MUZcdTYzRDJcdTRFRjZcdTY1ODdcdTRFRjZgKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBcdTc4NkVcdTRGRERcdTc2RUVcdTY4MDdcdTc2RUVcdTVGNTVcdTUzQ0FcdTUxNzZcdTcyMzZcdTc2RUVcdTVGNTVcdTVCNThcdTU3MjhcclxuICAgICAgICBhd2FpdCBmcy5lbnN1cmVEaXIodGFyZ2V0UGF0aClcclxuXHJcbiAgICAgICAgaWYgKHZlcmJvc2UpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKGAke2xvZ1ByZWZpeH0gXHU1RjAwXHU1OUNCXHU1OTBEXHU1MjM2IFVuaUFwcCBcdTY3MkNcdTU3MzBcdTUzOUZcdTc1MUZcdTYzRDJcdTRFRjYuLi5gKVxyXG4gICAgICAgICAgY29uc29sZS5sb2coYCR7bG9nUHJlZml4fSBcdTZFOTBcdTc2RUVcdTVGNTU6ICR7c291cmNlUGF0aH1gKVxyXG4gICAgICAgICAgY29uc29sZS5sb2coYCR7bG9nUHJlZml4fSBcdTc2RUVcdTY4MDdcdTc2RUVcdTVGNTU6ICR7dGFyZ2V0UGF0aH1gKVxyXG4gICAgICAgICAgY29uc29sZS5sb2coYCR7bG9nUHJlZml4fSBcdTY3ODRcdTVFRkFcdTZBMjFcdTVGMEY6ICR7YnVpbGRNb2RlfWApXHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhgJHtsb2dQcmVmaXh9IFx1NzZFRVx1NjgwN1x1NUU3M1x1NTNGMDogJHtwbGF0Zm9ybX1gKVxyXG4gICAgICAgICAgY29uc29sZS5sb2coYCR7bG9nUHJlZml4fSBcdTUzRDFcdTczQjAgJHtzb3VyY2VGaWxlcy5sZW5ndGh9IFx1NEUyQVx1NTM5Rlx1NzUxRlx1NjNEMlx1NEVGNlx1NjU4N1x1NEVGNi9cdTc2RUVcdTVGNTVgKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gXHU2MjY3XHU4ODRDXHU2NTg3XHU0RUY2XHU1OTBEXHU1MjM2XHU2NENEXHU0RjVDXHJcbiAgICAgICAgLy8gXHU1QzA2XHU2NTc0XHU0RTJBIG5hdGl2ZXBsdWdpbnMgXHU3NkVFXHU1RjU1XHU1OTBEXHU1MjM2XHU1MjMwXHU2Nzg0XHU1RUZBXHU4RjkzXHU1MUZBXHU3NkVFXHU1RjU1XHJcbiAgICAgICAgYXdhaXQgZnMuY29weShzb3VyY2VQYXRoLCB0YXJnZXRQYXRoLCB7XHJcbiAgICAgICAgICBvdmVyd3JpdGU6IHRydWUsIC8vIFx1ODk4Nlx1NzZENlx1NURGMlx1NUI1OFx1NTcyOFx1NzY4NFx1NjU4N1x1NEVGNlx1RkYwQ1x1Nzg2RVx1NEZERFx1NEY3Rlx1NzUyOFx1NjcwMFx1NjVCMFx1NzI0OFx1NjcyQ1xyXG4gICAgICAgICAgZXJyb3JPbkV4aXN0OiBmYWxzZSwgLy8gXHU1OTgyXHU2NzlDXHU3NkVFXHU2ODA3XHU2NTg3XHU0RUY2XHU1QjU4XHU1NzI4XHU0RTBEXHU2MkE1XHU5NTE5XHJcbiAgICAgICAgICBwcmVzZXJ2ZVRpbWVzdGFtcHM6IHRydWUsIC8vIFx1NEZERFx1NjMwMVx1NjU4N1x1NEVGNlx1NzY4NFx1NjVGNlx1OTVGNFx1NjIzM1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKGAke2xvZ1ByZWZpeH0gXHUyNzA1IFVuaUFwcCBcdTY3MkNcdTU3MzBcdTUzOUZcdTc1MUZcdTYzRDJcdTRFRjZcdTU5MERcdTUyMzZcdTVCOENcdTYyMTA6ICR7c291cmNlUGF0aH0gLT4gJHt0YXJnZXRQYXRofWApXHJcbiAgICAgICAgY29uc29sZS5sb2coYCR7bG9nUHJlZml4fSBcdTVERjJcdTYyMTBcdTUyOUZcdTU5MERcdTUyMzYgJHtzb3VyY2VGaWxlcy5sZW5ndGh9IFx1NEUyQVx1NjU4N1x1NEVGNi9cdTc2RUVcdTVGNTVcdTUyMzBcdTY3ODRcdTVFRkFcdTc2RUVcdTVGNTVgKVxyXG4gICAgICB9XHJcbiAgICAgIGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYCR7Y29uZmlnLmxvZ1ByZWZpeH0gXHUyNzRDIFx1NTkwRFx1NTIzNiBVbmlBcHAgXHU2NzJDXHU1NzMwXHU1MzlGXHU3NTFGXHU2M0QyXHU0RUY2XHU1OTMxXHU4RDI1OmAsIGVycm9yKVxyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYCR7Y29uZmlnLmxvZ1ByZWZpeH0gXHU5NTE5XHU4QkVGXHU4QkU2XHU2MEM1OmAsIGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSlcclxuICAgICAgICBjb25zb2xlLmVycm9yKGAke2NvbmZpZy5sb2dQcmVmaXh9IFx1OEJGN1x1NjhDMFx1NjdFNVx1NkU5MFx1NzZFRVx1NUY1NVx1Njc0M1x1OTY1MFx1NTQ4Q1x1NzhDMVx1NzZEOFx1N0E3QVx1OTVGNGApXHJcbiAgICAgICAgLy8gXHU0RTBEXHU2MjlCXHU1MUZBXHU5NTE5XHU4QkVGXHVGRjBDXHU5MDdGXHU1MTREXHU1RjcxXHU1NENEXHU2NTc0XHU0RTJBXHU2Nzg0XHU1RUZBXHU4RkM3XHU3QTBCXHVGRjBDXHU0RjQ2XHU0RjFBXHU4QkIwXHU1RjU1XHU4QkU2XHU3RUM2XHU3Njg0XHU5NTE5XHU4QkVGXHU0RkUxXHU2MDZGXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogXHU1MjFCXHU1RUZBIFVuaUFwcCBcdTY3MkNcdTU3MzBcdTUzOUZcdTc1MUZcdTYzRDJcdTRFRjZcdThENDRcdTZFOTBcdTU5MERcdTUyMzZcdTYzRDJcdTRFRjZcdTc2ODRcdTRGQkZcdTYzNzdcdTUxRkRcdTY1NzBcclxuICpcclxuICogXHU4RkQ5XHU2NjJGXHU0RTAwXHU0RTJBXHU0RkJGXHU2Mzc3XHU3Njg0XHU1REU1XHU1MzgyXHU1MUZEXHU2NTcwXHVGRjBDXHU3NTI4XHU0RThFXHU1RkVCXHU5MDFGXHU1MjFCXHU1RUZBXHU2M0QyXHU0RUY2XHU1QjlFXHU0RjhCXHJcbiAqIFx1NzI3OVx1NTIyQlx1OTAwMlx1NzUyOFx1NEU4RVx1NTcyOCB2aXRlLmNvbmZpZy50cyBcdTRFMkRcdThGREJcdTg4NENcdTY3NjFcdTRFRjZcdTYwMjdcdTYzRDJcdTRFRjZcdTkxNERcdTdGNkVcclxuICpcclxuICogXHU0RjdGXHU3NTI4XHU3OTNBXHU0RjhCXHVGRjFBXHJcbiAqIGBgYHR5cGVzY3JpcHRcclxuICogLy8gXHU1NzI4IHZpdGUuY29uZmlnLnRzIFx1NEUyRFxyXG4gKiBwbHVnaW5zOiBbXHJcbiAqICAgLy8gXHU0RUM1XHU1NzI4IGFwcCBcdTVFNzNcdTUzRjBcdTRFMTRcdTU0MkZcdTc1MjhcdTY1RjZcdTc1MUZcdTY1NDhcclxuICogICBVTklfUExBVEZPUk0gPT09ICdhcHAnXHJcbiAqICAgICA/IGNyZWF0ZUNvcHlOYXRpdmVSZXNvdXJjZXNQbHVnaW4oXHJcbiAqICAgICAgICAgVklURV9DT1BZX05BVElWRV9SRVNfRU5BQkxFID09PSAndHJ1ZScsXHJcbiAqICAgICAgICAgeyB2ZXJib3NlOiBtb2RlID09PSAnZGV2ZWxvcG1lbnQnIH1cclxuICogICAgICAgKVxyXG4gKiAgICAgOiBudWxsLFxyXG4gKiBdXHJcbiAqIGBgYFxyXG4gKlxyXG4gKiBAcGFyYW0gZW5hYmxlIFx1NjYyRlx1NTQyNlx1NTQyRlx1NzUyOFx1NjNEMlx1NEVGNlx1RkYwQ1x1OTAxQVx1NUUzOFx1OTAxQVx1OEZDN1x1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRlx1NjNBN1x1NTIzNlxyXG4gKiBAcGFyYW0gb3B0aW9ucyBcdTUxNzZcdTRFRDZcdTkxNERcdTdGNkVcdTkwMDlcdTk4NzlcdUZGMENcdTRFMERcdTUzMDVcdTU0MkIgZW5hYmxlIFx1NUM1RVx1NjAyN1xyXG4gKiBAcmV0dXJucyBWaXRlIFx1NjNEMlx1NEVGNlx1NUJGOVx1OEM2MVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNvcHlOYXRpdmVSZXNvdXJjZXNQbHVnaW4oXHJcbiAgZW5hYmxlOiBib29sZWFuID0gdHJ1ZSxcclxuICBvcHRpb25zOiBPbWl0PENvcHlOYXRpdmVSZXNvdXJjZXNPcHRpb25zLCAnZW5hYmxlJz4gPSB7fSxcclxuKTogUGx1Z2luIHtcclxuICByZXR1cm4gY29weU5hdGl2ZVJlc291cmNlcyh7IGVuYWJsZSwgLi4ub3B0aW9ucyB9KVxyXG59XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRTpcXFxcY29kZVxcXFxsaWp1bnhpXFxcXHRlbXBcXFxccmVzdW1lXFxcXHJlc3VtZS1hcHBcXFxcdml0ZS1wbHVnaW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFxjb2RlXFxcXGxpanVueGlcXFxcdGVtcFxcXFxyZXN1bWVcXFxccmVzdW1lLWFwcFxcXFx2aXRlLXBsdWdpbnNcXFxcc3luYy1tYW5pZmVzdC1wbHVnaW5zLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi9jb2RlL2xpanVueGkvdGVtcC9yZXN1bWUvcmVzdW1lLWFwcC92aXRlLXBsdWdpbnMvc3luYy1tYW5pZmVzdC1wbHVnaW5zLnRzXCI7aW1wb3J0IHR5cGUgeyBQbHVnaW4gfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgZnMgZnJvbSAnbm9kZTpmcydcclxuaW1wb3J0IHBhdGggZnJvbSAnbm9kZTpwYXRoJ1xyXG5pbXBvcnQgcHJvY2VzcyBmcm9tICdub2RlOnByb2Nlc3MnXHJcblxyXG5pbnRlcmZhY2UgTWFuaWZlc3RUeXBlIHtcclxuICAncGx1cyc/OiB7XHJcbiAgICBkaXN0cmlidXRlPzoge1xyXG4gICAgICBwbHVnaW5zPzogUmVjb3JkPHN0cmluZywgYW55PlxyXG4gICAgfVxyXG4gIH1cclxuICAnYXBwLXBsdXMnPzoge1xyXG4gICAgZGlzdHJpYnV0ZT86IHtcclxuICAgICAgcGx1Z2lucz86IFJlY29yZDxzdHJpbmcsIGFueT5cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHN5bmNNYW5pZmVzdFBsdWdpbigpOiBQbHVnaW4ge1xyXG4gIHJldHVybiB7XHJcbiAgICBuYW1lOiAnc3luYy1tYW5pZmVzdCcsXHJcbiAgICBhcHBseTogJ2J1aWxkJyxcclxuICAgIGVuZm9yY2U6ICdwb3N0JyxcclxuICAgIHdyaXRlQnVuZGxlOiB7XHJcbiAgICAgIG9yZGVyOiAncG9zdCcsXHJcbiAgICAgIGhhbmRsZXIoKSB7XHJcbiAgICAgICAgY29uc3Qgc3JjTWFuaWZlc3RQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksICcuL3NyYy9tYW5pZmVzdC5qc29uJylcclxuICAgICAgICBjb25zdCBkaXN0QXBwUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCAnLi9kaXN0L2Rldi9hcHAvbWFuaWZlc3QuanNvbicpXHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAvLyBcdThCRkJcdTUzRDZcdTZFOTBcdTY1ODdcdTRFRjZcclxuICAgICAgICAgIGNvbnN0IHNyY01hbmlmZXN0ID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoc3JjTWFuaWZlc3RQYXRoLCAndXRmOCcpKSBhcyBNYW5pZmVzdFR5cGVcclxuXHJcbiAgICAgICAgICAvLyBcdTc4NkVcdTRGRERcdTc2RUVcdTY4MDdcdTc2RUVcdTVGNTVcdTVCNThcdTU3MjhcclxuICAgICAgICAgIGNvbnN0IGRpc3RBcHBEaXIgPSBwYXRoLmRpcm5hbWUoZGlzdEFwcFBhdGgpXHJcbiAgICAgICAgICBpZiAoIWZzLmV4aXN0c1N5bmMoZGlzdEFwcERpcikpIHtcclxuICAgICAgICAgICAgZnMubWtkaXJTeW5jKGRpc3RBcHBEaXIsIHsgcmVjdXJzaXZlOiB0cnVlIH0pXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gXHU4QkZCXHU1M0Q2XHU3NkVFXHU2ODA3XHU2NTg3XHU0RUY2XHVGRjA4XHU1OTgyXHU2NzlDXHU1QjU4XHU1NzI4XHVGRjA5XHJcbiAgICAgICAgICBsZXQgZGlzdE1hbmlmZXN0OiBNYW5pZmVzdFR5cGUgPSB7fVxyXG4gICAgICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoZGlzdEFwcFBhdGgpKSB7XHJcbiAgICAgICAgICAgIGRpc3RNYW5pZmVzdCA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGRpc3RBcHBQYXRoLCAndXRmOCcpKVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIFx1NTk4Mlx1Njc5Q1x1NkU5MFx1NjU4N1x1NEVGNlx1NUI1OFx1NTcyOCBwbHVnaW5zXHJcbiAgICAgICAgICBpZiAoc3JjTWFuaWZlc3RbJ2FwcC1wbHVzJ10/LmRpc3RyaWJ1dGU/LnBsdWdpbnMpIHtcclxuICAgICAgICAgICAgLy8gXHU3ODZFXHU0RkREXHU3NkVFXHU2ODA3XHU2NTg3XHU0RUY2XHU0RTJEXHU2NzA5XHU1RkM1XHU4OTgxXHU3Njg0XHU1QkY5XHU4QzYxXHU3RUQzXHU2Nzg0XHJcbiAgICAgICAgICAgIGlmICghZGlzdE1hbmlmZXN0LnBsdXMpXHJcbiAgICAgICAgICAgICAgZGlzdE1hbmlmZXN0LnBsdXMgPSB7fVxyXG4gICAgICAgICAgICBpZiAoIWRpc3RNYW5pZmVzdC5wbHVzLmRpc3RyaWJ1dGUpXHJcbiAgICAgICAgICAgICAgZGlzdE1hbmlmZXN0LnBsdXMuZGlzdHJpYnV0ZSA9IHt9XHJcblxyXG4gICAgICAgICAgICAvLyBcdTU5MERcdTUyMzYgcGx1Z2lucyBcdTUxODVcdTVCQjlcclxuICAgICAgICAgICAgZGlzdE1hbmlmZXN0LnBsdXMuZGlzdHJpYnV0ZS5wbHVnaW5zID0gc3JjTWFuaWZlc3RbJ2FwcC1wbHVzJ10uZGlzdHJpYnV0ZS5wbHVnaW5zXHJcblxyXG4gICAgICAgICAgICAvLyBcdTUxOTlcdTUxNjVcdTY2RjRcdTY1QjBcdTU0MEVcdTc2ODRcdTUxODVcdTVCQjlcclxuICAgICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhkaXN0QXBwUGF0aCwgSlNPTi5zdHJpbmdpZnkoZGlzdE1hbmlmZXN0LCBudWxsLCAyKSlcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1x1MjcwNSBNYW5pZmVzdCBwbHVnaW5zIFx1NTQwQ1x1NkI2NVx1NjIxMFx1NTI5RicpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgY29uc29sZS5lcnJvcignXHUyNzRDIFx1NTQwQ1x1NkI2NSBtYW5pZmVzdCBwbHVnaW5zIFx1NTkzMVx1OEQyNTonLCBlcnJvcilcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH1cclxufVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWdULE9BQU9BLFdBQVU7QUFDalUsT0FBT0MsY0FBYTtBQUNwQixPQUFPLFNBQVM7QUFDaEIsU0FBUyxrQkFBa0I7QUFDM0IsT0FBTyxtQkFBbUI7QUFFMUIsT0FBTyxnQkFBZ0I7QUFFdkIsT0FBTyxpQkFBaUI7QUFFeEIsT0FBTyxjQUFjO0FBR3JCLE9BQU8saUJBQWlCO0FBTXhCLE9BQU8scUJBQXFCO0FBRTVCLE9BQU8sZUFBZTtBQUN0QixPQUFPLFdBQVc7QUFDbEIsU0FBUyxrQkFBa0I7QUFD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QTtBQUFBLFFBS1Q7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBRUEsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBS0MsTUFBSyxLQUFLRCxTQUFRLElBQUksR0FBRyxPQUFPO0FBQUEsUUFDckMsUUFBUUMsTUFBSyxLQUFLRCxTQUFRLElBQUksR0FBRyxxQkFBcUI7QUFBQSxNQUN4RDtBQUFBLElBQ0Y7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLEtBQUs7QUFBQSxNQUNMLE1BQU0sT0FBTyxTQUFTLGVBQWUsRUFBRTtBQUFBO0FBQUEsTUFFdkMsT0FBTyxLQUFLLE1BQU0scUJBQXFCLElBQ25DO0FBQUEsUUFDRSxDQUFDLHFCQUFxQixHQUFHO0FBQUEsVUFDdkIsUUFBUTtBQUFBLFVBQ1IsY0FBYztBQUFBO0FBQUEsVUFFZCxTQUFTLENBQUFDLFVBQ1BBLE1BQUssUUFBUSxJQUFJLE9BQU8sSUFBSSxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7QUFBQSxRQUM1RDtBQUFBLE1BQ0YsSUFDQTtBQUFBLElBQ047QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE1BQU0sd0JBQXdCLFNBQVMsQ0FBQyxXQUFXLFVBQVUsSUFBSSxDQUFDO0FBQUEsSUFDcEU7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNMLFdBQVc7QUFBQTtBQUFBO0FBQUEsTUFHWCxRQUFRO0FBQUE7QUFBQSxNQUVSLFFBQVEsU0FBUyxnQkFBZ0IsUUFBUTtBQUFBLElBQzNDO0FBQUEsRUFDRixDQUFDO0FBQ0gsQ0FBQzsiLAogICJuYW1lcyI6IFsicGF0aCIsICJwcm9jZXNzIiwgInBhdGgiLCAicHJvY2VzcyIsICJmcyIsICJwcm9jZXNzIiwgInBhdGgiLCAiZnMiLCAiZnMiLCAicGF0aCIsICJwcm9jZXNzIiwgInBhdGgiLCAicHJvY2VzcyIsICJmcyIsICJwcm9jZXNzIiwgInBhdGgiXQp9Cg==
