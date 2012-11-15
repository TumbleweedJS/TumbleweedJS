/**
 @module Event
 @namespace Event
 */

var TW = TW || {};

(function(TW) {

    if (typeof window.define === "function" && window.define.amd) {
        define(['./EventProvider', '../utils/Inheritance'], initWrap(init));
    } else {
        initWrap(init);
    }

    function initWrap(f) {
        TW.Event = TW.Event ||  {};
        TW.Event.MouseInput = f();
        return TW.Event.MouseInput;
    }

    function init() {

        function MouseInput(target) {
            var i, len;

            TW.Event.EventProvider.call(this);


            if (target === undefined) {
                target = window.document;
            }

	        this.contextMenuActive = false;

	        this.states.push('MOUSE_MOVE');
	        this.states.push('MOUSE_BUTTON_LEFT');
	        this.states.push('MOUSE_BUTTON_MIDDLE');
	        this.states.push('MOUSE_BUTTON_RIGHT');

            for (i = 0, len = this.states.length; i < len; i++) {
	            if (this.states[i] === 'MOUSE_MOVE') {
		            this.values[i] = {x: undefined, y: undefined};
		            this.oldValues[i] = {x: undefined, y: undefined};
	            }
	            else {
		            this.values[i] = MouseInput.BUTTON_RELEASED;
		            this.oldValues[i] = MouseInput.BUTTON_RELEASED;
	            }
            }

	        target.addEventListener("mousemove", this._onMouseMove.bind(this), false);
	        target.addEventListener("mouseup", this._onMouseUp.bind(this), false);
	        target.addEventListener("mousedown", this._onMouseDown.bind(this), false);
	        target.addEventListener("contextmenu",  this._showContextMenu.bind(this), false);
        }

        TW.Utils.inherit(MouseInput, TW.Event.EventProvider);


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
         * return the EventProvider type.
         *
         * @method getType
         * @return {String}     "MOUSE"
         */
        MouseInput.prototype.getType = function() {
            return "MOUSE";
        };

        /**
         * Called when a mouse is moved.
         *
         * @method _onMouseMove
         * @param {MouseEvent}  event
         * @private
         */
        MouseInput.prototype._onMouseMove = function(event) {
            this.modifyState('MOUSE_MOVE', {x: event.clientX, y: event.clientY});
        };

	    /**
	     * Called when a mouse button is released.
	     *
	     * @method _onMouseUp
	     * @param {MouseEvent}  event
	     * @private
	     */
	    MouseInput.prototype._onMouseUp = function(event) {
		    this.modifyState(this._getAssociatedEvent(event), MouseInput.BUTTON_RELEASED);
	    };

	    /**
	     * Called when a mouse button is pressed.
	     *
	     * @method _onMouseDown
	     * @param {MouseEvent}  event
	     * @private
	     */
	    MouseInput.prototype._onMouseDown = function(event) {
		    this.modifyState(this._getAssociatedEvent(event), MouseInput.BUTTON_PRESSED);
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

        return MouseInput;
    }

}(TW));
