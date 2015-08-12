'use strict';

// Log Config Done \\

var express = require('express'),
    cheerio = require('cheerio'),
    Promise = require('./lib/promise'),
    getRawBody = require('raw-body'),
    typer = require('media-typer'),
    timeout = require('connect-timeout'),
    steps = require('./lib/steps'),
    web = require('./lib/request'),
    parsePath = require('parse-filepath');

// create our app
var app = express();

app.use(function (req, res, next) {
  var encoding = ( ( req.headers['content-type'] && 
        ( encoding = typer.parse(req.headers['content-type']) ) &&
        ( ( encoding.parameters && encoding.parameters.charset ) || 'utf-8' ) ) || 'utf-8' );

  getRawBody(req, {
    length: req.headers['content-length'],
    limit: '1mb',
    encoding: encoding // utf8
  }, function (err, string) {
    if (err) { return next(err); }
    req.body = string;
    next();
  });
});

//Global Timeout
app.use(timeout(60000));

//Global error handling
app.use(function(err, req, res, next) {
  res.status(500).send(err.stack);
  next();
});



app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://notify.to');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    //res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


// A browser's default method is 'GET', so this
// is the route that express uses when we visit
// our site initially.
app.get('/', function(req, res){
  res.status(405).end();
});

var renderComponents = function(req, res) {
  Promise.resolve(req.body)
	.then(steps.resolveReq)
	.then(steps.invokeRequest)
	.then(steps.parseHTML)
	.then(steps.listMarkers)
	.then(steps.bundleMarker)
    .then(function(kwargs) {
		//console.log(kwargs.imageMarker);
		var d = "{'res':"+JSON.stringify(kwargs.imageMarker)+"}";
		res.send(kwargs.imageMarker);
      //res.send( $.html() );
    })['catch'](function(err) {
      res.status(500).send('Sorry, could not process your require at the movement');
    });
}

app.post('/', renderComponents);

app.listen(8012);




