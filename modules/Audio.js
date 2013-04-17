/**
 *
 * The Audio Module provides classes which give access to audio capabilities of
 * the web browser and use them easily in an easy way.
 *
 *
 * The first class to know is {{#crossLink "Audio.Sound"}}Sound{{/crossLink}}, primary brick of audio system.
 * It represent an `<audio>` tag, ie a Sound object, which can be played.
 *
 *
 * By default, HTML Audio objects can't be played twice in the same time.
 * However, it's a feature often used in many games.<br />
 * The {{#crossLink "Audio.Channel"}}Channel{{/crossLink}} class allow to do this, using many identical `Sound` objects.
 *
 *
 * Finally, the {{#crossLink "Audio.Manager"}}Manager{{/crossLink}} class can control
 * many Channels for do globals operations (like mute all sounds, or changing the global volume).
 *
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

