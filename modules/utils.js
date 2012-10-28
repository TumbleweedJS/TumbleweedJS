/**
 * @module Utils
 * @main
 *
 * This module contain some useful functions and helpers used in the Tumbleweed framework.
 * It include some pollyfills and a way to use inheritance.
 */


var TW = TW || {};

if (typeof window.define === "function" && window.define.amd) {

    define([
        './utils/Inheritance',
    ], function() {
        return TW.Utils;
    });

}
