/**
 * The aim of this module is to give you tools to test intersections between bounding boxes, bouncing circles and segments
 *
 * @module Collision
 * @main
 */


var TW = TW || {};

if (typeof window.define === "function" && window.define.amd) {

    define([
        './collision/CollisionBox',
        './collision/CollisionCircle',
        './collision/CollisionSegment'
    ], function() {
        return TW.Collision;
    });

}
