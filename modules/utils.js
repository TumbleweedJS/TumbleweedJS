/**
 * This module contain some useful functions and helpers used in the Tumbleweed framework.
 * It include some pollyfills and a way to use inheritance.
 *
 * @module Utils
 * @main
 */


var TW = TW || {};

if (typeof window.define === "function" && window.define.amd) {

    define([
        './utils/Inheritance',
        './utils/Polyfills'
    ], function() {
        return TW.Utils;
    });

}
