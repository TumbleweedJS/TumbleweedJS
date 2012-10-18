/**
 @module Math
 @namespace Math
 */

var TW = TW || {};
TW.Math = TW.Math || {};

TW.Math.Matrix = function() {

	/**
	 Matrix class, represent a matrix objet
	 for perform geometric calcul.
	 The default matrix is the identity matrix.

	 @example
	 `new Matrix(4, 4)` generate this matrix:

	 [1 0 0 0]
	 [0 1 0 0]
	 [0 0 1 0]
	 [0 0 0 1]

	 @class Matrix
	 @constructor
	 @param {Number} width size of matrix
	 @param {Number} height size of matrix
	 */
	function Matrix(width, height) {

		/**
		 Internal data that represent matrix.
		 @property {Array} data
		 */
		this.data = [];

		/**
		 Width size of matrix
		 @property {Number} width
		 */
		this.width = width;

		/**
		 Heigh size of matrix
		 @property {Number} heigh
		 */
		this.height = height;

		var i = 0;
		var j = 0;
		while (i < height) {
			j = 0;
			this.data.push([]);
			while (j < width) {
				this.data[i].push(i === j ? 1 : 0);
				j++;
			}
			i++;
		}
	}

	/**
	 multiplie the current matrix by scale matrix

	 @method scale
	 @param {Number} x multiplier of abscissa
	 @param {Number} y multiplier of ordinate
	 @chainable
	 */
	Matrix.prototype.scale = function(x, y) {
		var tmp_matrix = new Matrix(3, 3);
		tmp_matrix.setData(3, 3, [
			x, 0, 0,
			0, y, 0,
			0, 0, 1
		]);
		var result = this.multByMatrix(tmp_matrix);
		var i = 0;
		var j = 0;
		while (i < this.height) {
			j = 0;
			while (j < this.width()) {
				this.setScalar(i, j, result.getScalar(i, j));
				j++;
			}
			i++;
		}
		return this;
	};

	/**
	 Apply a rotation to this matrix.

	 @method rotate
	 @param {Number} angle in degrees
	 @chainable
	 */
	Matrix.prototype.rotate = function(angle) {
		var i = 0, j = 0;

		var tmp_matrix = new Matrix(3, 3);
		var rad_angle = angle / 180 * Math.PI;
		tmp_matrix.setData(3, 3, [
			Math.cos(rad_angle), -Math.sin(rad_angle), 0,
			Math.sin(rad_angle), Math.cos(rad_angle), 0,
			0, 0, 1
		]);
		var result = this.multByMatrix(tmp_matrix);
		while (i < this.height) {
			j = 0;
			while (j < this.width) {
				this.setScalar(i, j, result.getScalar(i, j));
				j++;
			}
			i++;
		}
		return this;
	};

	/**
	 Apply a translation to this matrix.

	 @method translate
	 @param {Number} x translation in abscissa
	 @param {Number} y translation in ordinate
	 @chainable
	 */
	Matrix.prototype.translate = function(x, y) {
		var tmp_matrix = new Matrix(3, 3);
		tmp_matrix.setData(3, 3, [
			1, 0, x,
			0, 1, y,
			0, 0, 1
		]);
		var result = this.multByMatrix(tmp_matrix);
		var i = 0;
		var j = 0;
		while (i < this.height) {
			j = 0;
			while (j < this.widh) {
				this.setScalar(i, j, result.getScalar(i, j));
				j++;
			}
			i++;
		}
		return this;
	};

	/**
	 Redefine data matrix.

	 @method setData
	 @param {Number} i new height
	 @param {Number} i new width
	 @param {Array} array_of_data the new data.
	 @return `false` if an error occurred; otherwise `true`
	 */
	Matrix.prototype.setData = function(i, j, array_of_data) {
		if (i < 0 || j < 0 || i * j != array_of_data.length) {
			return false;
		}
		var length = array_of_data.length;
		var step = 0;
		this.width = j;
		this.height = i;

		this.data = [];
		var i2 = 0;
		var j2 = 0;
		while (i2 < this.height) {
			j2 = 0;
			this.data.push([]);
			while (j2 < this.width) {
				this.data[i2].push(array_of_data[i2 * j + j2]);
				j2++;
			}
			i2++;
		}
		return true;
	};

	/**
	 Return the value of m(i,j)

	 @method getScalar
	 @param {Number} i new height
	 @param {Number} i new width
	 @return m(i, j)
	 */
	Matrix.prototype.getScalar = function(i, j) {
		return this.data[i][j];
	};

	/**
	 Set the value of  m(i, j)

	 @method setScalar
	 @param {Number} i new height
	 @param {Number} i new width
	 @param {Number} val the new value
	 @return `false` if an error was occured, `true` otherwise
	 */
	Matrix.prototype.setScalar = function(i, j, val) {
		if (i > this.height || i < 0
			    || j > this.width || j < 0) {
			return false;
		}
		this.data[i][j] = val;
		return true;
	};

	/**
	 Compute addition of two matrix

	 @method add
	 @param {Matrix} matrix
	 @return {Matrix} result if it's ok; `false` otherwise
	 */
	Matrix.prototype.add = function(matrix) {
		if (matrix.width != this.width
			|| matrix.height != this.height) {
			return false;
		}
		var ret_matrix = new Matrix(this.width, this.height);
		var i = 0;
		var j = 0;
		while (i < this.height) {
			j = 0;
			while (j < this.width) {
				ret_matrix.setScalar(i, j, this.getScalar(i, j) + matrix.getScalar(i, j));
				j++;
			}
			i++;
		}
		return ret_matrix;
	};

	/**
	 Substract this by an other matrix

	 @method sub
	 @param {Matrix} matrix
	 @return {Matrix} result if it's ok; `false` otherwise
	 */
	Matrix.prototype.sub = function(matrix) {
		if (matrix.width != this.width
			|| matrix.height != this.height) {
			return false;
		}
		var ret_matrix = new Matrix(this.width, this.height);
		var i = 0;
		var j = 0;
		while (i < this.height) {
			j = 0;
			while (j < this.width) {
				ret_matrix.setScalar(i, j, this.getScalar(i, j) - matrix.getScalar(i, j));
				j++;
			}
			i++;
		}
		return ret_matrix;
	};

	/**
	 mult the i row of this by the j column of matrix

	 @method _multScalar
	 @param {Number} i
	 @param {Number} j
	 @param {Matrix} matrix the other matrix
	 @return {Number} result
	 @private
	 */
	Matrix.prototype._multScalar = function(i, j, matrix) {
		var step = 0;
		var sum = 0;
		while (step < this.width) {
			sum += (this.getScalar(i, step) * matrix.getScalar(step, j));
			step++;
		}
		return sum;
	};

	/**
	 Compute the mult of two matrix

	 @method multByMatrix
	 @param {Matrix} matrix the matrix to multiplie
	 @return the result if it's ok, false if an error ocurred
	 */
	Matrix.prototype.multByMatrix = function(matrix) {
		var ret_matrix;
		var i = 0, j = 0;

		if (this.height != matrix.width
			|| this.width != matrix.height) {
			return false;
		}
		ret_matrix = new Matrix(this.width, this.height);
		while (i < this.height) {
			j = 0;
			while (j < this.width) {
				ret_matrix.setScalar(i, j, this._multScalar(i, j, matrix));
				j++;
			}
			i++;
		}
		return ret_matrix;
	};

	/**
	 Multiplie a Vector2d by this matrix
	 @method multByVector2d
	 @param {Vector2d} vector
	 @return {Vector2d} the result
	 */
	Matrix.prototype.multByVector2d = function(vector) {
		if (this.height > 3) {
			return false;
		}
		var vector2d = [
			vector.getX(),
			vector.getY(),
			1
		];
		var height = 0;
		var step = 0;
		var val_tmp = 0;
		var composant_counter = 0;
		var ret_vector_2d = [0, 0, 0];

		while (height < this.height) {
			step = 0;
			val_tmp = 0;
			while (step < this.width) {
				val_tmp += this.getScalar(height, step) * vector2d[step];
				step++;
			}
			ret_vector_2d[height] = val_tmp;
			height++;
		}
		return new Vector2d(ret_vector_2d[0], ret_vector_2d[1]);
	};

	/**
	 Display matrix content in alert box.

	 @method dump
	 @deprecated use `window.alert(matrix);` instead
	 */
	Matrix.prototype.dump = function() {
		window.alert(this);
	};

	/**
	 give a data representation of Matrix

	 @method toString
	 @return {String} data representation of Matrix
	 */
	Matrix.prototype.toString = function() {
		var i = 0;
		var j = 0;
		var chain_to_display = "";
		while (i < this.height) {
			j = 0;
			while (j < this.width) {
				chain_to_display += this.getScalar(i, j) + " ";
				j++;
			}
			chain_to_display += "\n";
			i++;
		}
		return chain_to_display;
	};

	return Matrix;
}();
