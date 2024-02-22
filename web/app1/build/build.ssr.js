import merge from "merge";
import baseConfig from "./common";
import commonjs from "@rollup/plugin-commonjs";

export default merge({}, baseConfig, {
  build: {
    outDir: "../../dist/server",
    ssr: "entry-server.js",
    rollupOptions: {
      output: {
        format: "cjs",
        entryFileNames: 'entry-server.js'
      },
      plugins: [commonjs()],
    },
  },
});
