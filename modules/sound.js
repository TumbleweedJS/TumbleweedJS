/**
 * @module Sound
 * @main
 *
 * TODO: describe module here.
 */


var TW = TW || {};

if (typeof window.define === "function" && window.define.amd) {

    define([
        './sound/Sound',
        './sound/Manager',
        './sound/Channel'
    ], function() {
        return TW.Event;
    });

}
