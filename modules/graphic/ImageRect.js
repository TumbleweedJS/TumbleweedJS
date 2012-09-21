/**
 @module Graphic
 @namespace Graphic
 */
/*jshint smarttabs: true */
var TW = TW || {};
TW.Graphic = TW.Graphic || {};

TW.Graphic.ImageRect = function() {

	/**
	 The ImageRect class allow you to specify a subimage into the the img object by specifying a square.
	 @class ImageRect
	 @constructor
	 @param {Image} img the Image object of the ImageRect object
	 @param {Integer} x the x coordinate of the ImageRect object
	 @param {Integer} y the y coordinate of the ImageRect object
	 @param {Integer} w the w coordinate of the ImageRect object
	 @param {Integer} h the h coordinate of the ImageRect object
	 */
	function ImageRect(img, x, y, w, h) {
		this.image = img;
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
	}

	/**
	 The getX method allow you to get the x coordinate of the ImageRect.
	 @method getX
	 @return {Integer} returns the x coordinate of the ImageRect
	 */
	ImageRect.prototype.getX = function() {
		return this.x;
	};

	/**
	 The getY method allow you to get the y coordinate of the ImageRect.
	 @method getY
	 @return {Integer} returns the y coordinate of the ImageRect
	 */
	ImageRect.prototype.getY = function() {
		return this.y;
	};

	/**
	 The setX method allow you to set the x coordinate of the ImageRect.
	 @method setX
	 @param {Integer} x the x coordinate of the ImageRect
	 */
	ImageRect.prototype.setX = function(x) {
		this.x = x;
	};

	/**
	 The setY method allow you to set the y coordinate of the ImageRect.
	 @method setY
	 @param {Integer} y the y coordinate of the ImageRect
	 */
	ImageRect.prototype.setY = function(y) {
		this.y = y;
	};

	/**
	 The getWidth method allow you to get the width of the ImageRect.
	 @method getWidth
	 @return {Integer} returns the width of the ImageRect
	 */
	ImageRect.prototype.getWidth = function() {
		return this.width;
	};

	/**
	 The getHeight method allow you to get the height of the ImageRect.
	 @method getHeight
	 @return {Integer} returns the height of the ImageRect
	 */
	ImageRect.prototype.getHeight = function() {
		return this.height;
	};

	/**
	 The setWidth method allow you to set the width of the ImageRect
	 @method setWidth
	 @param {Integer} width the width of the ImageRect
	 */
	ImageRect.prototype.setWidth = function(width) {
		this.width = width;
	};

	/**
	 The setHeigt method allow you to set the height of the ImageRect
	 @method setHeight
	 @param {Integer} height the height of the ImageRect
	 */
	ImageRect.prototype.setHeight = function(height) {
		this.height = height;
	};

	/**
	 The setImage method allow you to set the image of the ImageRect.
	 @method setImage
	 @param {Image} image the new image to set.
	 */
	ImageRect.prototype.setImage = function(image) {
		this.img = image;
	};

	/**
	 The getImage method allow you to get the image of the ImageRect.
	 @method getImage
	 @return {Image} returns the image used by the current ImageRect object.
	 */
	ImageRect.prototype.getImage = function() {
		return this.image;
	};

	return ImageRect;
}();
