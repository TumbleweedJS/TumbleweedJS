/**
 * @module Event
 * @namespace Event
 */

var TW = TW || {};
TW.Event = TW.Event || {};

/**
 Namespace that contain all possibles values for input keyboard.
 Each property is a constant representing a keyboard key.

 a variable of type Event.Key must be one of the values
 defined on this class.

 @class Key
 @static
 */
TW.Event.Key = {
    /**
     @property Backspace {Number}
     */
    Backspace: 8,
    /**
     @property Tab {Number}
     */
    Tab: 9,
    /**
     @property Enter {Number}
     */
    Enter: 13,
    /**
     @property Shift {Number}
     */
    Shift: 16,
    /**
     @property Ctrl {Number}
     */
    Ctrl: 17,
    /**
     @property Alt {Number}
     */
    Alt: 18,
    /**
     @property Pause {Number}
     */
    Pause: 19,
    /**
     @property CapsLock {Number}
     */
    CapsLock: 20,
    /**
     @property Escape {Number}
     */
    Escape: 27,
    /**
     @property PageUp {Number}
     */
    PageUp: 33,
    /**
     @property PageDown {Number}
     */
    PageDown: 34,
    /**
     @property End {Number}
     */
    End: 35,
    /**
     @property Home {Number}
     */
    Home: 36,
    /**
     @property LeftArrow {Number}
     */
    LeftArrow: 37,
    /**
     @property UpArrow {Number}
     */
    UpArrow: 38,
    /**
     @property RightArrow {Number}
     */
    RightArrow: 39,
    /**
     @property DownArrow {Number}
     */
    DownArrow: 40,
    /**
     @property Insert {Number}
     */
    Insert: 45,
    /**
     @property Delete {Number}
     */
    Delete: 46,
    /**
     @property 0 {Number}
     */
    0: 48,
    /**
     @property 1 {Number}
     */
    1: 49,
    /**
     @property 2 {Number}
     */
    2: 50,
    /**
     @property 3 {Number}
     */
    3: 51,
    /**
     @property 4 {Number}
     */
    4: 52,
    /**
     @property 5 {Number}
     */
    5: 53,
    /**
     @property 6 {Number}
     */
    6: 54,
    /**
     @property 7 {Number}
     */
    7: 55,
    /**
     @property 8 {Number}
     */
    8: 56,
    /**
     @property 9 {Number}
     */
    9: 57,
    /**
     @property A {Number}
     */
    A: 65,
    /**
     @property B {Number}
     */
    B: 66,
    /**
     @property C {Number}
     */
    C: 67,
    /**
     @property D {Number}
     */
    D: 68,
    /**
     @property E {Number}
     */
    E: 69,
    /**
     @property F {Number}
     */
    F: 70,
    /**
     @property G {Number}
     */
    G: 71,
    /**
     @property H {Number}
     */
    H: 72,
    /**
     @property I {Number}
     */
    I: 73,
    /**
     @property J {Number}
     */
    J: 74,
    /**
     @property K {Number}
     */
    K: 75,
    /**
     @property L {Number}
     */
    L: 76,
    /**
     @property M {Number}
     */
    M: 77,
    /**
     @property N {Number}
     */
    N: 78,
    /**
     @property O {Number}
     */
    O: 79,
    /**
     @property P {Number}
     */
    P: 80,
    /**
     @property Q {Number}
     */
    Q: 81,
    /**
     @property R {Number}
     */
    R: 82,
    /**
     @property S {Number}
     */
    S: 83,
    /**
     @property T {Number}
     */
    T: 84,
    /**
     @property U {Number}
     */
    U: 85,
    /**
     @property V {Number}
     */
    V: 86,
    /**
     @property W {Number}
     */
    W: 87,
    /**
     @property X {Number}
     */
    X: 88,
    /**
     @property Y {Number}
     */
    Y: 89,
    /**
     @property Z {Number}
     */
    Z: 90,
    /**
     @property F1 {Number}
     */
    F1: 112,
    /**
     @property F2 {Number}
     */
    F2: 113,
    /**
     @property F3 {Number}
     */
    F3: 114,
    /**
     @property F4 {Number}
     */
    F4: 115,
    /**
     @property F5 {Number}
     */
    F5: 116,
    /**
     @property F6 {Number}
     */
    F6: 117,
    /**
     @property F7 {Number}
     */
    F7: 118,
    /**
     @property F8 {Number}
     */
    F8: 119,
    /**
     @property F9 {Number}
     */
    F9: 120,
    /**
     @property F10 {Number}
     */
    F10: 121,
    /**
     @property F11 {Number}
     */
    F11: 122,
    /**
     @property F12 {Number}
     */
    F12: 123,
    /**
     @property Space {Number}
     */
    Space: 32
};

