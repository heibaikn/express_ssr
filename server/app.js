var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// const vite = require('vite');
var app = express();
const isProd = process.env.NODE_ENV === 'production';

// Middleware for global state
app.use((req, res, next) => {
  req.appState = {
      isProd,
  };
  next(); // 将控制权传递给下一个中间件
});
// view engine setup

app.engine('.html', ejs.__express)
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
if (!isProd) {
  ; (async () => {
    // const root = process.cwd()
    // const viteConfig = require(path.resolve(root,'www/package.json'));
    // const server = await require('vite').createServer(viteConfig)
    app.use(express.static(path.join(__dirname, '../dist')));
    app.set('views', path.join(__dirname, '../dist/page'));
    // app.use(server.middlewares)
  })()
} else {
  // app.set('views', path.join(__dirname, '../dist/page'));
  // app.use(express.static(path.join(__dirname, '../dist')));
}

app.use('/index', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler

app.get('*', (req, res) => {
  console.log('req.url', req.url);
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});




module.exports = app;
