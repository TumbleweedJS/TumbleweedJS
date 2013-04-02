/**
 @module Collision
 @namespace Collision
 */


define(['../math/Vector2D'], function(Vector2D) {
	var TW = TW || {};
	TW.Collision = TW.Collision || {};


	/**
	 * The CollisionSegment class allow you to define a segment to test
	 * collision width other segments and collision circles.
	 *
	 * @class CollisionSegment
	 * @constructor
	 * @param {Number} x1 the x coordinate of the first point of the segment
	 * @param {Number} y1 the y coordinate of the first point of the segment
	 * @param {Number} x2 the x coordinate of the second point of the segment
	 * @param {Number} y2 the y coordinate of the second point of the segment
	 */
	function CollisionSegment(x1, y1, x2, y2) {

		/**
		 * the x coordinate of the first point of the CollisionSegment
		 *
		 * @property {Number} px
		 */
		this.px = x1;

		/**
		 * the y coordinate of the first point of the CollisionSegment
		 *
		 * @property {Number} py
		 */
		this.py = y1;

		/**
		 * vector representing the segment (from x1;y2 to x2;y2)
		 *
		 * @property {Vector2D} vector
		 */
		this.vector = new Vector2D(x2 - x1, y2 - y1);
	}

	/**
	 * The isCollidingSegment method allow you to test if the current segment is colliding another segment.
	 * @method isCollidingSegment
	 * @param {CollisionSegment} segment the CollisionSegment to test
	 * if is colliding the current collision segment object.
	 * @return {boolean} return true if segment is colliding the current CollisionSegment.
	 */
	CollisionSegment.prototype.isCollidingSegment = function(segment) {
		var ax = this.px;
		var ay = this.py;
		var cx = segment.px;
		var cy = segment.py;
		var vectorI = this.vector;
		var vectorJ = segment.vector;
		var k;
		var m;
		var denominateur = (vectorI.x * vectorJ.y) - (vectorI.y * vectorJ.x);

		if (denominateur === 0) {
			return false;
		}
		m = -((-vectorI.x * ay) + (vectorI.x * cy) + (vectorI.y * ax) - (vectorI.y * cx)) /
		    denominateur;
		k = -((ax * vectorJ.y) - (cx * vectorJ.y) - (vectorJ.x * ay) + (vectorJ.x * cy)) /
		    denominateur;
		return (0 <= m && m <= 1 && 0 <= k && k <= 1);
	};

	/**
	 * The isCollidingCircle method allow you to test the collision beetween the current object and the circle object
	 *
	 * @method isCollidingCircle
	 * @param {CollisionCircle} circle the CollisionCircle to test the interection with the CollisionSegment.
	 * @return {boolean} return true if circle is colliding the current CollisionSegment.
	 */
	CollisionSegment.prototype.isCollidingCircle = function(circle) {
		var ax = this.px;
		var ay = this.py;
		var bx = ax + this.vector.x;
		var by = ay + this.vector.y;
		var vx = bx - ax;
		var vy = by - ay;
		var radius = circle.radius;
		var delta;

		ax -= circle.x;
		ay -= circle.y;
		delta = (((2 * ax * vx) + (2 * ay * vy)) * ((2 * ax * vx) + (2 * ay * vy))) -
		        (4 * ((vx * vx) + (vy * vy)) * ((ax * ax) + (ay * ay) - (radius * radius)));
		if (delta >= 0) {
			if ((((2 * ax * vx + 2 * ay * vy) * -1) + (Math.sqrt(delta))) / (2 * ((vx * vx) + (vy * vy))) < 1.0 &&
			    (((2 * ax * vx + 2 * ay * vy) * -1) + (Math.sqrt(delta))) / (2 * ((vx * vx) + (vy * vy))) > 0.0) {
				return true;
			}
			if ((((2 * ax * vx + 2 * ay * vy) * -1) - (Math.sqrt(delta))) / (2 * ((vx * vx) + (vy * vy))) < 1.0 &&
			    (((2 * ax * vx + 2 * ay * vy) * -1) - (Math.sqrt(delta))) / (2 * ((vx * vx) + (vy * vy))) > 0.0) {
				return true;
			}
		}
		return false;
	};

	TW.Collision.CollisionSegment = CollisionSegment;
	return CollisionSegment;
});