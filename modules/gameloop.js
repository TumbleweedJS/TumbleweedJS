/**
 * This module contain all classes relating to time management and
 * scheduling actions by object or group objects.
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
