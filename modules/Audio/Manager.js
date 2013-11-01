/**
 * @module Audio
 * @namespace Audio
 */

var TW = TW || {};
define(['../Event/EventProvider', '../Utils/inherit'], function (EventProvider, inherit) {
    TW.Audio = TW.Audio || {};

    /**
     * Manager class represents a pool of Sounds (HTML5 audio tag wrappers).
     *
     * A Manager is used to manage a pool of Sounds
     * It can resume, pause or stop all the elements in the pool
     * It can also set a master volume for all the elements and mute or unmute them
     *
     * @class Manager
     * @constructor
     */
    function Manager() {
        /**
         * Sound instances
         * @property {Array} _sounds
         * @private
         */
        this._sounds = [];

        /**
         * Volume of the manager
         * @property {Number} _volume
         * @default 100
         * @private
         */
        this._volume = 100;

        /**
         * Define if the Manager is muted
         * @property {Boolean} _is_muted
         * @default false
         * @private
         */
        this._is_muted = false;

        EventProvider.call(this);
    }

    inherit(Manager, EventProvider);

    /**
     * Pause all the elements currently playing in the manager
     * @method pause
     */
    Manager.prototype.pause = function() {
        for (var i = 0; i < this._sounds.length; i++) {
            if (this._sounds[i].status === TW.Audio.Instance_PLAYING) {
                this._sounds[i].pause();
            }
        }
    };

    /**
     *  Resume all the elements currently paused in the manager
     *  @method resume
     */
    Manager.prototype.resume = function() {
        for (var i = 0; i < this._sounds.length; i++) {
            if (this._sounds[i].status === TW.Audio.Instance_PAUSED) {
                this._sounds[i].play();
            }
        }
    };

    /**
     * Stop all the elements in the manager
     * @method stop
     */
    Manager.prototype.stop = function() {
        for (var i = 0; i < this._sounds.length; i++) {
            this._sounds[i].stop();
        }
    };

    /**
     * Add an element to the manager
     *
     * @method add
     * @param {Sound} sound The element to add
     */
    Manager.prototype.add = function(sound) {
        if (sound !== null && typeof(sound) !== 'undefined') {
            this._sounds.push(sound);
            sound.on("error", this.errorHandler.bind(this));
        }
    };

    /**
     * Remove an element from the manager
     *
     * @method rm
     * @param {Sound} sound The element to remove
     */
    Manager.prototype.rm = function(sound) {
        for (var i = 0; i < this._sounds.length; i++) {
            if (this._sounds[i] === sound) {
                this._sounds.splice(i, 1);
                break ;
            }
        }
    };

    /**
     * Check the presence of an element in the manager
     *
     * @method has
     * @param {Sound} sound
     * @return {boolean} True if the element is present in the manager, otherwise false
     */
    Manager.prototype.has = function(sound) {
        for (var i = 0; i < this._sounds.length; i++) {
            if (this._sounds[i] === sound) {
                return true;
            }
        }
        return false;
    };

    /**
     * Mute or unmute all the elements in the manager
     *
     * @method mute
     * @param {boolean} is_muted Mute if true or undefined, unmute if false
     * @default true
     */
    Manager.prototype.mute = function(is_muted) {
        if (is_muted === null || typeof(is_muted) === 'undefined') {
            is_muted = true;
        }
        this._is_muted = is_muted;
        for (var i = 0; i < this._sounds.length; i++) {
            this._sounds[i].mute(this._is_muted);
        }
    };

    /**
     * Check if the manager's sounds are muted
     *
     * @method isMuted
     * @return {boolean} True if the sounds are muted, false if they are not
     */
    Manager.prototype.isMuted = function() {
        return this._is_muted;
    };

    /**
     * Return the manager's volume (master volume)
     *
     * @method getVolume
     * @return {number} The volume [0, 100]
     */
    Manager.prototype.getVolume = function() {
        return this._volume;
    };

    /**
     * Set the volume of the manager, it is a master volume and will affect all the sounds in the pool.
     * For example:
     * The manager's volume is 100 and one of the sound in the pool is 50.
     * if you set the volume of the manager to 50, the sound will take a volume of 25.
     *
     * @method setVolume
     * @param {number} The volume to set
     */
    Manager.prototype.setVolume = function(volume) {
        volume = (volume > 100) ? 100: volume;
        volume = (volume < 0) ? 0 : volume;

        for (var i = 0; i < this._sounds.length; i++) {
            if (this._sounds[i].getVolume() === 0) {
                continue ;
            }
            else if (this._volume === 0 || volume === 0) {
                this._sounds[i].setVolume(volume);
            }
            else {
                this._sounds[i].setVolume(this._sounds[i].getVolume() * volume / this._volume);
            }
        }
        this._volume = volume;
    };

    /**
     * Handle errors emitted by the sounds in the pool and re-emit them with their source and error message
     *
     * @method errorHandler
     * @param event
     * @param data
     * @param provider
     */
    Manager.prototype.errorHandler = function(event, data, provider) {
        this.emit("error", [provider, data]);
    };

    TW.Audio.Manager = Manager;
    return Manager;
});
