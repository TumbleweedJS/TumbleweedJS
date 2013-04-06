/**
 * @module Graphic
 * @namespace Graphic
 */

var TW = TW || {};
define(['./GraphicObject', '../Utils/inherit', '../Utils/copyParam'], function(GraphicObject, inherit, copyParam) {

	TW.Graphic = TW.Graphic || {};


	/**
	 * The Sprite class provide methods to draw sprites on a context. the aim of the sprites object is to be added
	 * to a Layer or to be use directly with a graphical context by invoking the draw method of the Sprite.
	 *
	 * @example
	 *
	 *      var mySprite = new TW.Graphic.Sprite();
	 *      mySprite.draw(canvasContext);
	 *
	 * @class Sprite
	 * @extends Graphic.GraphicObject
	 * @param {Object} [params]
	 *  *params* is given to {{#crossLink "Graphic.GraphicObject"}}GraphicObject{{/crossLink}} constructor.
	 *  @param {Image} [params.image]
	 *  @param {Object} [params.imageRect]
	 *   @param {Number} [params.imageRect.x]
	 *   @param {Number} [params.imageRect.y]
	 *   @param {Number} [params.imageRect.width]
	 *   @param {Number} [params.imageRect.height]
	 * @constructor
	 */
	function Sprite(params) {
		GraphicObject.call(this, params);
		copyParam(this, params, {

			/**
			 * image to display.
			 *
			 * **Note: this property should be modified only with `setAttr`.**
			 *
			 * @property {Image} image
			 */
			image:     null,

			/**
			 * rectangle source from image to display.
			 *
			 * If you specify it you can used just a subImage of the current image to use.
			 * It is useful for the spritesheets for example where you only want to draw a specific area of the image.
			 *
			 * **Note: this property should be modified only with `setAttr`.**
			 *
			 * @property {Object} imageRect
			 *   @property {Number} imageRect.x
			 *   @property {Number} imageRect.y
			 *   @property {Number} imageRect.width
			 *   @property {Number} imageRect.height
			 */
			imageRect: null
		});
	}

	inherit(Sprite, GraphicObject);

	/**
	 * This method allow you to draw the sprite on a context.
	 *
	 * @method draw
	 * @param context this parameter must be a valid canvas context,
	 *  otherwise the behavior of the draw method is unspecified.
	 */
	Sprite.prototype.draw = function(context) {
		/* global CanvasRenderingContext2D */
		if (!(context instanceof CanvasRenderingContext2D)) {
			throw new Error("Bad argument: context");
		}
		if (!this.image) {
			throw new Error("no image to draw");
		}

		context.save();
		context.translate(this.x, this.y);
		this.matrix.transformContext(context);
		context.translate(-this.centerPoint.x, -this.centerPoint.x);
		if (this.imageRect === null) {
			context.drawImage(this.image, 0, 0, this.width, this.height);
		} else {
			context.drawImage(this.image, this.imageRect.x, this.imageRect.y,
			                  this.imageRect.w, this.imageRect.h, 0, 0,
			                  this.width, this.height);
		}
		context.restore();

	};

	TW.Graphic.Sprite = Sprite;
	return Sprite;
});
