/**
 @module Graphic
 @namespace Graphic
 */

var TW = TW || {};

(function(TW) {

    if (typeof window.define === "function" && window.define.amd) {
        window.define([], initWrap(init));
    } else {
        initWrap(init);
    }

    function initWrap(f) {
        TW.Graphic = TW.Graphic ||  {};
        TW.Graphic.Circle = f();
        return TW.Graphic.Circle;
    }

    function init() {

        /**
         * This class extends the Shape class. when you create a Circle object like `var myCircle = new TW.Graphic.Circle();`
         *  the default radius of the object is 50pixels.
         *
         * @class Circle
         * @extends Shape
         * @constructor
         */
        function Circle(params) {
            TW.Graphic.Shape.call(this, params);
			this.radius = params.radius ? params.radius : 50;
        }

        TW.Utils.inherit(Circle, TW.Graphic.Shape);

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
				this._matrix.transformContext(context);
                context.beginPath();
                context.arc(this.x, this.y, this.radius, Math.PI * 2, 0, true);
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

        return Circle;
    }
} (TW));