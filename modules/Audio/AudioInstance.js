/**
 * @module Audio
 * @namespace Audio
 */

var TW = TW || {};
define(['../Event/EventProvider', '../Utils/inherit'], function (EventProvider, inherit) {

    TW.Audio = TW.Audio || {};

    TW.Audio.Instance_ERROR = "error";
    TW.Audio.Instance_STOPPED = "stopped";
    TW.Audio.Instance_NOT_READY = "not ready";
    TW.Audio.Instance_LOADING = "loading";
    TW.Audio.Instance_PLAYING = "playing";
    TW.Audio.Instance_PAUSED = "paused";

    /**
     * AudioInstance class represents an HTML5 audio tag.
     *
     * An AudioInstance can be played, paused and stopped. It has a volume and can be muted. You can also
     * change the current playing position
     *
     * When you choose to play an AudioInstance not loaded, it will first load and play the audio source.
     * When the source is ready to play, it also triggers a "play" event from the EventProvier
     *
     * @class AudioInstance
     * @constructor
     * @param {HTMLAudioElement|String|String[]|} src The sound source audio element, url or array of url.
     *  If an array is passed, the first supported source is used,
     *  so providing the same sound in many formats is recommended.
     */
    function AudioInstance(src) {
        /**
         * Audio play state.
         *
         * @property {String} status
         * @readonly
         * @default TW.Audio.Instance_NOT_READY
         */
        this.status = TW.Audio.Instance_NOT_READY;

        /**
         * Audio volume.
         *
         * @property {Number} volume
         * @readonly
         * @default 100
         */
        this._volume = 100;


        /**
         * Muted state.
         *
         * @property {Boolean} is_muted
         * @readonly
         * @default false
         */
        this._is_muted = false;

        /**
         * Callback called when the audio element is ready to play
         *
         * @property {Function} readyHandler
         * @readonly
         * @default null
         */
        this._readyHandler = this._handleSoundReady.bind(this);

        /**
         * Callback called when the audio element stopped
         *
         * @property {Function} stoppedHandler
         * @default null
         */
        this._stoppedHandler = this._handleSoundStopped.bind(this);

        /**
         * Html5 tag audio.
         *
         * @property {Audio} audio_tag
         * @readonly
         * @type Object
         */
        this._audio_tag = null;

        EventProvider.call(this);
        this._setSource(src);
        if (this._audio_tag.src === null || this._audio_tag.src === "") {
            this.emit("error", "AudioInstance: Unable to find a valid source");
        }
    }

    inherit(AudioInstance, EventProvider);

    /**
     * Use the source to create or get the HTML5 audio element
     *
     * @method _setSource
     * @param {HTMLAudioElement|String|String[]|} src The sound source audio element, url or array of url.
     * @private
     */
    AudioInstance.prototype._setSource = function(src) {
        this.status = TW.Audio.Instance_NOT_READY;
        if (src.nodeType === 1 && src.nodeName === "AUDIO") {
            this._audio_tag = src;
        }
        else if (typeof src === "string") {
            this._audio_tag = new Audio();
            this._audio_tag.src = this._lookUpSource(src);
        }
        else if (src instanceof Array) {
            this._audio_tag = new Audio();
            for (var i = 0; i < src.length; i++) {
                var valid_src = this._lookUpSource(src[i]);
                if (valid_src !== null) {
                    this._audio_tag.src = valid_src;
                    break;
                }
            }
        }
    };

    /**
     * Check if the source extension is compatible with the browser
     *
     * @method _lookUpSource
     * @param src Url of the audio source
     * @returns {String} the first compatible extension, otherwise it returns null
     * @private
     */
    AudioInstance.prototype._lookUpSource = function(src) {
        var point = src.lastIndexOf(".");
        var ext = src.substr(point + 1).toLowerCase();
        if (this._audio_tag.canPlayType("audio/" + ext)) {
            return src;
        }
        return null;
    };

    /**
     * Load the sound and call the _readyHandler callback
     *
     * @method _load
     * @private
     */
    AudioInstance.prototype._load = function() {
        this._audio_tag.addEventListener("canplaythrough", this._readyHandler, false);
        this.status = TW.Audio.Instance_LOADING;
        this._audio_tag.load();
    };

    /**
     * Callback called when the sound is loaded
     * set the status to TW.Audio.Instance_STOPPED and call the play function
     *
     * @method _handleSoundReady
     * @private
     */
    AudioInstance.prototype._handleSoundReady = function() {
        this._audio_tag.removeEventListener("canplaythrough", this._readyHandler, false);
        this.status = TW.Audio.Instance_STOPPED;
        this.play();
    };

    /**
     * Callback called when the sound is stopped
     * set the status to TW.Audio.Instance_STOPPED
     * send a "stop" event
     *
     * @method _handleSoundStopped
     * @private
     */
    AudioInstance.prototype._handleSoundStopped = function() {
        this._audio_tag.removeEventListener("ended", this._stoppedHandler, false);
        this.status = TW.Audio.Instance_STOPPED;
        this.emit("stop");
    };

    /**
     * Play sound
     * Start playing the audio element
     *
     * @method play
     */
    AudioInstance.prototype.play = function() {
        if (this.status === TW.Audio.Instance_NOT_READY) {
            this._load();
        }
        else if (this.status === TW.Audio.Instance_STOPPED || this.status === TW.Audio.Instance_PAUSED) {
            this._audio_tag.addEventListener("ended", this._stoppedHandler, false);
            this._audio_tag.play();
            var old_status = this.status;
            this.status = TW.Audio.Instance_PLAYING;
            if (old_status === TW.Audio.Instance_STOPPED) {
                this.emit("play");
            }
        }
    };

    /**
     * Pause sound
     * Put the audio element on pause (keep the current position)
     *
     * @method pause
     */
    AudioInstance.prototype.pause = function() {
        this._audio_tag.pause();
        this.status = TW.Audio.Instance_PAUSED;
    };

    /**
     * Stop sound
     * Put the audio element on pause (set the position to 0)
     *
     * @method stop
     */
    AudioInstance.prototype.stop = function() {
        this._audio_tag.pause();
        this._audio_tag.currentTime = 0;
        this._handleSoundStopped();
    };

    /**
     * Get the current volume
     *
     * @method getVolume
     * @returns {Number} the volume [0, 100]
     */
    AudioInstance.prototype.getVolume = function() {
        return this._volume;
    };

    /**
     * Set the volume
     *
     * @method setVolume
     * @param {Number} volume [0, 100]
     */
    AudioInstance.prototype.setVolume = function(volume) {
        volume = (volume > 100) ? 100: volume;
        volume = (volume < 0) ? 0 : volume;
        this._volume = volume;
        this._audio_tag.volume = volume / 100.0;
    };

    /**
     * Mute or unmute the audio element
     *
     * @method mute
     * @param {Boolean} is_muted, True if not specified
     */
    AudioInstance.prototype.mute = function(is_muted) {
        if (is_muted === null || typeof(is_muted) === 'undefined') {
            is_muted = true;
        }
        this._is_muted = is_muted;
        if (is_muted) {
            this._audio_tag.volume = 0.0;
        }
        else {
            this._audio_tag.volume = this._volume / 100.0;
        }

    };

    /**
     * Function returning a boolean that define is the sound is muted or not
     *
     * @method isMuted
     * @returns {Boolean} isMuted
     */
    AudioInstance.prototype.isMuted = function() {
        return this._is_muted;
    };

    /**
     * Get the audio source duration
     *
     * @method getDuration
     * @returns {Number} Audio source duration
     */
    AudioInstance.prototype.getDuration = function() {
        return this._audio_tag.duration;
    };

    /**
     * Get the audio source playing position
     *
     * @method getPosition
     * @returns {Number} Audio source current position
     */
    AudioInstance.prototype.getPosition = function() {
        return this._audio_tag.currentTime;
    };

    /**
     * Set the playing position
     *
     * @method setPosition
     * @param {Number} position The position to set (throw and Error if the position is out of bounds)
     */
    AudioInstance.prototype.setPosition = function(position) {
        if (position < 0 || position > this._audio_tag.duration) {
            this.emit("error", "AudioInstance: Position out of bounds");
        }
        else {
            this._audio_tag.currentTime = position;
        }
    };

    TW.Audio.AudioInstance = AudioInstance;
    return AudioInstance;
});