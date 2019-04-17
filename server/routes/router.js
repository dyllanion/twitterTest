var express = require('express');
const http = require('http');
const https = require('https');
const Twitter = require('twitter');
var config = require('./../config/config.json');
var fs = require('fs');
var router = express.Router();
var User = require('../models/user');
var Trends = require('../models/data');

var client = new Twitter({
	consumer_key: config.consumer_key,
	consumer_secret: config.consumer_secret,
	access_token_key: config.access_token,
	access_token_secret: config.access_secret
});

/**
 * Handles GET requests to {@code /}, currently unused.
 */
router.get('/', function (req, res, next) {
  if(req.session.page_views){
    req.session.page_views++;
    res.send("You visited this page " + req.session.page_views + " times");
  } else {
      req.session.page_views = 1;
      res.send("Welcome to this page for the first time!");
  }
  // res.send("Got it")
});

/**
 * Handles POST requests to {@code /}, used for login actions.
 *
 * <p> When logging in, the body should contain {@code logemail} and {@code
 * logpassword} properties. </p>
 *
 * <p> For registration, the body should contain {@code email}, {@code
 * username}, {@code password}, and {@code passwordConf} properties.
 */
router.post('/', function (req, res, next) {
  // confirm that user typed same password twice
  if (req.body.password !== req.body.passwordConf) {
    // console.log("Password Mismatched! " , req.body)
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }

  if (req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.passwordConf) {
    // console.log("Registering")
    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    }

    User.create(userData, function (error, user) {
      if (error) {
        return res.json({ error: true })
      } else {
        req.session.userId = user;
        return res.json({ error: false })
      }
    });

  } else if (req.body.logemail && req.body.logpassword) {
    // console.log("Logging in!", req.cookies)
    User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        
        return res.json({ error: true }); 
      } else {
        req.session.user = user;
        // console.log("Session in Login is " , req.session)
        return res.json({ error: false })
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})

/* This function gets the IP of the user, queries for the closest trend location to their given IP, and gets the trend
	data from the Twitter API. */
router.get('/trend/onLoad', function (req, res, next) {
	http.get('http://api.ipstack.com/' + /*(req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress)*/"174.64.97.199" + '?access_key=f8fce154a9bb6ebe770d71b64d234cdf', (resp) => {
		let data = '';
		resp.on('data', (chunk) => {
			data += chunk;
		});
		
		resp.on('end', () => {
			var respo = JSON.parse(data);
			var lat = respo.latitude;
			var longi = respo.longitude;
			client.get('trends/closest', {lat: lat, long: longi}, function(error, tweets, response) {
				fs.writeFile("./server/routes/default.json", JSON.stringify(JSON.parse(response.body), null, 2), (err) => {
					if (err) throw err;
					else {
						fs.readFile("./server/routes/default.json", 'utf8', function (err, data) {
							if (err) throw err;
							else {
								data = JSON.parse(data);
								client.get('trends/place', {id: data[0].woeid}, function (error, tweets, response) {
									fs.writeFile("./server/routes/default.json", JSON.stringify(JSON.parse(response.body), null, 2) , (err) => {
										if (err) throw err;
										else {
										console.log("File written.");
										res.sendFile('./default.json', { root : __dirname});
										}
									});
								});
							}
						});
					}
				});
			});
		});
	}).on("error", (err) => {
		console.log("Error: " + err.message);
	});
})

router.get('/trend/:locat', function (req, res, next) {
	var parsedLocat = req.params.locat.replace(" ", "+");
	parsedLocat = parsedLocat.replace(",", "%2C");
	https.get('https://api.opencagedata.com/geocode/v1/json?q=' + parsedLocat + '&key=0aaeee7a557e4f6cb57326c5ac4ce5b3', (resp) => {
		let data = '';
		resp.on('data', (chunk) => {
			data+= chunk;
		});
		
		resp.on('end', () => {
			var respo = JSON.parse(data);
			var lat = respo.results[0].geometry.lat;
			var longi = respo.results[0].geometry.lng;
			client.get('trends/closest', {lat: lat, long: longi}, function(error, tweets, response) {
				fs.writeFile("./server/routes/output.json", JSON.stringify(JSON.parse(response.body), null, 2), (err) => {
					if (err) throw err;
					else {
						fs.readFile("./server/routes/output.json", 'utf8', function (err, data) {
							if (err) throw err;
							else {
								data = JSON.parse(data);
								client.get('trends/place', {id: data[0].woeid}, function (error, tweets, response) {
									fs.writeFile("./server/routes/output.json", JSON.stringify(JSON.parse(response.body), null, 2) , (err) => {
										if (err) throw err;
										else {
										console.log("File written.");
										res.sendFile('./output.json', { root : __dirname});
										}
									});
								});
							}
						});
					}
				});
			});
		});
	}).on("error", (err) => {
		console.log("Error: " + err.message);
	});
})

router.get('/search/:query', async (req, res, next) => {
	client.get('search/tweets', {q: req.params.query + "-filter:retweets-filter:replies", count: 15, result_type: "popular"}, function(error, tweets, response) {
		fs.writeFile("./server/routes/output.json", JSON.stringify(JSON.parse(response.body), null, 2) , (err) => {
			if (err) throw err;
			else {
				console.log("File written.");
				res.sendFile('./output.json', { root : __dirname});
			}
		});
	});
})

/**
 * Handles GET requests to {@code /users}, which returns a json result of all
 * registered users.
 */
router.get('/users', checkSignIn,  function (req, res, next) {
  // console.log("req.session " , req.session)

  User.find()
    .exec(function (error, users) {
      if (error) {
        return next(error);
      } else {
        if (users === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
            // console.log("Session is " , req.session.userId)
            res.json(users)
            
        }
      }
    });
  // res.json({error: "Hello"})
});


/**
 * Handles GET requests to {@code /profile}, currently non-operational.
 */
router.get('/profile', checkSignIn, function (req, res, next) {
  User.findById(req.session)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
          // return res.sendFile('./dashboard.html');
          res.json({ error: "Nothing here" })
        }
      }
    });
});

/**
 * Handles GET requests to {@code /logout}, which invalidate the users session
 * and return them to the login page.
 */
router.get('/logout', function (req, res, next) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        // console.log("Logout" , res)
        return res.redirect('/index.html');
      }
    });
});

function checkSignIn(req, res, next){
  if(req.session.user){
    // console.log("Session Exists!")
     return next();     //If session exists, proceed to page
  } else {
     var err = new Error("Not logged in!");
    //  console.log("Not Logged in!", req.session);
     next(err);  //Error, trying to access unauthorized page!
  }
}
module.exports = router;