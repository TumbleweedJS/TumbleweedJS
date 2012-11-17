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
        TW.Graphic.Window = f();
        return TW.Graphic.Window;
    }


    function init() {
	
		/**
		 * This class represent a window associated to a canvas element.
		 * It's the first class used in Graphic module, wrapping all graphic objects.
		 * 
		 * @class Window
		 * @constructor
		 * @param {HTMLCanvasElement} [canvas] main canvas for the window\
		 */
		function Window(canvas) {			
			this._realCanvas = (canvas == undefined ? document.createElement('canvas') : canvas);
			TW.Graphic.Layer.call(this, {
				localCanvas: this._realCanvas.getContext("2d"),
				width:	canvas.width,
				height: canvas.height
				});
		}
		
		TW.Utils.inherit(Window, TW.Graphic.Layer);
	
		/**
		 * @method getCanvas
		 * @return {HTMLCanvasElement} associated canvas to the window, that can be added in DOM.
		 */
		Window.prototype.getCanvas = function() {
			return this._realCanvas;
		};
		
		/**
		 * @method setCanvas
		 * @param {HTMLCanvasElement} canvas a HTML canvas to associate to the window.
		 */
		Window.prototype.setCanvas = function(canvas) {
			this._realCanvas = canvas;
			this.width = canvas.width;
			this.height = canvas.height;
			this._callParentOnChange();
		}
		
		/**
		 * Draw all graphic elements on the associated canvas.
		 * 
		 * @method draw
		 */
		Window.prototype.draw = function() {
			if (this._needToRedraw === true) {
				this.localCanvas.save();
				this._camera.prepare(this.localCanvas);
				this.spatialContainer.applyAll(function(child) {
					child.draw(this.localCanvas);
				}.bind(this));
				this.localCanvas.restore();
				this._needToRedraw = false;
			}
		};
		
		return Window;
	}
	
}(TW));
