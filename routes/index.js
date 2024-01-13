var express = require('express');
var router = express.Router();
const { createSSRApp } = require('vue');
const { renderToString } = require('vue/server-renderer');
// const { createApp } = require('../www/app');
// import { createApp } from '../www/app';
// import { createSSRApp } from 'vue'
// Vue 的服务端渲染 API 位于 `vue/server-renderer` 路径下
// import { renderToString } from ''

const app = createSSRApp({
  data: () => ({ count: 1 }),
  template: `<button @click="count++">{{ count }}</button>`
})
router.get('/about', function (req, res, next) {
  console.log("134");
  renderToString(app).then((html) => {
    res.render('page/about/index', { title: 'Express', abc: html });
  })
});
/* GET home page. */
router.get('/', function (req, res, next) {
  renderToString(app).then((html) => {
    res.render('page/index/index', { title: 'Express', abc: html });
  })
});


module.exports = router;
