/**
 * @module Event
 * @namespace Event
 */

var TW = TW || {};
define(['./EventProvider', '../Utils/inherit'], function(EventProvider, inherit) {

	TW.Event = TW.Event || {};


	/**
	 * Abstract class representing an event provider.
	 * The class contains a list of variables with a certain state.
	 * When a variable change, all listeners are called.
	 *
	 * All inputs can be represented by a list of states (ex: mouse position, each key (pressed or released)).
	 *
	 * @class DeviceInput
	 * @extends Event.EventProvider
	 * @constructor
	 */
	function DeviceInput() {

		EventProvider.call(this);

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

	}

	inherit(DeviceInput, EventProvider);

	/**
	 * return a const string representing the type of provider.
	 * All providers of the same type must return the same result.
	 *
	 * **Note:** All child class MUST implement this method.
	 *
	 * @method getType
	 * @return {String} name of Provider type.
	 */
	DeviceInput.prototype.getType = function() {
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
	DeviceInput.prototype.getStateList = function() {
		return this._states;
	};

	/**
	 *  Search the state of a state variable
	 *
	 * @method getState
	 * @param {String}  name
	 * @return {*}    value of corresponding variable
	 */
	DeviceInput.prototype.getState = function(name) {
		var i, len;

		for (i = 0, len = this._states.length; i < len; ++i) {
			if (this._states[i] === name) {
				return this._values[i];
			}
		}
		throw new Error('DeviceInput: Unknow state: ' + name);
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
	DeviceInput.prototype.getOldState = function(name) {
		var i, len;

		for (i = 0, len = this._states.length; i < len; ++i) {
			if (this._states[i] === name) {
				return this._oldValues[i];
			}
		}
		throw new Error('DeviceInput: Unknow state: ' + name);
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
	 *      @param {DeviceInput}  callback.provider   instance of provider
	 * @return {Number} listener id (used for remove it
	 * with {{#crossLink "Event.DeviceInput/rmListener"}}rmListener{{/crossLink}})
	 *
	 * @example
	 *
	 *      //myCallback will be called for each events.
	 *      provider.addListener(myCallback);
	 *
	 *      //mySecondCallback will be called only when the "A" variable obtain the state KEY_PRESSED.
	 *      provider.addListener("A", provider.KEY_PRESSED, mySecondCallback);
	 */
	DeviceInput.prototype.addListener = function(event, value, callback) {
		if (callback === undefined) {
			callback = value;
			value = undefined;
		}
		if (callback === undefined) {
			callback = event;
			event = undefined;
		}

		if (value !== undefined) {
			this.on(event, callback, function(evnt, data) {
				return (JSON.stringify(data) === JSON.stringify(value));
			});
		} else {
			this.on(event || null, callback);
		}

	};

	/**
	 * Remove a listener.
	 *
	 * @method rmListener
	 */
	DeviceInput.prototype.rmListener = function(event, callback) {


		this.off(event, callback);
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
	DeviceInput.prototype._modifyState = function(event, newValue) {
		var i, len;

		for (i = 0, len = this._states.length; i < len; ++i) {
			if (this._states[i] === event) {
				this._oldValues[i] = this._values[i];
				this._values[i] = newValue;
				this.emit(event, newValue);
				return;
			}
		}
		throw new Error('DeviceInput: Unknow state: ' + event);
	};

	TW.Event.DeviceInput = DeviceInput;
	return DeviceInput;
});
