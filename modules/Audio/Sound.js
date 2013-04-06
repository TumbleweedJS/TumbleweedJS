/**
 * @module Audio
 * @namespace Audio
 */

var TW = TW || {};
define(['../Utils/Polyfills'], function() {

	TW.Audio = TW.Audio || {};


	TW.Audio.PLAY_SUCCEEDED = "playSucceeded";
	TW.Audio.PLAY_FINISHED = "playFinished";
	TW.Audio.PLAY_FAILED = "playFailed";

	TW.Audio.AUDIO_READY = "canplaythrough";
	TW.Audio.AUDIO_ENDED = "ended";
	TW.Audio.AUDIO_PLAYED = "play";

	/**
	 * Sound class is object represent html5 sound tag.
	 *
	 * @class Sound
	 * @constructor
	 * @param {String|String[]} src The sound source url. If an array is passed, the first supported source is used,
	 *  so provide the same sound in many formats is recommended.
	 */
	function Sound(src) {

		/**
		 * Audio play state.
		 *
		 * @property {String} playState
		 * @readonly
		 * @default null
		 */
		this.playState = null;


		/**
		 * Audio offset.
		 *
		 * @property {Number} offset
		 * @default 0
		 * @private
		 */
		this._offset = 0;

		/**
		 * Audio volume, between 0.0 and 1.0
		 *
		 * @property {Number} _volume
		 * @default 1.0
		 * @private
		 */
		this._volume = 1;

		/**
		 * Number of loop remaining to play.
		 *
		 * @property {Number} remainingLoops
		 * @default 0
		 */
		this.remainingLoops = 0;

		/**
		 * Mute state.
		 *
		 * @property {Boolean} _muted
		 * @default false
		 * @private
		 */
		this._muted = false;

		/**
		 * Pause state.
		 *
		 * @property {Boolean} paused
		 * @readonly
		 * @default false
		 */
		this.paused = false;

		/**
		 * Callback function when sound play is complete.
		 *
		 * @property {Function} onComplete
		 * @default null
		 */
		this.onComplete = null;

		/**
		 * Callback called when sound play restart loop.
		 *
		 * @property {Function} onLoop
		 * @default null
		 */
		this.onLoop = null;

		/**
		 * Callback called when sound is ready to play.
		 *
		 * @property {Function} onReady
		 * @default null
		 */
		this.onReady = null;

		/**
		 * Html5 tag audio.
		 *
		 * @property {Audio} audio
		 * @type Object
		 */
		this.audio = document.createElement("audio");

		/**
		 * Html5 tag audio capabilities.
		 * Indicates for each format if it is supported by the navigator.
		 *
		 * Supported format are mp3, ogg and wav.
		 *
		 * @property {Object} audio
		 * @readonly
		 * @example
		 *
		 *     { mp3: true, ogg: false, wav: true }
		 *
		 */
		this.capabilities = {
			mp3: ( this.audio.canPlayType("audio/mp3") !== "no" && this.audio.canPlayType("audio/mp3") !== "" ),
			ogg: ( this.audio.canPlayType("audio/ogg") !== "no" && this.audio.canPlayType("audio/ogg") !== "" ),
			wav: ( this.audio.canPlayType("audio/wav") !== "no" && this.audio.canPlayType("audio/wav") !== "" )
		};

		/**
		 * Audio source file, used by the audio element.
		 *
		 * Even if many paths are passed to constructor, `src` contain only that which is currently used.
		 *
		 * @property {String} src
		 * @readonly
		 */
		this.src = this._choosePath(src);
		if (src === null) {
			throw new Error("Unable to load sound: no supported sources.");
		}

		this.audio.src = this.src;
		this.endedHandler = this.handleSoundComplete.bind(this);
		this.readyHandler = this.handleSoundReady.bind(this);
	}

	/**
	 * choose a compatible source for audio tag.
	 *
	 * @method _choosePath
	 * @param {String|String[]} sources url or array of urls for source audio file.
	 * @return {String} the first copmpatible url if any; `null` otherwise.
	 * @private
	 */
	Sound.prototype._choosePath = function(sources) {
		if (!(sources instanceof Array)) {
			sources = [sources];
		}

		var length = sources.length;
		for (var i = 0; i < length; i++) {
			var point = sources[i].lastIndexOf(".");
			var ext = sources[i].substr(point + 1).toLowerCase();
			if (this.capabilities[ext] === true) {
				return sources[i];
			}
		}
		return null;
	};

	/**
	 * Called when an error occurs for cleaning audio tag.
	 *
	 * @method _playFailed
	 * @private
	 */
	Sound.prototype._playFailed = function() {
		this.playState = TW.Audio.PLAY_FAILED;
		this.audio.pause();
		this.audio.currentTime = 0;
		this.audio.removeEventListener(TW.Audio.AUDIO_ENDED, this.endedHandler, false);
		this.audio.removeEventListener(TW.Audio.AUDIO_READY, this.readyHandler, false);
		this.audio = null;
	};

	/**
	 * Load sound and call `onReady` callback when load finish.
	 *
	 * @method load
	 * @param {Number} offset The offset where sound start.
	 * @param {Number} loop The number of loop where sound played.
	 * @param {Number} volume The volume of sound.
	 * @return {Boolean} true if sound begin the loading or false if the sound loading is impossible.
	 */
	Sound.prototype.load = function(offset, loop, volume) {

		if (this.audio === null) {
			this._playFailed();
			return false;
		}

		this.audio.addEventListener(TW.Audio.AUDIO_ENDED, this.endedHandler, false);

		this._offset = offset;
		this._volume = volume;
		this._updateVolume();
		this.remainingLoops = loop;

		if (this.audio.readyState !== 4) {
			this.audio.addEventListener(TW.Audio.AUDIO_READY, this.readyHandler, false);
			this.audio.load();
		} else {
			this.handleSoundReady();
		}

		return true;
	};

	Sound.prototype.handleSoundReady = function() {
		this.playState = TW.Audio.PLAY_SUCCEEDED;
		this.paused = false;
		this.audio.removeEventListener(TW.Audio.AUDIO_READY, this.readyHandler, false);

		if (this._offset >= this.getDuration()) {
			this._playFailed();
			return;
		}

		this.audio.currentTime = this._offset;

		if (this.onReady !== null) {
			this.onReady(this);
		}
	};

	Sound.prototype.handleSoundComplete = function() {
		if (this.remainingLoops !== 0) {
			this.remainingLoops--;
			this.audio.currentTime = 0;
			this.audio.play();
			if (this.onLoop !== null) {
				this.onLoop(this);
			}
			return;
		}
		this.playState = TW.Audio.PLAY_FINISHED;

		if (this.onComplete !== null) {
			this.onComplete(this);
		}
	};

	/**
	 * Start play sound.
	 *
	 * @method play
	 */
	Sound.prototype.play = function() {
		this.audio.play();
		this.playState = TW.Audio.AUDIO_PLAYED;
	};

	/**
	 * Pause sound.
	 *
	 * @method pause
	 */
	Sound.prototype.pause = function() {
		this.paused = true;
		this.audio.pause();
	};

	/**
	 * Resume sound.
	 *
	 * @method resume
	 */
	Sound.prototype.resume = function() {
		this.paused = false;
		this.audio.play();
	};

	/**
	 * Stop sound.
	 *
	 * @method stop
	 */
	Sound.prototype.stop = function() {
		this.pause();
		this.playState = TW.Audio.PLAY_FINISHED;
		this.audio.currentTime = 0;
	};

	/**
	 * Set current sound volume.
	 *
	 * @method mute
	 * @param {Number} value sound volume, between 0.0 and 1.0.
	 */
	Sound.prototype.setVolume = function(value) {
		value = (value > 1.0) ? 1.0 : value;
		value = (value < 0.0) ? 0.0 : value;
		this._volume = value;
		this._updateVolume();
	};

	/**
	 * Applies all volume modifications.
	 *
	 * @method _updateVolume
	 * @private
	 */
	Sound.prototype._updateVolume = function() {
		this.audio.volume = this._muted ? 0 : this._volume;
	};

	/**
	 * Get current sound volume.
	 *
	 * @method getVolume
	 * @return {Number} A current sound volume.
	 */
	Sound.prototype.getVolume = function() {
		return this._volume;
	};

	/**
	 * Mute or Unmute all sound in this channel.
	 *
	 * @method mute
	 * @param {Boolean} isMuted True for mute or false for unmute.
	 */
	Sound.prototype.mute = function(isMuted) {
		this._muted = isMuted;
		this._updateVolume();
	};

	/**
	 * Get current sound offset.
	 *
	 * @method getPosition
	 * @return {Number} A current sound offset.
	 */
	Sound.prototype.getPosition = function() {
		return this.audio.currentTime;
	};

	/**
	 * Set current sound offset.
	 *
	 * @method setPosition
	 * @param {Number} value The value of offset.
	 */
	Sound.prototype.setPosition = function(value) {
		this.audio.currentTime = value;
	};

	/**
	 * Get current sound duration.
	 *
	 * @method getDuration
	 * @return {Number} A current sound duration.
	 */
	Sound.prototype.getDuration = function() {
		return this.audio.duration;
	};

	TW.Audio.Sound = Sound;
	return Sound;
});
