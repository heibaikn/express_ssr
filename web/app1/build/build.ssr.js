import merge from "merge";
import baseConfig from "./common";

export default merge({}, baseConfig, {
  build: {
    outDir: "../../dist/server",
    ssr: "entry-server.js",
    rollupOptions: {
      // input: "./entry-server.js",
      format: "cjs",
    },
  },
});
