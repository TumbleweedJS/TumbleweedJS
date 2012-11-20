/**
 * The aim of this module is to give you tools to test intersections between bounding boxes,
 * bouncing circles and segments.
 *
 * Three classes covers a large set of interaction for different shapes, and meet all standard requirements:
 * {{#crossLink "Collision.CollisionBox"}}{{/crossLink}} for Axis-aligned bounding box,
 * {{#crossLink "Collision.CollisionCircle"}}{{/crossLink}} for bounding circle and
 * {{#crossLink "Collision.CollisionSegment"}}{{/crossLink}} for all others possibilities.
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
