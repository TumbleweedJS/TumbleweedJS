/**
 @module Event
 @namespace Event
 */

var TW = TW || {};

(function(TW) {

    if (typeof window.define === "function" && window.define.amd) {
        window.define([], initWrap(init));
    } else {
        initWrap(init);
    }

    function initWrap(f) {
        TW.Event = TW.Event ||  {};
        TW.Event.EventProvider = f();
        return TW.Event.EventProvider;
    }


    function init() {

        /**
         * Abstract class representing an event provider.
         * The class contains a list of variables with a certain state.
         * When a variable change, all listeners are called.
         *
         * All inputs can be represented by a list of states (ex: mouse position, each key (pressed or released)).
         *
         * @class EventProvider
         * @constructor
         */
        function EventProvider() {
            /**
             * List of all event variables name.
             *
             * @property {String[]} states []
             * @protected
             */
            this.states = [];

            /**
             * List of values for state variables.
             * `this.states` and `this.values` share the same array index.
             *
             * @property {Array}    values
             * @protected
             */
            this.values = [];

            /**
             * List of previous values for state variables.
             * `this.states` and `this.oldValues` share the same array index.
             *
             * @property {Array}    oldValues
             * @protected
             */
            this.oldValues = [];

            this._globalCallbacks = [];
            this._stateCallbacks = [];

            /* used for giving a unique id */
            this.next_id = 1;
        }

        /**
         * return a const string representing the type of provider.
         * All providers of the same type must return the same result.
         *
         * **Note:** All child class MUST implement this method.
         *
         * @method getType
         * @return {String} name of Provider type.
         */
        EventProvider.prototype.getType = function() {
            return null;            //TODO MUST be implemented !!!
        };

        /**
         * List all variables accessible by this provider
         * Each variable can accept listeners.
         *
         * @method getStateList
         * @return {String[]}   [] list of name variables.
         */
        EventProvider.prototype.getStateList = function() {
            return this.states;    //TODO: make a copy ? read-only ?
        };

        /**
         *  Search the state of a state variable
         *
         * @method getState
         * @param {String}  name
         * @return {*}    value of corresponding variable
         */
        EventProvider.prototype.getState = function(name) {
            var i, len;

            for (i = 0, len = this.states.length; i < len; i++) {
                if (this.states[i] === name) {
                    return this.values[i];
                }
            }
            return null; //TODO: throw exception ?
        };

        /**
         *  Search the previous state of a state variable.
         *  The provider keep always one old state for each variable.
         *  It's useful for compare the difference.
         *
         * @method getOldState
         * @param {String}  name
         * @return {*}    value of corresponding variable
         */
        EventProvider.prototype.getOldState = function(name) {
            var i, len;

            for (i = 0, len = this.states.length; i < len; i++) {
                if (this.states[i] === name) {
                    return this.oldValues[i];
                }
            }
            return null; //TODO: throw exception ?
        };

        /**
         * add a listener.
         *
         * it can listen all events or only one event variable.
         * The listener can choose to be called for all events associated to a variable,
         * or only when the variable is in a certain state.
         *
         * @method addListener
         * @param {String}   [event]    name of event variable. y default, all events are caught.
         * @param {*}        [value]    value expected for call the callback. By default, any value call the callback.
         * @param {Function} callback   callback function called with 3 parameters:
         *      @param {String}         callback.event      event name
         *      @param {*}              callback.value      new value
         *      @param {EventProvider}  callback.provider   instance of provider
         * @return {Number} listener id (used for remove it
         * with {{#crossLink "Event.EventProvider/rmListener"}}{{/crossLink}})
         *
         * @example
         *
         *      //myCallback will be called for each events.
         *      provider.addListener(myCallback);
         *
         *      //mySecondCallback will be called only when the "A" variable obtain the state KEY_PRESSED.
         *      provider.addListener("A", provider.KEY_PRESSED, mySecondCallback);
         */
        EventProvider.prototype.addListener = function(event, value, callback) {
            var i, len, id;

            if (callback === undefined) {
                callback = value;
                value = undefined;
            }
            if (callback === undefined) {
                callback = event;
                event = undefined;
            }

            id = this.next_id;
            this.next_id++;

            if (event === undefined) {
                this._globalCallbacks.push({
                    id:         id,
                    callback:   callback
                });
                return id;
            } else {
                for (i = 0, len = this.states.length; i < len; i++) {
                    if (this.states[i] === event) {
                        if (this._stateCallbacks[i] === undefined) {
                            this._stateCallbacks[i] = [];
                        }
                        this._stateCallbacks[i].push({
                            id:         id,
                            filter:     value,
                            callback:   callback
                        });
                        return id;
                    }
                }
                return null;    //TODO: throw exception ?
            }
        };

        /**
         * Remove a listener.
         *
         * @method rmListener
         * @param {Number} id id of the listener.
         */
        EventProvider.prototype.rmListener = function(id) {
            var i, j, len, len2;

            for (i = 0, len = this._globalCallbacks.length; i < len; i++) {
                if (this._globalCallbacks[i].id === id) {
                    this._globalCallbacks.splice(i, 1);
                    return;
                }
            }

            for (i = 0, len = this._stateCallbacks.length; i < len; i++) {
                if (this._stateCallbacks[i] !== undefined) {
                    for (j = 0, len2 = this._stateCallbacks[i].length; j < len2; j++) {
                        if (this._stateCallbacks[i][j].id === id) {
                            this._stateCallbacks[i][j].splice(i, 1);
                            return;
                        }
                    }
                }
            }
        };

        /**
         * Apply a modification to an internal state variable
         * and call listeners.
         *
         * @method modifyState
         * @param {String}  event       event name
         * @param {*}       new_value   the new value.
         * @protected
         */
        EventProvider.prototype.modifyState = function(event, new_value) {
            var i, j, len, len2;

            for (i = 0, len = this.states.length; i < len; i++) {
                if (this.states[i] === event) {
                    this.oldValues[i] = this.values[i];
                    this.values[i] = new_value;

                    for (j = 0, len2 = this._globalCallbacks.length; j < len2; j++) {
                        this._globalCallbacks[j].callback(event, new_value, this);
                    }
                    if (this._stateCallbacks[i] !== undefined) {
                        for (j = 0, len2 = this._stateCallbacks[i].length; j < len2; j++) {
                            if (new_value === this._stateCallbacks[i][j].filter) {
                                this._stateCallbacks[i][j].callback(event, new_value, this);
                            }
                        }
                    }
                }
            }
            // TODO: throw exception ?
        };

        return EventProvider;
    }



}(TW));