/**
 @module Graphic
 @namespace Graphic
 */

var TW = TW || {};

(function(TW) {

    TW.Graphic = TW.Graphic ||  {};
    TW.Graphic.AnimatedSprite = AnimatedSprite;

    if (typeof window.define === "function" && window.define.amd) {
		define(['./Sprite', '../utils/Inheritance'], function() {
            TW.Utils.inherit(AnimatedSprite, TW.Graphic.Sprite);
            return AnimatedSprite;
        });
    } else {
        TW.Utils.inherit(AnimatedSprite, TW.Graphic.Sprite);
    }

    /**
     * The AnimatedSprite allows you to create an object which can be animated using a SpriteSheet.
     * When you instanciate a new AnimatedSprite instance, you have to pass it the SpriteSheet which it will
     * have to use.
     * @class AnimatedSprite
     * @constructor
     * @param {Object} params
     *   *params* is given to {{#crossLink "Graphic.Sprite"}}{{/crossLink}} constructor.
     *   @param {SpriteSheet} params.spriteSheet it is a SpriteSheet object which contains one or severals animation
     *   which can be used by the current AnimatedSprite object.
     */
    function AnimatedSprite(params) {
        TW.Graphic.Sprite.call(this, params);
        this.image = params.spriteSheet ? params.spriteSheet : null;
        this.currentAnim = "";
        this.currentFrame = 0;
        this.date = new Date();
        this.loop = false;
        this.timeStart = this.date.getTime();
        this.callback = null;
        this.status = "stop";
        this.sigma_elapsed_time = 0;
    }

    /**
     * The setSpriteSheet method allows you to set the current spriteSheet to use.
     * @method setSpriteSheet
     * @param {SpriteSheet} spriteSheet It represents the spriteSheet instance which will be attached on the current
     * AnimatedSprite object.
     */
    AnimatedSprite.prototype.setSpriteSheet = function(spriteSheet) {
        this.image = spriteSheet;
    };

    /**
     * The getSpriteSheet method allows you to get the current spriteSheet object which is currently
     * attached to the AnimatedSprite.
     * @method getSpriteSheet
     * @return {SpriteSheet} the getSpriteSheet method returns the current SpriteSheet in use otherwise it returns null.
     */
    AnimatedSprite.prototype.getSpriteSheet = function() {
        return this.image;
    };

    /**
     * the play method allows you to start an animation (note that this animation must be defined inside of the
     * SpriteSheet object currently used by the AnimatedSprite).
     * @method play
     * @param {String} name string parameter which represents the name of the animation to start
     * @param {Boolean} loop boolean parameter which set looping the animation if set to true.
     * Otherwise, looping is disabled.
     * @param {Function} callback function which is called each time the animation reach it's end.
     * Callback take one parameter which is an object which contains the following parameters :
     * @param {Boolean} callback.loop a boolean which represent the loop status of the animation,
     * if loop true then the animation will loop when its reach its end.
     * @param {String} callback.anim a string which represent the name of the animation which reach end.
     * @param {AnimatedSprite} callback.sprite a reference to the animated sprite which called the callback
     * @param {String} callback.status a string which represent the status of the callback,
     * status can have the following values :
     *
     * - `"END:LOOP"` the AnimatedSprite will loop
     * - `"END:STOP"` the AnimatedSprite is now stopped,
     * - `"PAUSE"` the AnimatedSprite is now paused
     * - `"RESUME"` the animated sprite is now resumed
     *
     * @return {Boolean} if the animation have been finded and will be played the return value will be true,
     * otherwise it will be false.
     */
    AnimatedSprite.prototype.play = function(name, loop, callback) {
        this.currentAnim = name;
        this.loop = loop;
		this.currentFrame = 0;
        this.callback = callback;
        this.status = "play";
    };

    /**
     * The pause method allows you to pause the current animation until the resume method is called.
     * @method pause
     * @return {Boolean} if the pause method has been successfully called, then the return value will be true,
     * otherwise it will be false.
     */
    AnimatedSprite.prototype.pause = function() {
        this.status = "pause";
        if (this.callback && typeof this.callback === "function") {
            this.callback({loop: this.loop, anim: this.currentAnim, sprite: this, status: "PAUSE"});
        }
    };

    /**
     * The resume method allows you to resume the current animation if it has been pause before.
     * @method resume
     * @return {Boolean} return true if the resume method has been successfully called, otherwise it returns false.
     */
    AnimatedSprite.prototype.resume = function() {
        this.status = "play";
        if (this.callback && typeof this.callback === "function") {
            this.callback({loop: this.loop, anim: this.currentAnim, sprite: this, status: "RESUME"});
        }
    };

    /**
     * The stop method allows you to stop and then rewind the current animation.
     * @method stop
     * @return {Boolean} returns true if the stop method has been successfully called. Otherwise false is returned.
     */
    AnimatedSprite.prototype.stop = function() {
        this.status = "stop";
        this.currentAnim = "";
        this.callback = null;
        this.currentFrame = 0;
        if (this.callback && typeof this.callback === "function") {
            this.callback({loop: this.loop, anim: this.currentAnim, sprite: this, status: "END:STOP"});
        }
    };

    /**
     * The isPlaying method allows you to test if the current AnimatedSprite object is playing or not an animation.
     * @method isPlaying
     * @return {Boolean} returns true if the current AnimatedSprite object is playing an animation,
     * otherwise it returns false.
     */
    AnimatedSprite.prototype.isPlaying = function() {
        if (this.status === "play") {
            return true;
        } else {
            return false;
        }
    };

    /**
     * The getCurrentAnim returns the current animation which is currently played.
     * @method getCurrentAnim
     * @return {Object} returns the animation which is played. If there is no animations currently played then the
     * getCurrentAnim method will returns null.
     */
    AnimatedSprite.prototype.getCurrentAnim = function() {
        if (this.image && this.image !== null) {
            if (this.currentAnim !== "") {
                return this.image.getAnimation(this.currentAnim);
            }
        }
        return null;
    };

    /**
     * The update method is called each frame by the gameloop.
     * @method update
     * @return {Boolean} return true if the update function has been called successfully,
     * otherwise false is returned.
     */
    AnimatedSprite.prototype.update = function(delta_time) {
        this.sigma_elapsed_time += delta_time;
        if (this.image === null || this.currentAnim === "") {
            return false;
        }
        var current_anim = this.image.getAnimation(this.currentAnim);
        if (!current_anim.frames || !current_anim.framerate) {
            return false;
        }
        if (this.isPlaying()) {
            if (this.sigma_elapsed_time >= 1000/current_anim.framerate) {
                this.currentFrame++;
                if (this.currentFrame >= current_anim.frames.length) {
                    if (this.loop === true) {
                        this.currentFrame = 0;
                        this.notifyParentChange();
                    } else {
                        this.stop();
                    }
                    if (this.callback && typeof this.callback === "function") {
                        this.callback({loop: this.loop, anim: this.currentAnim, sprite: this, status: "END:LOOP"});
                    }
                } else {
                    this.notifyParentChange();
                }
            this.timeStart = this.date.getTime();
            this.sigma_elapsed_time = 0;
            }
        }
      return true;
    };

	/**
	 * This method is private and associate to the animated sprite the hotpoint
	 * @method _setCenterPointByHotPoint
	 * @param {Object} current_anim current animation of the Animated Sprite.
	 * @private
	 */
	AnimatedSprite.prototype._setCenterPointByHotPoint = function(current_anim) {
		if (current_anim.frames[this.currentFrame].hotpoint) {
			this.xCenterPoint = current_anim.frames[this.currentFrame].hotpoint.x;
			this.yCenterPoint = current_anim.frames[this.currentFrame].hotpoint.y;
		}
	};

    /**
     * This method allow you to draw an animated sprite on a context.
     *
     * @method draw
     * @param context this parameter must be a valid canvas context,
     *  otherwise the behavior of the draw method is unspecified.
     * @return {Boolean} this methods return true if the context parameter is a valid object and if the sprite's
     * image is also a validSpriteSheet.
     */
    AnimatedSprite.prototype.draw = function(context) {
        if (this.image === null || this.currentAnim === "") {
            return false;
        }
        var current_anim = this.image.getAnimation(this.currentAnim);
        if (!current_anim.frames || !current_anim.framerate) {
            return false;
        }
        if (context && this.image) {
            context.save();
            context.translate(this.x, this.y);
            this.matrix.transformContext(context);
	        this._setCenterPointByHotPoint(current_anim);
            context.translate(-this.xCenterPoint, -this.yCenterPoint);
            if (current_anim.flip_x) {
                context.scale(-1, 1);
                context.translate(-this.width, 0);
            }
            if (current_anim.flip_y) {
                context.scale(1, -1);
                context.translate(0, -this.height);
            }
            //TODO do transformation from the GraphicObject matrix.
            context.drawImage(this.image.getImage(),
                current_anim.frames[this.currentFrame].x,
                current_anim.frames[this.currentFrame].y,
                current_anim.frames[this.currentFrame].w,
                current_anim.frames[this.currentFrame].h,
                0, 0, this.width, this.height);
            context.restore();
            return true;
        } else {
            return false;
        }
    };

})(TW);
