/**
 * This module contain useful class and method
 * for perform calcul with matrix or vector.
 *
 * @module Math
 * @main
 */


var TW = TW || {};

if (typeof window.define === "function" && window.define.amd) {

    define([
        './math/Matrix',
        './math/Vector2d'
    ], function() {
        return TW.Math;
    });

}

