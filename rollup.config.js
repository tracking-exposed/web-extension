import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import sass from "node-sass";
import { execSync } from "child_process";

import alias from "@rollup/plugin-alias";
import copy from "rollup-plugin-copy";
import json from "rollup-plugin-json";
import globals from "rollup-plugin-node-globals";
import builtins from "rollup-plugin-node-builtins";
import svelte from "rollup-plugin-svelte";
import resolve from "rollup-plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import commonjs from "rollup-plugin-commonjs";
import strip from "@rollup/plugin-strip";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";

import packageJson from "./package.json";

dotenv.config();
const production = !process.env.ROLLUP_WATCH;
const build = execSync("git rev-parse --short HEAD")
  .toString()
  .trim();
const config = {
  production,
  build,
  ...(production
    ? {
        version: packageJson.version,
        apiEndpoint: "https://collector.facebook.tracking.exposed/api/v1/"
      }
    : {
        version: "dev",
        autologin: true,
        autologinEmail: process.env.AUTOLOGIN_EMAIL,
        autologinPassword: process.env.AUTOLOGIN_PASSWORD,
        apiEndpoint: "http://localhost:8100/api/v1/"
      })
};

function setConfig() {
  return replace({
    __CONFIG__: JSON.stringify(config)
  });
}

function setAlias() {
  const projectRootDir = path.resolve(__dirname);
  return alias({
    resolve: [".svelte", ".js"],
    entries: [
      {
        find: "src",
        replacement: path.resolve(projectRootDir, "src")
      }
    ]
  });
}

function compileSCSS() {
  const result = sass.renderSync({
    file: "src/styles/main.scss"
  });
  fs.mkdirSync("build/styles/theme", { recursive: true });
  fs.writeFileSync("build/styles/theme/main.css", result.css);
}

function compileManifest() {
  fs.mkdirSync("build/", { recursive: true });
  const manifest = JSON.parse(fs.readFileSync("src/manifest.json"));
  manifest.version = packageJson.version.split("-")[0];
  manifest.version_name = packageJson.version;
  if (production) {
    manifest.permissions = manifest.permissions.filter(
      p => !p.includes("localhost")
    );
  }
  fs.writeFileSync("build/manifest.json", JSON.stringify(manifest, null, 2));
}

compileSCSS();
compileManifest();

export default [
  {
    input: "src/background/",
    output: {
      sourcemap: !production,
      format: "iife",
      name: "background",
      file: "build/background/bundle.js"
    },
    plugins: [
      setConfig(),
      copy({
        targets: [
          {
            src: "src/_locales",
            dest: "build/"
          },
          {
            src: ["assets/images", "assets/fonts"],
            dest: "build/"
          },
          // Google doesn't give a (fire)fox about the `browser` namespace, so
          // it's polyfill time! More info:
          // https://github.com/mozilla/webextension-polyfill
          {
            src: "node_modules/webextension-polyfill/dist/browser-polyfill.js",
            dest: "build/"
          }
        ]
      }),

      setAlias(),
      globals(),
      builtins(),

      // If you have external dependencies installed from
      // npm, you'll most likely need these plugins. In
      // some cases you'll need additional configuration —
      // consult the documentation for details:
      // https://github.com/rollup/rollup-plugin-commonjs
      resolve({
        browser: true,
        dedupe: importee =>
          importee === "svelte" || importee.startsWith("svelte/")
      }),
      commonjs(),

      // Watch the `build` directory and refresh the
      // browser on changes when not in production
      //! production && livereload("build"),

      production &&
        strip({
          functions: ["console.debug"],
          sourceMap: false
        }),

      // If we're building for production (npm run build
      // instead of npm run dev), minify
      production && terser()
    ],
    watch: {
      clearScreen: true,
      chokidar: {
        usePolling: true
      }
    }
  },
  {
    input: "src/default_popup/",
    output: {
      sourcemap: !production,
      format: "iife",
      name: "default_popup",
      file: "build/default_popup/bundle.js"
    },
    plugins: [
      setConfig(),
      copy({
        targets: [
          {
            src: "src/default_popup/index.html",
            dest: "build/default_popup"
          }
        ]
      }),
      svelte({
        // enable run-time checks when not in production
        dev: !production,
        // we'll extract any component CSS out into
        // a separate file — better for performance
        css: css => {
          css.write("build/default_popup/bundle.css", !production);
        }
      }),

      setAlias(),
      // If you have external dependencies installed from
      // npm, you'll most likely need these plugins. In
      // some cases you'll need additional configuration —
      // consult the documentation for details:
      // https://github.com/rollup/rollup-plugin-commonjs
      resolve({
        browser: true,
        dedupe: importee =>
          importee === "svelte" || importee.startsWith("svelte/")
      }),
      commonjs(),

      // Watch the `build` directory and refresh the
      // browser on changes when not in production
      //! production && livereload("build"),

      production &&
        strip({
          functions: ["console.debug"],
          sourceMap: false
        }),

      // If we're building for production (npm run build
      // instead of npm run dev), minify
      production && terser()
    ],
    watch: {
      clearScreen: true,
      chokidar: {
        usePolling: true
      }
    }
  },
  {
    input: "src/domains/facebook.com/content_scripts/",
    output: {
      sourcemap: !production,
      format: "iife",
      name: "content_scripts",
      file: "build/content_scripts/facebook.com/bundle.js"
    },
    plugins: [
      setConfig(),
      svelte({
        // enable run-time checks when not in production
        dev: !production,
        // we'll extract any component CSS out into
        // a separate file — better for performance
        css: css => {
          css.write("build/content_scripts/facebook.com/bundle.css", !production);
        }
      }),

      setAlias(),

      // If you have external dependencies installed from
      // npm, you'll most likely need these plugins. In
      // some cases you'll need additional configuration —
      // consult the documentation for details:
      // https://github.com/rollup/rollup-plugin-commonjs
      resolve({
        browser: true,
        dedupe: importee =>
          importee === "svelte" || importee.startsWith("svelte/")
      }),
      commonjs(),

      // Watch the `build` directory and refresh the
      // browser on changes when not in production
      // !production && livereload("build"),

      production &&
        strip({
          functions: ["console.debug"],
          sourceMap: false
        }),

      // If we're building for production (npm run build
      // instead of npm run dev), minify
      production && terser()
    ],
    watch: {
      clearScreen: true,
      chokidar: {
        usePolling: true
      }
    }
  }
];
