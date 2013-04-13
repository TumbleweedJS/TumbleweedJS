/**
 * @module Event
 * @namespace Event
 */

var TW = TW || {};
define(['./EventProvider', '../Utils/inherit'], function(EventProvider, inherit) {

	TW.Event = TW.Event || {};


	/**
	 * Abstract class representing a device, like a keyboard or a mouse.
	 * The class contains a list of state variables representing the state of the device.
	 *
	 * When a variable change, an event with the same name is emitted.
	 *
	 * All inputs can be represented by a list of states (ex: mouse position, each key (pressed or released)).
	 *
	 * **Example:**
	 *
	 * The A key is pressed. The state value of the key, named `KEY_A` changes from `RELEASED` to `PRESSED`.
	 * An event named `KEY_A` is fired, like this:
	 *
	 *     device.emit('KEY_A', KEY_PRESSED);
	 *
	 * **State variables**
	 *
	 * All state variables availlables are listed in `states`.
	 *
	 * For getting the value of a state variable you can use `get` at any time:
	 *
	 *     keyboard.get('KEY_A') //KEY_PRESSED
	 *     mouse.get('MOUSE_POSITION') // { x: 100, y: 100 }
	 *
	 *
	 * @class DeviceInput
	 * @extends Event.EventProvider
	 * @constructor
	 */
	function DeviceInput() {

		EventProvider.call(this);

		/**
		 * List of all states variables.
		 * This array contain only the names, the values can be accessed by using `get()`.
		 *
		 * @property {String[]} states
		 * @readonly
		 */
		this.states = [];

		/**
		 * List of values for state variables.
		 * `this.states` and `this._values` share the same array index.
		 *
		 * @property {Array} _values
		 * @protected
		 */
		this._values = [];

		/**
		 * Enable (or disable) the device.
		 * When the device is disabled, all call to `emit` is ignored.
		 *
		 * @property {Boolean} enabled
		 * @default true
		 */
		this.enabled = true;
	}

	inherit(DeviceInput, EventProvider);

	/**
	 *  Search the value of a state variable
	 *
	 * @method get
	 * @param {String} name
	 * @return value of corresponding variable
	 */
	DeviceInput.prototype.get = function(name) {
		var i, len;

		for (i = 0, len = this.states.length; i < len; ++i) {
			if (this.states[i] === name) {
				return this._values[i];
			}
		}
		throw new Error('DeviceInput: Unknow state: ' + name);
	};

	/**
	 * Emit an event and call all subscibers to this event.
	 *
	 * This method overload `EventProvider.emit`, for update the values of state variables.
	 *
	 * **This method should not be used directly by the user.**
	 *
	 * @method emit
	 * @param {String} event event name
	 * @param [data=null] event data. Can be anything.
	 * @chainable
	 */
	DeviceInput.prototype.emit = function(event, data) {
		if (!this.enabled) {
			return this;
		}

		var len = this.states.length;
		for (var i = 0; i < len; ++i) {
			if (this.states[i] === event) {
				this._values[i] = data;
			}
		}

		return EventProvider.prototype.emit.call(this, event, data);
	};


	TW.Event.DeviceInput = DeviceInput;
	return DeviceInput;
});
