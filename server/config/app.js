var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var cookieParser = require('cookie-parser');
var config = require('./config')
//connect to MongoDB

module.exports.init = function() {

  mongoose.connect(config.storageConfig.db);
  var db = mongoose.connection;

  //handle mongo error
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function () {
	console.log("MongoDB connection established.");
    // we're connected!
  });
  app.use(cookieParser());
  //use sessions for tracking logins
  app.use(session({

    secret: 'feretredw4343dgrfde3456yhgfgd!#@#43cde^$',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db
    })
  }));

  app.use('/', express.static(__dirname + './../../client'));


  /**TODO 
  Use the listings router for requests to the api */

  // parse incoming requests
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  //Template for login received from https://github.com/Createdd/authenticationIntro



  // include routes
  var routes = require('./../routes/router');
  app.use('/api', routes);

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
  });

  // error handler
  // define as the last app.use callback
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
  });


  // listen on port 8080
  app.listen(config.port, function () {
    console.log('Express app listening on port', config.port);
  });

  return app
}