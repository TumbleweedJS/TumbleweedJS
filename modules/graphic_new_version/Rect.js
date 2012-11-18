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
        TW.Graphic.Rect = f();
        return TW.Graphic.Rect;
    }

    function init() {
	
		
        function Rect(param) {
            TW.Graphic.GraphicObject.call(this, param);
        }
		
		TW.Utils.inherit(Rect, TW.Graphic.Shape);

		Rect.prototype.draw = function(context) {
            if (context) {
                //TODO apply the matrix transformations on the context before drawing the circle
                context.save();
				this._matrix.transformContext(context);
                if (this.mode === "WIRED") {
					context.strokeStyle = this.strokeColor;
                    context.strokeRect(this.x, this.y, this.width, this.height);
                } else {
					context.fillStyle = this.color;
                    context.fillRect(this.x, this.y, this.width, this.height);
                }
                context.restore();
                return true;
            } else {
                return false;
            }
		};
		
		return Rect;
	}

})(TW);