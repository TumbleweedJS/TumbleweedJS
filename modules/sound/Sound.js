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
        TW.Sound.Sound = f();
        return TW.Sound.Sound;
    }


    function init() {


	PLAY_SUCCEEDED = "playSucceeded";
	PLAY_FINISHED = "playFinished";
	PLAY_FAILED = "playFailed";

	AUDIO_READY = "canplaythrough";
	AUDIO_ENDED = "ended";
	AUDIO_PLAYED = "play";

	/**
	 Sound class is object represent html5 sound tag.

	 @class Sound
	 @constructor
	 @param {String} src The source of channel separated with '|' for multi-format.
	 */
	function Sound(src) {

		/**
		 Audio play state.

		 @property playState
		 @type Enum
		 @default null
		 **/
		this.playState = null;

		/**
		 Audio loaded state.

		 @property loaded
		 @type Boolean
		 @default false
		 **/
		this.loaded = false;

		/**
		 Audio offset.

		 @property offset
		 @type Number
		 @default 0
		 **/
		this.offset = 0;

		/**
		 Audio volume.

		 @property volume
		 @type Number
		 @default 1
		 **/
		this.volume = 1;

		/**
		 Number of loop already played.

		 @property remainingLoops
		 @type Number
		 @default 0
		 **/
		this.remainingLoops = 0;

		/**
		 Mute state.

		 @property muted
		 @type Boolean
		 @default false
		 **/
		this.muted = false;

		/**
		 Pause state.

		 @property paused
		 @type Boolean
		 @default false
		 **/
		this.paused = false;

		/**
		 Callback function when sound play is complete.

		 @property onComplete
		 @type Function
		 @default null
		 **/
		this.onComplete = null;

		/**
		 Callback function when sound play restart loop.

		 @property onLoop
		 @type Function
		 @default null
		 **/
		this.onLoop = null;

		/**
		 Callback function when sound is ready to play.

		 @property onReady
		 @type Function
		 @default null
		 **/
		this.onReady = null;

		/**
		 Html5 tag audio.

		 @property audio
		 @type Object
		 @default <audio>
		 **/
		this.audio = document.createElement("audio");

		/**
		 Html5 tag audio capabilities.

		 @property audio
		 @type Array
		 **/
		this.capabilities = {
			mp3: ( this.audio.canPlayType("audio/mp3") != "no" && this.audio.canPlayType("audio/mp3") != "" ),
			ogg: ( this.audio.canPlayType("audio/ogg") != "no" && this.audio.canPlayType("audio/ogg") != "" ),
			wav: ( this.audio.canPlayType("audio/wav") != "no" && this.audio.canPlayType("audio/wav") != "" )
		};

		/**
		 Audio source.

		 @property src
		 @type String
		 **/
		this.src = this._parsePath(src);

		this.audio.src = this.src;
		this.endedHandler = this.handleSoundComplete.bind(this);
		this.readyHandler = this.handleSoundReady.bind(this);
	}

	Sound.prototype._parsePath = function(value) {
		var sounds = value.split("|");
		var found = false;
		var c = this.capabilities;
		var i;

		for (i = 0, l = sounds.length; i < l; i++) {
			var sound = sounds[i];
			var point = sound.lastIndexOf(".");
			var ext = sound.substr(point + 1).toLowerCase();
			switch (ext) {
				case "mp3":
					if (c.mp3) {
						found = true;
					}
					break;
				case "ogg":
					if (c.ogg) {
						found = true
					}
					break;
				case "wav":
					if (c.wav) {
						found = true;
					}
					break;
				default:
					found = false;
			}

			if (found) {
				return sound;
			}
		}
		return null;
	};

	Sound.prototype._cleanUp = function() {
		this.audio.pause();
		try {
			this.audio.currentTime = 0;
		} catch (error) {
		}
		this.audio.removeEventListener(AUDIO_ENDED, this.endedHandler, false);
		this.audio.removeEventListener(AUDIO_READY, this.readyHandler, false);
		this.audio = null;
	};

	Sound.prototype._playFailed = function() {
		this.playState = PLAY_FAILED;
		this._cleanUp();
	};

	/**
	 Load sound and call onReady callback when load finish.

	 @method load
	 @param {Number} offset The offset where sound start.
	 @param {Number} loop The number of loop where sound played.
	 @param {Number} volume The volume of sound.
	 @return {Boolean} True if sound begin the loading or false if the sound loading is impossible.
	 **/
	Sound.prototype.load = function(offset, loop, volume) {

		if (this.audio === null) {
			this._playFailed();
			return false;
		}

		this.audio.addEventListener(AUDIO_ENDED, this.endedHandler, false);

		this.offset = offset;
		this.volume = volume;
		this._updateVolume();
		this.remainingLoops = loop;

		if (this.audio.readyState !== 4) {
			this.audio.addEventListener(AUDIO_READY, this.readyHandler, false);
			this.audio.load();
		} else {
			this.handleSoundReady();
		}

		return true;
	};

	Sound.prototype.handleSoundReady = function() {
		this.playState = PLAY_SUCCEEDED;
		this.paused = false;
		this.audio.removeEventListener(AUDIO_READY, this.readyHandler, false);

		if (this.offset >= this.getDuration()) {
			this._playFailed();
			return;
		}

		this.audio.currentTime = this.offset;

		if (this.onReady != null) {
			this.onReady(this);
		}
	};

	Sound.prototype.handleSoundComplete = function() {
		if (this.remainingLoops != 0) {
			this.remainingLoops--;
			try {
				this.audio.currentTime = 0;
			} catch (error) {
			}
			this.audio.play();
			if (this.onLoop != null) {
				this.onLoop(this);
			}
			return;
		}
		this.playState = PLAY_FINISHED;

		if (this.onComplete != null) {
			this.onComplete(this);
		}
	};

	/**
	 Start play sound.

	 @method play
	 **/
	Sound.prototype.play = function() {
		this.audio.play();
		this.playState = AUDIO_PLAYED;
	};

	/**
	 Pause sound.

	 @method pause
	 **/
	Sound.prototype.pause = function() {
		this.paused = true;
		this.audio.pause();
	};

	/**
	 Resume sound.

	 @method resume
	 **/
	Sound.prototype.resume = function() {
		this.paused = false;
		this.audio.play();
	};

	/**
	 Stop sound.

	 @method stop
	 **/
	Sound.prototype.stop = function() {
		this.pause();
		this.playState = PLAY_FINISHED;
		try {
			this.audio.currentTime = 0;
		} catch (error) {
		}
	};

	/**
	 Set current sound volume.

	 @method mute
	 @param {Number} value The sound volume.
	 **/
	Sound.prototype.setVolume = function(value) {
		value = (value > 1.0) ? 1.0 : value;
		value = (value < 0.0) ? 0.0 : value;
		this.volume = value;
		this._updateVolume();
	};


	Sound.prototype._updateVolume = function() {
		this.audio.volume = this.muted ? 0 : this.volume;
	};

	/**
	 Get current sound volume.

	 @method getVolume
	 @return {Number} A current sound volume.
	 **/
	Sound.prototype.getVolume = function() {
		return this.volume;
	};

	/**
	 Mute or Unmute all sound in this channel.

	 @method mute
	 @param {Boolean} isMuted True for mute or false for unmute.
	 **/
	Sound.prototype.mute = function(isMuted) {
		this.muted = isMuted;
		this._updateVolume();
	};

	/**
	 Get current sound offset.

	 @method getPosition
	 @return {Number} A current sound offset.
	 **/
	Sound.prototype.getPosition = function() {
		return this.audio.currentTime;
	};

	/**
	 Set current sound offset.

	 @method setPosition
	 @param {Number} value The value of offset.
	 **/
	Sound.prototype.setPosition = function(value) {
		try {
			this.audio.currentTime = value;
		} catch (error) {
		}
	};

	/**
	 Get current sound duration.

	 @method getDuration
	 @return {Number} A current sound duration.
	 **/
	Sound.prototype.getDuration = function() {
		return this.audio.duration;
	};

	return Sound;

    }

}(TW));
