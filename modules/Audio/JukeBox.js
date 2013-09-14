/**
 * @module Audio
 * @namespace Audio
 */

var TW = TW || {};
define(['../Event/EventProvider', '../Utils/inherit'], function (EventProvider, inherit) {
    TW.Audio = TW.Audio || {};

    TW.Audio.JukeBox_ERROR = "error";
    TW.Audio.JukeBox_STOPPED = "stopped";
    TW.Audio.JukeBox_PLAYING = "playing";
    TW.Audio.JukeBox_PAUSED = "paused";

    /**
     * JukeBox class represents a playlist of sounds
     *
     * The JukeBox can play sounds continuously, randomly and in loop
     * If random == true, play sounds randomly in the playlist
     * If loop == true, play the full playlist in loop
     * If actif_loop == true, play the current sound in loop
     *
     * @class JukeBox
     * @constructor
     */
    function JukeBox() {
        /**
         * Sound instances
         * @type {Array}
         * @private
         */
        this._sounds = [];

        /**
         * Sound identifiers
         * @type {Array}
         * @private
         */
        this._ids = [];

        /**
         * ID of the current sound to play in this._sounds and this._ids
         * @type {number}
         * @default 0
         * @private
         */
        this._current = 0;

        /**
         * Status of the JukeBox (playing, paused, stopped, error)
         * @default TW.Audio.JukeBox_STOPPED
         * @type {string}
         */
        this.status = TW.Audio.JukeBox_STOPPED;

        /**
         * Define if the JukeBox should loop if its reach the end of the playlist
         * @default false
         * @type {boolean}
         */
        this.loop = false;

        /**
         * Define if the JukeBox should loop on the current sound
         * @default false
         * @type {boolean}
         */
        this.actif_loop = false;

        /**
         * Define if the JukeBox should random next sounds to play
         * @default false
         * @type {boolean}
         */
        this.random = false;

        /**
         * Volume of the JukeBox
         * @type {number}
         * @default 100
         * @private
         */
        this._volume = 100;

        /**
         * Define if the JukeBox is muted
         * @type {boolean}
         * @default false
         * @private
         */
        this._is_muted = false;

        EventProvider.call(this);
    }

    inherit(JukeBox, EventProvider);

    /**
     * Play the current element in the playlist
     * if the parameter id is specified, jump to this sound and play it
     *
     * @param {String} id Sound id to play (play the current sound if not specified)
     */
    JukeBox.prototype.play = function(id) {
        if (this._sounds.length === 0) {
            return ;
        }
        if (id !== null && typeof(id) !== 'undefined') {
            for (var i = 0; i < this._ids.length; i++) {
                if (this._ids[i] === id) {
                    if (this.status === TW.Audio.JukeBox_PLAYING) {
                        this._sounds[this._current].stop();
                    }
                    this._current = i;
                    break;
                }
            }
        }
        if (this._current >= this._sounds.length) {
            this.stop();
            return ;
        }
        this.status = TW.Audio.JukeBox_PLAYING;
        this._setVolumeOfCurrent();
        this._sounds[this._current].play();
    };

    /**
     * Pause the elements currently playing in the JukeBox
     */
    JukeBox.prototype.pause = function() {
        if (this._sounds.length === 0) {
            return ;
        }
        for (var i = 0; i < this._sounds.length; i++) {
            this._sounds[i].pause();
        }
        this.status = TW.Audio.JukeBox_PAUSED;
    };

    /**
     * Stop the elements currently playing in the JukeBox
     */
    JukeBox.prototype.stop = function() {
        this.status = TW.Audio.JukeBox_STOPPED;
        if (this._sounds.length === 0) {
            return ;
        }
        for (var i = 0; i < this._sounds.length; i++) {
            this._sounds[i].stop();
        }
    };

    /**
     * Add a sound to the playlist with an ID and an instance
     *
     * @param {String} id The identifier of this sound
     * @param {Sound} sound Sound instance to add
     */
    JukeBox.prototype.add = function(id, sound) {
        if (sound !== null && typeof(sound) !== 'undefined') {
            this._ids.push(id);
            this._sounds.push(sound);
            sound.on("stop", this._handleSoundStopped.bind(this));
            sound.on("error", this._handleSoundError.bind(this));
        }
    };

    /**
     * Remove a sound from the playlist by its ID
     *
     * @param {String} id Identifier of the sound to remove
     */
    JukeBox.prototype.rm = function(id) {
        for (var i = 0; i < this._ids.length; i++) {
            if (this._ids[i] === id) {
                if (i === this._current) {
                    this.stop();
                }
                this._sounds[i].off("stop", this._handleSoundStopped.bind(this));
                this._sounds[i].off("error", this._handleSoundError.bind(this));
                this._ids.splice(i, 1);
                this._sounds.splice(i, 1);
                break ;
            }
        }
    };

    /**
     * Get a sound from the playlist by its ID
     *
     * @param {String} id Identifier of the sound to get
     * @return {Sound | boolean} The instance of the sound or false if not found
     */
    JukeBox.prototype.get = function(id) {
        for (var i = 0; i < this._ids.length; i++) {
            if (this._ids[i] === id) {
                return this._sounds[i];
            }
        }
        return false;
    };

    /**
     * Get the current sound playing or to play
     *
     * @returns {Sound | boolean} The instance of the current sound or false if the playlist is empty
     */
    JukeBox.prototype.getCurrent = function() {
        if (this._sounds.length === 0 || this._current >= this._sounds.length) {
            return false;
        }
        return this._sounds[this._current];
    };

    /**
     * Set the volume of the current sound to play (call by play)
     *
     * @private
     */
    JukeBox.prototype._setVolumeOfCurrent = function() {
        if (this.status === TW.Audio.JukeBox_PLAYING && this._current < this._sounds.length) {
            this._sounds[this._current].mute(this._is_muted);
            this._sounds[this._current].setVolume(this._volume);
        }
    };

    /**
     * Callback to handle the event emitted by the sound currently playing when its ends
     *
     * @param event
     * @param data
     * @param provider
     * @private
     */
    JukeBox.prototype._handleSoundStopped = function(event, data, provider) {
        if (this.status === TW.Audio.JukeBox_PLAYING &&
            this._current < this._sounds.length && provider === this._sounds[this._current]) {
            this.next();
        }
    };

    /**
     * Callback to handle the event emitted by the sounds when they throw an error
     *
     * @param event
     * @param data
     * @param provider
     * @private
     */
    JukeBox.prototype._handleSoundError= function(event, data, provider) {
        this.emit("error", [provider, data]);
    };

    /**
     * Jump to the next sound to play
     */
    JukeBox.prototype.next = function() {
        if (this._sounds.length === 0) {
            return;
        }
        if (this.actif_loop) {
            this.play();
        }
        else {
            if (this.random) {
                this._play_random();
                if (this.status === TW.Audio.JukeBox_PLAYING) {
                    this.emit("next_track", this._ids[this._current]);
                }
            }
            else if ((this._current + 1) >= this._sounds.length && !this.loop) {
                this._current = 0;
                this.emit("stop", this._ids[this._current]);
                this.stop();
            }
            else {
                this._current = (this._current + 1 >= this._sounds.length) ? 0 : this._current + 1;
                this.play();
                if (this.status === TW.Audio.JukeBox_PLAYING) {
                    this.emit("next_track", this._ids[this._current]);
                }
            }
        }
    };

    /**
     * Random function for the next sound to play
     *
     * @private
     */
    JukeBox.prototype._play_random = function() {
        this._current = Math.floor(Math.random() * (this._sounds.length));
        this.play();
    };

    /**
     * Return the volume of the JukeBox
     *
     * @returns {number} The current volume of the JukeBox
     */
    JukeBox.prototype.getVolume = function() {
        return this._volume;
    };

    /**
     * Set the volume of the JukeBox
     *
     * @param {number} volume New volume for the JukeBox [0, 100]
     */
    JukeBox.prototype.setVolume = function(volume) {
        volume = (volume > 100) ? 100: volume;
        volume = (volume < 0) ? 0 : volume;
        this._volume = volume;
        this._setVolumeOfCurrent();
    };

    /**
     * Mute or unmute the JukeBox
     * @param {boolean} is_muted Mute if true or undefined, unmute if false
     * @default true
     */
    JukeBox.prototype.mute = function(is_muted) {
        if (is_muted === null || typeof(is_muted) === 'undefined') {
            is_muted = true;
        }
        this._is_muted = is_muted;
        this._setVolumeOfCurrent();
    };

    /**
     * Check if the JukeBox is muted
     * @returns {boolean} True if the JukeBox is muted, false if it is not
     */
    JukeBox.prototype.isMuted = function() {
        return this._is_muted;
    };

    TW.Audio.JukeBox = JukeBox;
    return JukeBox;
});
