/**
 * @module Collision
 * @namespace Collision
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
        TW.Collision.CollisionBox = f();
        return TW.Collision.CollisionBox;
    }


    function init() {


        /**
         The CollisionBox class allow you to declare a boucing box to test collisions beetween other collisions boxes and collisions circles.

         @class CollisionBox
         @param {Integer} x the x coordinate of the collision box
         @param {Integer} y the y coordinate of the collision box
         @param {Integer} w the width of the collision box
         @param {Integer} h the height of the collision box
         @constructor
         */
        function CollisionBox(x, y, w, h) {
            this.type = "CollisionBox";
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
            this.x_centerPoint = 0;
            this.y_centerPoint = 0;
            this.angle = 0;
            this.debug_mode = false;
        }


        /**
         The isPointInside method allow you to test if a point is inside the bouncing box.
         @method isPointInside
         @param {Integer} px the x coordinate of the point
         @param {Integer} py the y coordinate of the point
         @return {boolean} return true if the point is inside the box, else return false.
         */
        CollisionBox.prototype.isPointInside = function(px, py) {
            return px >= this.getX() && px <= this.getX() + this.getWidth() &&
                py >= this.getY() && py <= this.getY() + this.getHeight();
        };

        /**
         The isSegmentCollidingCircle method allow you to test if a segment is colliding a circle
         @method isSegmentCollidingCircle
         @param {Integer} a_x the x coordinate of the first point of the segment
         @param {Integer} a_y the y coordinate of the first point of the segment
         @param {Integer} b_x the x coordinate of the second point of the segment
         @param {Integer} b_y the y coordinate of the second point of the segment
         @param {CollisionCircle} circle the CollisionCircle object to test collision with the segment
         @return {boolean} return true if circle and the segment are colliding, else return false.
         */
        CollisionBox.prototype.isSegmentCollidingCircle = function(a_x, a_y, b_x, b_y, circle) {
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

        /**
         The isCollidingCircle method allow you to test if the current CollisionBox is colliding the CollisionCircle object.
         @method isCollidingCircle
         @param {CollisionCircle} circle the CollisionCircle object to test the collision with.
         @return {boolean} if the current CollisionBox is colliding the CollisionCircle object, then the isCollidingCircle function will return true otherwise it will return false.
         */
        CollisionBox.prototype.isCollidingCircle = function(circle) {
            var radius = circle.getRadius();

            //On check si la boite englobante du cercle rentre en collision avec this
            if (circle.getX() + radius < this.x) {
                return false;
            }
            if (circle.getX() - radius > this.x + this.w) {
                return false;
            }
            if (circle.getY() + radius < this.y) {
                return false;
            }
            if (this.y - radius > this.y + this.h) {
                return false;
            }
            //On check si un des segments de la box rentre en collision avec le cercle
            if (this.isSegmentCollidingCircle(this.x, this.y, this.x + this.w, this.y, circle)) {
                return true;
            }
            if (this.isSegmentCollidingCircle(this.x + this.w, this.y, this.x + this.w, this.y + this.h, circle)) {
                return true;
            }
            if (this.isSegmentCollidingCircle(this.x + this.w, this.y + this.h, this.x, this.y + this.h, circle)) {
                return true;
            }
            if (this.isSegmentCollidingCircle(this.x, this.y + this.h, this.x, this.y, circle)) {
                return true;
            }
            //On check si le centre du cercle est dans la box.
            if (circle.getX() > this.x && circle.getX() < this.x + this.w && circle.getY() > this.y &&
                circle.getY() < this.y + this.h) {
                return true;
            }
            //on check si les sommets de la box sont a une distance plus petite que le rayon du cercle
            if (Math.sqrt(((this.x - circle.getX()) * (this.x - circle.getX())) +
                ((this.y - circle.getY()) * (this.y - circle.getY()))) < radius) {
                return true;
            }
            if (Math.sqrt(((this.x + this.w - circle.getX()) * (this.x + this.w - circle.getX())) +
                ((this.y - circle.getY()) * (this.y - circle.getY()))) < radius) {
                return true;
            }
            if (Math.sqrt(((this.x + this.w - circle.getX()) * (this.x + this.w - circle.getX())) +
                ((this.y + this.h - circle.getY()) * (this.y + this.h - circle.getY()))) < radius) {
                return true;
            }
            if (Math.sqrt(((this.x - circle.getX()) * (this.x - circle.getX())) +
                ((this.y + this.h - circle.getY()) * (this.y + this.h - circle.getY()))) < radius) {
                return true;
            }
            return false;
        };

        /**
         The isCollidingBox method allow you to test if the current CollisionBox object is colliding the CollisionBox object gived in parameter.
         @method isCollidingBox
         @param {CollisionBox} box the CollisionBox object to test the collision with
         @return {boolean} return true if the box object is colliding the this object.
         */
        CollisionBox.prototype.isCollidingBox = function(box) {
            var box_x = box.getX();
            var box_y = box.getY();
            var box_width = box.getWidth();
            var box_height = box.getHeight();

            if (this.x + this.w < box_x) {
                return false;
            }
            if (this.x > box_x + box_width) {
                return false;
            }
            if (this.y + this.h < box_y) {
                return false;
            }
            if (this.y > box_y + box_height) {
                return false;
            }
            return true;
        };

        /**
         This method allow you to set the x coordinate of the CollisonBox
         @method setX
         @param {Integer} val the x coordinate of the CollisionBox
         */
        CollisionBox.prototype.setX = function(val) {
            this.x = val;
        };

        /**
         This method allow you to get the x coordinate of the CollisionBox
         @method getX
         @return {Integer} return the value of the x coordinate of the CollisionBox
         */
        CollisionBox.prototype.getX = function() {
            return this.x;
        };

        /**
         This method allow you to set the y coordinate of the CollisionBox
         @method setY
         @param {Integer} val the y coordinate of the CollisionBox
         */
        CollisionBox.prototype.setY = function(val) {
            this.y = val;
        };

        /**
         This method allow you to get the y coordinate of the CollisonBox
         @method getY
         @return {Integer} return the y coordinate of the CollisionBox
         */
        CollisionBox.prototype.getY = function() {
            return this.y;
        };

        /**
         The setWidth method allow you to set the width of the CollisionBox
         @method setWidth
         @param {Integer} val the width of the CollisionBox
         */
        CollisionBox.prototype.setWidth = function(val) {
            this.w = val;
        };

        /**
         The getWidth method allow you to get the width of the CollisionBox
         @method getWidth
         @return {Integer} return the width of the CollisionBox
         */
        CollisionBox.prototype.getWidth = function() {
            return this.w;
        };

        /**
         The setHeight method allow you to set the height of the CollisionBox
         @method setHeight
         @param {Integer} val the height parameter of the CollisionBox
         */
        CollisionBox.prototype.setHeight = function(val) {
            this.h = val;
        };

        /**
         The getHeight method allow you to get the height of the CollisionBox
         @method getHeight
         @return {Integer} return the height of the CollisonBox.
         */
        CollisionBox.prototype.getHeight = function() {
            return this.h;
        };

        /**
         The setDebug method allow you to switch the mode of the CollisionBox beetween debug and release.
         @method setDebug
         @param {Integer} true_of_false the parameter to define which type of mode choose (true means debug, false means release)
         */
        CollisionBox.prototype.setDebug = function(true_of_false) {
            this.debug_mode = true_or_false;
        };

        /**
         The draw method allow you to draw the CollisionBox only if `setDebug(true)` was called before.
         @method draw
         @param {CanvasRenderingContext2D} context the context 2d on which draw the CollisionBox.
         */
        CollisionBox.prototype.draw = function(context) {
            if (context && this.debug_mode) {
                //Permet de sauvegarder le context
                context.save();
                //Set a l'identity la matrice de transformation
                context.setTransform(1.0, 0.0, 0.0, 1.0, 0.0, 0.0);
                context.fillStyle = "rgb(" + 0 + ", " + 0 + ", " + 0 + ")";
                context.strokeRect(this.x, this.y, this.w, this.h);
                //Permet de restorer le context
                context.restore();
            }
        };

        return CollisionBox;
    }
}(TW));
