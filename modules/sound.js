/**
 * TODO: describe module here.
 *
 * @module Sound
 * @main
 */


var TW = TW || {};

if (typeof window.define === "function" && window.define.amd) {

    define([
        './sound/Sound',
        './sound/Manager',
        './sound/Channel'
    ], function() {
        return TW.Sound;
    });

}
