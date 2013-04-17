/**
 * @module Audio
 * @namespace Audio
 */

var TW = TW || {};
define(['./Sound', '../Utils/Polyfills'], function(Sound) {

	TW.Audio = TW.Audio || {};


	/**
	 * Channel class is an utility for manage multiple sounds with a same source.
	 *
	 * By default, a sound object can't be played twice simulaneously.
	 * The correct way to do this is to use the Channel class.
	 *
	 * A Channel is a group of many Sound objets using the same source (so the same music).
	 *
	 * @class Channel
	 * @constructor
	 * @param {String|String[]} src The source(s) of channel.
	 *   If many values are passed, the first compatible are used.
	 * @param {Number} max The number of sound allocated in this channel.
	 * @param {Number} id The identifier of the channel.
	 */
	function Channel(src, max, id) {

		/**
		 * Array of Sound.
		 *
		 * @property {Sound[]} _sounds
		 * @default []
		 */
		this._sounds = [];

		/**
		 * Callback function when all sound is ready to play in this channel.
		 *
		 * @property {Function} allSoundsReady
		 * @default null
		 */
		this.allSoundsReady = null;

		/**
		 * Source sound for this channel.
		 * Can contains many values (first compatible are used).
		 *
		 * @property {String|String[]} _src
		 * @private
		 */
		this._src = src;

		/**
		 * Channel id.
		 *
		 * @property {Number} id
		 * @default id
		 * @readonly
		 */
		this.id = id;

		this.add(max);
	}

	/**
	 * Add max sound instance with sources in channel.
	 *
	 * @method add
	 * @param {Number} max The number of sound allocated in this channel.
	 */
	Channel.prototype.add = function(max) {

		while (this._sounds.length < max) {
			this._sounds.push(new Sound(this._src));
		}
	};

	/**
	 * Load all sound.
	 *
	 * @method load
	 */
	Channel.prototype.load = function() {
		var handleAllSoundsReady = function() {
			if (this.allSoundsReady !== null) {
				this.allSoundsReady(this);
			}
		}.bind(this);

		for (var i = 0; i < this._sounds.length; ++i) {
			var sound = this._sounds[i];
			if (i === 0) {
				sound.onReady = handleAllSoundsReady;
			}
			sound.load(0, 0, 1);
		}
	};

	/**
	 * Get a playable sound.
	 *
	 * @method getPlayableSound
	 * @return {Object} A playable sound.
	 */
	Channel.prototype.getPlayableSound = function() {
		for (var i = 0; i < this._sounds.length; ++i) {
			var sound = this._sounds[i];
			if (sound.playState !== TW.Audio.AUDIO_PLAYED) {
				return sound;
			}
		}
		this._sounds[0].stop();
		return this._sounds[0];
	};

	/**
	 * Applies the command to all sounds.
	 *
	 * @method _tellAllSounds
	 * @param {String} command commands availables:
	 *
	 *  - `"pause"`
	 *  - `"resume"`
	 *  - `"setVolume"`
	 *  - `"mute"`
	 *  - `"stop"`
	 *
	 * @param {*} [value] argument
	 * @private
	 */
	Channel.prototype._tellAllSounds = function(command, value) {

		for (var i = this._sounds.length - 1; i >= 0; --i) {
			var sound = this._sounds[i];
			switch (command) {
				case "pause":
					sound.pause();
					break;
				case "resume":
					sound.resume();
					break;
				case "setVolume":
					sound.setVolume(value);
					break;
				case "mute":
					sound.mute(value);
					break;
				case "stop":
					sound.stop();
					break;
				default:
			}
		}
	};

	/**
	 * Mute or Unmute all sound in this channel.
	 *
	 * @method setMute
	 * @param {Boolean} isMuted True for mute or false for unmute.
	 */
	Channel.prototype.setMute = function(isMuted) {
		this._tellAllSounds("mute", isMuted);
	};

	/**
	 * Pause all sound in this channel.
	 *
	 * @method pause
	 */
	Channel.prototype.pause = function() {
		this._tellAllSounds("pause", null);
	};

	/**
	 * Resume all sound in this channel.
	 *
	 * @method resume
	 */
	Channel.prototype.resume = function() {
		this._tellAllSounds("resume", null);
	};

	/**
	 * Stop all sound in this channel.
	 *
	 * @method stop
	 */
	Channel.prototype.stop = function() {
		this._tellAllSounds("stop", null);
	};

	/**
	 * Set a volume for all sound in this channel.
	 *
	 * @method setMasterVolume
	 * @param {Number} value The value of volume needed. min: 0.0 -> max: 1.0
	 */
	Channel.prototype.setMasterVolume = function(value) {
		this._tellAllSounds("setVolume", value);
	};

	TW.Audio.Channel = Channel;
	return Channel;
});
