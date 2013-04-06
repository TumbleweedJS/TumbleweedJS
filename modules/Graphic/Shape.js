/**
 * @module Graphic
 * @namespace Graphic
 */

var TW = TW || {};
define(['./GraphicObject', '../Utils/Inheritance'], function(GraphicObject, inherit) {

	TW.Graphic = TW.Graphic || {};


	/**
	 * The Shape class is an abstract object who provides tool to draw some primitive Shapes.
	 * You should not use this class cause it is an abstract class who have the purpose to be extended
	 * to implements basic shape drawing.
	 * Note that the Shape class extends the GraphicObject class.
	 *
	 *
	 * ## color and Stroke Color
	 *
	 * Both `color` and `strokeColor` support many format:
	 *
	 *      myShape.setAttr({ color: "black" });
	 *      myShape.setAttr({ color: "#FF0000" });           // hexadecimal notation
	 *      myShape.setAttr({ color: "rgb(0, 255, 0)" });    // decimal RGB notation
	 *
	 * It's possible to get more complex effets using CanvasGradient or CanvasPattern objects. For more details, see
	 * [the canvas 2D context specs](http://www.w3.org/html/wg/drafts/2dcontext/html5_canvas/#dom-context-2d-fillstyle).
	 *
	 * @class Shape
	 * @extends Graphic.GraphicObject
	 * @constructor
	 * @param {Object} [params] set of parameters for configure this objects.
	 *   *params* is given to {{#crossLink "Graphic.GraphicObject"}}GraphicObject{{/crossLink}} constructor.
	 *   @param [params.color="black"] content color (in filled mode)
	 *   @param [params.strokeColor="black"] stroke color (in wired mode)
	 *   @param {"WIRED"|"FILLED"} [params.mode="WIRED"] display mode for shape.
	 */
	function Shape(params) {
		GraphicObject.call(this, params);
		TW.Utils.copyParam(this, params, {
			/**
			 * fill color to draw this object.
			 *
			 * **Note: should be modified with `setAttr`**
			 *
			 * @property {*} color
			 */
			color:       "black",

			/**
			 * color to apply to the stroke mode
			 *
			 * **Note: should be modified with `setAttr`**
			 *
			 * @property {*} strokeColor
			 */
			strokeColor: "black",

			/**
			 * the draw mode of the current shape.
			 * Two modes are available "WIRED" and "FILLED".
			 *
			 * **Note: should be modified with `setAttr`**
			 *
			 * @property {"WIRED"|"FILLED"} mode
			 */
			mode:        "WIRED"
		});
	}

	inherit(Shape, GraphicObject);

	TW.Graphic.Shape = Shape;
	return Shape;
});
