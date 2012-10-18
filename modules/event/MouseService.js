/**
 * @module Event
 * @namespace Event
 */

var TW = TW || {};
TW.Event = TW.Event || {};


/**
 Namespace that contain all possibles values for input mouse.
 Each property is a constant representing a mouse button.

 a variable of type Event.MouseKey must be one of the values
 defined on this class.

 @class MouseKey
 @static
 */
TW.Event.MouseKey = {
	/**
	 * @property MouseLeft {Number}
	 */
	"MouseLeft": 0
};


/**
 A service to manage input mouse

 @class MouseService
 @static
 */
TW.Event.MouseService = function() {

	/**
	 * Status for know if the button is down
	 * @property mouseDown
	 * @type {Boolean}
	 */
	var mouseDown = false;

	/**
	 * Status for know if the action is a click
	 * @property click
	 * @type {Boolean}
	 */
	var click = false;

	/**
	 * Array for the mouse position
	 * @property mousePosition
	 * @type {Array}
	 */
	var mousePosition = [];

	/**
	 initialize the mouse service.
	 Must be called before any use.

	 @method initialize
	 */
	function initialize() {
		window.onmousedown = mouseDownFunction;
		window.onmouseup = mouseUpFunction;
		window.onclick = mouseClickFunction;
		window.onmousemove = setMousePosition;
		mousePosition.length = 0;
		mouseDown = false;
		click = false;
	}

	/**
	 * Set the mouse position
	 * @method setMousePosition
	 * @param event
	 */
	function setMousePosition(event) {
		mousePosition.x = event.layerX;
		mousePosition.y = event.layerY;

		if (mousePosition.x < 0) {
			mousePosition.x = 0;
		}
		if (mousePosition.y < 0) {
			mousePosition.y = 0;
		}
	}

	/**
	 * Update the state when the button is down
	 * @method mouseDownFunction
	 * @param event
	 */
	function mouseDownFunction(event) {
		mouseDown = true;
		click = false;
	}

	/**
	 * Update the state when the button is up
	 * @method mouseUpFunction
	 * @param event
	 */
	function mouseUpFunction(event) {
		mouseDown = false;
	}

	/**
	 * Update the state when the action is a simple click
	 * @method mouseClickFunction
	 * @param event
	 */
	function mouseClickFunction(event) {
		click = true;
	}

	/**
	 * Check if the button is down
	 * @method isMouseButtonDown
	 * @param {TW.Event.MouseKey} mouse_code
	 * @return {Boolean}
	 */
	function isMouseButtonDown(mouse_code) {
		if (mouse_code === TW.Event.MouseKey.Left) {
			return mouseDown;
		}
		return false;
	}

	/**
	 * Check if the action is a simple click
	 * @method isClick
	 * @return {Boolean}
	 */
	function isClick() {
		var temp = click;
		click = false;
		return temp;
	}

	/**
	 * Get the mouse position
	 *
	 * @method getMousePosition
	 * @return {Object} {
     * x: the x position,
     * y: the y position
     * }
	 */
	function getMousePosition() {
		return mousePosition;
	}

	//public service interface.
	return {
		initialize       : initialize,
		isMouseButtonDown: isMouseButtonDown,
		isClick          : isClick,
		getMousePosition : getMousePosition
	};
}();

/**
 Used for compatibility
 @module Event
 */

/**
 @class MouseEnum
 @deprecated replaced by `Event.Key`
 */
var MouseEnum = TW.Event.MouseKey;