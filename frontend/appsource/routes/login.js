var express = require('express');
// We need this to build our post string
var querystring = require('querystring');
var https = require('https');
var fs = require('fs');
var crypto = require('crypto');
var oauthSignature = require("oauth-signature");
var url = require('url');
var mongoose = require('mongoose')
var router = express.Router();
var oauth_token="";
var oauth_token_secret="";

mongoose.connect('mongodb://mongodb/test');

var userSchema = mongoose.Schema({
    name: String
});

var User = mongoose.model('User', userSchema);

/* GET users listing. */
router.get('/twitter', function(req, res, next) {
  sendTokenRequest(res);  
});

router.get('/callback', function(req, res, next) {
	console.log(req.headers);
	console.log(req.body);
	var url_parts = url.parse(req.url,true);
	var queryObj = url_parts.query;
	sendAccessTokenRequest(res,queryObj.oauth_verifier);
});

function getAuthHeader(host, path, httpMethod) {
	var url = "https://"+host+path;
	var callback = "http://171.68.114.231/login/callback";
	var oauth_callback = encodeURIComponent(callback);
	var oauth_consumer_key = "CouvyEOy4RajTz98bdFPKNIGU";
	var oauth_nonce = crypto.randomBytes(32).toString('hex');
	var consumerSecret = "AihzQGEdqwCIna64baTphLzAYQBGrFisDrMg8uB4AhXS2160oh";
	var oauth_signature_method = "HMAC-SHA1";
	var oauth_timestamp = Math.floor(Date.now() / 1000);
	var oauth_version = "1.0";
	var parameters = {};
	parameters.oauth_nonce=oauth_nonce;
	parameters.oauth_signature_method=oauth_signature_method;
	parameters.oauth_timestamp=oauth_timestamp;
	parameters.oauth_consumer_key=oauth_consumer_key;
	parameters.oauth_version=oauth_version;
	if(isEmpty(oauth_token)){
		parameters.oauth_callback=callback;
	}else{
		parameters.oauth_token=oauth_token;
	}
    console.log('oauth_token_secret:'+oauth_token_secret);
    var oauth_signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, oauth_token_secret);
  	console.log("oauth_signature: "+oauth_signature);
  	var authHeader = "OAuth oauth_consumer_key="+oauth_consumer_key+
		", oauth_nonce="+oauth_nonce+
		", oauth_signature="+oauth_signature+
		", oauth_signature_method="+oauth_signature_method+
		", oauth_timestamp="+oauth_timestamp+
		", oauth_version="+oauth_version;
  	if(isEmpty(oauth_token)){
		authHeader += ", oauth_callback="+oauth_callback;
	}else{
		authHeader += ", oauth_token="+oauth_token;
	}
	console.log("Auth Header: "+authHeader);
	return authHeader;
}

function sendTokenRequest(response) {
	var host = "api.twitter.com";
	var path = "/oauth/request_token";
	var httpMethod = 'POST';
	var authHeader = getAuthHeader(host, path, httpMethod);
	// An object of options to indicate where to post to
  	var post_options = {
		host: host,
		port: '443',
		path: path,
		method: httpMethod,
		headers: {
		  'Content-Type' : 'application/x-www-form-urlencoded',
		  'Authorization' : authHeader
		}
  	};
  	// Set up the request
	var post_req = https.request(post_options, function(res) {
	  res.setEncoding('utf8');
	  res.on('data', function (chunk) {
		  console.log('Response: ' + chunk);
		  var tokenResponse = querystring.parse(chunk);		  
		  if(tokenResponse.oauth_callback_confirmed){
		  	oauth_token = tokenResponse.oauth_token;
		  	response.write("{\"location\": \"https://api.twitter.com/oauth/authenticate?oauth_token="+tokenResponse.oauth_token+"\"}");
		  	response.end();
		  }else{
		  	response.write(chunk);
		  	response.end();
		  }		  	  
	  });
	  res.on('error', function(error) {
	  	console.log(error);
	  });
	});
	post_req.end();
}

function sendAccessTokenRequest(response,oauth_verifier) {
	var host = "api.twitter.com";
	var path = "/oauth/access_token";
	var httpMethod = 'POST';
	var authHeader = getAuthHeader(host, path, httpMethod);
	// An object of options to indicate where to post to
  	var post_options = {
		host: host,
		port: '443',
		path: path,
		method: httpMethod,
		headers: {
		  'Content-Type' : 'application/x-www-form-urlencoded',
		  'Authorization' : authHeader
		}
  	};
  	// Set up the request
	var post_req = https.request(post_options, function(res) {
	  res.setEncoding('utf8');
	  res.on('data', function (chunk) {
		  console.log('Response: ' + chunk);
		  var tokenResponse = querystring.parse(chunk);
		  oauth_token = tokenResponse.oauth_token;
		  oauth_token_secret = tokenResponse.oauth_token_secret;
		  sendUserIdentityRequest(response);
	  });
	  res.on('error', function(error) {
	  	console.log(error);
	  });
	});
	post_req.write("oauth_verifier="+oauth_verifier);
	post_req.end();
}

function sendUserIdentityRequest(response) {
	var host = "api.twitter.com";
	var path = "/1.1/account/verify_credentials.json";
	var httpMethod = 'GET';
	var authHeader = getAuthHeader(host, path, httpMethod);
	// An object of options to indicate where to post to
  	var post_options = {
		host: host,
		port: '443',
		path: path,
		method: httpMethod,
		headers: {
		  'Content-Type' : 'application/x-www-form-urlencoded',
		  'Authorization' : authHeader
		}
  	};
  	// Set up the request
	var post_req = https.request(post_options, function(res) {
	  res.setEncoding('utf8');
	  res.on('data', function (chunk) {
		  console.log('Response: ' + chunk);
		  var userIdentity = JSON.parse(chunk);
		  var user = {};
		  user.name = userIdentity.name;
		  var dbUser = new User;
		  dbUser.name = user.name;
		  dbUser.save();
		  response.render('home', { title: 'Smart Reader - Home', user: user});
	  });
	  res.on('error', function(error) {
	  	console.log(error);
	  });
	});
	post_req.end();
}

function isEmpty(str) {
	return (!str || 0 === str.length);
}

module.exports = router;