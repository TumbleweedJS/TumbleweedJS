/**
 * @module Collision
 * @namespace Collision
 */


define([], function() {
	var TW = TW || {};
	TW.Collision = TW.Collision || {};


	/**
	 * The CollisionBox class allow you to declare a bounding box to test collisions between
	 * other collisions boxes and collisions circles.
	 *
	 * @class CollisionBox
	 * @constructor
	 * @param {Number} x the x coordinate of the collision box
	 * @param {Number} y the y coordinate of the collision box
	 * @param {Number} w the width of the collision box
	 * @param {Number} h the height of the collision box
	 */
	function CollisionBox(x, y, w, h) {

		/**
		 * type of Collision object
		 *
		 * @property {String} type
		 * @readonly
		 */
		this.type = "CollisionBox";

		/**
		 * @property {Number} x
		 */
		this.x = x;

		/**
		 * @property {Number} y
		 */
		this.y = y;

		/**
		 * @property {Number} width
		 */
		this.width = w;

		/**
		 * @property {Number} height
		 */
		this.height = h;

		this._debugMode = false;
	}


	/**
	 * The isPointInside method allow you to test if a point is inside the bouncing box.
	 *
	 * @method isPointInside
	 * @param {Number} px the x coordinate of the point
	 * @param {Number} py the y coordinate of the point
	 * @return {boolean} true if the point is inside the box, else return false.
	 */
	CollisionBox.prototype.isPointInside = function(px, py) {
		return px >= this.x && px <= this.x + this.width &&
		       py >= this.y && py <= this.y + this.height;
	};

	/**
	 * The isSegmentCollidingCircle method allow you to test if a segment is colliding a circle
	 *
	 * @method isSegmentCollidingCircle
	 * @param {Number} ax the x coordinate of the first point of the segment
	 * @param {Number} ay the y coordinate of the first point of the segment
	 * @param {Number} bx the x coordinate of the second point of the segment
	 * @param {Number} by the y coordinate of the second point of the segment
	 * @param {CollisionCircle} circle the CollisionCircle object to test collision with the segment
	 * @return {boolean} return true if circle and the segment are colliding, else return false.
	 */
	CollisionBox.prototype.isSegmentCollidingCircle = function(ax, ay, bx, by, circle) {
		var vx = bx - ax;
		var vy = by - ay;
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
	 * The isCollidingCircle method allow you to test if the current CollisionBox
	 * is colliding the CollisionCircle object.
	 *
	 * @method isCollidingCircle
	 * @param {CollisionCircle} circle the CollisionCircle object to test the collision with.
	 * @return {boolean} if the current CollisionBox is colliding the CollisionCircle object,
	 *  then the isCollidingCircle function will return true otherwise it will return false.
	 */
	CollisionBox.prototype.isCollidingCircle = function(circle) {
		var radius = circle.radius;

		//On check si la boite englobante du cercle rentre en collision avec this
		if (circle.x + radius < this.x) {
			return false;
		}
		if (circle.x - radius > this.x + this.width) {
			return false;
		}
		if (circle.y + radius < this.y) {
			return false;
		}
		if (circle.y - radius > this.y + this.height) {
			return false;
		}
		//On check si un des segments de la box rentre en collision avec le cercle
		if (this.isSegmentCollidingCircle(this.x, this.y, this.x + this.width, this.y, circle)) {
			return true;
		}
		if (this.isSegmentCollidingCircle(this.x + this.width, this.y, this.x + this.width, this.y + this.height,
		                                  circle)) {
			return true;
		}
		if (this.isSegmentCollidingCircle(this.x + this.width, this.y + this.height, this.x, this.y + this.height,
		                                  circle)) {
			return true;
		}
		if (this.isSegmentCollidingCircle(this.x, this.y + this.height, this.x, this.y, circle)) {
			return true;
		}
		//On check si le centre du cercle est dans la box.
		if (circle.x > this.x && circle.x < this.x + this.width && circle.y > this.y &&
		    circle.y < this.y + this.height) {
			return true;
		}
		//on check si les sommets de la box sont a une distance plus petite que le rayon du cercle
		if (Math.sqrt(((this.x - circle.x) * (this.x - circle.x)) +
		              ((this.y - circle.y) * (this.y - circle.y))) < radius) {
			return true;
		}
		if (Math.sqrt(((this.x + this.width - circle.x) * (this.x + this.width - circle.x)) +
		              ((this.y - circle.y) * (this.y - circle.y))) < radius) {
			return true;
		}
		if (Math.sqrt(((this.x + this.width - circle.x) * (this.x + this.width - circle.x)) +
		              ((this.y + this.height - circle.y) * (this.y + this.height - circle.y))) < radius) {
			return true;
		}
		if (Math.sqrt(((this.x - circle.x) * (this.x - circle.x)) +
		              ((this.y + this.height - circle.y) * (this.y + this.height - circle.y))) < radius) {
			return true;
		}
		return false;
	};

	/**
	 * The isCollidingBox method allow you to test if the current CollisionBox object is colliding
	 * the CollisionBox object given in parameter.
	 *
	 * @method isCollidingBox
	 * @param {CollisionBox} box the CollisionBox object to test the collision with
	 * @return {Boolean} return true if the box object is colliding the this object.
	 */
	CollisionBox.prototype.isCollidingBox = function(box) {
		if (this.x + this.width < box.x) {
			return false;
		}
		if (this.x > box.x + box.width) {
			return false;
		}
		if (this.y + this.height < box.y) {
			return false;
		}
		return this.y <= box.y + box.height;

	};

	/**
	 * The setDebug method allow you to switch the mode of the CollisionBox between debug and release.
	 *
	 * @method setDebug
	 * @param {Number} debug the parameter to define which type of mode choose
	 * (true means debug mode, false means release)
	 */
	CollisionBox.prototype.setDebug = function(debug) {
		this._debugMode = debug;
	};

	/**
	 * The draw method allow you to draw the CollisionBox only if `setDebug(true)` was called before.
	 * 
	 * @method draw
	 * @param {CanvasRenderingContext2D} context the context 2d on which draw the CollisionBox.
	 */
	CollisionBox.prototype.draw = function(context) {
		if (context && this._debugMode) {
			//Permet de sauvegarder le context
			context.save();
			//Set a l'identity la matrice de transformation
			context.setTransform(1.0, 0.0, 0.0, 1.0, 0.0, 0.0);
			context.fillStyle = "rgb(" + 0 + ", " + 0 + ", " + 0 + ")";
			context.strokeRect(this.x, this.y, this.width, this.height);
			//Permet de restorer le context
			context.restore();
		}
	};


	TW.Collision.CollisionBox = CollisionBox;
	return CollisionBox;
});