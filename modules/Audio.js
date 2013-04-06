/**
 * TODO: describe module here.
 *
 * @module Audio
 * @main
 */


var TW = TW || {};

define([
	       './Audio/Sound',
	       './Audio/Manager',
	       './Audio/Channel'
       ], function() {
	return TW.Audio;
});

