/**
 * @module Graphic
 * @namespace Graphic
 */

var TW = TW || {};
define(['./Layer', '../Utils/inherit', '../Utils/Polyfills'], function(Layer, inherit) {

	TW.Graphic = TW.Graphic || {};


	/**
	 * This class represent a window associated to a canvas element.
	 * It's the first class used in Graphic module, wrapping all graphic objects.
	 *
	 *
	 *     //From an existing canvas
	 *     var win = new Window(document.getElementById('myCanvas'));
	 *     win.draw();
	 *
	 *     //Creating a new canvas tag
	 *     var win = new Window();
	 *     document.body.appendChild(win.canvas);
	 *     win.draw();
	 *
	 * @class Window
	 * @extends Graphic.Layer
	 * @constructor
	 * @param {HTMLCanvasElement} [canvas] main canvas for the window. by default, a new canvas is created.
	 */
	function Window(canvas) {
		/**
		 * The HTML canvas element.
		 *
		 * By default, a new canvas is created (and can be displayed to screen).
		 *
		 * @property {HTMLCanvasElement} canvas
		 * @readonly
		 */
		this.canvas = canvas || document.createElement('canvas');
		Layer.call(this, {
			localContext: this.canvas.getContext("2d"),
			width:       this.canvas.width,
			height:      this.canvas.height
		});
	}

	inherit(Window, Layer);

	/**
	 * Draw all graphic elements on the associated canvas.
	 *
	 * @method draw
	 */
	Window.prototype.draw = function() {
		this.localContext.save();
		this.camera.prepare(this.localContext);
		this.spatialContainer.applyAll(function(child) {
			child.draw(this.localContext);
		}.bind(this));
		this.localContext.restore();
		this._needToRedraw = false;
	};

	TW.Graphic.Window = Window;
	return Window;
});
