/**
 * @module Graphic
 * @namespace Graphic
 */


define(['./Shape', '../utils/Inheritance'], function(Shape, inherit) {
	var TW = TW || {};
	TW.Graphic = TW.Graphic || {};


	/**
	 * a Rect defined by it's `x`, `y`, `width` and `height` properties.
	 *
	 * @class Rect
	 * @extends Shape
	 * @constructor
	 * @param {Object} [params]
	 *  `params` is given to {{#crossLink "Graphic.Shape"}}{{/crossLink}} constructor.
	 */
	function Rect(params) {
		Shape.call(this, params);
	}

	inherit(Rect, Shape);

	/**
	 * This overridden draw method allow the Rect class to draw a rectangle on the context given in parameter.
	 *
	 * @method draw
	 * @param {CanvasRenderingContext2D} context
	 */
	Rect.prototype.draw = function(context) {
		/* global CanvasRenderingContext2D */
		if (!(context instanceof CanvasRenderingContext2D)) {
			throw new Error("Bad argument: context");
		}
		context.save();
		context.translate(this.x, this.y);
		this.matrix.transformContext(context);
		context.translate(-this.centerPoint.x, -this.centerPoint.y);
		if (this.mode === "WIRED") {
			context.strokeStyle = this.strokeColor;
			context.strokeRect(0, 0, this.width, this.height);
		} else {
			context.fillStyle = this.color;
			context.fillRect(0, 0, this.width, this.height);
		}
		context.restore();
	};

	TW.Graphic.Rect = Rect;
	return Rect;
});
