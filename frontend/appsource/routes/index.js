var express = require('express');
var zerorpc = require("zerorpc");
var client = new zerorpc.Client();

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/home', function(req, res, next) {
	res.render('home', { title: 'Home'});
});

router.post('/findgems', function(req, res, next) {
	client.connect("tcp://backend:5000");
	console.log(req.body);
	client.invoke("hello", req.body.body, function(error, response, more) {
		    console.log(response);
		    res.write(JSON.stringify({ gems: response }));
		    res.end();
	});
});

module.exports = router;
