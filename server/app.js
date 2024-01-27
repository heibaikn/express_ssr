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

// view engine setup

app.engine('.html', ejs.__express)
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

if (!isProd) {
  ; (async () => {
    const root = process.cwd()
    const viteConfig = require(path.resolve(root,'www/package.json'));
    const server = await require('vite').createServer(viteConfig)
    app.set('views', path.join(__dirname, '../www/page'));
    app.use(server.middlewares)
  })()
} else {
  app.set('views', path.join(__dirname, '../dist/page'));
  app.use(express.static(path.join(__dirname, '../dist')));
}

module.exports = app;
