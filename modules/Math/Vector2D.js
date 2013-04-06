/**
 * @module Math
 * @namespace Math
 */

var TW = TW || {};
define([], function() {

	TW.Math = TW.Math || {};


	/**
	 * The Vector2D class allow you to create a vector2D object
	 *
	 * For a more simplier use, most of methods which take `Vector2D` in parameter
	 * can also take a basic object instead:
	 *
	 *     vector.add({ x: 20, y: 20 });
	 *     vector.dotProduct({ x: 10, y: 10 });
	 *
	 * This inclues `add`, `sub`, `dotProduct` and `crossProduct`.
	 * Warning: `getAngleBetween` need a full `Vector2D` object.
	 * 
	 * @class Vector2D
	 * @constructor
	 * @param {Number} x the x coordinate of the Vector2D
	 * @param {Number} y the y coordinate of the Vector2D
	 */
	function Vector2D(x, y) {

		/**
		 * x coordinate
		 * @property {Number} x
		 */
		this.x = x;

		/**
		 * y coordinate
		 * @property {Number} y
		 */
		this.y = y;
	}

	/**
	 * The add method allow you to add two vectors.
	 *
	 * @method add
	 * @param {Vector2D} vector the Vector2D to add with the current Vector2D object.
	 * @chainable
	 */
	Vector2D.prototype.add = function(vector) {
		this.x += vector.x;
		this.y += vector.y;
		return this;
	};

	/**
	 * The sub method allow you to sub two vectors.
	 *
	 * @method sub
	 * @param {Vector2D} vector the Vector2D to subtract to the current Vector2D object.
	 * @chainable
	 */
	Vector2D.prototype.sub = function(vector) {
		this.x -= vector.x;
		this.y -= vector.y;
		return this;
	};

	/**
	 * The mult method allow you to mult the current Vector2D by a scalar.
	 *
	 * @method mult
	 * @param {Number} scalar the scalar who multiply the current Vector2D
	 * @chainable
	 */
	Vector2D.prototype.mult = function(scalar) {
		this.x *= scalar;
		this.y *= scalar;
		return this;
	};

	/**
	 * The div method allow you to div the current Vector2D by a scalar.
	 *
	 * @method div
	 * @param {Number} scalar
	 * @chainable
	 */
	Vector2D.prototype.div = function(scalar) {
		this.x /= scalar;
		this.y /= scalar;
		return this;
	};

	/**
	 * normalize the current Vector2D
	 *
	 * @method normalize
	 */
	Vector2D.prototype.normalize = function() {
		var length = Math.sqrt((this.x * this.x) + (this.y * this.y));
		this.x /= length;
		this.y /= length;
	};

	/**
	 * get the length of the Vector2D
	 *
	 * @method getLength
	 * @return {Number} returns the length of the Vector2D.
	 */
	Vector2D.prototype.getLength = function() {
		return Math.sqrt((this.x * this.x) + (this.y * this.y));
	};

	/**
	 * set the length of the current Vector2D
	 *
	 * @method setLength
	 * @param {Number} length the length to apply to the current Vector2D
	 */
	Vector2D.prototype.setLength = function(length) {
		this.normalize();
		this.x *= length;
		this.y *= length;
	};

	/**
	 * get the angle of the current Vector2D
	 *
	 * @method getAngle
	 * @return {Number} returns the angle of the current Vector2D (expressed in degree).
	 */
	Vector2D.prototype.getAngle = function() {
		if (this.x === 0) {
			if (this.y > 0) {
				return 90;
			}
			if (this.y < 0) {
				return -90;
			}
			if (this.y === 0) {
				return 0;
			}
		}
		var tmpX = this.x / this.getLength();
		var tmpY = this.y / this.getLength();
		return Math.atan(tmpY / tmpX) * 180.0 / Math.PI + ( tmpX < 0 ? 180 : 0);
	};


	/**
	 * set the angle of the current Vector2D
	 *
	 * @method setAngle
	 * @param {Number} angle the angle to apply to the current Vector2D (angle is expressed in degree)
	 */
	Vector2D.prototype.setAngle = function(angle) {
		var length = this.getLength();
		this.x = Math.cos(angle / 180.0 * Math.PI) * length;
		this.y = Math.sin(angle / 180.0 * Math.PI) * length;
	};

	/**
	 * compute the dot product of the current Vector2D
	 *
	 * @method dotProduct
	 * @param {Vector2D} vector2 the second vector to compute the dot product
	 * @return {Number} returns the dot product between the current Vector2D and vector2.
	 */
	Vector2D.prototype.dotProduct = function(vector2) {
		return ((this.x * vector2.x) + (this.y * vector2.y));
	};

	/**
	 * compute the angle between the current Vector2D and vector2
	 *
	 * @method getAngleBetween
	 * @param {Vector2D} vector2 the second vector to compute the angle between.
	 *  **Note that `vector2` must be a full `Vector2D` object.**
	 * @return {Number} returns the angle between the current Vector2D and vector2 (expressed in degree).
	 */
	Vector2D.prototype.getAngleBetween = function(vector2) {
		var dotProd = this.dotProduct(vector2);
		var cos = dotProd / (this.getLength() * vector2.getLength());
		return Math.acos(cos) * 180.0 / Math.PI;
	};

	/**
	 * compute the cross product of the current Vector2D and vector2
	 *
	 * @method crossProduct
	 * @param {Vector2D} vector2 the second vector to use to compute the cross product
	 * @return {Number} returns the cross product between the current Vector2D and vector2
	 */
	Vector2D.prototype.crossProduct = function(vector2) {
		return ((this.x * vector2.y) - (this.y * vector2.x));
	};

	/**
	 * get the squared length of this vector
	 *
	 * @method getSquaredLength
	 * @return {Number} squared length
	 */
	Vector2D.prototype.getSquaredLength = function() {
		return this.x * this.x + this.y * this.y;
	};

	/**
	 * give a data representation of Vector2D
	 *
	 * @method toString
	 * @return {String} data representation of Vector2D
	 */
	Vector2D.prototype.toString = function() {
		return "[x=" + this.x + "; y=" + this.y + "]";
	};

	TW.Math.Vector2D = Vector2D;
	return Vector2D;
});
