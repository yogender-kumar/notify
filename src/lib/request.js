var http = require('http'),
    url = require('url'),
    Promise = require('./promise'),
    vm = require('vm');


module.exports.request = function(path, data, type, options) {
  'use strict';
  
  if( path ) {
    return new Promise(function(resolve, reject) {
      var _options = {},
          _segments = url.parse(path),
          _processed_data;
		  
		  _options.followAllRedirects = true;
		  console.log(_segments.host+"------======"+_segments.hostname+"------======"+_segments.port+"------======"+_segments.path)
      
      if(_segments.host) { _options.host = _segments.host; }
      if(_segments.hostname) { _options.hostname = _segments.hostname; }
      _options.path = _segments.path;
      if(_segments.port) { _options.port = _segments.port || 80; }
      _options.method = (options && options.method) || 'GET';
      if( options && options.headers ) { _options.headers = options.headers; }

      if( options && options.dataType ) {
        options.dataType = options.dataType.toLowerCase();

        if( options.dataType === 'html' ) {
          _options.headers = _options.headers || {};
          if( data ) {
            _processed_data = JSON.stringify(data);
            _options.headers['Content-Type'] = type;
          }
          _options.headers.Accept = 'text/html, text/plain';
        }
      }

      var req = http.request(_options, function(res) {
        var data = '';

        res.on('data', function (chunk) {
          data = data + chunk;
        });

        res.on('end', function() {
          if( res.statusCode !== 200 ) { reject(data, res.headers); }
          if( options && options.dataType === 'html' ) {
            try { data } catch (er) { reject(er); }
          }
          resolve(data, res.headers);
        });
      });

      req.on('error', function(er){
		  console.log(er);
		  reject
	  });

      if(_processed_data) { req.write(_processed_data); }
      req.end();
    });
  }

  return Promise.reject('Url not given');
};

