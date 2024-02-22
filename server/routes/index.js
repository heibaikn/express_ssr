var express = require("express");
var router = express.Router();
var { readFileSync } = require("fs");
var path = require('path');
const { createSSRApp } = require("vue");
const { renderToString } = require("vue/server-renderer");
const { getSirvPaths } = require('../utils/index');
// const { createApp } = require('../www/app');
// import { createApp } from '../www/app';
// import { createSSRApp } from 'vue'
// Vue 的服务端渲染 API 位于 `vue/server-renderer` 路径下
// import { renderToString } from ''

const app = createSSRApp({
  data: () => ({ count: 1 }),
  template: `<button @click="count++">{{ count }}</button>`,
});
// router.get('/about', function (req, res, next) {
//   console.log("134");
//   renderToString(app).then((html) => {
//     res.render('about/index', { title: 'Express', abc: html });
//   })
// });
/* GET home page. */
// 方式1： 直接读取文件
router.get("/index", async function (req, res, next) {
  getSirvPaths(req, "index/index")
  let appHtml = await renderToString(app).then((html) => {
    let indexHTML = readFileSync(
      path.resolve(__dirname, "../../dist/page/index/index.html"),
      { encoding: "utf8" }
    );
    return indexHTML.replace(`<!--button-html-->`, html);
  });
  res.send(appHtml);
});
// 方式2： 使用 views模板
router.get("/index2", async function (req, res, next) {
  let appHtml = await renderToString(app).then((html) => {
    let indexHTML = readFileSync(
      path.resolve(__dirname, "../../dist/index.html"),
      { encoding: "utf8" }
    );
    return indexHTML.replace(`<!--app-html-->`, html);
  });
  res.send(appHtml);
});

module.exports = router;
