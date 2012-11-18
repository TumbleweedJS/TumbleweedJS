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
        './graphic/Camera',
        './graphic/Circle',
        './graphic/GraphicObject',
        './graphic/Layer',
        './graphic/Shape',
        './graphic/SpatialContainer',
        './graphic/Sprite',
        './graphic/Window'
    ], function() {
        return TW.Math;
    });

}

