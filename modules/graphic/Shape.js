/**
 @module Shape
 @namespace Graphic
 */

var TW = TW || {};
TW.Graphic = TW.Graphic || {};


/**
 * The Shape class is an abstract object who provides tool to draw some primitive Shapes. You should not use this class
 * cause it is an abstract class who have the purpose to be extended to implements basic shape drawing.
 * Note that the Shape class extends the GraphicObject class.
 * @type {Shape}
 */

TW.Graphic.Shape = function() {
	function Shape() {
	TW.Graphic.GraphicObject.call(this);
	 this.color = "black";
	 this.strokeColor = "black";
	 this.mode = "WIRED";
	}

	TW.Utils.inherit(Shape, TW.Graphic.GraphicObject);

	return Shape;
}();