/**
 A service to manage input keyboard

 @class KeyboardService
 @static
 */
TW.Event.KeyboardService = function() {
    /**
     Array of all keyboard keys actually down.
     @property {Array} keyDown
     */
    var keyDown = [];

    /**
     Array of all keyboard keys down before the last update.
     @property {Array} oldKeyDown
     */
    var oldKeyDown = [];


    /**
     initialize the keyboard service.
     Must be called before any use.

     @method initialize
     */
    function initialize() {
        window.onkeydown = _updateDown;
        window.onkeyup = _updateUp;
        keyDown.length = 0;
        oldKeyDown.length = 0;
    }


    /**
     Update the state when a key is pressed

     @method _updateDown
     @param {Event.Key} event the keyboard key value
     @private
     */
    function _updateDown(event) {
        _updateArray();

        for (var it = 0; it < keyDown.length; it++)
        {
            if (keyDown[it] == event.keyCode) {
                return;
            }
        }
        keyDown.push(event.keyCode);
    }

    /**
     Update the state when a key is released

     @method _updateUp
     @param {Event.Key} event the keyboard key value
     @private
     */
    function _updateUp(event) {
         _updateArray();

        for(var it = 0; it < keyDown.length; it++) {
            if (keyDown[it] == event.keyCode) {
                keyDown.splice(it, 1);
            }
        }
    }

    /**
     Check if a keyboard key is down

     @method isKeyDown
     @param {Event.Key} keyCode the value of the keyboard key
     @return {bool} `true` if keyCode is down;
     otherwise `false`
     */
    function isKeyDown(keyCode) {
        for(var it = 0; it < keyDown.length; it++) {
            if (keyDown[it] == keyCode) {
                return true;
            }
        }
        return false;
    }

    /**
     Check if a keyboard key was down before the last update

     @method isOldKeyDown
     @param {Event.Key} keyCode the value of the keyboard key
     @return {bool} `true` if keyCode was down;
     otherwise `false`
     */
    function isOldKeyDown(keyCode) {
        for(var it = 0; it < oldKeyDown.length; it++) {
            if (oldKeyDown[it] == keyCode) {
                return true;
            }
        }
        return false;
    }

    /**
     Check if a keyboard key is up

     @method isKeyUp
     @param {Event.Key} keyCode the value of the keyboard key
     @return {bool} `true` if keyCode is up;
     otherwise `false`
     */
    function isKeyUp(keyCode) {
        return !isKeyDown(keyCode);
    }

    /**
     Check if a keyboard key is pressed.
     A key is pressed if its status changes from up to down.

     @method isKeyDown
     @param {Event.Key} keyCode the value of the keyboard key
     @return {bool} `true` if keyCode is pressed;
     otherwise `false`
     */
    function isKeyPressed(keyCode) {
        if (this.isOldKeyDown(keyCode) && this.isKeyUp(keyCode)) {
            for(var it = 0; it < oldKeyDown.length; it++) {
                if (oldKeyDown[it] == keyCode) {
                    oldKeyDown.splice(it, 1);
                }
            }
            return true;
        }
        return false;
    }


    /**
     Move keyDown to oldKeyDown.

     @method _updateArray
     @private
     */
    function _updateArray() {
        oldKeyDown.length = 0;
        for (var it = 0; it < keyDown.length; it++) {
            oldKeyDown.push(keyDown[it]);
        }
    }

    //public service interface.
    return {
        keyDown: keyDown,
        oldKeyDown: oldKeyDown,
        initialize: initialize,
        isKeyDown: isKeyDown,
        isOldKeyDown: isOldKeyDown,
        isKeyUp: isKeyUp,
        isKeyPressed: isKeyPressed,
    };
}();


/**
 Used for compatibility
 @module Event
 */

/**
 @class KeyEnum
 @deprecated replaced by `Event.Key`
 */
var KeyEnum = TW.Event.Key;