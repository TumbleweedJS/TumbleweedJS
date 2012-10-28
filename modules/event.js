/**
 * @module Event
 * @main
 *
 * TODO: describe module here.
 */


var TW = TW || {};

if (typeof window.define === "function" && window.define.amd) {

    define([
        './event/EventProvider',
        './event/KeyboardInput'
    ], function() {
        return TW.Event;
    });

}
