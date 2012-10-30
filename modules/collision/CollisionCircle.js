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
        TW.Collision.CollisionCircle = f();
        return TW.Collision.CollisionCircle;
    }


    function init() {

        /**
         The CollisionCircle class allow you to create a CollisionCircle to test intersections with other collision objects like circles, segments or boxes.
         @class CollisionCircle
         @constructor
         @param {Integer} x the x coordinate of the CollisionCircle
         @param {Integer} y the y coordinate of the CollisionCircle
         @param {Integer} radius the radius of the CollisionCircle
         */
        function CollisionCircle(x, y, radius) {
            this.type = "CollisionCircle";
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.x_centerPoint = 0;
            this.y_centerPoint = 0;
            this.angle = 0;
            this.debug_mode = false;
        }


        /**
         The method is CollidingCircle allow you to test if two circles are Colliding. Let's see an example :
         `var cercle = new CollisionCircle(x, y, radius);
         var cercle2 = new CollisionCircle(x2, y2, radius2);
         var result = cercle.isCollidingCircle(cercle2);`
         If result is true, so the cercle object is colliding the cercle2 object.
         If result if false, so the cercle object is not colliding the cercle2 object.
         @method isCollisingCircle
         @param {CollisionCircle} circle the CollisionCircle to test collision with.
         @return {boolean} return true if the two circles are colliding, otherwise return false.
         */
        CollisionCircle.prototype.isCollidingCircle = function(circle) {
            var circle_x = circle.getX();
            var circle_y = circle.getY();
            var dist = Math.sqrt(((circle_x - this.x) * (circle_x - this.x)) + ((circle_y - this.y) * (circle_y - this.y)));

            if (dist < this.radius + circle.getRadius()) {
                return true;
            }
            return false;
        };

        /**
         The isCollidingSegment method allow you to test if the CollisionCircle is Colliding a segment
         @method isCollidingSegment
         @param {Integer} a_x the x coordinate of the first point of the segment to test intersection with.
         @param {Integer} a_y the y coordinate of the first point of the segment to test intersection with.
         @param {Integer} b_x the x coordinate of the second point of the segment to test intersection with.
         @param {Integer} b_y the y coordinate of the second point of the segment to test intersection with.
         @return {boolean} returns true if the current CollisionCircle is colliding the segment. Ortherwise return false.
         */
        CollisionCircle.prototype.isCollidingSegment = function(a_x, a_y, b_x, b_y) {
            var v_x = b_x - a_x;
            var v_y = b_y - a_y;
            var circle = this;
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


        /**
         The isPointInside method allow you to test if a point is inside the current circle
         @method isPointInside
         @param {Integer} px the x coordinate of the point
         @param {Integer} py the y coordinate of the point
         @return {boolean} return true if the point is inside the Circle, otherwise it returns false.
         */
        CollisionCircle.prototype.isPointInside = function(px, py) {
            px -= this.getX();
            py -= this.getY();
            return Math.sqrt((px * px) + (py * py)) <= this.getRadius();
        };

        /**
         The isCollidingBox method allow you to test if the current CollisionCircle is colliding the CollidingBox in parameter.
         @method isCollidingBox
         @param {CollisionBox} box the CollidingBox to test collision with.
         @return {boolean} returns true if the current CollisionCircle is colliding the box, otherwise, it returns false
         */
        CollisionCircle.prototype.isCollidingBox = function(box) {
            //On check si la boite englobante du cercle rentre en collision avec this
            if (this.x + this.radius < box.getX()) {
                return false;
            }
            if (this.x - this.radius > box.getX() + box.getWidth()) {
                return false;
            }
            if (this.y + this.radius < box.getY()) {
                return false;
            }
            if (this.y - this.radius > box.getY() + box.getHeight()) {
                return false;
            }
            //On check si les segments de la boite rentrent en collision avec le cercle
            if (this.isCollidingSegment(box.getX(), box.getY(), box.getX() + box.getWidth(), box.getY())) {
                return true;
            }
            if (this.isCollidingSegment(box.getX() + box.getWidth(), box.getY(), box.getX() + box.getWidth(),
                box.getY() + box.getHeight())) {
                return true;
            }
            if (this.isCollidingSegment(box.getX() + box.getWidth(), box.getY() + box.getHeight(), box.getX(),
                box.getY() + box.getHeight())) {
                return true;
            }
            if (this.isCollidingSegment(box.getX(), box.getY() + box.getHeight(), box.getX(), box.getY())) {
                return true;
            }
            //On check si le centre du cercle est dans la box.
            if (this.getX() > box.getX() && this.getX() < box.getX() + box.getWidth() && this.getY() > box.getY() &&
                this.getY() < box.getY() + box.getHeight()) {
                return true;
            }
            //on check si les sommets de la box sont a une distance plus petite que le rayon du cercle
            if (Math.sqrt(((box.getX() - this.getX()) * (box.getX() - this.getX())) +
                ((box.getY() - this.getY()) * (box.getY() - this.getY()))) < this.radius) {
                return true;
            }
            if (Math.sqrt(((box.getX() + box.getWidth() - this.getX()) * (box.getX() + box.getWidth() - this.getX())) +
                ((box.getY() - this.getY()) * (box.getY() - this.getY()))) < this.radius) {
                return true;
            }
            if (Math.sqrt(((box.getX() + box.getWidth() - this.getX()) * (box.getX() + box.getWidth() - this.getX())) +
                ((box.getY() + box.getHeight() - this.getY()) * (box.getY() + box.getHeight() - this.getY()))) <
                this.radius) {
                return true;
            }
            if (Math.sqrt(((box.getX() - this.getX()) * (box.getX() - this.getX())) +
                ((box.getY() + box.getHeight() - this.getY()) * (box.getY() + box.getHeight() - this.getY()))) <
                this.radius) {
                return true;
            }
            return false;
        };

        /**
         the setX method allow you to set the x coordinate of the CollisionCircle
         @method setX
         @param {Integer} val the x value to set.
         */
        CollisionCircle.prototype.setX = function(val) {
            this.x = val;
        };

        /**
         the getX method allow you to get the x coordinate of the CollisionCircle
         @method getX
         @return {Integer} the x coordinate of the CollisionCircle
         */
        CollisionCircle.prototype.getX = function() {
            return this.x;
        };

        /**
         the setY method allow you to set the y coordinate of the CollisionCircle
         @method setY
         @param {Integer} val the y coordinate of the CollisionCircle.
         */
        CollisionCircle.prototype.setY = function(val) {
            this.y = val;
        };

        /**
         the getY method allow you to get the y coordinate of the CollisionCircle
         @method getY
         @return {Integer} returns the y coordinate of the CollisionCircle
         */
        CollisionCircle.prototype.getY = function() {
            return this.y;
        };

        /**
         the getRadius method allow you to get the radius of the current CollisionCircle object.
         @method getRadius
         @return {Integer} returns the radius of the current CollisionCircle.
         */
        CollisionCircle.prototype.getRadius = function() {
            return this.radius;
        };

        /**
         the setRadius method allow you to set the radius of the current CollisionCircle object.
         @method setRadius
         @param {Integer} rad the radius of the current CollisionCircle
         */
        CollisionCircle.prototype.setRadius = function(rad) {
            this.radius = rad;
        };

        /**
         the setDebug method allow you to set the debug mode of the current CollisionCircle object.
         @method setDebug
         @param {boolean} true_or_false the boolean value to determine if the current CollisionCircle object must switch into debug mode (true) or release mode (false)
         */
        CollisionCircle.prototype.setDebug = function(true_or_false) {
            this.debug_mode = true_or_false;
        };

        /**
         the draw method allow you to draw the circle of the current CollisionCircle on the context only if the current CollisionCircle object is in debug mode (that mean you must call `setDebug(true);` before draw something on the context).
         @method draw
         @param {CanvasRenderingContext2D} context the context to draw on.
         */
        CollisionCircle.prototype.draw = function(context) {
            if (context && this.debug_mode) {
                //Permet de sauvegarder le context
                context.save();
                //Set a l'identity la matrice de transformation
                context.setTransform(1.0, 0.0, 0.0, 1.0, 0.0, 0.0);
                context.fillStyle = "rgb(" + 0 + ", " + 0 + ", " + 0 + ")";
                context.beginPath();
                context.arc(this.x, this.y, this.radius, 0, Math.PI * 2.0, true);
                context.closePath();
                context.stroke();
                //Permet de restorer le context
                context.restore();
            }
        };

        return CollisionCircle;
    }

}(TW));
