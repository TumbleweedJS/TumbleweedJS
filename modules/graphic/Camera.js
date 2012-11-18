/**
 @module Camera
 @namespace Graphic
 */

var TW = TW || {};
TW.Graphic = TW.Graphic || {};

/**
 * @type {Camera}
 */

TW.Graphic.Camera = function() {

	/**
	 * The Camera class allow you to create a camera who has the purpose to simulate a camera on some layers.
	 * @constructor
	 */
	function Camera() {
		this._matrix = TW.Graphic.Matrix2D();
	}

	/**
	 * This method allow you to get the internal matrix of the camera
	 *
	 * @return {TW.Graphic.Matrix2D}
	 */
	Camera.prototype.getMatrix = function() {
	 return this._matrix;
	};

	/**
	 * This method allow you to set the matrix
	 * @param matrix
	 * @return {Boolean}
	 */
	Camera.prototype.setMatrix = function(matrix) {
	 if (matrix) {
		 this._matrix = matrix;
		 return true;
	 }	else {
		 return false;
	 }
	};

	

	return Camera;
}();