import merge from "merge";
import baseConfig from "./common";
// https://vitejs.dev/config/

export default merge({},baseConfig, {
  build: {
    outDir: "../../dist/client",
    ssrManifest: true,
  },
});
