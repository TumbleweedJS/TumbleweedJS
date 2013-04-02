/**
 * TODO: describe module here.
 *
 * @module Audio
 * @main
 */


var TW = TW || {};

define([
	       './audio/Sound',
	       './audio/Manager',
	       './audio/Channel'
       ], function() {
	return TW.Audio;
});

