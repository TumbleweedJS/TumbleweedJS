/**
 @module Event
 @namespace Event
 */

var TW = TW || {};

(function(TW) {

    TW.Event = TW.Event ||  {};
    TW.Event.EventCombination = EventCombination;

    if (typeof window.define === "function" && window.define.amd) {
		define(['./EventProvider', '../utils/Inheritance'], function() {
            TW.Utils.inherit(EventCombination, TW.Event.EventProvider);
            return EventCombination;
        });
	} else {
        TW.Utils.inherit(EventCombination, TW.Event.EventProvider);
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
    function EventCombination(input) {

        TW.Event.EventProvider.call(this);

        this._events = [];
        this._eventsBind = [];

        this.enable = true;

        this.input = input;
        this.input.addListener(this._combinationEvent.bind(this));
    }

    /**
     * return the EventProvider type.
     *
     * @method getType
     * @return {String}     "COMBINATION"
     */
    EventCombination.prototype.getType = function() {
        return "COMBINATION";
    };

    /**
     * Bind a combinaison of remote events to a local event.
     *
     * @method bindEvent
     * @param {String}  localEvent
     * @param {String}  remoteEvents
     * @param {EventProvider}  input
     */
    EventCombination.prototype.addCombination = function(localEvent, remoteEvents) {
        var i, n, len, states, values, oldValues;
        i = this.states.indexOf(localEvent);

        if (i !== -1 || remoteEvents.length === 0) {
            return false;
        }
        for (i = 0, len = remoteEvents.length; i < len; ++i) {
            if (this.input.states.indexOf(remoteEvents[i]) === -1) {
                return false;
            }
        }

        values = [];
        oldValues = [];

        for (i = 0, len = remoteEvents.length; i < len; ++i) {

            n = this._events.indexOf(remoteEvents[i]);

            if (n === -1) {
                this._events.push(remoteEvents[i]);
                this._eventsBind.push([localEvent]);
            }
            else {
                this._eventsBind[n].push(localEvent);
            }
            values.push({event: remoteEvents[i], value: this.input.getState(remoteEvents[i])});
            oldValues.push({event: remoteEvents[i], value: this.input.getOldState(remoteEvents[i])});
        }
        this.states.push(localEvent);
        this.values.push(values);
        this.oldValues.push(oldValues);

        return true;
    };

    /**
     * Removing a local combinaison event.
     *
     * @method rmCombinaison
     * @param {String}  name
     * @return {Boolean} true if success, false if failure
     */
    EventCombination.prototype.rmCombinaison = function(name) {
        var i, n, len;

        i = this.states.indexOf(name);

        if (i === -1) {
            return false;
        }
        this.states.splice(i, 1);
        this.values.splice(i, 1);
        this.oldValues.splice(i, 1);

        for (i = 0, len = this._eventsBind.length; i < len; ++i) {
            n = this._eventsBind[i].indexOf(name);

            if (n !== -1) {
                if (this._eventsBind[i].length === 1) {
                    this._eventsBind.splice(i, 1);
                    this._events.splice(i, 1);
                    --i;
                }
                else {
                    this._eventsBind[i].splice(n, 1);
                }
            }
        }
        return true;
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
    EventCombination.prototype._combinationEvent = function(event, new_value, object) {
        var i, j, n, len, leng,  localEvents, values, modified;

        if (this.enable) {
            i = this._events.indexOf(event);
            if (i === -1) {
                return;
            }

            localEvents = this._eventsBind[i];

            for (i = 0, len = localEvents.length; i < len; ++i) {

                n = this.states.indexOf(localEvents[i]);
                values = this.values[n];

                modified = false;

                for (j = 0, leng = values.length; j < leng; ++j) {

                    if (values[j].event === event) {

                        values[j].value = new_value;
                        modified = true;
                    }
                }
                this.modifyState(localEvents[i], values);
            }
        }
    };

}(TW));
