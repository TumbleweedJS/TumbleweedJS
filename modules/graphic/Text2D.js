/**
 @module Graphic
 @namespace Graphic
 */
/*jshint smarttabs: true */
var TW = TW || {};
TW.Graphic = TW.Graphic || {};

TW.Graphic.Text2D = function() {
	/**
	 Text2D is a class that allow you to display text on the canvas context.
	 For example, if yo want to create a Text2D object who display the text "Hello World" at the [50;60] position, with a size of 15 in calibri font, then you should do :
	 new Text2D(50, 60, 'Calibri', 'Hello World');
	 @class Text2D
	 @constructor
	 @param {Integer} x the x parameter represent the x coordinate of the text on the canvas context
	 @param {Integer} y the y parameter represent the y coordinate of the text on the canvas context
	 @param {Integer} size the size of the text
	 @param {String} font_name the name of the font to load, for example, if you want to use the Calibri font, then, the font parameter should be equals to 'Calibri'
	 @param {String} text the text to display on the canvas context.
	 */
	function Text2D(x, y, size, font_name, text) {
		this.x = x;
		this.y = y;
		this.text = text;
		this.size = size + 'pt';
		this.fontName = font_name;
		this.redColor = 0;
		this.greenColor = 0;
		this.blueColor = 0;
		this.alpha = 1.0;
		this.x_centerPoint = 0;
		this.y_centerPoint = 0;
		this.scaleX = 1.0;
		this.scaleY = 1.0;
		this.rotation = 0.0;
		this.fontStyle = ""; //"" = normal, "italic" = italic, "bold" = bold
	}

	/**
	 The getWidth method allow you to get the width of the text
	 currently this method is not working because the metrics functions of HTML5 on the canvas to measure text require an access to the context.
	 @method getWidth
	 @return {Integer} currently this function always return 0.
	 */
	Text2D.prototype.getWidth = function() {
		//var metrics = ctx.measureText(this.text);
		//return metrics.width;
		return 0;
	};

	/**
	 The getHeight method allow you to get the height of the text
	 currently this method is not working because the metrics functions of HTML5 on the canvas to measure text require an access to the context.
	 @method getHeight
	 @return {Integer} currently this function always return 0.
	 */
	Text2D.prototype.getHeight = function() {
		//var metrics = ctx.measureText(this.text);
		return 0;
	};

	/**
	 The setCenterPoint method allow you to set the point of rotation of the test
	 @method setCenterPoint
	 @param {Integer} x coordinate of the center point of the text, note that x and y values are expressed in local orthonormal system of the Text2D
	 @param {Integer} y coordinate of the center point of the text, note that y and x values are expressed in local orthonormal system of the Text2D
	 */
	Text2D.prototype.setCenterPoint = function(x, y) {
		this.x_centerPoint = x;
		this.y_centerPoint = y;
	};

	/**
	 The getX method allow you to get the x coordinate of the Text2D object
	 @method getX
	 @return {Integer} the x coordinate of the Text2D
	 */
	Text2D.prototype.getX = function() {
		return this.x;
	};

	/**
	 The getY method allow you to get the y coordinate of the Text2D object
	 @method getY
	 @return {Integer} the xy coordinate of the Text2D
	 */
	Text2D.prototype.getY = function() {
		return this.y;
	};

	/**The setScale method allow you to set the scale of the Text2D
	 @method setScale
	 @param {Number} x the scale factor of the x axis
	 @param {Number} y the scale factor of the y axis
	 */
	Text2D.prototype.setScale = function(x, y) {
		this.scaleX = x;
		this.scaleY = y;
	};

	/**The setRotation method allow you to set the angle of rotation of the Text2D object
	 @method setRotation
	 @param {Number} rot degree value of the angle of rotation
	 */
	Text2D.prototype.setRotation = function(rot) {
		this.rotation = rot / 180.0 * Math.PI;
	};

	/**The setRVBColor method allow you to set the color of the Text2D object
	 @method setRVBColor
	 @param {Integer} red value, must be beetween 0 and 255
	 @param {Integer} green value, must be beetween 0 and 255
	 @param {Integer} blue value, must be beetween 0 and 255
	 */
	Text2D.prototype.setRVBColor = function(red, green, blue) {
		this.redColor = red;
		this.greenColor = green;
		this.blueColor = blue;
	};

	/**
	 The setAlpha method allow you to set the transparency value of the Text2D object
	 @method setAlpha
	 @param {float} alpha parameter must be beetween 0.0 and 1.0
	 */
	Text2D.prototype.setAlpha = function(alpha) {
		if (alpha > 1.0) {
			this.alpha = 1.0;
			return;
		}
		if (alpha < 0.0) {
			this.alpha = 0.0;
			return;
		}
		this.alpha = alpha;
	};

	/**
	 The getAlpha method allow you to get the transparency value of the Text2D object
	 @method getAlpha
	 @return {Number} return the transparency value of the Text2D, value beetween 0.0 and 1.0
	 */
	Text2D.prototype.getAlpha = function() {
		return this.alpha;
	};

	/**
	 The setFontStyle method allow you to set the font style of the Text2D object
	 @method setFontStyle
	 @param {string} fontStyle style of the font, there's 3 font styles, 'italic', 'bold' and 'normal', if the fontStyle parameter doesn't match any of these values, then the setFontStyle will have no effect.
	 */
	Text2D.prototype.setFontStyle = function(fontStyle) {
		if (fontStyle == "italic" || fontStyle == "bold" || fontStyle == "normal") {
			this.fontStyle = fontStyle;
		}
	};

	/**
	 The setSize method allow you to set the size of the Text2D object.
	 @method setSize
	 @param {Integer} size of the font contained by the Text2D object, the size are the sames in the word processing softwares.
	 @return {boolean} return true if the size parameter value is valid, return false if the size parameter is not valid.
	 */
	Text2D.prototype.setSize = function(size) {
		if (size > 0) {
			this.size = size + "pt";
			return true;
		} else {
			return false;
		}
	};

	/**
	 The setText method allow you to set a text to display to the Text2D object.
	 @method setText
	 @param {string} text to display
	 */
	Text2D.prototype.setText = function(text) {
		this.text = text;
	};

	/**
	 The setFont method allow you to set a font to the Text2D object
	 @method setFont
	 @param {string} font value of the font to load, for example, if you want to load the Calibri font, you should do this => my_text2d_object.setFont('calibri');
	 @return {boolean} always return true.
	 */
	Text2D.prototype.setFont = function(font) {
		this.fontName = font;
		return true;
	};

	/**
	 The draw method allow you to draw the Text2D on the canvas
	 @method draw
	 @param {CanvasRenderingContext2D} context on which draw method will draw.
	 @return {boolean} always return true
	 */
	Text2D.prototype.draw = function(context) {
		context.save();
		var saveFont = context.font;
		var saveFillStyle = context.fillStyle;
		context.fillStyle = "rgb(" + this.redColor + "," + this.greenColor + "," + this.blueColor + ")";
		context.font = this.fontStyle + " " + this.size + " " + this.fontName;
		context.globalAlpha = this.alpha;
		context.transform(1, 0, 0, 1, this.x + this.x_centerPoint, this.y + this.y_centerPoint);
		context.transform(this.scaleX, 0, 0, this.scaleY, 0, 0);
		context.transform(Math.cos(this.rotation), -Math.sin(this.rotation), Math.sin(this.rotation),
		                  Math.cos(this.rotation), 0, 0);
		context.transform(1, 0, 0, 1, this.x_centerPoint * -1, this.y_centerPoint * -1);
		context.fillText(this.text, 0, 0);
		context.restore();
		return true;
	};

	return Text2D;
}();