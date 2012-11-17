/**
 *
 * @module Preload
 * @main
 */


var TW = TW || {};

if (typeof window.define === "function" && window.define.amd) {

    define([
        './preload/Preload',
        './preload/XMLHttpRequestLoader'
    ], function() {
        return TW.Preload;
    });

}
