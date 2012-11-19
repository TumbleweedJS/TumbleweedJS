/**
 @module Graphic
 @namespace Graphic
 */

var TW = TW || {};

(function(TW) {

    if (typeof window.define === "function" && window.define.amd) {
        define(['./GraphicObject', '../utils/Inheritance'], initWrap(init));
    } else {
        initWrap(init);
    }

    function initWrap(f) {
        TW.Graphic = TW.Graphic ||  {};
        TW.Graphic.Shape = f();
        return TW.Graphic.Shape;
    }

    function init() {
        /**
         * The Shape class is an abstract object who provides tool to draw some primitive Shapes.
         * You should not use this class cause it is an abstract class who have the purpose to be extended
         * to implements basic shape drawing.
         * Note that the Shape class extends the GraphicObject class.
         *
         * @class Shape
         * @extends GraphicObject
         * @constructor
         */
        function Shape(params) {
            TW.Graphic.GraphicObject.call(this, params);
            this.color = params.color ? params.color : "black";
            this.strokeColor = params.strokeColor ? params.strokeColor : "black";
            this.mode = params.mode ? params.mode : "WIRED";
        }

        TW.Utils.inherit(Shape, TW.Graphic.GraphicObject);

        /**
         * This method allow you to set the color of the current Shape.
         *
         * @method setFillColor
         * @param {String} color this parameter represent the color to assign to the fill mode.
         *  For example if you want to set it black, you should do `myShape.setFillColor("black");`
         */
        Shape.prototype.setFillColor = function(color) {
            this.color = color;
        };

        /**
         * This method allow you to change the draw mode of the current shape.
         * Two modes are available "WIRED" and "FILLED".
         *
         * @method setMode
         * @param {String} type this parameter represent the draw style. type can be set to "WIRED" or "FILLED".
         */
        Shape.prototype.setMode = function(type) {
            if (type === "WIRED" || type === "FILLED") {
                this.mode = type;
                return true;
            } else {
                return false;
            }
        };

        /**
         * This method allow you to set the stroke color of the current shape.
         *
         * @method setStrokeColor
         * @param {String} color this parameter represent the color to apply to the stroke mode.
         *  For example to set the stroke color to black you should used `myShape.setStrokeColor("black");`
         */
        Shape.prototype.setStrokeColor = function(color) {
            this.strokeColor = color;
        };

        return Shape;
    }

}(TW));
