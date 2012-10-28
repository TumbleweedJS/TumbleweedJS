/**
 * @module Gameloop
 * @main
 *
 * TODO: describe module here.
 */


var TW = TW || {};

if (typeof window.define === "function" && window.define.amd) {

    define([
        './gameloop/Gameloop',
    ], function() {
        return TW.Gameloop;
    });

}
