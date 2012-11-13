/**
 @module Shape
 @namespace Graphic
 */

var TW = TW || {};
TW.Graphic = TW.Graphic || {};

/**
 * The Sprite class provide methods to draw sprites on a context. the aim of the sprites object is to be added to a
 * Layer or to be use directly with a graphical context by invoking the draw method of the Sprite. like `var mySprite = new TW.Graphic.Sprite(); mySprite.draw(canvasContext);`
 * @type {Sprite}
 */
TW.Graphic.Sprite = function() {
	function Sprite() {
		this.image = null;
		this.imageRect = null;
		TW.Graphic.GraphicObject.call(this);
	}

	TW.Utils.inherit(Sprite, TW.Graphic.GraphicObject);

	/**
	 * This method allow you to set the image of the Sprite. the image object must be a valid object otherwise the
	 * behavior of the setImage method is unspecified.
	 *
	 * @method setImage
	 * @param image this object must be a valid image object
	 * @param obj this parameter is optionnal. If you specify it you can used just a subImage of the current image to
	 * use. It is useful for the spritesheets for example where you only want to draw a specific area of the image.
	 * @return {Boolean} this method returns true if the image parameter is a valid object, otherwise it will
	 * returns false.
	 */
	Sprite.prototype.setImage = function(image, obj) {
	 if (image) {
		 this.image = image;
		 if (obj && obj.x && obj.y && obj.w && obj.h) {
			 this.imageRect = obj;
		 } else {
			 this.imageRect = null;
		 }
		 return true;
	 }	else {
		 return false;
	 }
	};

	/**
	 * This method allow you to draw the sprite on a context.
	 *
	 * @method draw
	 * @param context this parameter must be a valid canvas context, ortherwise the behavior of the draw method is unspecified.
	 * @return {Boolean} this methods return true if the context parameter is a valid object and if the sprite's
	 * image is also a valid object.
	 */
	Sprite.prototype.draw = function(context) {
		if (context && this.image) {
		context.save();
		//TODO do transformation from the GraphicObject matrix.
		if (this.imageRect === null) {
			context.drawImage(this.image, 0, 0, this.width, this.height);
		} else {
			context.drawImage(this.image, this.imageRect.x, this.imageRect.y, this.imageRect.w, this.imageRect.h, 0, 0,
			                  this.width, this.height);
		}
		 context.restore();
		 return true;
		} else {
			return false;
		}
	};
}();