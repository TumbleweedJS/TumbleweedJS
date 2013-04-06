/**
 * @module Graphic
 * @namespace Graphic
 */

var TW = TW || {};
define(['../Math/Matrix2D'], function(Matrix2D) {

	TW.Graphic = TW.Graphic || {};


	/**
	 * The Camera class allow you to create a camera who has the purpose to simulate a camera on some layers.
	 * Each {{#crossLink "Graphic.Layer" }}Layer{{/crossLink}} or {{#crossLink "Graphic.Window" }}Window{{/crossLink}}
	 * contain a camera for moving te point of view displayed.
	 *
	 * ### Manipulate the camera
	 *
	 * The movement of the camera is based on an internal matrix, representing the point of view
	 * of the camera.
	 * This class provide an useful way to moving in the space without using directly matrices.
	 * All manipulation methods matrix provided are applied in a fixed order:
	 *
	 *  - translation
	 *  - rotation
	 *  - skew
	 *  - scale
	 *
	 * the aim is to use each type of transformation separately, regardless of the order of method calls.
	 *
	 *
	 * It's also possible to directly use the matrix methods, but both methods are not compatible,
	 * because calling a method from the camera will overwrite the matrix.<br />
	 * __If you choose to directly manipulate the matrix, be careful to not use matrix transformations method
	 * provided by the Camera class.__
	 *
	 * ### Extending the class
	 *
	 * The Camera class provide only basic features and is destined to be extended.
	 * The two important methods are `prepare` and `update`
	 *
	 *  - `prepare` is called for preparing the graphic rendering (just applying matrix by default).<br />
	 *      {{#crossLink "Graphic.Camera/prepare" }}More information here{{/crossLink}}
	 *  - `update` is an optional method (and is not provided in this class) called regularly,
	 *  useful for adding a dynamic behavior.<br />
	 * Note that you can take advantage of Javascript by adding directly an `update` method on the Camera instance.
	 *
	 * @class Camera
	 * @constructor
	 */
	function Camera() {
		/**
		 * matrix used for define the view.
		 *
		 * Note that modify it don't automatically refresh the associated layer.
		 * You should refresh the Layer after this operation.
		 *
		 * Directly modifing the matrix is not compatible with other matrix Camera's method (`translate`, `rotate`,
		 * `skew` or `scale`).
		 * Calling one of these method will recreate the matrix and erasing your matrix.
		 * For applying transformations, you should modify directly the matrix.
		 *
		 * @property {Matrix2D} matrix
		 */
		this.matrix = new Matrix2D();

		this._translation = {x: 0, y: 0 };
		this._rotation = 0;
		this._scale = {x: 1, y: 1 };
		this._skew = {a: 0, b: 0 };
	}

	/**
	 * prepare is called before each draw on the canvas.
	 * The canvas 2D context must be completely reset.
	 *
	 * By default, context matrix are multiplied by internal matrix.
	 * save and restore operations are done by the caller.
	 *
	 * @method prepare
	 * @param {CanvasRenderingContext2D} context The canvas context which will be used to draw.
	 */
	Camera.prototype.prepare = function(context) {
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);
		this.matrix.transformContext(context);
	};

	/**
	 * Apply a translation to the camera.
	 *
	 * @method translate
	 * @chainable
	 * @param x
	 * @param y
	 * @return {Camera}
	 */
	Camera.prototype.translate = function(x, y) {
		this._translation = {x: x, y: y};
		this._updateMatrix();
		return this;
	};

	/**
	 * Apply a rotation to the camera.
	 *
	 * @method rotate
	 * @chainable
	 * @param {Number} angle rotation angle in degrees.
	 * @return {Camera}
	 */
	Camera.prototype.rotate = function(angle) {
		this._rotation = angle;
		this._updateMatrix();
		return this;
	};
	/**
	 * Apply a scale transformation to the camera.
	 *
	 * @method scale
	 * @chainable
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Camera}
	 */
	Camera.prototype.scale = function(x, y) {
		this._scale = {x: x, y: y };
		this._updateMatrix();
		return this;
	};

	/**
	 * Apply a skew transformation to the camera.
	 *
	 * @method skew
	 * @chainable
	 * @param {Number} a
	 * @param {Number} b
	 * @return {Camera}
	 */
	Camera.prototype.skew = function(a, b) {
		this._skew = {a: a, b: b};
		this._updateMatrix();
		return this;
	};

	/**
	 * Update the matrix after a transformation.
	 * @method _updateMatrix
	 * @protected
	 */
	Camera.prototype._updateMatrix = function() {
		this.matrix.identity()
			.translate(- this._translation.x, - this._translation.y)
			.rotate(this._rotation)
			.skew(this._skew.a, this._skew.b)
			.scale(this._scale.x, this._scale.y);
	};

	TW.Graphic.Camera = Camera;
	return Camera;
});
