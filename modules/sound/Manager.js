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
        TW.Sound.Manager = f();
        return TW.Sound.Manager;
    }


    function init() {

	/**
	 Manager class is utility for manage all sound in channel.

	 @class Manager
	 @constructor
	 */
	function Manager() {

		/**
		 Array of Channel.

		 @property instances
		 @type Array
		 @default empty
		 **/
		this.instances = [];

		/**
		 Number of Channel.

		 @property length
		 @type Number
		 @default 0
		 **/
		this.length = 0;

		/**
		 LastId of Channel.

		 @property lastId
		 @type Number
		 @default 0
		 **/
		this.lastId = 0;

		/**
		 Number of Channel ready to play.

		 @property ready
		 @type Number
		 @default 0
		 **/
		this.ready = 0;

		/**
		 Callback function when all channel is ready to play.

		 @property allInstancesReady
		 @type Function
		 @default null
		 **/
		this.allInstancesReady = null;

		/**
		 Callback function when a channel is ready to play.

		 @property instanceReady
		 @type Function
		 @default null
		 **/
		this.instanceReady = null;

		/**
		 Volume of all sound in all channel.

		 @property volume
		 @type Number
		 @default 1
		 **/
		this.masterVolume = 1;

		this.allInstancesReadyHandler = this.handleAllInstancesReady.bind(this);
	}

	/**
	 Create new channel with src and max sound instance.

	 @method add
	 @param {String} src The source of channel separated with '|' for multiformat.
	 @param {Number} max The number of sound allocated in this channel.
	 @return {Number} The id of the channel.
	 **/
	Manager.prototype.add = function(src, max) {
		this.lastId++;
		this.instances[this.lastId] = new TW.Sound.Channel(src, max, this.lastId);
		this.length++;
		return this.lastId;
	};

	/**
	 Remove a channel.

	 @method remove
	 @param {Number} uniqueId The id of the channel need remove.
	 @return {Boolean} True if the channel has been remove or False.
	 **/
	Manager.prototype.remove = function(uniqueId) {
		if (this.instances[uniqueId] === null) {
			return false;
		}
		delete this.instances[uniqueId];
		this.length--;
		return true;
	};

	/**
	 Get a channel.

	 @method get
	 @param {Number} uniqueId The id of the channel need get.
	 @return {Object} The channel with uniqueId.
	 **/
	Manager.prototype.get = function(uniqueId) {
		return this.instances[uniqueId];
	};

	/**
	 Get a playable sound.

	 @method getPlayableSound
	 @param {Number} uniqueId The id of the channel need get a sound.
	 @return {Object} A playable sound.
	 **/
	Manager.prototype.getPlayableSound = function(uniqueId) {
		return this.instances[uniqueId].getPlayableSound();
	};

	/**
	 Load all sounds on all channels.

	 @method loadAll
	 **/
	Manager.prototype.loadAll = function() {
		this.ready = 0;
		for (var key in this.instances) {
			var sounds = this.instances[key];
			sounds.allSoundsReady = this.allInstancesReadyHandler;
			sounds.load();
		}
	};

	Manager.prototype.handleAllInstancesReady = function(channel) {
		this.ready++;

		if (this.instanceReady != null) {
			this.instanceReady(channel.id);
		}
		if (this.allInstancesReady != null && this.ready === this.length) {
			this.allInstancesReady();
		}
	};

	Manager.prototype.tellAllInstances = function(command, value) {
		var key;
		var sound;

		for (key in this.instances) {
			sounds = this.instances[key];
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
	 Get a current master volume.

	 @method getMasterVolume
	 @return {Number} A current master volume.
	 **/
	Manager.prototype.getMasterVolume = function() {
		return this.masterVolume;
	};

	/**
	 Mute or Unmute all sound in every channel.

	 @method setMute
	 @param {Boolean} isMuted True for mute or false for unmute.
	 **/
	Manager.prototype.setMute = function(isMuted) {
		this.tellAllInstances("mute", isMuted);
	};

	/**
	 Pause all sound in every channel.

	 @method pause
	 **/
	Manager.prototype.pause = function() {
		this.tellAllInstances("pause", null);
	};

	/**
	 Resume all sound in every channel.

	 @method resume
	 **/
	Manager.prototype.resume = function() {
		this.tellAllInstances("resume", null);
	};

	/**
	 Stop all sound in every channel.

	 @method stop
	 **/
	Manager.prototype.stop = function() {
		this.tellAllInstances("stop", null);
	};

	/**
	 Set a volume for all sound in every channel.

	 @method setMasterVolume
	 @param {Number} value The value of volume needed. min: 0.0 -> max: 1.0
	 **/
	Manager.prototype.setMasterVolume = function(value) {
		value = (value > 1.0) ? 1.0 : value;
		value = (value < 0.0) ? 0.0 : value;

		this.masterVolume = value;
		this.tellAllInstances("setVolume", value);
	};

	return Manager;
    }

}(TW));