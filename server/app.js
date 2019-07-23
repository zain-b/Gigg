var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');

var database = require('./config/database');
var apiRouter = require('./api/api.router');

var passport = require('passport');
var passportConfig = require('./config/passport');

var properties = require('./config/properties');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var dataSocket = require('./socket/data.socket');
/**
 * Add the Socket.io object to each request to allow controllers to emit events
 */
app.use(function(req, res, next){
    res.io = io;
    next();
});

/**
 * Allow cross-origin resource sharing.
 */
app.use(cors());

/**
 * Connect to database.
 */
database.connect();

/**
 * Configure passport with JSON Web Tokens for a stateless API.
 */
passportConfig.configure(passport);

/**
 * Set up sockets to emit new data to clients.
 */
dataSocket.setup(io);

/**
 * Passport middleware setup.
 */
app.use(passport.initialize());

/**
 * Uncomment after placing your favicon in /public
 * app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
 */
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(properties.uploadsRoute, express.static(path.join(__dirname, 'uploads')));

/**
 * Setup API router.
 */
app.use('/api', apiRouter);

/**
 * Setup express to render angular client statically.
 */
app.use('/',express.static(__dirname+'/../client/dist/client'));

app.use('/*', function (req, res) {
  res.sendFile(path.join(__dirname+'/../client/dist/client','index.html'))
});

/**
 * Catch 404 and forward to error handler.
 */
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/**
 * Error handler
 */
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = {app: app, server: server};
