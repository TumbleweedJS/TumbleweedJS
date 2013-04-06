/**
 * @module Graphic
 * @namespace Graphic
 */

var TW = TW || {};
define(['../Graphic/Camera', '../Utils/inherit'], function(Camera, inherit) {

	TW.Graphic = TW.Graphic || {};


	/**
	 * the TrackingCamera is a {{#crossLink "Graphic.Camera"}}Camera{{/crossLink}} which can follow a target.
	 *
	 * When the target near the edges of the camera, the camera move for always keep the target in the field of view.
	 * This behaviour can be enabled or disabled whith `lock`.
	 *
	 * The `margin` property provides a way to configure the  motion field of the player.
	 * If we set the margin.x to 10, the camera don't let the player to approach whitin 10px.
	 *
	 * @class TrackingCamera
	 * @extends Graphic.Camera
	 * @constructor
	 * @param {GraphicObject} target
	 */
	function TrackingCamera(target) {

		/**
		 * target pointed by the camera
		 *
		 * @property {GraphicObject} target
		 */
		this.target = target;

		/**
		 * Lock or not the camera on the target.
		 * 
		 * @property {Boolean} locked
		 * @default true
		 */
		this.locked = true;

		/**
		 * inner screen margin
		 *
		 * @property {Object} margin
		 * @property {Number} margin.x
		 * @property {Number} margin.y
		 */
		this.margin = {
			x: 0,
			y: 0
		};

		Camera.call(this);
	}

	inherit(TrackingCamera, Camera);

	/**
	 * Update the camera position.
	 * If locked and the target go out of camera,
	 * the camera follow the target.
	 *
	 * @method draw
	 */
	TrackingCamera.prototype.prepare = function(context) {
		if (this.locked) {
			var pos = this._translation;
			if (this.target.x < pos.x + this.margin.x) {
				pos.x = this.target.x - this.margin.x;
				this._updateMatrix();
			}
			if (this.target.y < pos.y + this.margin.y) {
				pos.y = this.target.y - this.margin.y;
				this._updateMatrix();
			}
			if (this.target.x + this.target.width > pos.x + context.canvas.width - this.margin.x) {
				pos.x = this.target.x + this.target.width - context.canvas.width + this.margin.x;
				this._updateMatrix();
			}
			if (this.target.y + this.target.height > pos.y + context.canvas.height - this.margin.y) {
				pos.y = this.target.y + this.target.height - context.canvas.height + this.margin.y;
				this._updateMatrix();
			}
		}
		Camera.prototype.prepare.call(this, context);
	};

	TW.Graphic.TrackingCamera = TrackingCamera;
	return TrackingCamera;
});
