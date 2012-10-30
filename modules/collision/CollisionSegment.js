/**
 @module Collision
 @namespace Collision
 */

var TW = TW || {};

(function(TW) {

    if (typeof window.define === "function" && window.define.amd) {
        define([], initWrap(init));
    } else {
        initWrap(init);
    }

    function initWrap(f) {
        TW.Collision = TW.Collision ||  {};
        TW.Collision.CollisionSegment = f();
        return TW.Collision.CollisionSegment;
    }


    function init() {

        /**
         The CollisionSegment class allow you to define a segment to test collision width other segments and collision circles.
         @class CollisionSegment
         @constructor
         @param {Integer} x1 the x coordinate of the first point of the segment
         @param {Integer} y1 the y coordinate of the first point of the segment
         @param {Integer} x2 the x coordinate of the second point of the segment
         @param {Integer} y2 the y coordinate of the second point of the segment
         */
        function CollisionSegment(x1, y1, x2, y2) {
            this.px = x1;
            this.py = y1;
            this.vector = new Vector2d(x2 - x1, y2 - y1);
        }

        /**
         The getVector method allow you to get the Vector of the collisionSegment
         @method getVector
         @return {Vector2d} returns the vector of the CollisionSegment.
         */
        CollisionSegment.prototype.getVector = function() {
            return this.vector;
        };

        /**
         The getPx method allow you to get the x coordinate of the first point of the CollisionSegment
         @method getPx
         @return {Integer} returns the x coordinate of the first point of the CollisionSegment
         */
        CollisionSegment.prototype.getPx = function() {
            return this.px;
        };

        /**
         The getPy method allow you to get the y coordinate of the first point of the CollisionSegment
         @method getPy
         @return {Integer} returns the y coordinate of the first point of the CollisionSegment
         */
        CollisionSegment.prototype.getPy = function() {
            return this.py;
        };

        /**
         The isCollidingSegment method allow you to test if the current segment is colliding another segment.
         @method isCollidingSegment
         @param {CollisionSegment} segment the CollisionSegment to test if is colliding the current collision segment object.
         @return {boolean} return true if segment is colliding the current CollisionSegment.
         */
        CollisionSegment.prototype.isCollidingSegment = function(segment) {
            var ax = this.px;
            var ay = this.py;
            var cx = segment.getPx();
            var cy = segment.getPy();
            var vector_i = this.getVector();
            var vector_j = segment.getVector();
            var k;
            var m;
            var denominateur = (vector_i.getX() * vector_j.getY()) - (vector_i.getY() * vector_j.getX());

            if (denominateur == 0) {
                return false;
            }
            m = -((-vector_i.getX() * ay) + (vector_i.getX() * cy) + (vector_i.getY() * ax) - (vector_i.getY() * cx)) /
                denominateur;
            k = -((ax * vector_j.getY()) - (cx * vector_j.getY()) - (vector_j.getX() * ay) + (vector_j.getX() * cy)) /
                denominateur;
            return (0 <= m && m <= 1 && 0 <= k && k <= 1);
        };

        /**
         The isCollidingCircle method allow you to test the collision beetween the current object and the circle object
         @method isCollidingCircle
         @param {CollisionCircle} circle the CollisionCircle to test the interection with the CollisionSegment.
         @return {boolean} return true if circle is colliding the current CollisionSegment.
         */
        CollisionSegment.prototype.isCollidingCircle = function(circle) {
            var a_x = this.px;
            var a_y = this.py;
            var b_x = ax + this.vector.getX();
            var b_y = ay + this.vector.getY();
            var v_x = b_x - a_x;
            var v_y = b_y - a_y;
            var radius = circle.getRadius();

            a_x -= circle.getX();
            a_y -= circle.getY();
            var delta = (((2 * a_x * v_x) + (2 * a_y * v_y)) * ((2 * a_x * v_x) + (2 * a_y * v_y))) -
                (4 * ((v_x * v_x) + (v_y * v_y)) * ((a_x * a_x) + (a_y * a_y) - (radius * radius)));
            if (delta >= 0) {
                if ((((2 * a_x * v_x + 2 * a_y * v_y) * -1) + (Math.sqrt(delta))) / (2 * ((v_x * v_x) + (v_y * v_y))) <
                    1.0 &&
                    (((2 * a_x * v_x + 2 * a_y * v_y) * -1) + (Math.sqrt(delta))) / (2 * ((v_x * v_x) + (v_y * v_y))) >
                        0.0) {
                    return true;
                }
                if ((((2 * a_x * v_x + 2 * a_y * v_y) * -1) - (Math.sqrt(delta))) / (2 * ((v_x * v_x) + (v_y * v_y))) <
                    1.0 &&
                    (((2 * a_x * v_x + 2 * a_y * v_y) * -1) - (Math.sqrt(delta))) / (2 * ((v_x * v_x) + (v_y * v_y))) >
                        0.0) {
                    return true;
                }
            }
            return false;
        };

        return CollisionSegment;
    }

}(TW));
