/**
 @module Circle
 @namespace Graphic
 */

var TW = TW || {};
TW.Graphic = TW.Graphic || {};

/**
 * This class extends the Shape class. when you create a Circle object like `var myCircle = new TW.Graphic.Circle();`
 * the default radius of the object is 50pixels.
 *
 * @type {Circle}
 */
TW.Graphic.Circle = function() {
	function Circle() {
		TW.Graphic.Shape.call(this);
		this.radius = 50;
	}

	TW.Utils.inherit(Circle, TW.Graphic.Shape);

/**
 * This overidded draw method allow the Circle class to draw a circle on the context gived in parameter.
 *
 * @method draw
 * @param context if the context object is not a valid object the method will returns false, otherwise it
 * will returns true.
 */
	Circle.prototype.draw = function(context) {
		if (context) {
			//TODO apply the matrix transformations on the context before drawing the circle
			context.save();
			context.beginPath();
			context.strokeStyle = this.strokeColor;
			context.arc(this.x, this.y, this.radius, 0, Math.PI * 2.0, true);
			if (this.mode === "WIRED") {
				context.stroke();
			} else {
				context.fill();
			}
			context.closePath();
			context.restore();
			return true;
		} else {
			return false;
		}
	};

	return Circle;
}();