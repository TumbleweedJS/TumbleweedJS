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
        TW.Graphic.Sprite = f();
        return TW.Graphic.Sprite;
    }


    function init() {

        /**
         * The Sprite class provide methods to draw sprites on a context. the aim of the sprites object is to be added to a
         * Layer or to be use directly with a graphical context by invoking the draw method of the Sprite. like `var mySprite = new TW.Graphic.Sprite(); mySprite.draw(canvasContext);`
         * @class Sprite
         * @constructor
         */
        function Sprite(param) {
            (param.image ? this.image = param.image : this.image = null);
            (param.imageRect ? this.imageRect = param.imageRect : this.imageRect = null);
            TW.Graphic.GraphicObject.call(this, param);
        }

        TW.Utils.inherit(Sprite, TW.Graphic.GraphicObject);

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
                return true;
            }	else {
                return false;
            }
        };

        /**
         * This method allow you to draw the sprite on a context.
         *
         * @method draw
         * @param context this parameter must be a valid canvas context, otherwise the behavior of the draw method is unspecified.
         * @return {Boolean} this methods return true if the context parameter is a valid object and if the sprite's
         * image is also a valid object.
         */
        Sprite.prototype.draw = function(context) {
            if (context && this.image) {
                context.save();
                this._matrix.transformContext(context);
                //TODO do transformation from the GraphicObject matrix.
                if (this.imageRect === null) {
                    context.drawImage(this.image, this.x, this.y, this.width, this.height);
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
        return Sprite;

    }
}(TW));