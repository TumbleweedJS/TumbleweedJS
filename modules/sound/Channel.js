/**
 @module Sound
 @namespace Sound
 */

var TW = TW || {};

(function(TW) {

    if (typeof window.define === "function" && window.define.amd) {
        define(['../utils/Polyfills'], initWrap(init));
    } else {
        initWrap(init);
    }

    function initWrap(f) {
        TW.Sound = TW.Sound ||  {};
        TW.Sound.Channel = f();
        return TW.Sound.Channel;
    }


    function init() {

	/**
	 Channel class is utility for manage multiple sound with same source.

	 @class Channel
	 @constructor
	 @param {String} src The source of channel separated with '|' for multi-format.
	 @param {Number} max The number of sound allocated in this channel.
	 @param {Number} id The identifier of the channel.
	 */
	function Channel(src, max, id) {

		/**
		 Array of Sound.

		 @property sounds
		 @type Object
		 @default empty
		 **/
		this.sounds = [];

		/**
		 Volume of all sound in this channel.

		 @property volume
		 @type Number
		 @default 1
		 **/
		this.volume = 1;

		/**
		 Callback function when all sound is ready to play in this channel.

		 @property allSoundsReady
		 @type Function
		 @default null
		 **/
		this.allSoundsReady = null;

		this.allSoundsReadyHandler = this.handleAllSoundsReady.bind(this);

		/**
		 Source sound for this channel.

		 @property src
		 @type String
		 @default src
		 **/
		this.src = src;

		/**
		 Channel id.

		 @property id
		 @type Number
		 @default id
		 **/
		this.id = id;

		this.add(max);
	}

	/**
	 Add max sound instance with sources in channel.

	 @method add
	 @param {Number} max The number of sound allocated in this channel.
	 **/
	Channel.prototype.add = function(max) {

		while (this.sounds.length < max) {
			this.sounds.push(new TW.Sound.Sound(this.src));
		}
	};

	/**
	 Load all sound.

	 @method load
	 **/
	Channel.prototype.load = function() {

		for (var i = 0; i < this.sounds.length; ++i) {
			var sound = this.sounds[i];
			if (i === 0) {
				sound.onReady = this.allSoundsReadyHandler;
			}
			sound.load(0, 0, 1);
		}
	};

	/**
	 Get a playable sound.

	 @method getPlayableSound
	 @return {Object} A playable sound.
	 **/
	Channel.prototype.getPlayableSound = function() {
		var i = 0;
		var sound;

		for (i = 0; i < this.sounds.length; ++i) {
			sound = this.sounds[i];
			if (sound.playState != AUDIO_PLAYED) {
				return this.sounds[i];
			}
		}
		this.sounds[0].stop();
		return this.sounds[0];
	};

	Channel.prototype.handleAllSoundsReady = function(sound) {
		if (this.allSoundsReady != null) {
			this.allSoundsReady(this);
		}
	};

	Channel.prototype.tellAllSounds = function(command, value) {

		for (var i = this.sounds.length - 1; i >= 0; --i) {
			var sound = this.sounds[i];
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
	 Mute or Unmute all sound in this channel.

	 @method setMute
	 @param {Boolean} isMuted True for mute or false for unmute.
	 **/
	Channel.prototype.setMute = function(isMuted) {
		this.tellAllSounds("mute", isMuted);
	};

	/**
	 Pause all sound in this channel.

	 @method pause
	 **/
	Channel.prototype.pause = function() {
		this.tellAllSounds("pause", null);
	};

	/**
	 Resume all sound in this channel.

	 @method resume
	 **/
	Channel.prototype.resume = function() {
		this.tellAllSounds("resume", null);
	};

	/**
	 Stop all sound in this channel.

	 @method stop
	 **/
	Channel.prototype.stop = function() {
		this.tellAllSounds("stop", null);
	};

	/**
	 Set a volume for all sound in this channel.

	 @method setMasterVolume
	 @param {Number} value The value of volume needed. min: 0.0 -> max: 1.0
	 **/
	Channel.prototype.setMasterVolume = function(value) {
		this.tellAllSounds("setVolume", value);
	};

	return Channel;
    }

}(TW));