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
        TW.Event.KeyboardInput = f();
        return TW.Event.KeyboardInput;
    }


    function init() {

        /**
         * EventProvider using the keyboard.
         *
         *
         * Each event represent a key. each key has two states: `KEY_PRESSED` or `KEY_RELEASED`
         *
         *
         * ## List of keys:
         *
         * - KEY_A
         * - KEY_B
         * - KEY_C
         * - KEY_D
         * - KEY_E
         * - KEY_F
         * - KEY_G
         * - KEY_H
         * - KEY_I
         * - KEY_J
         * - KEY_K
         * - KEY_L
         * - KEY_M
         * - KEY_N
         * - KEY_O
         * - KEY_P
         * - KEY_Q
         * - KEY_R
         * - KEY_S
         * - KEY_T
         * - KEY_U
         * - KEY_V
         * - KEY_W
         * - KEY_X
         * - KEY_Y
         * - KEY_Z
         * - KEY_0
         * - KEY_1
         * - KEY_2
         * - KEY_3
         * - KEY_4
         * - KEY_5
         * - KEY_6
         * - KEY_7
         * - KEY_8
         * - KEY_9
         * - KEY_F1
         * - KEY_F2
         * - KEY_F3
         * - KEY_F4
         * - KEY_F5
         * - KEY_F6
         * - KEY_F7
         * - KEY_F8
         * - KEY_F9
         * - KEY_F10
         * - KEY_F11
         * - KEY_F12
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
         * The [next W3C standard](http://www.w3.org/TR/DOM-Level-3-Events/#keys-keyvalues) should improve compatibility.<br />
         * __Currently, using Numeric key (from Keypad or not) with the Shift, CapsLock or NumLock keys is not possible.__<br />
         * __Use exotic keys are strongly discouraged.__<br />
         * <br />
         * For example, using Chrome 22.0.1229.94 (under Linux) with a fr keyboard, key `&` (key `1` without `Shift`) are equally to key `7`.
         * For more information about compatibility,[this document](http://unixpapa.com/js/key.html) provide a good summary of the situation.
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
         * @extends Event.EventProvider
         * @param {HTMLElement} [target]      element to listen keypressed and keyup. default to `window.document`
         * @constructor
         */
        function KeyboardInput(target) {
            var i, len;

            TW.Event.EventProvider.call(this);


            if (target === undefined) {
                target = window.document;
            }

            this.states = [];

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

            this.states.push('KEY_BACKSPACE', 8);
            this.states.push('KEY_TAB', 9);
            this.states.push('KEY_ENTER', 13);
            this.states.push('KEY_SHIFT', 16);
            this.states.push('KEY_CTRL', 17);
            this.states.push('KEY_ALT', 18);
            this.states.push('KEY_PAUSE', 19);
            this.states.push('KEY_CAPSLOCK', 20);
            this.states.push('KEY_ESC', 27);
            this.states.push('KEY_SPACE', 32);
            this.states.push('KEY_PAGE_UP', 33);
            this.states.push('KEY_PAGE_DOWN', 34);
            this.states.push('KEY_END', 35);
            this.states.push('KEY_HOME', 36);
            this.states.push('KEY_LEFT', 37);
            this.states.push('KEY_UP', 38);
            this.states.push('KEY_RIGHT', 39);
            this.states.push('KEY_DOWN', 40);
            this.states.push('KEY_INSERT', 45);
            this.states.push('KEY_DELETE', 46);
            this.states.push('KEY_NUMLOCK', 144);

            for (i = 0, len = this.states.length; i < len; i++) {
                this.values[i] = KeyboardInput.KEY_RELEASED;
                this.oldValues[i] = KeyboardInput.KEY_RELEASED;
            }

            target.addEventListener("keydown", this._onKeyDown.bind(this), false);
            target.addEventListener("keyup", this._onKeyUp.bind(this), false);
        }

        TW.Utils.inherit(KeyboardInput, TW.Event.EventProvider);


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
         * return the EventProvider type.
         *
         * @method getType
         * @return {String}     "KEYBOARD"
         */
        KeyboardInput.prototype.getType = function() {
            return "KEYBOARD";
        };

        /**
         * Called when a key is pressed.
         *
         * @method _onKeyDown
         * @param {KeyboardEvent}  event
         * @private
         */
        KeyboardInput.prototype._onKeyDown = function(event) {
            this.modifyState(this._getAssociatedEvent(event), KeyboardInput.KEY_PRESSED);
        };

        /**
         * Called when a key is released.
         *
         * @method _onKeyUp
         * @param {KeyboardEvent}  event
         * @private
         */
        KeyboardInput.prototype._onKeyUp = function(event) {
            this.modifyState(this._getAssociatedEvent(event), KeyboardInput.KEY_RELEASED);
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

        return KeyboardInput;
    }

}(TW));
