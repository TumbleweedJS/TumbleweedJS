/**
 * TODO: describe module here.
 *
 * @module Audio
 * @main
 */


var TW = TW || {};

if (typeof window.define === "function" && window.define.amd) {

    define([
        './audio/Sound',
        './audio/Manager',
        './audio/Channel'
    ], function() {
        return TW.Audio;
    });

}
