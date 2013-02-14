/**
 @module Event
 @namespace Event
 */

var TW = TW || {};

(function(TW) {

    TW.Event = TW.Event ||  {};
    TW.Event.InputMapper = InputMapper;

	if (typeof window.define === "function" && window.define.amd) {
		define(['./EventProvider', '../utils/Inheritance'], function() {
            return InputMapper;
        });
	}

    /**
     * InputMapper is a virtual event provider used to redirect event under an other event.
     *
     * It allow to create custom events (user-defined), following others eventProviders.
     * Its role is to act as an interface, hiding real event which can be changed without the user noticing.
     *
     * A typical utilisation is the remapping is to let the choice of controls keyboard to the player.
     *
     * @example
     *
     *      var keyboardEvents = new KeyboardInput();
     *      var inputMapper = new InputMapper();
     *
     *      inputMapper.addEvent("ATTACK");
     *      inputMapper.bind("ATTACK", "KEY_Q", keyboardEvents);
     *
     *      inputMapper.addListener("ATTACK", KeyboardInput.KEY_PRESSED, function(event, value, provider) {
     *      });
     *
     * @class InputMapper
     * @constructor
     */
    function InputMapper() {

        TW.Event.EventProvider.call(this);

        this.enable = true;

        this._binds = [];
    }

    TW.Utils.inherit(InputMapper, TW.Event.EventProvider);


    /**
     * return the EventProvider type.
     *
     * @method getType
     * @return {String}     "MAPPER"
     */
    InputMapper.prototype.getType = function() {
        return "MAPPER";
    };


    /**
     * Getting the name of event bind with localEvent.
     *
     * @method getRealEvent
     * @param {String}  localEvent
     * @return {String} Name of the real event if it exist or null
     */
    InputMapper.prototype.getRealEvent = function(localEvent) {
        var i;
        i = this.states.indexOf(localEvent);

        if (i === -1) {
            return null;
        }

        return this._binds[i] ? this._binds[i].event : null;
    };


    /**
     * Getting a array of all no mapped local event.
     *
     * @method getNoMappedEvents
     * @return {Array} Array with all local events who is not already bound
     */
    InputMapper.prototype.getNoMappedEvents = function() {
        var i, len, arr;

        arr = [];
        for (i = 0, len = this._binds.length; i < len; ++i) {
            if (this._binds[i] === undefined) {
                arr.push(this.states[i]);
            }
        }
        return arr;
    };

    /**
     * Adding a local event.
     *
     * @method addEvent
     * @param {String}  name
     * @return {Boolean} true if success, false if failure
     */
    InputMapper.prototype.addEvent = function(name) {
        if (this.states.indexOf(name) !== -1) {
            return false;
        }

        this.states.push(name);
        this._binds.push(undefined);
        this.values.push(undefined);
        this.oldValues.push(undefined);

        return true;
    };

    /**
     * Removing a local event.
     *
     * @method rmEvent
     * @param {String}  name
     * @return {Boolean} true if success, false if failure
     */
    InputMapper.prototype.rmEvent = function(name) {
        var i;
        i = this.states.indexOf(name);

        if (i === -1) {
            return false;
        }
        this.states.splice(i, 1);
        this._binds.splice(i, 1);
        this.values.splice(i, 1);
        this.oldValues.splice(i, 1);

        return true;
    };

    /**
     * Bind a remote event to a local event.
     *
     * @method bindEvent
     * @param {String}  localEvent
     * @param {String}  remoteEvent
     * @param {EventProvider}  input
     */
    InputMapper.prototype.bindEvent = function(localEvent, remoteEvent, input) {
        var i, id;
        i = this.states.indexOf(localEvent);

        if (i === -1 || input.getStateList().indexOf(remoteEvent) === -1) {
            return false;
        }

        if ( this._binds[i] !== undefined ) {
            this._binds[i].input.rmListener(this._binds[i].id);
        }

        id = input.addListener(remoteEvent, this._bindEvent.bind(this));
        this._binds[i] = {event: remoteEvent, input: input, id: id};
        return true;
    };


    /**
     * Bind a remote event to a local event by listening to the next event of input.
     *
     * @method bindListen
     * @param {String}  localEvent
     * @param {EventProvider}  input
     */
    InputMapper.prototype.bindListen = function(localEvent, input, callback) {
        var i, id;
        i = this.states.indexOf(localEvent);

        if (i === -1) {
            return false;
        }

        if ( this._binds[i] !== undefined ) {
            this._binds[i].input.rmListener(this._binds[i].id);
        }

        this.stopBindListen();

        id = input.addListener(this._bindListenEvent.bind(this));
        this._binds[i] = {event: undefined, input: input, id: id, callback: callback};
        return true;
    };


    /**
     * Stop a listening of the function bindListen.
     *
     * @method stopBindListen
     */
    InputMapper.prototype.stopBindListen = function() {
        var i, len;

        for (i = 0, len = this._binds.length; i < len; ++i) {
            if (this._binds[i] !== undefined && this._binds[i].event === undefined) {
                this._binds[i].input.rmListener(this._binds[i].id);
                this._binds.splice(i, 1);
                return;
            }
        }
    };

    /**
     * Callback function who bind a local event with remote event.
     *
     * @method _bindEvent
     * @param {String}   event
     * @param {Boolean|Object}   new_value
     * @param {EventProvider}   object
     * @private
     */
    InputMapper.prototype._bindEvent = function(event, new_value, object) {
        var i, len;
        if (this.enable) {
            for (i = 0, len = this._binds.length; i < len; ++i) {
                if (this._binds[i] !== undefined && this._binds[i].event === event &&
                    this._binds[i].input === object) {
                    this.modifyState(this.states[i], new_value);
                }
            }
        }
    };

    /**
     * Callback function who bind a local event with remote event when bindListen is run.
     *
     * @method _bindListenEvent
     * @param {String}   event
     * @param {Boolean|Object}   new_value
     * @param {EventProvider}   object
     * @private
     */
    InputMapper.prototype._bindListenEvent = function(event, new_value, object) {
        var i, len;
        for (i = 0, len = this._binds.length; i < len; ++i) {
            if (this._binds[i] !== undefined && this._binds[i].event === undefined &&
                this._binds[i].input === object) {

                this._binds[i].input.rmListener(this._binds[i].id);
                if (this._binds[i].callback !== undefined) {
                    this._binds[i].callback(event);
                }
                this.bindEvent(this.states[i], event, object);
            }
        }
    };

}(TW));
