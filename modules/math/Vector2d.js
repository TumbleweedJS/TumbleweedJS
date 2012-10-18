/**
 @module Math
 @namespace Math
 */

var TW = TW || {};
TW.Math = TW.Math || {};

TW.Math.Vector2d = function() {
	/**
	 The Vector2d class allow you to create a vector2d object

	 @class Vector2d
	 @param {float} x the x coordinate of the Vector2d
	 @param {float} y the y coordinate of the Vector2d
	 @constructor
	 */
	function Vector2d(x, y) {
		/**
		 x coordinate
		 @property {Number} x
		 */
		this.x = x;
		/**
		 y coordinate
		 @property {Number} y
		 */
		this.y = y;
	}

	/**
	 The add method allow you to add two vectors and return the sum of them.

	 @method add
	 @param {Vector2d} vector the Vector2d to add with the current Vector2d object.
	 @return {Vector2d} return the sum of the two Vector2d
	 */
	Vector2d.prototype.add = function(vector) {
		return new Vector2d(this.x + vector.x, this.y + vector.y);
	};

	/**
	 The sub method allow you to sub two vectors and return the substraction of them.

	 @method sub
	 @param {Vector2d} vector the Vector2d to substract to the current Vector2d object.
	 @return {Vector2d} returns the substraction of this and vector object.
	 */
	Vector2d.prototype.sub = function(vector) {
		return new Vector2d(this.x - vector.x, this.y - vector.y);
	};

	/**
	 The mult method allow you to mult the current Vector2d by a scalar and return the result.

	 @method mult
	 @param {float} scalar the scalar who multiply the current Vector2d
	 @return {Vector2d} returns the current Vector2d multiplied by scalar.
	 */
	Vector2d.prototype.mult = function(scalar) {
		return new Vector2d(this.x * scalar, this.y * scalar);
	};

	/**
	 The div method allow you to div the current Vector2d by a scalar and return the result

	 @method div
	 @param scalar
	 @return {Vector2d} returns the current Vector2d divided by scalar
	 */
	Vector2d.prototype.div = function(scalar) {
		return new Vector2d(this.x / scalar, this.y / scalar);
	};

	/**
	 get the x coordinate of the current Vector2d

	 @method getX
	 @return {float} returns the x coordinate of the Vector2d
	 @deprecated use directly Vector2d.x
	 */
	Vector2d.prototype.getX = function() {
		return this.x;
	};

	/**
	 get the y coordinate of the current Vector2d

	 @method getY
	 @return {float} returns the y coordinate of the Vector2d
	 @deprecated use directly Vector2d.y
	 */
	Vector2d.prototype.getY = function() {
		return this.y;
	};

	/**
	 set the x coordinate of the current Vector2d

	 @method setX
	 @param {float} x the x coordinate of the Vector2d
	 @deprecated use directly Vector2d.x
	 */
	Vector2d.prototype.setX = function(x) {
		this.x = x;
	};

	/**
	 set the y coordinate of the Vector2d
	 @method setY
	 @param {float} y the y coordinate of the Vector2d
	 @deprecated use directly Vector2d.y
	 */
	Vector2d.prototype.setY = function(y) {
		this.y = y;
	};

	/**
	 nomalize the current Vector2d

	 @method normalize
	 */
	Vector2d.prototype.normalize = function() {
		var length = Math.sqrt((this.x * this.x) + (this.y * this.y));
		this.x /= length;
		this.y /= length;
	};

	/**
	 get the length of the Vector2d

	 @method getLength
	 @return {float} returns the length of the Vector2d.
	 */
	Vector2d.prototype.getLength = function() {
		return Math.sqrt((this.x * this.x) + (this.y * this.y));
	};

	/**
	 set the length of the current Vector2d

	 @method setLength
	 @param {float} length the length to apply to the current Vector2d
	 */
	Vector2d.prototype.setLength = function(length) {
		this.normalize();
		this.x *= length;
		this.y *= length;
	};

	/**
	 get the angle of the current Vector2d

	 @method getAngle
	 @return {float} returns the angle of the current Vector2d (expressed in degree).
	 */
	Vector2d.prototype.getAngle = function() {
		if (this.x == 0) {
			if (this.y > 0) {
				return 90;
			}
			if (this.y < 0) {
				return -90;
			}
			if (this.y == 0) {
				return 0;
			}
		}
		return Math.atan(this.y / this.x) * 180.0 / Math.PI;
	};


	/**
	 set the angle of the current Vector2d

	 @method setAngle
	 @param {float} angle the angle to apply to the current Vector2d (angle is expressed in degree)
	 */
	Vector2d.prototype.setAngle = function(angle) {
		var length = this.getLength();
		this.x = Math.cos(angle / 180.0 * Math.PI) * length;
		this.y = Math.sin(angle / 180.0 * Math.PI) * length;
	};

	/**
	 compute the dot product of the current Vector2d

	 @method dotProduct
	 @param {Vector2d} vector2 the second vector to compute the dot product
	 @return {float} returns the dot product beetween the current Vector2d and vector2.
	 */
	Vector2d.prototype.dotProduct = function(vector2) {
		return ((this.x * vector2.getX()) + (this.y * vector2.getY()));
	};

	/**
	 compute the angle beetween the current Vector2d and vector2

	 @method getAngleBeetween
	 @param {Vector2d} vector2 the second vector to compute the angle beetween.
	 @return {float} returns the angle beetween the current Vector2d and vector2 (expressed in degree).
	 */
	Vector2d.prototype.getAngleBeetween = function(vector2) {
		var dot_prod = this.dotProduct(vector2);
		var length_v1 = this.getLength();
		var length_v2 = vector2.getLength();
		var cos = dot_prod / (length_v1 * length_v2);
		return Math.acos(cos) * 180.0 / Math.PI;
	};

	/**
	 compute the cross product of the current Vector2d and vector2

	 @method cross product
	 @param {Vector2d} vector2 the second vector to use to compute the cross product
	 @return {float} returns the cross product beetween the current Vector2d and vector2
	 */
	Vector2d.prototype.crossProduct = function(vector2) {
		return ((this.x * vector2.getY()) - (this.y * vector2.getX()));
	};

	/**
	 get the det of the current Vector2d and vector

	 @method getDet
	 @param {Vector2d} vector the second Vector2d to use to compute the det of the two vectors
	 @return {float} returns the det of the current Vector2d and vector, if the return value > 0 then vector is at left of this, if the return value is < 0 then vector is at right of this, if the return value is equal to 0 then vector is on this.
	 */
	Vector2d.prototype.getDet = function(vector) {
		return this.crossProduct(vector);
	};

	/**
	 popup the values of the Vector2d throught an alert box.

	 @method dump
	 @deprecated use `window.alert(vector);` instead
	 */
	Vector2d.prototype.dump = function() {
		window.alert(this);
	};

	/**
	 give a data representation of Vector2d

	 @method toString
	 @return {String} data representation of Vector2d
	 */
	Vector2d.prototype.toString = function() {
		return "[x=" + this.x + "; y=" + this.y + "]";
	};

	return Vector2d;
}();


/**
 @module Math
 */

/**
 @class Vector2d
 @deprecated use TW.Math.Vector2d instead
 */
var Vector2d = TW.Math.Vector2d;
