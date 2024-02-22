const fs = require("fs");
const express = require("express");
// import fs from 'node:/promises'
// import express from 'express'

// Constants
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 5173;
const base = process.env.BASE || "/";

// Cached production assets
const templateHtml = isProduction
  ? fs.readFileSync("./dist/client/index.html", "utf-8")
  : "";
const ssrManifest = isProduction
  ? fs.readFileSync("./dist/client/.vite/ssr-manifest.json", "utf-8")
  : undefined;

// Create http server
const app = express();

// Add Vite or respective production middlewares
let vite;
(async () => {
  if (!isProduction) {
    const { createServer } = await require("vite");
    vite = await createServer({
      root: "./web/app1",
      configFile: "./web/app1/vite.config.js",
      server: { middlewareMode: true },
      appType: "custom",
      base,
    });
    app.use((req, res, next) => {
      console.log("middlewares", req.url);
      vite.middlewares.handle(req, res, next);
    });
  } else {
    const compression = await require("compression");
    const sirv = await require("sirv");
    app.use(compression());
    app.use(base, sirv("./dist/client", { extensions: [] }));
  }
  // Serve HTML
  app.use("*", async (req, res) => {
    console.log(req.url, req.originalUrl);
    try {
      const url = req.originalUrl.replace(base, "");

      let template;
      let render;
      if (!isProduction) {
        // Always read fresh template in development
        template = fs.readFileSync("./web/app1/index.html", "utf-8");
        template = await vite.transformIndexHtml(url, template);
        const entryServer = await vite.ssrLoadModule("/entry-server.js");
        render = entryServer.render;
      } else {
        template = templateHtml;
        const entryServer= await require("./dist/server/entry-server.js")
        render = entryServer.render;
      }

      const rendered = await render(url, ssrManifest);

      const html = template
        .replace(`<!--app-head-->`, rendered.head ?? "")
        .replace(`<!--app-html-->`, rendered.html ?? "");

      res.status(200).set({ "Content-Type": "text/html" }).send(html);
    } catch (e) {
      vite?.ssrFixStacktrace(e);
      console.log(e.stack);
      res.status(500).end(e.stack);
    }
  });

  // Start http server
  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
  });
})();
