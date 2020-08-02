var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//路由模块引入
var indexRouter = require('./routes/index');
var registerRouter = require("./routes/register");
var loginRouter = require("./routes/login");
var memberRouter = require("./routes/member");
var cartRouter = require("./routes/cart");
var getCodeRouter = require("./routes/getCode");
var goodsListRouter = require("./routes/list");
var detailRouter = require("./routes/detail");
var searchRouter = require("./routes/search");
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine("html", require("ejs").__express)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // 开启跨域支持
  res.header("Access-Control-Allow-Headers", "*"); // 跨域时, 允许前端携带的请求头字段
  next();
});
//路由模块使用
app.use('/', indexRouter);
app.use('/register', registerRouter);
app.use("/login", loginRouter);
app.use("/member", memberRouter);
app.use("/cart", cartRouter);
app.use("/getcode", getCodeRouter);
app.use("/goodslist", goodsListRouter);
app.use("/goodsdetail",detailRouter);
app.use("/search", searchRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
