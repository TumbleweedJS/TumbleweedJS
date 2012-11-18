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
        TW.Graphic.Shape = f();
        return TW.Graphic.Shape;
    }


    function init() {

        /**
         * The Shape class is an abstract object who provides tool to draw some primitive Shapes. You should not use this class
         * cause it is an abstract class who have the purpose to be extended to implements basic shape drawing.
         * Note that the Shape class extends the GraphicObject class.
         *
         * @class Shape
         * @extends {GraphicObject}
         * @constructor
         */
        function Shape() {
            TW.Graphic.GraphicObject.call(this);
            this.color = "black";
            this.strokeColor = "black";
            this.mode = "WIRED";
        }

        TW.Utils.inherit(Shape, TW.Graphic.GraphicObject);

        return Shape;

    }

}(TW));
