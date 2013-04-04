/**
 @module Collision
 @namespace Collision
 */


define([], function() {
	var TW = TW || {};
	TW.Collision = TW.Collision || {};


	/**
	 * The CollisionCircle class allow you to create a CollisionCircle to test intersections
	 * with other collision objects like circles, segments or boxes.
	 *
	 * @class CollisionCircle
	 * @constructor
	 * @param {Number} x the x coordinate of the CollisionCircle
	 * @param {Number} y the y coordinate of the CollisionCircle
	 * @param {Number} radius the radius of the CollisionCircle
	 */
	function CollisionCircle(x, y, radius) {

		/**
		 * type of Collision object
		 *
		 * @property {String} type
		 * @readonly
		 */
		this.type = "CollisionCircle";

		/**
		 * @property {Number} x
		 */
		this.x = x;

		/**
		 * @property {Number} y
		 */
		this.y = y;

		/**
		 * @property {Number} radius
		 */
		this.radius = radius;
	}


	/**
	 * The method is CollidingCircle allow you to test if two circles are Colliding. Let's see an example :
	 *
	 *      var circle = new CollisionCircle(x, y, radius);
	 *      var circle2 = new CollisionCircle(x2, y2, radius2);
	 *      var result = circle.isCollidingCircle(circle2);
	 *
	 * If result is true, so the circle object is colliding the circle2 object.
	 * If result if false, so the circle object is not colliding the circle2 object.
	 *
	 * @method isCollidingCircle
	 * @param {CollisionCircle} circle the CollisionCircle to test collision with.
	 * @return {boolean} return true if the two circles are colliding, otherwise return false.
	 */
	CollisionCircle.prototype.isCollidingCircle = function(circle) {
		var dist = Math.sqrt(((circle.x - this.x) * (circle.x - this.x)) +
		                     ((circle.y - this.y) * (circle.y - this.y)));

		return dist < (this.radius + circle.radius);
	};

	/**
	 * The isCollidingSegment method allow you to test if the CollisionCircle is Colliding a segment
	 *
	 * @method isCollidingSegment
	 * @param {Number} ax the x coordinate of the first point of the segment to test intersection with.
	 * @param {Number} ay the y coordinate of the first point of the segment to test intersection with.
	 * @param {Number} bx the x coordinate of the second point of the segment to test intersection with.
	 * @param {Number} by the y coordinate of the second point of the segment to test intersection with.
	 * @return {Boolean} returns `true` if the current CollisionCircle is colliding the segment.
	 *  Otherwise return `false`.
	 */
	CollisionCircle.prototype.isCollidingSegment = function(ax, ay, bx, by) {
		var vx = bx - ax;
		var vy = by - ay;
		var circle = this;
		var radius = circle.radius;
		ax -= circle.x;
		ay -= circle.y;
		var delta = (((2 * ax * vx) + (2 * ay * vy)) * ((2 * ax * vx) + (2 * ay * vy))) -
		            (4 * ((vx * vx) + (vy * vy)) * ((ax * ax) + (ay * ay) - (radius * radius)));
		if (delta >= 0) {
			if ((((2 * ax * vx + 2 * ay * vy) * -1) + (Math.sqrt(delta))) / (2 * ((vx * vx) + (vy * vy))) <
			    1.0 &&
			    (((2 * ax * vx + 2 * ay * vy) * -1) + (Math.sqrt(delta))) / (2 * ((vx * vx) + (vy * vy))) >
			    0.0) {
				return true;
			}
			if ((((2 * ax * vx + 2 * ay * vy) * -1) - (Math.sqrt(delta))) / (2 * ((vx * vx) + (vy * vy))) <
			    1.0 &&
			    (((2 * ax * vx + 2 * ay * vy) * -1) - (Math.sqrt(delta))) / (2 * ((vx * vx) + (vy * vy))) >
			    0.0) {
				return true;
			}
		}
		return false;
	};


	/**
	 * The isPointInside method allow you to test if a point is inside the current circle
	 *
	 * @method isPointInside
	 * @param {Number} px the x coordinate of the point
	 * @param {Number} py the y coordinate of the point
	 * @return {Boolean} return true if the point is inside the Circle, otherwise it returns false.
	 */
	CollisionCircle.prototype.isPointInside = function(px, py) {
		px -= this.x;
		py -= this.y;
		return Math.sqrt((px * px) + (py * py)) <= this.radius;
	};

	/**
	 * The isCollidingBox method allow you to test if the current CollisionCircle
	 * is colliding the CollidingBox in parameter.
	 *
	 * @method isCollidingBox
	 * @param {CollisionBox} box the CollidingBox to test collision with.
	 * @return {boolean} returns true if the current CollisionCircle is colliding the box;
	 *  otherwise, it returns false
	 */
	CollisionCircle.prototype.isCollidingBox = function(box) {
		//On check si la boite englobante du cercle rentre en collision avec this
		if (this.x + this.radius < box.x) {
			return false;
		}
		if (this.x - this.radius > box.x + box.width) {
			return false;
		}
		if (this.y + this.radius < box.y) {
			return false;
		}
		if (this.y - this.radius > box.y + box.height) {
			return false;
		}
		//On check si les segments de la boite rentrent en collision avec le cercle
		if (this.isCollidingSegment(box.x, box.y, box.x + box.width, box.y)) {
			return true;
		}
		if (this.isCollidingSegment(box.x + box.width, box.y, box.x + box.width, box.y + box.height)) {
			return true;
		}
		if (this.isCollidingSegment(box.x + box.width, box.y + box.height, box.x, box.y + box.height)) {
			return true;
		}
		if (this.isCollidingSegment(box.x, box.y + box.height, box.x, box.y)) {
			return true;
		}
		//On check si le centre du cercle est dans la box.
		if (this.x > box.x && this.x < box.x + box.width && this.y > box.y &&
		    this.y < box.y + box.height) {
			return true;
		}
		//on check si les sommets de la box sont a une distance plus petite que le rayon du cercle
		if (Math.sqrt(((box.x - this.x) * (box.x - this.x)) +
		              ((box.y - this.y) * (box.y - this.y))) < this.radius) {
			return true;
		}
		if (Math.sqrt(((box.x + box.width - this.x) * (box.x + box.width - this.x)) +
		              ((box.y - this.y) * (box.y - this.y))) < this.radius) {
			return true;
		}
		if (Math.sqrt(((box.x + box.width - this.x) * (box.x + box.width - this.x)) +
		              ((box.y + box.height - this.y) * (box.y + box.height - this.y))) <
		    this.radius) {
			return true;
		}
		if (Math.sqrt(((box.x - this.x) * (box.x - this.x)) +
		              ((box.y + box.height - this.y) * (box.y + box.height - this.y))) <
		    this.radius) {
			return true;
		}
		return false;
	};

	TW.Collision.CollisionCircle = CollisionCircle;
	return CollisionCircle;
});
