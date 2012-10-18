/**
 * @module Graphic
 * @namespace HUDElement
 */

var TW = TW || {};
TW.HUDElement = TW.HUDElement || {};

TW.Graphic.HUDElement = function() {
	HUDElement.prototype = new TW.Graphic.Sprite(0, 0, 0, 0, "undefined");

	/**
	 HUDElement is a class that allow you to define a HUD object who can organize HUDElements on it and then add it to a View object by the pushHUD method and then draw it by calling the method draw of the View object.


	 @class HUDElement
	 @constructor
	 @param {Integer} x the x coordinate of the HUDElement
	 @param {Integer} y the y coordinate of the HUDElement
	 @param {Integer} w the width of the HUDElement
	 @param {Integer} h the height of the HUDElement
	 @param {ImageRect} img_rect the image rect of the picture to use
	 */
	function HUDElement(x, y, w, h, img_rect) {
		/**
		 The x coordinate of the HUD

		 @property {Integer} x
		 */
		this.x = x;
		/**
		 The y coordinate of the HUD

		 @property {Integer} y
		 */
		this.y = y;
		/**
		 The width of the HUD

		 @property {Integer} width
		 */
		this.width = w;
		/**
		 The height of the HUD

		 @property {Integer} height
		 */
		this.height = h;
		/**
		 The left margin of the HUD

		 @property {Integer} left
		 */
		this.left = null;
		/**
		 The right margin of the HUD

		 @property {Integer} right
		 */
		this.right = null;
		/**
		 The bottom margin of the HUD

		 @property {Integer} bottom
		 */
		this.bottom = null;
		/**
		 The top margin of the HUD

		 @property {Integer} top
		 */
		this.top = null;
		/**
		 The position mode of the HUD, this property can only take two values : "absolute" and "relative", if the property is setted with another value, then, "absolute" value will be the default value.

		 @property {string} position
		 */
		this.position = "absolute";
		this.imgRect = img_rect;
	}

	/**
	 This method allow you to draw the HUDElement on a graphical context.

	 @method draw
	 @param {CanvasRenderingContext2D} context the canvas' graphical context to draw on.
	 */
	HUDElement.prototype.draw = function(context) {
		context.save();
		context.globalAlpha = this.alpha;
		context.drawImage(this.imgRect.getImage(), this.imgRect.getX(), this.imgRect.getY(), this.imgRect.getWidth(),
		                  this.imgRect.getHeight(), 0, 0, this.width, this.height);
		context.restore();
	};

	/**
	 This method allow you to set the image rect of the HUDElement

	 @method setImageRect
	 @param {ImageRect} imgRect the image rect to apply to the current object.
	 @return {boolean} returns true if the setImageRect method success, otherwise it returns false.
	 */
	HUDElement.prototype.setImageRect = function(imgRect) {
		if (!imgRect) {
			return false;
		}
		this.imgRect = imgRect;
		return true;
	};

	HUDElement.prototype.constructor = HUDElement;
	return HUDElement;
}();