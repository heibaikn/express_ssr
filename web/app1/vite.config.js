import { defineConfig } from "vite";
import clientConfig from "./build/build.client";
import ssrConfig from "./build/build.ssr";
import ssrDevConfig from './build/dev.ssr';

let config 
switch (process.env.BUILD) {
  case "client":
    config = clientConfig;
    break;
  case "ssr":
    config = ssrConfig;
    break;
  default:
    config = ssrDevConfig;
}

export default defineConfig(config);
