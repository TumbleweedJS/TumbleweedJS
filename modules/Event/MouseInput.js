/**
 * @module Event
 * @namespace Event
 */

var TW = TW || {};
define(['./DeviceInput', '../Utils/inherit', '../Utils/Polyfills'], function(DeviceInput, inherit) {

	TW.Event = TW.Event || {};

	/**
	 * DeviceInput using the mouse.
	 *
	 * Four state variables are provided:
	 *
	 *  - `MOUSE_MOVE` (object containing `x` and `y` properties)
	 *  - `MOUSE_BUTTON_LEFT` (type boolean)
	 *  - `MOUSE_BUTTON_RIGHT` (type boolean)
	 *  - `MOUSE_BUTTON_MIDDLE` (type boolean)
	 *
	 * Each button is either `MOUSE_PRESSED` or `MOUSE_RELEASED` following the mouse state.<br />
	 * The `MOUSE_MOVE` state contain directly an object representing the position of the object.
	 * At each mouse movement, a new event is created, updating the values.
	 *
	 *
	 *
	 * @example
	 *
	 *     var mouse = new MouseInput();
	 *          mouse.on("MOUSE_BUTTON_LEFT", function(event, value, provider) {
	 *
	 *          }, MouseInput.isPressed);
     *     });
	 *
	 *
	 * @class MouseInput
	 * @extends Event.DeviceInput
	 * @constructor
	 * @param {HTMLElement} [target] element listened. Only mouse events on target are considered.
	 *   default to window.document.
	 */
	function MouseInput(target) {
		var i, len;

		DeviceInput.call(this);

		/**
		 * @event {Object} MOUSE_MOVE
		 * @param {Number} MOUSE_MOVE.x
		 * @param {Number} MOUSE_MOVE.y
		 */
		/**
		 * @event {Boolean} MOUSE_BUTTON_LEFT
		 */
		/**
		 * @event {Boolean} MOUSE_BUTTON_MIDDLE
		 */
		/**
		 * @event {Boolean} MOUSE_BUTTON_RIGHT
		 */


		if (target === undefined) {
			target = window.document;
		}

		/**
		 * Enable or disable context menu display on right click.
		 *
		 * @property {Boolean} contextMenuActive
		 * @default true
		 */
		this.contextMenuActive = true;

		this.states.push('MOUSE_MOVE');
		this.states.push('MOUSE_BUTTON_LEFT');
		this.states.push('MOUSE_BUTTON_MIDDLE');
		this.states.push('MOUSE_BUTTON_RIGHT');

		for (i = 0, len = this.states.length; i < len; i++) {
			if (this.states[i] === 'MOUSE_MOVE') {
				this._values[i] = {x: 0, y: 0};
			} else {
				this._values[i] = MouseInput.BUTTON_RELEASED;
			}
		}

		target.addEventListener("mousemove", this._onMouseMove.bind(this), false);
		target.addEventListener("mouseup", this._onMouseUp.bind(this), false);
		target.addEventListener("mousedown", this._onMouseDown.bind(this), false);
		target.addEventListener("contextmenu", this._showContextMenu.bind(this), false);
	}

	inherit(MouseInput, DeviceInput);

	/**
	 * Represent a button pressed state
	 * @property {Boolean} BUTTON_PRESSED
	 * @static
	 * @readonly
	 */
	MouseInput.BUTTON_PRESSED = true;

	/**
	 *Represent a button released state
	 * @property {Boolean} BUTTON_RELEASED
	 * @static
	 * @readonly
	 */
	MouseInput.BUTTON_RELEASED = false;

	/**
	 * Called when a mouse is moved.
	 *
	 * @method _onMouseMove
	 * @param {MouseEvent}  event
	 * @private
	 */
	MouseInput.prototype._onMouseMove = function(event) {
		this.emit('MOUSE_MOVE', {
			x: event.clientX - event.target.getBoundingClientRect().left,
			y: event.clientY - event.target.getBoundingClientRect().top
		});
	};

	/**
	 * Called when a mouse button is released.
	 *
	 * @method _onMouseUp
	 * @param {MouseEvent}  event
	 * @private
	 */
	MouseInput.prototype._onMouseUp = function(event) {
		this.emit(this._getAssociatedEvent(event), MouseInput.BUTTON_RELEASED);
	};

	/**
	 * Called when a mouse button is pressed.
	 *
	 * @method _onMouseDown
	 * @param {MouseEvent}  event
	 * @private
	 */
	MouseInput.prototype._onMouseDown = function(event) {
		this.emit(this._getAssociatedEvent(event), MouseInput.BUTTON_PRESSED);
	};

	/**
	 * search a state corresponding to the event object
	 *
	 * @method _getAssociatedEvent
	 * @param {MouseEvent}   event
	 * @return {String|null}    name of state changed. null if no state is found.
	 * @private
	 */
	MouseInput.prototype._getAssociatedEvent = function(event) {

		switch (event.button) {
			case 0:
				return 'MOUSE_BUTTON_LEFT';
			case 1:
				return 'MOUSE_BUTTON_MIDDLE';
			case 2:
				return 'MOUSE_BUTTON_RIGHT';
			default:
				return null;
		}
	};

	/**
	 * remove showing of context menu
	 *
	 * @method _showContextMenu
	 * @param {MouseEvent}   event
	 * @private
	 */
	MouseInput.prototype._showContextMenu = function(event) {

		if (this.contextMenuActive === false) {
			event.preventDefault();
		}
	};

	/**
	 * Predicate wich can be used for testing if a mouse button is pressed.
	 *
	 * @method isPressed
	 * @static
	 * @return {Boolean} return `true` if the button is pressed.
	 */
	MouseInput.isPressed = function(event, value) {
		return value;
	};

	/**
	 * Predicate wich can be used for testing if a mouse button is released.
	 *
	 * @method isReleased
	 * @static
	 * @return {Boolean} return `true` if the button is released.
	 */
	MouseInput.isReleased = function(event, value) {
		return !value;
	};

	TW.Event.MouseInput = MouseInput;
	return MouseInput;
});
