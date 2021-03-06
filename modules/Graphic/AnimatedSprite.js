/**
 * @module Graphic
 * @namespace Graphic
 */

var TW = TW || {};
define(['./GraphicObject', '../Utils/inherit'], function(GraphicObject, inherit) {

	TW.Graphic = TW.Graphic || {};


	/**
	 * The AnimatedSprite allows you to create an object which can be animated using a
	 * {{#crossLink "Graphic.SpriteSheet"}}SpriteSheet{{/crossLink}}.
	 *
	 * When you instanciate a new AnimatedSprite instance, you have to pass it the SpriteSheet which it will
	 * have to use.
	 *
	 * The spritesheet represent the configuration of all animations and how to play them.
	 * An `AnimatedSprite` instance is an object which can be displayed, and can play animations.
	 * several AnimatedSprite with the same animation should use the same shared SpriteSheet.
	 *
	 * An animation can be started with `play()` and stopped with `stop()`. For managing animations,
	 * you can assign a callback when an animation is ended:
	 *
	 *     sprite.play("running", false, function(loop, anim, sprite, status) {
	 *         if (status == "END:STOP") {
	 *              console.log("Stop running, i'll walk.");
	 *              sprite.play("walking", true);
	 *         }
	 *     });
	 *
	 * @class AnimatedSprite
	 * @extends Graphic.GraphicObject
	 * @constructor
	 * @param {Object} params *params* is given to {{#crossLink "Graphic.GraphicObject"}}GraphicObject{{/crossLink}}
	 *   constructor.
	 *   @param {SpriteSheet} params.spriteSheet it is a SpriteSheet object which contains one or severals animation
	 *   which can be used by the current AnimatedSprite object.
	 */
	function AnimatedSprite(params) {
		GraphicObject.call(this, params);

		/**
		 * a SpriteSheet object which contains one or severals animation
		 * which can be used by the current AnimatedSprite object.
		 *
		 * @property {SpriteSheet} spriteSheet
		 */
		this.spriteSheet = params.spriteSheet || null;
		this._currentAnim = "";
		this._currentFrame = 0;
		this._loop = false;
		this._callback = null;
		this._status = "stop";
		this._sigmaElapsedTime = 0;

		if (this.spriteSheet.image && !this.spriteSheet.image.complete) {
			this.spriteSheet.image.addEventListener('load', this.notifyParentChange.bind(this));
		}
	}

	inherit(AnimatedSprite, GraphicObject);

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
	 */
	AnimatedSprite.prototype.play = function(name, loop, callback) {
		this._currentAnim = name;
		this._loop = loop;
		this._currentFrame = 0;
		this._callback = callback;
		this._status = "play";
	};

	/**
	 * The pause method allows you to pause the current animation until the resume method is called.
	 * @method pause
	 */
	AnimatedSprite.prototype.pause = function() {
		this._status = "pause";
		if (typeof this._callback === "function") {
			this._callback({loop: this._loop, anim: this._currentAnim, sprite: this, status: "PAUSE"});
		}
	};

	/**
	 * The resume method allows you to resume the current animation if it has been pause before.
	 * @method resume
	 */
	AnimatedSprite.prototype.resume = function() {
		this._status = "play";
		if (typeof this._callback === "function") {
			this._callback({loop: this._loop, anim: this._currentAnim, sprite: this, status: "RESUME"});
		}
	};

	/**
	 * The stop method allows you to stop and then rewind the current animation.
	 * @method stop
	 */
	AnimatedSprite.prototype.stop = function() {
		var anim = this._currentAnim;
		var tmp = this.callback;
		this._status = "stop";
		this._currentAnim = "";
		this._callback = null;
		this._currentFrame = 0;
		if (typeof tmp === "function") {
			tmp({loop: this._loop, anim: anim, sprite: this, status: "END:STOP"});
		}
		this.notifyParentChange();
	};

	/**
	 * The isPlaying method allows you to test if the current AnimatedSprite object is playing or not an animation.
	 * @method isPlaying
	 * @return {Boolean} returns true if the current AnimatedSprite object is playing an animation,
	 * otherwise it returns false.
	 */
	AnimatedSprite.prototype.isPlaying = function() {
		return this._status === "play";
	};

	/**
	 * The getCurrentAnim returns the current animation which is currently played.
	 * @method getCurrentAnim
	 * @return {Object} returns the animation which is played. If there is no animations currently played then the
	 * getCurrentAnim method will returns null.
	 */
	AnimatedSprite.prototype.getCurrentAnim = function() {
		if (this.spriteSheet && this._currentAnim !== "") {
			return this.spriteSheet.getAnimation(this._currentAnim);
		}
		return null;
	};

	/**
	 * The update method is called each frame by the gameloop.
	 * @method update
	 * @return {Boolean} return true if the update function has been called successfully,
	 * otherwise false is returned.
	 */
	AnimatedSprite.prototype.update = function(deltaTime) {
		this._sigmaElapsedTime += deltaTime;
		if (this.spriteSheet === null || this._currentAnim === "") {
			return false;
		}
		var currentAnim = this.spriteSheet.getAnimation(this._currentAnim);
		if (!currentAnim.frames || !currentAnim.framerate) {
			return false;
		}
		if (this.isPlaying()) {
			if (this._sigmaElapsedTime >= 1000 / currentAnim.framerate) {
				this._currentFrame++;
				if (this._currentFrame >= currentAnim.frames.length) {
					if (this._loop === true) {
						this._currentFrame = 0;
						this.notifyParentChange();
					} else {
						this.stop();
					}
					if (typeof this._callback === "function") {
						this._callback({loop: this._loop, anim: this._currentAnim, sprite: this, status: "END:LOOP"});
					}
				} else {
					this.notifyParentChange();
				}
				this._sigmaElapsedTime = 0;
			}
		}
		return true;
	};

	/**
	 * This method is private and associate to the animated sprite the hotpoint
	 * @method _setCenterPointByHotPoint
	 * @param {Object} currentAnim current animation of the Animated Sprite.
	 * @private
	 */
	AnimatedSprite.prototype._setCenterPointByHotPoint = function(currentAnim) {
		if (currentAnim.frames[this._currentFrame].hotpoint) {
			this.centerPoint.x = currentAnim.frames[this._currentFrame].hotpoint.x;
			this.centerPoint.y = currentAnim.frames[this._currentFrame].hotpoint.y;
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
		if (!this.spriteSheet || this._currentAnim === "" || !context) {
			return false;
		}
		var currentAnim = this.spriteSheet.getAnimation(this._currentAnim);
		if (!currentAnim.frames || !currentAnim.framerate) {
			return false;
		}

		context.save();
		context.translate(this.x, this.y);
		this.matrix.transformContext(context);
		this._setCenterPointByHotPoint(currentAnim);
		context.translate(-this.centerPoint.x, -this.centerPoint.y);
		if (currentAnim.flipX) {
			context.scale(-1, 1);
			context.translate(-this.width, 0);
		}
		if (currentAnim.flipY) {
			context.scale(1, -1);
			context.translate(0, -this.height);
		}
		context.drawImage(this.spriteSheet.image,
		                  currentAnim.frames[this._currentFrame].x,
		                  currentAnim.frames[this._currentFrame].y,
		                  currentAnim.frames[this._currentFrame].w,
		                  currentAnim.frames[this._currentFrame].h,
		                  0, 0, this.width, this.height);
		context.restore();
		return true;
	};

	TW.Graphic.AnimatedSprite = AnimatedSprite;
	return AnimatedSprite;
});
