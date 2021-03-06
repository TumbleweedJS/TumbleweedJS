/**
 * @module Math
 * @namespace Math
 */

var TW = TW || {};
define(['./Vector2D'], function(Vector2D) {

	TW.Math = TW.Math || {};


	/**
	 * Matrix2D class, represent a matrix object
	 * for perform geometric calculus.
	 * The default matrix is the identity matrix.
	 *
	 * @class Matrix2D
	 * @constructor
	 *
	 * @example
	 *`new Matrix2D()` generate this matrix:
	 *
	 *     [1 0 0]
	 *     [0 1 0]
	 *     [0 0 1]
	 */
	function Matrix2D() {

		/**
		 * Internal data that represent matrix.
		 *
		 * **Note that datas are given in column major order.**
		 *
		 * @property {Array} data
		 * @example
		 *
		 *     [[1, 0, 0],
		 *      [0, 1, 0],
		 *      [0, 0, 1]]
		 *
		 */
		this.data = [
			[1, 0, 0],
			[0, 1, 0],
			[0, 0, 1]
		];
	}

	/**
	 * Check if the current matrix match the identity.
	 *
	 * @method isIdentity
	 * @return {Boolean} `true` if the current matrix is set to the identity, otherwise it returns `false`.
	 */
	Matrix2D.prototype.isIdentity = function() {
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				if (this.data[i][j] !== (i === j ? 1 : 0)) {
					return false;
				}
			}
		}
		return true;
	};


	/**
	 * Set the current matrix to the specified scalars (a, b, c, d, e, f).
	 * **Note that the parameters are given in column major order.**
	 *
	 * After a `setTransform` call, your matrix will look like :
	 *
	 *     [a b 0]
	 *     [c d 0]
	 *     [e f 1]
	 *
	 * @method setTransform
	 * @param a represent the top-left scalar in the matrix
	 * @param b represent the top-center scalar in the matrix
	 * @param c represent the middle-left scalar in the matrix
	 * @param d represent the middle-center scalar in the matrix
	 * @param e represent the bottom-left scalar in the matrix
	 * @param f represent the bottom-center scalar in the matrix
	 * @chainable
	 */
	Matrix2D.prototype.setTransform = function(a, b, c, d, e, f) {
		this.data[0][0] = a;
		this.data[0][1] = b;
		this.data[1][0] = c;
		this.data[1][1] = d;
		this.data[2][0] = e;
		this.data[2][1] = f;
		return this;
	};

	/**
	 * Transform the current matrix by the scalars a,b,c,d,e,f.
	 * If C if our current matrix and B the matrix made by a,b,c,d,e,f scalars. Then, the transform will be :
	 *
	 *       C Matrix      B matrix
	 *     [Ca, Cc, Ce]   [a, c, e]
	 *     [Cb, Cd, Cf] X [b, d, f]
	 *     [0,  0,   1]   [0, 0, 1]
	 *
	 * @method transform
	 * @param a
	 * @param b
	 * @param c
	 * @param d
	 * @param e
	 * @param f
	 * @chainable
	 */
	Matrix2D.prototype.transform = function(a, b, c, d, e, f) {
		var matrix = new Matrix2D();
		matrix.setTransform(a, b, c, d, e, f);
		this.multiplyMatrix(matrix);
		return this;
	};

	/**
	 * Get a copy of the current state of the matrix by a 2d array of floats.
	 *
	 * **Note: if you want to modify the matrix, you can access directly to `matrix.data`**
	 *
	 * @method getData
	 * @return {Array} data return the internal data array of the matrix (In column-major order).
	 */
	Matrix2D.prototype.getData = function() {
		return [
			[this.data[0][0], this.data[0][1], this.data[0][2]],
			[this.data[1][0], this.data[1][1], this.data[1][2]],
			[this.data[2][0], this.data[2][1], this.data[2][2]]
		];
	};

	/**
	 * Set the current matrix to identity.
	 *
	 * @method identity
	 * @chainable
	 */
	Matrix2D.prototype.identity = function() {
		this.setTransform(1, 0, 0, 1, 0, 0);
		return this;
	};

	/**
	 * multiplies the current matrix by scale matrix
	 *
	 * @method scale
	 * @param {Number} x multiplier of abscissa
	 * @param {Number} y multiplier of ordinate
	 * @chainable
	 */
	Matrix2D.prototype.scale = function(x, y) {
		var tmpMatrix = new Matrix2D();
		tmpMatrix.setTransform(x, 0, 0, y, 0, 0);
		tmpMatrix.multiplyMatrix(this);
		this.data = tmpMatrix.data;
		return this;
	};

	/**
	 * Apply a rotation to this matrix.
	 *
	 * @method rotate
	 * @param {Number} angle in degrees
	 * @chainable
	 */
	Matrix2D.prototype.rotate = function(angle) {
		var tmpMatrix = new Matrix2D();
		var radAngle = angle / 180 * Math.PI;
		tmpMatrix.setTransform(Math.cos(radAngle), Math.sin(radAngle),
		                        -Math.sin(radAngle), Math.cos(radAngle),
		                        0, 0);
		tmpMatrix.multiplyMatrix(this);
		this.data = tmpMatrix.data;
		return this;
	};

	/**
	 * Apply a translation to this matrix.
	 *
	 * @method translate
	 * @param {Number} x translation in abscissa
	 * @param {Number} y translation in ordinate
	 * @chainable
	 */
	Matrix2D.prototype.translate = function(x, y) {
		var tmpMatrix = new Matrix2D();
		tmpMatrix.setTransform(1, 0, 0, 1, x, y);
		tmpMatrix.multiplyMatrix(this);
		this.data = tmpMatrix.data;
		return this;
	};

	/**
	 *Transform the current matrix to apply a skew.
	 *
	 * @method skew
	 * @param a the x skew angle (in degrees)
	 * @param b the y skew angle (in degrees)
	 * @return {Matrix2D} return the current matrix that have been transformed by the skew.
	 * @chainable
	 */
	Matrix2D.prototype.skew = function(a, b) {
		var tmpMatrix = Matrix2D.skew(a, b);
		tmpMatrix.multiplyMatrix(this);
		this.data = tmpMatrix.data;
		return this;
	};


	/**
	 * create a copy of the matrix.
	 *
	 * @method copy
	 * @return {Matrix2D} the new matrix
	 */
	Matrix2D.prototype.copy = function() {
		var matrix = new Matrix2D();
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				this.data[i][j] = matrix.data[i][j];
			}
		}
		return matrix;
	};

	/**
	 * Compute the product of two matrix
	 *
	 * @method multiplyMatrix
	 * @param {Matrix2D} matrix the matrix to multiplies
	 * @chainable
	 */
	Matrix2D.prototype.multiplyMatrix = function(matrix) {
		if (!(matrix instanceof Matrix2D)) {
			throw new Error("bad type argument: matrix");
		}

		var tmpMatrix = new Matrix2D();
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				tmpMatrix.data[i][j] = this.data[i][0] * matrix.data[0][j] +
				                         this.data[i][1] * matrix.data[1][j] +
				                         this.data[i][2] * matrix.data[2][j];
			}
		}
		this.data = tmpMatrix.data;
		return this;
	};

	/**
	 * Multiplies the current matrix by a vector 2d.
	 *
	 * @method multiplyVector
	 * @param {Vector2D} vector
	 * @return {Vector2D} a new vector transformed by the current matrix
	 */
	Matrix2D.prototype.multiplyVector = function(vector) {
		var result = new Vector2D(0, 0);
		var vectorW;

		result.x = this.data[0][0] * vector.x + this.data[1][0] * vector.y + this.data[2][0];
		result.y = this.data[0][1] * vector.x + this.data[1][1] * vector.y + this.data[2][1];
		vectorW = this.data[0][2] * vector.x + this.data[1][2] * vector.y + this.data[2][2];
		result.div(vectorW);
		return result;
	};

	/**
	 * This method transform the context given in parameter by the current matrix.
	 *
	 * @method transformContext
	 * @param {CanvasRenderingContext2D} context it is the context to transform by the current matrix.
	 */
	Matrix2D.prototype.transformContext = function(context) {
		/* global CanvasRenderingContext2D:false */
		if (!(context instanceof CanvasRenderingContext2D)) {
			throw new Error("bad type argument: context");
		}
		context.transform(this.data[0][0], this.data[0][1], this.data[1][0],
		                  this.data[1][1], this.data[2][0], this.data[2][1]);
	};

	/**
	 * Compute the inverse matrix of this.
	 *
	 * @method inverse
	 * @return {Matrix2D} inverse of this matrix if it exist; Otherwise `null`
	 */
	Matrix2D.prototype.inverse = function() {
		var result = new Matrix2D();
		var m = this.data;

		result.data = [
			[ m[2][2] * m[1][1] - m[1][2] * m[2][1],
			  m[0][2] * m[2][1] - m[2][2] * m[0][1],
			  m[1][2] * m[0][1] - m[0][2] * m[1][1] ],
			[ m[1][2] * m[2][0] - m[2][2] * m[1][0],
			  m[2][2] * m[0][0] - m[0][2] * m[2][0],
			  m[0][2] * m[1][0] - m[1][2] * m[0][0] ],
			[ m[2][1] * m[1][0] - m[1][1] * m[2][0],
			  m[0][1] * m[2][0] - m[2][1] * m[0][0],
			  m[1][1] * m[0][0] - m[0][1] * m[1][0] ]
		];

		var det = (m[0][0] * (m[2][2] * m[1][1] - m[1][2] * m[2][1])) -
		          (m[0][1] * (m[2][2] * m[1][0] - m[1][2] * m[2][0])) -
		          (m[0][2] * (m[2][1] * m[1][0] - m[1][1] * m[2][0]));

		if (det === 0) {
			return null;
		}

		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				result.data[i][j] *= 1 / det;

			}
		}
		return result;
	};

	/**
	 * give a data representation of Matrix
	 *
	 * @method toString
	 * @return {String} data representation of Matrix
	 */
	Matrix2D.prototype.toString = function() {
		var result = "";

		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				result += this.data[j][i] + " ";
			}
			result += "\n";
		}
		return result;
	};

	/**
	 * This method returns an identity matrix.
	 *
	 * @method identity
	 * @static
	 * @return {Matrix2D} return an identity matrix object
	 */
	Matrix2D.identity = function() {
		var tmp = new Matrix2D();
		tmp.setTransform(1, 0, 0, 1, 0, 0);
		return tmp;
	};

	/**
	 * This method returns a rotation matrix
	 * **Note that the angle is expressed in degree**
	 *
	 * @method rotation
	 * @static
	 * @param angle a scalar expressed in degree who represent the angle of rotation of the matrix to generate.
	 * @return {Matrix2D} return a rotation matrix object
	 */
	Matrix2D.rotation = function(angle) {
		var tmp = new Matrix2D();
		var angleRad = angle / Math.PI * 180.0;
		tmp.setTransform(Math.cos(angleRad), Math.sin(angleRad), -Math.sin(angleRad), Math.cos(angleRad), 0, 0);
		return tmp;
	};

	/**
	 * This method return a translation matrix
	 *
	 * @method translation
	 * @static
	 * @param x the x translation to integrate in the matrix
	 * @param y the y translation to integrate in the matrix
	 * @return {Matrix2D}
	 */
	Matrix2D.translation = function(x, y) {
		var tmp = new Matrix2D();
		tmp.setTransform(1, 0, 0, 1, x, y);
		return tmp;
	};

	/**
	 * This method return a scale matrix
	 *
	 * @method scale
	 * @static
	 * @param x the abscissa scale factor to integrate in the matrix
	 * @param y the ordinate scale factor to integrate in the matrix
	 * @return {Matrix2D}
	 */
	Matrix2D.scale = function(x, y) {
		var tmp = new Matrix2D();
		tmp.setTransform(x, 0, 0, y, 0, 0);
		return tmp;
	};

	/**
	 * This method return a skew matrix
	 *
	 * @method skew
	 * @static
	 * @param a the angle of skew on the y axis (in degrees)
	 * @param b the angle of skew on the x axis (in degrees)
	 * @return {Matrix2D}
	 */
	Matrix2D.skew = function(a, b) {
		var tmp = new Matrix2D();
		tmp.setTransform(1, Math.tan(a / 180 * Math.PI), Math.tan(b / 180 * Math.PI), 1, 0, 0);
		return tmp;
	};

	TW.Math.Matrix2D = Matrix2D;
	return Matrix2D;
});
