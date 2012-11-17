/**
 * TODO: describe module here.
 * @module Event
 * @main
 */


var TW = TW || {};

if (typeof window.define === "function" && window.define.amd) {

    define([
        './event/EventProvider',
        './event/KeyboardInput',
        './event/MouseInput',
        './event/InputMapper'
           ], function() {
        return TW.Event;
    });

}
