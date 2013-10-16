/**
 * @module Event
 * @namespace Event
 */

var TW = TW || {};
define(['./DeviceInput', '../Utils/inherit', '../Utils/Polyfills'], function(DeviceInput, inherit) {

	TW.Event = TW.Event || {};


	/**
	 * DeviceInput using the keyboard.
	 *
	 *
	 * Each event represent a key. each key has two states: `KEY_PRESSED` or `KEY_RELEASED`
	 *
	 *
	 * ## List of keys:
	 *
	 * - All letters from `KEY_A` to `KEY_Z`
	 * - All digits from `KEY_0` to `KEY_9`
	 * - Functions Keys, from `KEY_F1` to `KEY_F12`
	 * - KEY_BACKSPACE
	 * - KEY_TAB
	 * - KEY_ENTER
	 * - KEY_SHIFT
	 * - KEY_ALT
	 * - KEY_PAUSE
	 * - KEY_CAPSLOCK
	 * - KEY_ESC
	 * - KEY_SPACE
	 * - KEY_PAGE_UP
	 * - KEY_PAGE_DOWN
	 * - KEY_END
	 * - KEY_HOME
	 * - KEY_LEFT
	 * - KEY_UP
	 * - KEY_RIGHT
	 * - KEY_DOWN
	 * - KEY_INSERT
	 * - KEY_DELETE
	 * - KEY_NUMLOCK
	 *
	 *
	 * <span>
	 * __Note:__
	 * This class use the `keyCode` attribute from KeyboardEvent object.
	 * The code list of [current W3C standard](http://www.w3.org/TR/2007/WD-DOM-Level-3-Events-20071221/keyset.html)
	 * is not implemented and there is differences between each browser.<br />
	 * The [next W3C standard](http://www.w3.org/TR/DOM-Level-3-Events/#keys-keyvalues)
	 * should improve compatibility.<br />
	 * __Currently, using Numeric key (from Keypad or not) with the Shift,
	 * CapsLock or NumLock keys is not possible.__<br />
	 * __Use exotic keys are strongly discouraged.__<br />
	 * <br />
	 * For example, using Chrome 22.0.1229.94 (under Linux) with a fr keyboard, key `&` (key `1` without `Shift`)
	 * are equally to key `7`.
	 * For more information about compatibility,[this document](http://unixpapa.com/js/key.html) provide
	 * a good summary of the situation.
	 *
	 * Usage of arrows keys, and usage of controls keys with alphabetic characters are supported.
	 *
	 *
	 *
	 * @example
	 *
	 *      var keyboard = new KeyboardInput();
	 *      keyboard.addListener("KEY_SPACE", KeyboardInput.KEY_PRESSED, function(event, value, provider) {
     *          if (provider.getState("KEY_CTRL") === KeyboardInput.KEY_PRESSED) {
     *              //CTRL+space is pressed !
     *          }
     *      });
	 *
	 * @class KeyboardInput
	 * @extends Event.DeviceInput
	 * @param {HTMLElement} [target]      element to listen keypressed and keyup. default to `window.document`
	 * @constructor
	 */
	function KeyboardInput(target) {
		var i, len;

		DeviceInput.call(this);

		if (target === undefined) {
			target = window.document;
		}

		/**
		 * @event {Boolean} KEY_A
		 */
		/**
		 * @event {Boolean} KEY_B
		 */
		/**
		 * @event {Boolean} KEY_C
		 */
		/**
		 * @event {Boolean} KEY_D
		 */
		/**
		 * @event {Boolean} KEY_E
		 */
		/**
		 * @event {Boolean} KEY_F
		 */
		/**
		 * @event {Boolean} KEY_G
		 */
		/**
		 * @event {Boolean} KEY_H
		 */
		/**
		 * @event {Boolean} KEY_I
		 */
		/**
		 * @event {Boolean} KEY_J
		 */
		/**
		 * @event {Boolean} KEY_K
		 */
		/**
		 * @event {Boolean} KEY_L
		 */
		/**
		 * @event {Boolean} KEY_M
		 */
		/**
		 * @event {Boolean} KEY_N
		 */
		/**
		 * @event {Boolean} KEY_O
		 */
		/**
		 * @event {Boolean} KEY_P
		 */
		/**
		 * @event {Boolean} KEY_Q
		 */
		/**
		 * @event {Boolean} KEY_R
		 */
		/**
		 * @event {Boolean} KEY_S
		 */
		/**
		 * @event {Boolean} KEY_T
		 */
		/**
		 * @event {Boolean} KEY_U
		 */
		/**
		 * @event {Boolean} KEY_V
		 */
		/**
		 * @event {Boolean} KEY_W
		 */
		/**
		 * @event {Boolean} KEY_X
		 */
		/**
		 * @event {Boolean} KEY_Y
		 */
		/**
		 * @event {Boolean} KEY_Z
		 */
		/**
		 * @event {Boolean} KEY_1
		 */
		/**
		 * @event {Boolean} KEY_2
		 */
		/**
		 * @event {Boolean} KEY_3
		 */
		/**
		 * @event {Boolean} KEY_4
		 */
		/**
		 * @event {Boolean} KEY_5
		 */
		/**
		 * @event {Boolean} KEY_5
		 */
		/**
		 * @event {Boolean} KEY_6
		 */
		/**
		 * @event {Boolean} KEY_7
		 */
		/**
		 * @event {Boolean} KEY_8
		 */
		/**
		 * @event {Boolean} KEY_9
		 */
		/**
		 * @event {Boolean} KEY_0
		 */

		/**
		 * @event {Boolean} KEY_F1
		 */
		/**
		 * @event {Boolean} KEY_F2
		 */
		/**
		 * @event {Boolean} KEY_F3
		 */
		/**
		 * @event {Boolean} KEY_F4
		 */
		/**
		 * @event {Boolean} KEY_F5
		 */
		/**
		 * @event {Boolean} KEY_F6
		 */
		/**
		 * @event {Boolean} KEY_F7
		 */
		/**
		 * @event {Boolean} KEY_F8
		 */
		/**
		 * @event {Boolean} KEY_F9
		 */
		/**
		 * @event {Boolean} KEY_F10
		 */
		/**
		 * @event {Boolean} KEY_F11
		 */
		/**
		 * @event {Boolean} KEY_F12
		 */
		/**
		 * @event {Boolean} KEY_BACKSPACE
		 */
		/**
		 * @event {Boolean} KEY_TAB
		 */
		/**
		 * @event {Boolean} KEY_ENTER
		 */
		/**
		 * @event {Boolean} KEY_SHIFT
		 */
		/**
		 * @event {Boolean} KEY_ALT
		 */
		/**
		 * @event {Boolean} KEY_PAUSE
		 */
		/**
		 * @event {Boolean} KEY_CAPSLOCK
		 */
		/**
		 * @event {Boolean} KEY_ESC
		 */
		/**
		 * @event {Boolean} KEY_SPACE
		 */
		/**
		 * @event {Boolean} KEY_PAGE_UP
		 */
		/**
		 * @event {Boolean} KEY_PAGE_DOWN
		 */
		/**
		 * @event {Boolean} KEY_END
		 */
		/**
		 * @event {Boolean} KEY_HOME
		 */
		/**
		 * @event {Boolean} KEY_UP
		 */
		/**
		 * @event {Boolean} KEY_DOWN
		 */
		/**
		 * @event {Boolean} KEY_RIGHT
		 */
		/**
		 * @event {Boolean} KEY_LEFT
		 */
		/**
		 * @event {Boolean} KEY_INSERT
		 */
		/**
		 * @event {Boolean} KEY_DELETE
		 */
		/**
		 * @event {Boolean} KEY_NUMLOCK
		 */

		//from KEY_A to KEY_Z
		for (i = 0; i < 26; i++) {
			this.states.push('KEY_' + String.fromCharCode('A'.charCodeAt(0) + i));      // charCode MAJ
		}
		//from KEY_F1 to KEY_F12
		for (i = 0; i < 12; i++) {
			this.states.push('KEY_F' + String.fromCharCode('1'.charCodeAt(0) + i)); //      112
		}
		// KEY_0 to KEY_9
		for (i = 0; i < 10; i++) {
			this.states.push('KEY_' + String.fromCharCode('0'.charCodeAt(0) + i));  //      48
		}

		this.states.push('KEY_BACKSPACE');
		this.states.push('KEY_TAB');
		this.states.push('KEY_ENTER');
		this.states.push('KEY_SHIFT');
		this.states.push('KEY_CTRL');
		this.states.push('KEY_ALT');
		this.states.push('KEY_PAUSE');
		this.states.push('KEY_CAPSLOCK');
		this.states.push('KEY_ESC');
		this.states.push('KEY_SPACE');
		this.states.push('KEY_PAGE_UP');
		this.states.push('KEY_PAGE_DOWN');
		this.states.push('KEY_END');
		this.states.push('KEY_HOME');
		this.states.push('KEY_LEFT');
		this.states.push('KEY_UP');
		this.states.push('KEY_RIGHT');
		this.states.push('KEY_DOWN');
		this.states.push('KEY_INSERT');
		this.states.push('KEY_DELETE');
		this.states.push('KEY_NUMLOCK');

		for (i = 0, len = this.states.length; i < len; i++) {
			this._values[i] = KeyboardInput.KEY_RELEASED;
		}

		/**
		 * enable or not the key repeat.
		 *
		 * @property {Boolean} enableKeyRepeat
		 * @default false
		 */
		this.enableKeyRepeat = false;

		target.addEventListener("keydown", this._onKeyDown.bind(this), false);
		target.addEventListener("keyup", this._onKeyUp.bind(this), false);
	}

	inherit(KeyboardInput, DeviceInput);

	/**
	 * Represent a key pressed state
	 * @property {Boolean} KEY_PRESSED
	 * @static
	 * @readonly
	 */
	KeyboardInput.KEY_PRESSED = true;

	/**
	 *Represent a key released state
	 * @property {Boolean} KEY_RELEASED
	 * @static
	 * @readonly
	 */
	KeyboardInput.KEY_RELEASED = false;


	/**
	 * Called when a key is pressed.
	 *
	 * @method _onKeyDown
	 * @param {KeyboardEvent}  event
	 * @private
	 */
	KeyboardInput.prototype._onKeyDown = function(event) {
		var name = this._getAssociatedEvent(event);
		if (this.enableKeyRepeat || this.get(name) !== KeyboardInput.KEY_PRESSED) {
			this.emit(name, KeyboardInput.KEY_PRESSED);
		}
	};

	/**
	 * Called when a key is released.
	 *
	 * @method _onKeyUp
	 * @param {KeyboardEvent}  event
	 * @private
	 */
	KeyboardInput.prototype._onKeyUp = function(event) {
		var name = this._getAssociatedEvent(event);
		if (this.enableKeyRepeat || this.get(name) !== KeyboardInput.KEY_RELEASED) {
			this.emit(name, KeyboardInput.KEY_RELEASED);
		}
	};

	/**
	 * search a state corresponding to the event object
	 *
	 * @method _getAssociatedEvent
	 * @param {KeyboardEvent}   event
	 * @return {String|null}    name of state changed. null if no state is found.
	 * @private
	 */
	KeyboardInput.prototype._getAssociatedEvent = function(event) {
		if (event.keyCode >= 'A'.charCodeAt(0) && event.keyCode <= 'Z'.charCodeAt(0)) {
			return 'KEY_' + String.fromCharCode(event.keyCode);
		}

		if (event.keyCode >= '0'.charCodeAt(0) && event.keyCode <= '9'.charCodeAt(0)) {
			return 'KEY_' + String.fromCharCode(event.keyCode);
		}

		if (event.keyCode >= 112 && event.keyCode < 124) {
			return 'KEY_F' + String.fromCharCode(111 - event.keyCode);
		}

		switch (event.keyCode) {
			case 8:
				return 'KEY_BACKSPACE';
			case 9:
				return 'KEY_TAB';
			case 13:
				return 'KEY_ENTER';
			case 16:
				return 'KEY_SHIFT';
			case 17:
				return 'KEY_CTRL';
			case 18:
				return 'KEY_ALT';
			case 19:
				return 'KEY_PAUSE';
			case 20:
				return 'KEY_CAPSLOCK';
			case 27:
				return 'KEY_ESC';
			case 32:
				return 'KEY_SPACE';
			case 33:
				return 'KEY_PAGE_UP';
			case 34:
				return 'KEY_PAGE_DOWN';
			case 36:
				return 'KEY_HOME';
			case 37:
				return 'KEY_LEFT';
			case 38:
				return 'KEY_UP';
			case 39:
				return 'KEY_RIGHT';
			case 40:
				return 'KEY_DOWN';
			case 45:
				return 'KEY_INSERT';
			case 46:
				return 'KEY_DELETE';
			case 144:
				return 'KEY_NUMLOCK';
			default:
				return null;
		}
	};

	/**
	 * Predicate wich can be used for testing if a key is pressed.
	 *
	 * @method isPressed
	 * @static
	 * @return {Boolean} return `true` if the key is pressed.
	 */
	KeyboardInput.isPressed = function(event, value) {
		return value;
	};

	/**
	 * Predicate wich can be used for testing if a key is released.
	 *
	 * @method isReleased
	 * @static
	 * @return {Boolean} return `true` if the key is released.
	 */
	KeyboardInput.isReleased = function(event, value) {
		return !value;
	};

	TW.Event.KeyboardInput = KeyboardInput;
	return KeyboardInput;
});
