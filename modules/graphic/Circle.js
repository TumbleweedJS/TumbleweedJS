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
     * This class extends the Shape class. When you create a Circle object
     * like `var myCircle = new TW.Graphic.Circle();`
     * the default radius of the object is 50pixels.
     *
     * @class Circle
     * @extends Shape
     * @constructor
     */
    function Circle(params) {
        TW.Graphic.Shape.call(this, params);
        this.radius = params.radius ? params.radius : 50;
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
            context.arc(0, 0, this.radius, Math.PI * 2, 0, true);
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