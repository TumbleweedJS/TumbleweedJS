/**
 * @module Event
 * @namespace Event
 */

var TW = TW || {};
define([], function() {

	TW.Event = TW.Event || {};


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
		 * @property {String[]} _states []
		 * @protected
		 */
		this._states = [];

		/**
		 * List of values for state variables.
		 * `this._states` and `this._values` share the same array index.
		 *
		 * @property {Array} _values
		 * @protected
		 */
		this._values = [];

		/**
		 * List of previous values for state variables.
		 * `this._states` and `this._oldValues` share the same array index.
		 *
		 * @property {Array}    _oldValues
		 * @protected
		 */
		this._oldValues = [];

		this._globalCallbacks = [];
		this._stateCallbacks = [];

		/* used for giving a unique id */
		this._nextId = 1;
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
		return null;
	};

	/**
	 * List all variables accessible by this provider
	 * Each variable can accept listeners.
	 *
	 * **Note:** return value is a reference. you should make a copy if you need to modify it.
	 * @method getStateList
	 * @return {String[]}   [] list of name variables.
	 */
	EventProvider.prototype.getStateList = function() {
		return this._states;
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

		for (i = 0, len = this._states.length; i < len; ++i) {
			if (this._states[i] === name) {
				return this._values[i];
			}
		}
		throw new Error('EventProvider: Unknow state: ' + name);
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

		for (i = 0, len = this._states.length; i < len; ++i) {
			if (this._states[i] === name) {
				return this._oldValues[i];
			}
		}
		throw new Error('EventProvider: Unknow state: ' + name);
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
	 * with {{#crossLink "Event.EventProvider/rmListener"}}rmListener{{/crossLink}})
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

		id = this._nextId;
		this._nextId++;

		if (event === undefined) {
			this._globalCallbacks.push({
				                           id:       id,
				                           callback: callback
			                           });
			return id;
		} else {
			for (i = 0, len = this._states.length; i < len; ++i) {
				if (this._states[i] === event) {
					if (this._stateCallbacks[i] === undefined) {
						this._stateCallbacks[i] = [];
					}
					this._stateCallbacks[i].push({
						                             id:       id,
						                             filter:   value,
						                             callback: callback
					                             });
					return id;
				}
			}
			throw new Error('EventProvider: Unknow state: ' + event);
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

		for (i = 0, len = this._globalCallbacks.length; i < len; ++i) {
			if (this._globalCallbacks[i].id === id) {
				this._globalCallbacks.splice(i, 1);
				return;
			}
		}

		for (i = 0, len = this._stateCallbacks.length; i < len; ++i) {
			if (this._stateCallbacks[i] !== undefined) {
				for (j = 0, len2 = this._stateCallbacks[i].length; j < len2; ++j) {
					if (this._stateCallbacks[i][j].id === id) {
						this._stateCallbacks[i].splice(j, 1);
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
	 * @method _modifyState
	 * @param {String}  event       event name
	 * @param {*}       newValue   the new value.
	 * @protected
	 */
	EventProvider.prototype._modifyState = function(event, newValue) {
		var i, j, len, len2;

		for (i = 0, len = this._states.length; i < len; ++i) {
			if (this._states[i] === event) {
				this._oldValues[i] = this._values[i];
				this._values[i] = newValue;

				for (j = 0, len2 = this._globalCallbacks.length; j < len2; ++j) {
					this._globalCallbacks[j].callback(event, newValue, this);
				}
				if (this._stateCallbacks[i] !== undefined) {
					for (j = 0, len2 = this._stateCallbacks[i].length; j < len2; ++j) {
						if (this._stateCallbacks[i][j].filter === undefined ||
						    JSON.stringify(newValue) === JSON.stringify(this._stateCallbacks[i][j].filter)) {
							this._stateCallbacks[i][j].callback(event, newValue, this);
						}
					}
				}
				return;
			}
		}
		throw new Error('EventProvider: Unknow state: ' + event);
	};

	TW.Event.EventProvider = EventProvider;
	return EventProvider;
});
