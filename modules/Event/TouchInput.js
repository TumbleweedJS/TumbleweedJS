
/**
 * @module Event
 * @namespace Event
 */

var TW = TW || {};
define(['./DeviceInput', '../Utils/inherit', '../Utils/Polyfills'], function(DeviceInput, inherit) {

	TW.Event = TW.Event || {};

	/**
	 * DeviceInput using the touch interface, for tactile devices.
	 *
	 * Three state variables are provided:
	 *
	 *  - `TOUCH_START` (type TouchInput)
	 *  - `TOUCH_END` (type TouchInput)
	 *  - `TOUCH_MOVE` (type TouchInput)
	 *
	 * @class TouchInput
	 * @extends Event.DeviceInput
	 * @constructor
	 * @param {HTMLElement} [target] element listened.
	 *   default to window.document.
	 */
	function TouchInput(target) {

		DeviceInput.call(this);

		/**
		 * Emited when the user add a touch point on the touch surface.
		 *
		 * @event {TouchEvent} TOUCH_START
		 */
		/**
		 * Emited when the user removes a touch point from the touch surface.
		 *
		 * @event {TouchEvent} TOUCH_END
		 */
		/**
		 * Emited when the user moves a touch point along the touch surface.
		 *
		 * @event {TouchEvent} TOUCH_MOVE
		 */

		if (target === undefined) {
			target = window.document;
		}

		this.states.push('TOUCH_START');
		this.states.push('TOUCH_END');
		this.states.push('TOUCH_MOVE');

		var that = this;
		target.addEventListener("touchstart", function(evt) {
			that.emit('TOUCH_START', evt);
		}, false);
		target.addEventListener("touchend", function(evt) {
			that.emit('TOUCH_END', evt);
		}, false);
		target.addEventListener("touchmove", function(evt) {
			that.emit('TOUCH_MOVE', evt);
		}, false);
	}

	inherit(TouchInput, DeviceInput);

	TW.Event.TouchInput = TouchInput;
	return TouchInput;
});
