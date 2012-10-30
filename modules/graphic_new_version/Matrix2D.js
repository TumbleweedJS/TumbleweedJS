/**
 @module Math
 @namespace Math
 */

var TW = TW || {};
TW.Math = TW.Math || {};

TW.Math.Matrix2D = function() {

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
         Internal data that represent matrix.
         @property {Array} data
         */
        this.data = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

        /**
         Width size of matrix
         @property {Number} width
         */
        this.width = 3;

        /**
         Heigh size of matrix
         @property {Number} heigh
         */
        this.height = 3;
    }

    /**
     * Check if the current matrix match the identity.
     *
     * @method isIdentity
     * @return {Boolean} ret ret will match true if the current matrix is set to the identity, otherwise it returns false.
     */

    Matrix2D.prototype.isIdentity = function() {
        for (var i=0; i<3; i++) {
            if (this.data[i][i] !== 1.0) {
                return false;
            }
        }
        return true;
    };


    /**
     * Set the current matrix to the specified scalars (a, b, c, d, e, f). **Note that the parameters are given in column major order.**
     *
     * @method setTransform
     * @param a represent the top-left scalar in the matrix
     * @param b represent the middle-left scalar in the matrix
     * @param c represent the top-center scalar in the matrix
     * @param d represent the middle-middle scalar in the matrix
     * @param e represent the top-left scalar in the matrix
     * @param f represent the middle-right scalar in the matrix
     *
     * After a setTransform call, your matrix will look like :
     *     [a c e]
     *     [b d f]
     *     [0 0 1]
     */

    Matrix2D.prototype.setTransform = function(a, b, c, d, e, f) {
        this.data[0][0] = a;
        this.data[0][1] = b;
        this.data[1][0] = c;
        this.data[1][1] = d;
        this.data[2][0] = e;
        this.data[2][1] = f;
    };

    /**
     * Transform the current matrix by the scalars a,b,c,d,e,f. If C if our current matrix and B the matrix made by a,b,c,d,e,f scalars. Then, the transform will be :
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
        var matrix = new TW.Math.Matrix2D();
        matrix.setTransform(a, b, c, d, e, f);
        var result = this.multByMatrix(matrix);
        this.copyMatrix(result);
        return this;
    };

    /**
     * Get the current state of the matrix by a 2d array of floats.
     *
     * @method getData
     * @return {Array} data return the internal data array of the matrix (In column-major order). **Note**: It is just a copy, we do not allow the user to access original data's of the matrix.
     */

    Matrix2D.prototype.getData = function() {
        return [[this.data[0][0], this.data[0][1]],
            [this.data[1][0], this.data[1][1]],
            [this.data[2][0], this.data[2][1]]];
    };

    /**
     multiplies the current matrix by scale matrix

     @method scale
     @param {Number} x multiplier of abscissa
     @param {Number} y multiplier of ordinate
     @chainable
     */
    Matrix2D.prototype.scale = function(x, y) {
        var tmp_matrix = new TW.Math.Matrix2D();
        tmp_matrix.setTransform(x, 0, 0, y, 0, 0);
        var result = this.multiplyMatrix(tmp_matrix);
        this.copyMatrix(tmp_matrix);
        return this;
    };

    /**
     Apply a rotation to this matrix.

     @method rotate
     @param {Number} angle in degrees
     @chainable
     */
    Matrix2D.prototype.rotate = function(angle) {
        var tmp_matrix = new TW.Math.Matrix2D();
        var rad_angle = angle / 180 * Math.PI;
        tmp_matrix.setTransform(Math.cos(rad_angle), Math.sin(rad_angle),
            -Math.sin(rad_angle), Math.cos(rad_angle),
            0, 0);
        var result = this.multByMatrix(tmp_matrix);
        this.copyMatrix(tmp_matrix);
        return this;
    };

    /**
     Apply a translation to this matrix.

     @method translate
     @param {Number} x translation in abscissa
     @param {Number} y translation in ordinate
     @chainable
     */
    Matrix2D.prototype.translate = function(x, y) {
        var tmp_matrix = new TW.Math.Matrix2D();
        tmp_matrix.setTransform(1, 0, 0, 1, x, y);
        var result = this.multiplyMatrix(tmp_matrix);
        this.copyMatrix(tmp_matrix);
        return this;
    };

    /**
     *Transform the current matrix to apply a skew.
     *
     * @method skew
     * @param a the x skew factor
     * @param b the y skew factor
     * @return {Matrix} return the current matrix that have been transformed by the skew.
     * @chainable
     */
    Matrix2D.prototype.skew = function(a, b) {
        var tmp_matrix = new TW.Math.Matrix2D();
        tmp_matrix.setTransform(1, a, b, 1, 0, 0);
        var result = this.multiplyMatrix(tmp_matrix);
        this.copyMatrix(tmp_matrix);
        return this;
    };


    /**
     * Set the current matrix data to the matrix gived in parameter.
     *
     * @method copyMatrix
     * @param matrix
     * @return {Boolean} return true if matrix is a valid matrix object. Otherwise, false will be returned.
     */

    Matrix2D.prototype.copyMatrix = function(matrix) {
        if (matrix instanceof TW.Math.Matrix2D) {
            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    this.data[i][j] = matrix.data[i][j];
                }
            }
            return false;
        } else {
            return true;
        }
    };


    /**
     Compute the product of two matrix

     @method multiply
     @param {Matrix} matrix the matrix to multiplies
     @return the result if it's ok, null if an error occurred
     */
    Matrix2D.prototype.multiplyMatrix = function(matrix) {
        if (matrix instanceof TW.Math.Matrix2D) {
            var matrix_temp = new TW.Math.Matrix2D();
            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    matrix_temp.data[i][j] = this.data[i][0] * matrix.data[0][j] + this.data[i][1] * matrix.data[1][j] +
                        this.data[i][2] * matrix.data[2][j];
                }
            }
            return matrix_temp;
        } else {
            return null;
        }
    };

    /**
     Multiplies the current matrix by a vector 2d.
     @method multiplyVector
     @param {TW.Math.Vector2d} vector
     @return {TW.Math.Vector2d} if vector is a valid TW.Math.Vector2D instance, it will return vector transformed by the current matrix. Otherwise it will return null.
     */
    Matrix2D.prototype.multiplyVector = function(vector) {
        if (vector instanceof TW.Math.Vector2d) {
            var vector_result = new TW.Math.Vector2d(0, 0);
            vector_result.x = this.data[0][0] * vector.x + this.data[1][0] * vector.y + this.data[2][0] * vector.w;
            vector_result.y = this.data[0][1] * vector.x + this.data[1][1] * vector.y + this.data[2][1] * vector.w;
            vector_result.w = this.data[0][2] * vector.x + this.data[1][2] * vector.y + this.data[2][2] * vector.w;
            vector_result.x /= vector_result.w;
            vector_result.y /= vector_result.w;
            vector_result.w /= vector_result.w;
            return vector_result;
        } else {
            return null;
        }
    };

    /**
     give a data representation of Matrix

     @method toString
     @return {String} data representation of Matrix
     */
    Matrix2D.prototype.toString = function() {
        var i = 0;
        var j = 0;
        var chain_to_display = "";
        while (i < this.height) {
            j = 0;
            while (j < this.width) {
                chain_to_display += this.data[i][j] + " ";
                j++;
            }
            chain_to_display += "\n";
            i++;
        }
        return chain_to_display;
    };

    /**
     * This method returns an identity matrix.
     *
     * @method identity
     * @return {TW.Math.Matrix2D} return an identity matrix object
     */
    Matrix2D.prototype.identity = function() {
        var tmp = new TW.Math.Matrix2D();
        tmp.setTransform(1, 0, 0, 1, 0, 0);
        return tmp;
    };

    /**
     * This method returns a rotation matrix
     * **Note that the angle is expressed in degree**
     *
     * @method rotation
     * @param angle this parameter is a scalar expressed in degree who represent the angle of rotation of the matrix to generate.
     * @return {TW.Math.Matrix2D} return a rotation matrix object
     */
    Matrix2D.prototype.rotation = function(angle) {
        var tmp = new TW.Math.Matrix2D();
        var angle_rad = angle / Math.PI * 180.0;
        tmp.setTransform(Math.cos(angle_rad), Math.sin(angle_rad), -Math.sin(angle_rad), Math.cos(angle_rad), 0, 0);
        return tmp;
    };

    /**
     * This method return a translation matrix
     *
     * @method translation
     * @param x the x translation to integrate in the matrix
     * @param y the y translation to integrate in the matrix
     * @return {TW.Math.Matrix2D}
     */
    Matrix2D.prototype.translation = function(x, y) {
        var tmp = new TW.Math.Matrix2D();
        tmp.setTransform(1,0, 0, 1, x, y);
        return tmp;
    };

    /**
     * This method return a scale matrix
     *
     * @method scale
     * @param x the abscissa scale factor to integrate in the matrix
     * @param y the ordinate scale factor to integrate in the matrix
     * @return {TW.Math.Matrix2D}
     */
    Matrix2D.prototype.scale = function(x, y) {
        var tmp = new TW.Math.Matrix2D();
        tmp.setTransform(x,0, 0, y, 0, 0);
        return tmp;
    };

    /**
     * This method return a skew matrix
     *
     * @method skew
     * @param a the factor of skew on the y axis
     * @param b the factor of skew on the x axis
     * @return {TW.Math.Matrix2D}
     */
    Matrix2D.prototype.skew = function(a, b) {
        var tmp = new TW.Math.Matrix2D();
        tmp.setTransform(1,a, b, 1, 0, 0);
        return tmp;
    }
    return Matrix2D;
}();
