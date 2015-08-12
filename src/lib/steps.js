/**
 *
 */
'use strict';

var cheerio = require('cheerio'),
    Promise = require('./promise'),
	web = require('./req'),
    parsePath = require('parse-filepath'),
    extend = require('extend');
	
/**
 * Some default config details for the module
 */
var steps = {
  MARKER_SELECTORS : ['meta[property="og:image"]', 'img'].join(','),
  //MARKER_SELECTORS : 'img',
  PLAY_REQ_CONF: {dataType: 'html', method: 'GET'}
};

/**
 * it would parse the content into cherrio.
 *
 * @return cherrio instance
 */
steps.parseHTML = function toDon(kwargs) {
  return cheerio.load.apply(cheerio, kwargs.source);
}

/**
 * Go through the cherrio dom and find the image tags.
 * We find both the meta og:image & img tag.
 *
 * @param $ cherrio instance
 * @return Object with $, imageMarker
 */
steps.listMarkers = function($) {
  var imageMarker = $(steps.MARKER_SELECTORS);
  return {
    '$': $,
    imageMarker: imageMarker
  };
};
 
 /**
 * Invoke the Request End-Point and get the response
 */
steps.invokeRequest = function(kwargs) {
  return web.request(kwargs, {}, "text/html", steps.PLAY_REQ_CONF)
    .then(function(data) {
		return {source:[data]};
    });
};
/**
 * Checck if url is valid or not
 */
 steps.resolveReq = function(kwargs){
	 var uri = decodeURIComponent(kwargs);
	 if(uri == "" && uri){}
	 return uri;
 }


steps.bundleMarker = function(kwargs) {
  if( kwargs && kwargs.$ && kwargs.imageMarker ) {
    var $ = kwargs.$,
        imageNodes = kwargs.imageMarker,
        imageMap = {};

    imageNodes.each(function(index) {
      var $imageMarker = $(this);
      try {
		  var tagName = $imageMarker[0].name;
        var imageSrc = $imageMarker[0].name == "meta" ? $imageMarker.attr("content") : $imageMarker.attr('src');
        imageMap[index] = extend(true, imageMap[imageSrc], {"src":imageSrc} );
		if(index == 2)
			return false;
      } catch(err) {
		  console.log(err.message);
      }
    });
    return (kwargs.imageMarker = imageMap) && kwargs;
  }
};


module.exports = steps;
