var http = require('http'),
    url = require('url'),
    Promise = require('./promise'),
    vm = require('vm'),
	request = require('request');


module.exports.request = function(path, data, type, options) {
  'use strict';
  
  if( path ) {
    return new Promise(function(resolve, reject) {
      var _options = {},
          _segments = url.parse(path),
          _processed_data;
		  
		  _options.followAllRedirects = true;
		if(path.substring(0,7) == "http://" || path.substring(0,8) == "https://")
			_options.url = path;
		else
			_options.url = "http://"+path;
	  var req = request(_options, function (error, response, body) {
				if(error != "null")
					reject;
				resolve(body);
			});
    });
  }

  return Promise.reject('Url not given');
};

