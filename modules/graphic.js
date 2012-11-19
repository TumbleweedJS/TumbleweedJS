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
        './graphic_new_version/Camera',
        './graphic_new_version/Circle',
        './graphic_new_version/GraphicObject',
        './graphic_new_version/Layer',
        './graphic_new_version/Rect',
        './graphic_new_version/Shape',
        './graphic_new_version/SpatialContainer',
        './graphic_new_version/Sprite',
        './graphic_new_version/Window'
    ], function() {
        return TW.Math;
    });

}

