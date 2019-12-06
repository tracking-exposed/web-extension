import dotenv from "dotenv";
import copy from "rollup-plugin-copy";
import json from "rollup-plugin-json";
import svelte from "rollup-plugin-svelte";
import resolve from "rollup-plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import commonjs from "rollup-plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";

import fs from "fs";
import sass from "node-sass";

dotenv.config();
const production = !process.env.ROLLUP_WATCH;
const config = {
  production,
  ...(production
    ? {}
    : {
        autologin: true,
        autologinEmail: process.env.AUTOLOGIN_EMAIL,
        autologinPassword: process.env.AUTOLOGIN_PASSWORD
      })
};

function setConfig() {
  return replace({
    __CONFIG__: JSON.stringify(config)
  });
}

function compileSCSS() {
  const result = sass.renderSync({
    file: "src/styles/main.scss"
  });
  fs.mkdirSync("build/styles/theme", { recursive: true });
  fs.writeFileSync("build/styles/theme/main.css", result.css);
}

compileSCSS();

export default [
  // Background is just javascript, without a UI.
  {
    input: "src/background/",
    output: {
      sourcemap: true,
      format: "iife",
      name: "background",
      file: "build/background/bundle.js"
    },
    plugins: [
      setConfig(),
      copy({
        targets: [
          {
            src: "src/manifest.json",
            dest: "build/"
          },
          {
            src: "src/_locales",
            dest: "build/"
          },
          {
            src: "src/images",
            dest: "build/"
          },
          // Google doesn't give a (fire)fox about the `browser` namespace, so it's polyfill time!
          // More info: https://github.com/mozilla/webextension-polyfill
          {
            src: "node_modules/webextension-polyfill/dist/browser-polyfill.js",
            dest: "build/"
          },
          {
            src: "theme-trex/static/fonts",
            dest: "build/"
          }
        ]
      }),
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
      sourcemap: true,
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
          css.write("build/default_popup/bundle.css");
        }
      }),

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
    input: "src/content_scripts/facebook.com/",
    output: {
      sourcemap: true,
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
          css.write("build/content_scripts/facebook.com/bundle.css");
        }
      }),

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
