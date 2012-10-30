/**
 * TODO: describe module here.
 *
 * @module Gameloop
 * @main
 */


var TW = TW || {};

if (typeof window.define === "function" && window.define.amd) {

    define([
        './gameloop/Gameloop'
    ], function() {
        return TW.Gameloop;
    });

}
