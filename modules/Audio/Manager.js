/**
 * @module Audio
 * @namespace Audio
 */

var TW = TW || {};
define(['./Channel', '../Utils/Polyfills'], function(Channel) {

	TW.Audio = TW.Audio || {};


	/**
	 * Manager class is utility for manage all sound in channel.
	 *
	 * @class Manager
	 * @constructor
	 */
	function Manager() {

		/**
		 * Array of Channel.
		 *
		 * @property {Array} _instances
		 * @default []
		 * @private
		 */
		this._instances = [];

		/**
		 * Number of Channel.
		 *
		 * @property {Number} length
		 * @default 0
		 * @readonly
		 */
		this.length = 0;

		/**
		 * LastId of Channel.
		 *
		 * @property {Number} _lastId
		 * @default 0
		 * @private
		 */
		this._lastId = 0;

		/**
		 * Number of Channel ready to play.
		 *
		 * @property {Number} _ready
		 * @default 0
		 * @private
		 */
		this._ready = 0;

		/**
		 * Callback function when all channel is ready to play.
		 *
		 * @property {Function} allInstancesReady
		 * @default null
		 */
		this.allInstancesReady = null;

		/**
		 * Callback function when a channel is ready to play.
		 *
		 * @property {Function} instanceReady
		 *  @param {Number} id first callback arg; id of ready instance.
		 * @default null
		 */
		this.instanceReady = null;

		/**
		 * Volume of all sound in all channel, between 0.0 and 1.0.
		 *
		 * @property {Number} _masterVolume
		 * @default 1
		 * @private
		 */
		this._masterVolume = 1;

	}

	/**
	 * Create new channel with src and max sound instance.
	 *
	 * @method add
	 * @param {String|String[]} src The source(s) of channel. If many values are passed, the first compatibel are used.
	 * @param {Number} max The number of sound allocated in this channel.
	 * @return {Number} The id of the channel.
	 */
	Manager.prototype.add = function(src, max) {
		this._lastId++;
		this._instances[this._lastId] = new Channel(src, max, this._lastId);
		this.length++;
		return this._lastId;
	};

	/**
	 * Remove a channel.
	 *
	 * @method remove
	 * @param {Number} uniqueId The id of the channel need remove.
	 * @return {Boolean} True if the channel has been remove or False.
	 */
	Manager.prototype.remove = function(uniqueId) {
		if (this._instances[uniqueId] === null) {
			return false;
		}
		delete this._instances[uniqueId];
		this.length--;
		return true;
	};

	/**
	 * Get a channel.
	 *
	 * @method get
	 * @param {Number} uniqueId The id of the channel need get.
	 * @return {Object} The channel with uniqueId.
	 */
	Manager.prototype.get = function(uniqueId) {
		return this._instances[uniqueId];
	};

	/**
	 * Get a playable sound.
	 *
	 * @method getPlayableSound
	 * @param {Number} uniqueId The id of the channel need get a sound.
	 * @return {Object} A playable sound.
	 */
	Manager.prototype.getPlayableSound = function(uniqueId) {
		return this._instances[uniqueId].getPlayableSound();
	};

	/**
	 * Load all sounds on all channels.
	 *
	 * @method loadAll
	 */
	Manager.prototype.loadAll = function() {
		this._ready = 0;
		for (var key in this._instances) {
			var sounds = this._instances[key];
			sounds.allSoundsReady = this._handleAllInstancesReady.bind(this);
			sounds.load();
		}
	};

	/**
	 * Used has callback for the `allSoundsReady` event.
	 *
	 * @method _handleAllInstancesReady
	 * @param channel
	 * @private
	 */
	Manager.prototype._handleAllInstancesReady = function(channel) {
		this._ready++;

		if (this.instanceReady !== null) {
			this.instanceReady(channel.id);
		}
		if (this.allInstancesReady !== null && this._ready === this.length) {
			this.allInstancesReady();
		}
	};

	/**
	 * Applies the command to all channels.
	 *
	 * @method _tellAllInstances
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
	Manager.prototype._tellAllInstances = function(command, value) {
		var key;

		for (key in this._instances) {
			var sounds = this._instances[key];
			switch (command) {
				case "pause":
					sounds.pause();
					break;
				case "resume":
					sounds.resume();
					break;
				case "setVolume":
					sounds.setMasterVolume(value);
					break;
				case "mute":
					sounds.setMute(value);
					break;
				case "stop":
					sounds.stop();
					break;
			}
		}
	};

	/**
	 * Get a current master volume.
	 *
	 * @method getMasterVolume
	 * @return {Number} A current master volume.
	 */
	Manager.prototype.getMasterVolume = function() {
		return this._masterVolume;
	};

	/**
	 * Mute or Unmute all sound in every channel.
	 *
	 * @method setMute
	 * @param {Boolean} isMuted True for mute or false for unmute.
	 */
	Manager.prototype.setMute = function(isMuted) {
		this._tellAllInstances("mute", isMuted);
	};

	/**
	 * Pause all sound in every channel.
	 *
	 * @method pause
	 */
	Manager.prototype.pause = function() {
		this._tellAllInstances("pause", null);
	};

	/**
	 * Resume all sound in every channel.
	 *
	 * @method resume
	 */
	Manager.prototype.resume = function() {
		this._tellAllInstances("resume", null);
	};

	/**
	 * Stop all sound in every channel.
	 *
	 * @method stop
	 */
	Manager.prototype.stop = function() {
		this._tellAllInstances("stop", null);
	};

	/**
	 * Set a volume for all sound in every channel.
	 *
	 * @method setMasterVolume
	 * @param {Number} value The value of volume needed. min: 0.0 -> max: 1.0
	 */
	Manager.prototype.setMasterVolume = function(value) {
		value = (value > 1.0) ? 1.0 : value;
		value = (value < 0.0) ? 0.0 : value;

		this._masterVolume = value;
		this._tellAllInstances("setVolume", value);
	};

	TW.Audio.Manager = Manager;
	return Manager;
});
