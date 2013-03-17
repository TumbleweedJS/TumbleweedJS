/**
 @module Graphic
 @namespace Graphic
 */

var TW = TW || {};

(function(TW) {

    TW.Graphic = TW.Graphic ||  {};
    TW.Graphic.Sprite = Sprite;

    if (typeof window.define === "function" && window.define.amd) {
        define(['./GraphicObject', '../utils/Inheritance'], function() {
            TW.Utils.inherit(Sprite, TW.Graphic.GraphicObject);
            return Sprite;
        });
    } else {
        TW.Utils.inherit(Sprite, TW.Graphic.GraphicObject);
    }

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
     * @extends GraphicObject
     * @param {Object} [params]
     *  *params* is given to {{#crossLink "Graphic.GraphicObject"}}{{/crossLink}} constructor.
     *  @param {Object} [params.image]
     *  @param {Object} [params.imageRect]
     * @constructor
     */
    function Sprite(params) {
	    TW.Graphic.GraphicObject.call(this, params);
	    TW.Utils.copyParam(this, params, {
		    image:      null,
		    imageRect:  null
	    });
    }



    /**
     * This method allow you to set the image of the Sprite. the image object must be a valid object otherwise the
     * behavior of the setImage method is unspecified.
     *
     * @method setImage
     * @param image this object must be a valid image object
     * @param obj this parameter is optional. If you specify it you can used just a subImage of the current image to
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
            this.notifyParentChange();
            return true;
        }	else {
            return false;
        }
    };

    /**
     * This method allow you to draw the sprite on a context.
     *
     * @method draw
     * @param context this parameter must be a valid canvas context,
     *  otherwise the behavior of the draw method is unspecified.
     * @return {Boolean} this methods return true if the context parameter is a valid object and if the sprite's
     * image is also a valid object.
     */
    Sprite.prototype.draw = function(context) {
        if (context && this.image) {
            context.save();
            context.translate(this.x, this.y);
            this.matrix.transformContext(context);
            context.translate(-this.xCenterPoint, -this.yCenterPoint);
            //TODO do transformation from the GraphicObject matrix.
            if (this.imageRect === null) {
                context.drawImage(this.image, 0, 0, this.width, this.height);
            } else {
                context.drawImage(this.image, this.imageRect.x, this.imageRect.y,
                    this.imageRect.w, this.imageRect.h, 0, 0,
                    this.width, this.height);
            }
            context.restore();
            return true;
        } else {
            return false;
        }
    };

}(TW));