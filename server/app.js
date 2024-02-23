var createError = require("http-errors");
var express = require("express");
const fs = require("fs");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var ejs = require("ejs");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
// const vite = require('vite');
var app = express();
const isProd = process.env.NODE_ENV === "production";

// Middleware for global state
app.use((req, res, next) => {
  req.appState = {
    isProd,
  };
  next();
});
// view engine setup

app.engine(".html", ejs.__express);
app.set("view engine", "html");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Constants
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 5173;
const base = process.env.BASE || "/";

let vite;
(async () => {
  // Cached production assets

  if (!isProduction) {
    const { createServer } = await require("vite");
    vite = await createServer({
      root: "../web/app1",
      configFile: "../web/app1/vite.config.js",
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
    app.use(base, sirv("../dist/client", { extensions: [] }));
  }
  // app.use("/index", indexRouter);
  // app.use("/users", usersRouter);
  // Serve HTML
  app.use("*", async (req, res) => {
    console.log(req.url, req.originalUrl);
    try {
      const url = req.originalUrl.replace(base, "");

      if (!isProduction) {
        // Always read fresh template in development
        let template = fs.readFileSync("../web/app1/index.html", "utf-8");
        template = await vite.transformIndexHtml(url, template);
        const entryServer = await vite.ssrLoadModule("/entry-server.js");
        const rendered = await entryServer.render(url);
        const html = template
          .replace(`<!--app-head-->`, rendered.head ?? "")
          .replace(`<!--app-html-->`, rendered.html ?? "");
        res.status(200).set({ "Content-Type": "text/html" }).send(html);
      } else {
        app.set("views", path.join(__dirname, "../dist/client"));
        const ssrManifest = fs.readFileSync(
          "../dist/client/.vite/ssr-manifest.json",
          "utf-8"
        );
        // let template = fs.readFileSync("../dist/client/index.html", "utf-8");
        const entryServer = await require("../dist/server/entry-server.js");
        const rendered = await entryServer.render(url, ssrManifest);
        res.render("index", {}, (err, template) => {
          const html = template
            .replace(`<!--app-head-->`, rendered.head ?? "")
            .replace(`<!--app-html-->`, rendered.html ?? "");
          res.status(200).set({ "Content-Type": "text/html" }).send(html);
        });
      }
    } catch (e) {
      vite?.ssrFixStacktrace(e);
      console.log(e.stack);
      res.status(500).end(e.stack);
    }
  });
})();

// catch 404 and forward to error handler

module.exports = app;
