/**
 @module Graphic
 @namespace Graphic
 */

var TW = TW || {};

(function(TW) {

    TW.Graphic = TW.Graphic ||  {};
    TW.Graphic.Rect = Rect;

    if (typeof window.define === "function" && window.define.amd) {
        define(['./Shape', '../utils/Inheritance'], function() {
            TW.Utils.inherit(Rect, TW.Graphic.Shape);
            return Rect;
        });
    } else {
        TW.Utils.inherit(Rect, TW.Graphic.Shape);
    }

	/**
	 * @class Rect
	 * @extends Shape
	 * @param {Object} [params]
	 *   *params* is given to {{#crossLink "Graphic.Shape"}}{{/crossLink}} constructor.
	 * @constructor
	 */
    function Rect(params) {
        TW.Graphic.Shape.call(this, params);
    }

    Rect.prototype.draw = function(context) {
        if (context) {
            //TODO apply the matrix transformations on the context before drawing the circle
            context.save();
            context.translate(this.x, this.y);
            this.matrix.transformContext(context);
            context.translate(-this.xCenterPoint, -this.yCenterPoint);
            if (this.mode === "WIRED") {
                context.strokeStyle = this.strokeColor;
                context.strokeRect(0, 0, this.width, this.height);
            } else {
                context.fillStyle = this.color;
                context.fillRect(0, 0, this.width, this.height);
            }
            context.restore();
            return true;
        } else {
            return false;
        }
    };

})(TW);