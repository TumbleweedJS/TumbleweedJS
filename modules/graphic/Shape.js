/**
 @module Graphic
 @namespace Graphic
 */

var TW = TW || {};

(function(TW) {

    TW.Graphic = TW.Graphic ||  {};
    TW.Graphic.Shape = Shape;

    if (typeof window.define === "function" && window.define.amd) {
        define(['./GraphicObject', '../utils/Inheritance'], function() {
            TW.Utils.inherit(Shape, TW.Graphic.GraphicObject);
            return Shape;
        });
    } else {
        TW.Utils.inherit(Shape, TW.Graphic.GraphicObject);
    }

    /**
     * The Shape class is an abstract object who provides tool to draw some primitive Shapes.
     * You should not use this class cause it is an abstract class who have the purpose to be extended
     * to implements basic shape drawing.
     * Note that the Shape class extends the GraphicObject class.
     *
     * @class Shape
     * @extends GraphicObject
     * @constructor
     * @param {Object} [params] set of parameters for configure this objects.
     *   *params* is given to {{#crossLink "Graphic.GraphicObject"}}{{/crossLink}} constructor.
     *   @param [params.color="black"] content color (in filled mode)
     *   @param [params.strokeColor="black"] stroke color (in wired mode)
     *   @param {"WIRED"|"FILLED"} [params.mode="WIRED"] display mode for shape.
     */
    function Shape(params) {
        TW.Graphic.GraphicObject.call(this, params);
	    TW.Utils.copyParam(this, params, {
		    color:          "black",
		    strokeColor:    "black",
		    mode:           "WIRED"
	    });
    }

    /**
     * This method allow you to set the color of the current Shape.
     *
     * @method setFillColor
     * @param {String} color this parameter represent the color to assign to the fill mode.
     * @example
     *
     *      myShape.setFillColor("black");
     *      myShape.setFillCOlor("#FF0000");           // hexadecimal notation
     *      myShape.setFillCOlor("rgb(0, 255, 0)");    // decimal RGB notation
     *
     * It's possible to get more complex effets using CanvasGradient or CanvasPattern objects. For more details, see
     * [the canvas 2D context specs](http://www.w3.org/html/wg/drafts/2dcontext/html5_canvas/#dom-context-2d-fillstyle).
     *
     *
     */
    Shape.prototype.setFillColor = function(color) {
        this.color = color;
    };

    /**
     * This method allow you to change the draw mode of the current shape.
     * Two modes are available "WIRED" and "FILLED".
     *
     * @method setMode
     * @param {"WIRED"|"FILLED"} type this parameter represent the draw style.
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
     * @example
     *
     *      myShape.setStrokeColor("black");
     *      myShape.setStrokeColor("#FF0000");           // hexadecimal notation
     *      myShape.setStrokeColor("rgb(0, 255, 0)");    // decimal RGB notation
     *
     * It's possible to get more complex effets using CanvasGradient or CanvasPattern objects. For more details, see the
     * [canvas 2D context specs](http://www.w3.org/html/wg/drafts/2dcontext/html5_canvas/#dom-context-2d-strokestyle).

     */
    Shape.prototype.setStrokeColor = function(color) {
        this.strokeColor = color;
    };

}(TW));
