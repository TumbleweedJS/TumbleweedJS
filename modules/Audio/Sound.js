/**
 * @module Audio
 * @namespace Audio
 */

var TW = TW || {};
define(['../Event/EventProvider', './AudioInstance', '../Utils/inherit'],
        function (EventProvider, AudioInstance, inherit) {

    TW.Audio = TW.Audio || {};

    /**
     * Sound class represents an audio resource.
     *
     * A Sound is an extension of an AudioInstance and has the same properties and methods.
     * The difference between a Sound and an AudioInstance is that the Sound can be played multiple times
     * simultaneously using different AudioInstances.
     * It can also be played in loop.
     *
     * When the loop mode is enabled (is_loop == true), an Event "loop" is emit every time the audio resource
     * is played again.
     * When you choose to play multiple times the same Sound, if it needs to create a new AudioInstance for this
     * purpose, the Sound will emit an Event "new_instance".
     *
     * @class Sound
     * @constructor
     * @param {HTMLAudioElement|String|String[]|} src The sound source audio element, url or array of url.
     *  If an array is passed, the first supported source is used,
     *  so providing the same sound in many formats is recommended.
     */
    function Sound(src) {
        /**
         * Audio resource
         * @type {HTMLAudioElement|String|String[]}
         * @private
         */
        this._src = src;

        /**
         * Define if the loop mode is enabled
         * @type {boolean}
         */
        this.is_loop = false;

        /**
         * Define the max number of instances you can play simultaneously
         * @type {number}
         * @default 100
         */
        this.max_instances = 100;

        /**
         * Array of running and pending AudioInstances
         * @type {Array}
         * @private
         */
        this._instances = [];

        /**
         * Handler for the stop signal
         * Used to play again a song that has finished when the loop mode is enabled
         * @property {Function} loopHandler
         * @private
         */
        this._loopHandler =  this._handleLoop.bind(this);

        AudioInstance.call(this, src);
        EventProvider.call(this);
        this.on("stop", this._loopHandler);
    }

    inherit(Sound, AudioInstance, EventProvider);

    /**
     * Play the audio resource. If the parameter create_instance is true, this method will play a new AudioInstance.
     *
     * @method play
     * @param {Boolean} create_instance False by default, if true, reuse or create a new instance of this Audio
     * resource and play it.
     * @return {AudioInstance} The AudioInstance that has been started
     */
    Sound.prototype.play = function(create_instance) {
        if (create_instance === null || typeof(create_instance) === 'undefined') {
            create_instance = false;
        }
        var instance = this;

        if (create_instance) {
            for (var i = 0; i < this.max_instances; i++)
            {
                if (this._instances[i] === null || typeof(this._instances[i]) === 'undefined') {
                    instance = new AudioInstance(this._src);
                    this._instances[i] = instance;
                    instance.on("stop", this._loopHandler);
                    this.emit("new_instance", instance);
                    break;
                }
                if (this._instances[i].status === TW.Audio.Instance_STOPPED) {
                    instance = this._instances[i];
                    break;
                }
            }
        }
        AudioInstance.prototype.play.call(instance);
        return instance;
    };

    /**
     * Set the loop mode.
     * True = loop.
     *
     * @method loop
     * @param {Boolean} is_loop If not specified, this method will invert the value of is_loop.
     */
    Sound.prototype.loop = function(is_loop) {
        if (is_loop === null || typeof(is_loop) === 'undefined') {
            is_loop = !this.is_loop;
        }
        this.is_loop = is_loop;
    };

    /**
     * Handle the signal stopped emitted by the running AudioInstances.
     * This method is used to play AudioInstances in loop
     *
     * @param event
     * @param data
     * @param provider
     * @private
     */
    Sound.prototype._handleLoop = function(event, data, provider) {
        if (this.is_loop) {
            provider.play();
            this.emit("loop");
        }
    };

    TW.Audio.Sound = Sound;
    return Sound;
});
