/**
 * @module Graphic
 * @namespace Graphic
 */

var TW = TW || {};
define(['./Shape', '../Utils/inherit', '../Utils/copyParam'], function(Shape, inherit, copyParam) {

	TW.Graphic = TW.Graphic || {};


	/**
	 * This class extends the Shape class.
	 *
	 * When you create a Circle object like `var myCircle = new TW.Graphic.Circle();`
	 * the default radius of the object is 50pixels.
	 *
	 * **Note:** the `[x, y]` coordinates corresponds to the top left corner of the square which includes the circle.
	 * If you want to draw to circle from its origin, you should consider moving its centerPoint:
	 *
	 *     circle.setAttr({
	 *          centerPoint: {
	 *              x: radius,
	 *              y: radius
	 *          }
	 *      });
	 *
	 * @class Circle
	 * @extends Graphic.Shape
	 * @constructor
	 * @param {Object} [params] set of properties given to Circle.
	 *   `params` is given to {{#crossLink "Graphic.Shape"}}Shape{{/crossLink}} constructor.
	 *   @param {Number} [params.radius=50] radius of the circle.
	 */
	function Circle(params) {
		Shape.call(this, params);
		copyParam(this, params, {
			/**
			 *
			 * **Note: this property should be modified only with `setAttr`**
			 *
			 * @property {Number} radius
			 */
			radius: 50
		});
	}

	inherit(Circle, Shape);

	/**
	 * This overridden draw method allow the Circle class to draw a circle on the context given in parameter.
	 *
	 * @method draw
	 * @param {CanvasRenderingContext2D} context
	 */
	Circle.prototype.draw = function(context) {
		/* global CanvasRenderingContext2D */
		if (!(context instanceof CanvasRenderingContext2D)) {
			throw new Error("Bad argument: context");
		}
		context.save();
		context.translate(this.x, this.y);
		this.matrix.transformContext(context);
		context.translate(-this.centerPoint.x, -this.centerPoint.y);
		context.beginPath();
		context.arc(this.radius, this.radius, this.radius, Math.PI * 2, 0, true);
		if (this.mode === "WIRED") {
			context.strokeStyle = this.strokeColor;
			context.stroke();
		} else {
			context.fillStyle = this.color;
			context.fill();
		}
		context.closePath();
		context.restore();
	};

	TW.Graphic.Circle = Circle;
	return Circle;
});
