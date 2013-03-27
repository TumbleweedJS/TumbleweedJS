/**
 @module Graphic
 @namespace Graphic
 */

var TW = TW || {};

(function(TW) {

    TW.Graphic = TW.Graphic ||  {};
    TW.Graphic.Circle = Circle;

    if (typeof window.define === "function" && window.define.amd) {
        define(['./Shape', '../utils/Inheritance'], function() {
            TW.Utils.inherit(Circle, TW.Graphic.Shape);
            return Circle;
        });
    } else {
        TW.Utils.inherit(Circle, TW.Graphic.Shape);
    }

    /**
     * This class extends the Shape class.
     *
     * When you create a Circle object like `var myCircle = new TW.Graphic.Circle();`
     * the default radius of the object is 50pixels.
     *
     * **Note:** the `[x, y]` coordinates corresponds to the top left corner of the square which includes the circle.
     * If you want to draw to circle from its origin, you should consider moving its centerPoint:
     *
     *     circle.setCenterPoint(radius, radius);
     *
     * @class Circle
     * @extends Shape
     * @constructor
     * @param {Object} [params] set of properties given to Circle.
     *   `params` is given to {{#crossLink "Graphic.Shape"}}{{/crossLink}} constructor.
     *   @param {Number} [params.radius=50] radius of the circle.
     */
    function Circle(params) {
        TW.Graphic.Shape.call(this, params);
	    TW.Utils.copyParam(this, params, {
		    radius:          50
	    });
    }



    /**
     * This overridden draw method allow the Circle class to draw a circle on the context given in parameter.
     *
     * @method draw
     * @param context if the context object is not a valid object the method will returns false, otherwise it
     * will returns true.
     */
    Circle.prototype.draw = function(context) {
        if (context) {
            //TODO apply the matrix transformations on the context before drawing the circle
            context.save();
            context.translate(this.x, this.y);
            this.matrix.transformContext(context);
            context.translate(-this.xCenterPoint, -this.yCenterPoint);
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
            return true;
        } else {
            return false;
        }
    };

}(TW));