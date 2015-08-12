/* global Promise:true */

if( typeof(Promise) === 'undefined' ) {
	Promise = module.exports = require('promise');
} else { module.exports = Promise; }

module.exports.sequence = function(promises) {
  'use strict';
  if(promises) {
  	return new Promise(function(resolve) {
      var keys = Object.keys(promises),
      		idx = keys.length,
        	data = {resolve: {}, reject: {}};

      keys.forEach(function(key) {
        function _handle(map, res) {
          map[key] = res;
          if( --idx < 1 ) {
            resolve(data);
          }
        }

        promises[key].then( _handle.bind(this, data.resolve), 
        	 _handle.bind(this, data.reject) );
      });

      if( !keys.length ) { resolve(); }
    });
  }
  return Promise.resolve();
};