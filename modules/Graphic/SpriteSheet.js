/**
 * @module Graphic
 * @namespace Graphic
 */

var TW = TW || {};
define(['../Utils/clone'], function(clone) {

	TW.Graphic = TW.Graphic || {};


	/**
	 * The spritesheet class provides a model to describe animations from an image called spriteSheet.
	 *
	 * @class SpriteSheet
	 * @constructor
	 * @param {Image} image represents the image on which the SpriteSheet coordinate will be applied.
	 * @param {Object} config represents the object which provides the description of each animation.
	 *
	 *
	 *     var mySpriteSheet = new SpriteSheet(image, config);
	 *
	 *  config object represents the raw configuration of the spriteSheet.
	 *  Please see below the synthax of a spriteSheet :
	 *
	 *  The SpriteSheet in tumbleweed work on JSON objects.
	 *  Inside of these JSON objects, there is a description of all or just one animation.
	 *  In the previous example, config is a full description of the animation.
	 *  Here is how tumbleweed's spritesheets are configured :
	 *
	 *  First of all let's define the structure of our SpriteSheet object :
	 *
	 *     {}
	 *
	 *  As you can see it is only an empty JSON object.
	 *  This object can handle some informations about the animation.
	 *
	 * ### Setting default values
	 *
	 *     default : {}
	 *
	 *  The default object can handle default values. It is useful to make some constants in the spriteSheet.
	 *  For example if you want to define 5 constants (x = 10, y = 30, w = 50, h = 60, framerate = 25) You must
	 *  proceed like this :
	 *
	 *     default : {
     *          x : 10,
     *          y : 30,
     *          w : 50,
     *          h : 60,
     *          framerate : 25
     *     }
	 *
	 *
	 * ### Setting animations
	 *
	 *  Each animation is composed by frames and can also define a framerate value which override the framerate
	 *  from default values.
	 *  Here is an important tip, in some animations you may don't want to use the default values. Then you just
	 *  Have to redefine them inside of the animation.
	 *  To create an animation named 'walk' which have framerate set to 12 you must proceed like this :
	 *
	 *     walk : {
     *          framerate: 12,
     *          frames : []
     *     }
	 *
	 *  Note that there is an entry in you walk animation called frames. This entry must contain each frame of the
	 *  walk animation.
	 *
	 * ### Setting frames
	 *
	 *  Each animation contain some frames. It works like a flipbook, each frame are displayed one
	 *  after another, tumbleweed will wait 1/framerate seconds to display the next frame.
	 *  Let's imagine that your walk animation is made of three frames inside of your SpriteSheet.
	 *  The first one will have the coordinate : `x = 0, y = 0, w = 50, h = 50`
	 *  The second one will have the coordinate : `x = 50, y = 0, w = 50, h = 50`
	 *  And finally the third one will have the coordinate : `x = 0, y = 50, w = 50, h = 50`
	 *
	 *  Let's see below what will be the result of these frame inside of our walk animation object :
	 *
	 *     walk : {
     *          framerate: 12,
     *          frames : [
     *              { x: 0, y: 0, w: 50, h: 50 },
     *              { x: 50, y: 0, w: 50, h: 50 },
     *              { x: 0, y: 50, w: 50, h: 50 }
     *          ]
     *     }
	 *
	 * Let's wrap it inside of our config object :
	 *
	 *     var config = {
     *          default: {
     *              x: 0,
     *              y: 0,
     *              w: 50,
     *              h: 50,
     *              framerate: 25
     *          },
     *          walk: {
     *              framerate: 12,
     *              frames: [
     *                  {x:0, y:0, w: 50, h: 50},
     *                  {x:50, y:0, w:50, h:50},
     *                  {x:0, y:50, w:50, h:50}
     *              ]
     *          }
     *     };
	 *
	 * Now you have a walk animation which contain 3 frames which will be displayed with a framerate of 12.
	 * You have the basics to build your own animations.
	 * In the following parts i will describe how to make animation's reference and how you can do
	 * transformations on them.
	 *
	 * ### Animation's reference
	 *
	 *  Sometimes you can need to specify another animation which is a copy of another animation but with some
	 *  transformations on it, the typical case will be an animation of walking to right and another animation which
	 *  is walking to left.
	 *  Frames are the same except that they must be reverted horizontally.
	 *  To make it we will introduce a new entity which is the flip flags.
	 *  Flip flags allow you to flip images from an animation. You can either flip them by the x axis
	 *  (horizontal flip) or by the y axis (vertical flip).
	 *
	 *  To illustrate it we will improve our config object which contain the walk animation.
	 *  Now we want 2 walk animation (walk_left and walk_right).
	 *  Initially we will consider that our previous definition of the walk animation was equivalent to the
	 *  walk_left animation.
	 *
	 *  Now let's see now how looks like our config object :
	 *
	 *     var config = {
     *          default: {
     *              x: 0,
     *              y: 0,
     *              w: 50,
     *              h: 50,
     *              framerate: 25
     *          },
     *          walk_left: {
     *              framerate: 12,
     *              frames: [
     *                  {x:0, y:0, w: 50, h: 50 },
     *                  {x:50, y:0, w:50, h:50 },
     *                  {x:0, y:50, w:50, h:50 }
     *              ]
     *          },
     *          walk_right: {                           //This is our new animation entry : walk_right
     *              framerate: 12,                      //The framerate is the same than walk_left
     *              frames: [
     *                  {x:0, y:0, w:50, h:50},         //The frames are also the same than walk_left
     *                  {x:50, y:0, w:50, h:50},
     *                  {x:0, y:50, w:50, h:50}
     *              ],
     *              flipX: true,                       //Flip_x true indicate that all the frames must be
     *                                                  //horizontally flipped before being draw.
     *          }
     *     };
	 *
	 *  There's one annoying thing in the previous definition, as you can see, the frames of the walk_left animation
	 *  and the frames of the walk_right animation are duplicated.
	 *  There's one way to solve this problem : the alias flag.
	 *
	 * ### Alias flag
	 *
	 *  Alias flag allows you to define an animation by referencing another, it's quite useful when an animation has
	 *  the same frames than another. And we're actually in this case.
	 *  Using the alias flag, this is what will be your config object :
	 *
	 *     var config = {
     *          default: {
     *              x: 0,
     *              y: 0,
     *              w: 50,
     *              h: 50,
     *              framerate: 25
     *          },
     *          walk_left: {
     *              framerate: 12,
     *              frames: [
     *                  {x:0, y:0, w: 50, h: 50 },
     *                  {x:50, y:0, w:50, h:50 },
     *                  {x:0, y:50, w:50, h:50 }
     *              ]
     *          },
     *          walk_right: {               //This is our new animation entry : walk_right
     *              framerate: 12,          //The framerate is the same than walk_left
     *              alias: "walk_left",     //by declaring walk_left as alias,
     *                                      // walk_right will share it's frames with walk_left.
     *              flipX: true,           //Flip_x true indicate that all the frames must be
     *                                      //horizontally flipped before being draw.
     *          }
     *     };
	 *
	 * ## define frames more quickly
	 *
	 *  It's possible to define many frames in one line, if these frames follow or if they are identical.
	 *
	 *  If all frames are on the same line, or the same collumn, we can just specify the number of frames we want,
	 *  and the direction of repetition. No direction means we want to copy and repeat the frame.
	 *
	 *  Repeat a frame can be useful in some case.
	 *  For example if you want to wait more than one cycle to go on the next frame.
	 *
	 *  - `nbFrames` is the number of frames we want
	 *  - `way` is the direction we want to move for the next frames. If not defined, it's a repetition.
	 *    It can take 4 values :
	 *
	 *     - "LEFT",
	 *     - "RIGHT"
	 *     - "UP"
	 *     - "DOWN"
	 *
	 * Example :
	 *
	 *
	 *     var config = {
     *          default: {
     *              x: 0,
     *              y: 0,
     *              w: 50,
     *              h: 50,
     *              framerate: 25
     *          },
     *          walk_left: {
     *              framerate: 12,
     *              frames: [
     *                  {x:0, y:0, w: 50, h: 50 },
     *                  {x:50, y:0, w:50, h:50 },
     *                  {x:0, y:50, w:50, h:50, nbFrames: 5 }                  //This frame will be duplicated 5 times.
     *                  {x:0, y:100, w:50, h:50, nbFrames: 5, way: "RIGHT" }   //We take 5 frames, moving on the right.
     *              ]
     *          },
     *          walk_right: {
     *              framerate: 12,
     *              alias: "walk_left",
     *              flipX: true
     *          }
     *     };
	 *
	 *  Now let me introduce you the last feature which allows you to reverse the frames order of an animation.
	 *  There's some case where you will need to reverse the frames of an animation, especially when you animation
	 *  is an alias of another.
	 *  Let's took our previous example, now, i want to add two moonwalk animation (moonwalk_left, moonwalk_right).
	 *  To make them i will apply to them respectively an alias of the walk_left and walk_right, and then, i will apply
	 *  to moonwalk_right and moonwalk_right the reverse flag which will reverse the frames that the animation contains.
	 *
	 *     var config = {
     *          default: {
     *              x: 0,
     *              y: 0,
     *              w: 50,
     *              h: 50,
     *              framerate: 25
     *          },
     *          walk_left: {
     *              framerate: 12,
     *              frames: [
     *                  {x:0, y:0, w: 50, h: 50 },
     *                  {x:50, y:0, w:50, h:50 },
     *                  {x:0, y:50, w:50, h:50, nbFrames: 5 },                 //This frame will be duplicated 5 times.
     *                  {x:0, y:100, w:50, h:50, nbFrames: 5, way: "RIGHT" }   //We take 5 frames, moving on the right.
     *              ]
     *          },
     *          walk_right: {
     *              framerate: 12,
     *              alias: "walk_left",
     *              flipX: true
     *          },
     *          moonwalk_left: {
     *              framerate: 12,
     *              alias: "walk_right",
     *              reverse: true           //We set our moonwalk_left animation to be reversed.
     *          },
     *          moonwalk_right: {
     *              framerate: 12,
     *              alias: "walk_left",
     *              reverse: true           //We set out moonwalk_right animation to be reversed.
     *          }
     *     };
	 *
	 * ## Hotpoint
	 *
	 * As it's possible to define frames of any size, two frames in an animation can be of differents sizes.
	 * However, this fact hides a problem : if the element must change size, how to enlarge the sprite ?
	 * by the right or the left ? Up or bottom ?
	 *
	 * Usually, we can use the `centerPoint`. If it's defined in the up-left corner,
	 * the sprite will grow toward bottom and right. If it's defined on the center, the sprite will grow from all sides.
	 *
	 * But it's not always the best choice. So, you can redefine the centerPoint for the transition
	 * with the `hotpoint` param. It can take these following values :
	 *
	 *  - `TOP-LEFT`
	 *  - `TOP-CENTER`
	 *  - `TOP-RIGHT`
	 *  - `CENTER-LEFT`
	 *  - `CENTER-CENTER`
	 *  - `CENTER-RIGHT`
	 *  - `BOTTOM-LEFT`
	 *  - `BOTTOM-CENTER`
	 *  - `BOTTOM-RIGHT`
	 *
	 *
	 * Example:
	 *
	 *     grow_up: {
     *          framerate: 12,
     *          frames: [
     *              {x:0, y:0, w:50, h:50 },
     *              {x:50, y:0, w:50, h:150, hotpoint: "BOTTOM-CENTER" }
     *              //the height grow from 50 to 150
     *              //but the center bottom point will not move.
     *          ]
     *     }
	 *
	 */
	function SpriteSheet(image, config) {

		/**
		 * image used by the srpitesheet.
		 *
		 * @property {Image} image
		 */
		this.image = image;

		this.listAnimation = {};



		this.config = clone(config);

		for (var a in this.config) {
			if (a !== "default") {
				if (this.config[a].alias) {
					if (this.listAnimation[this.config[a].alias]) {
						this.config[a].frames = clone(this.listAnimation[this.config[a].alias].frames);
					}
				}
				this.developAnimationFrames(this.config[a]);
				if (this.config[a].reverse && this.config[a].reverse === true) {
					this.config[a].frames.reverse();
				}
			}
			this.listAnimation[a] = this.config[a];
		}
	}

	/**
	 * This function is used internally by the SpriteSheet class to apply the default values in the frames.
	 * @method applyDefaultValuesToFrames
	 * @param {Object} animation object which contains the description of the animation to apply default values.
	 * @private
	 */
	SpriteSheet.prototype.applyDefaultValuesToFrames = function(animation) {
		if (!this.config['default']) {
			return;
		}
		if (this.config['default'].framerate) {
			if (!animation.framerate) {
				animation.framerate = this.config['default'].framerate;
			}
		}
		if (this.config['default'].flipX) {
			if (!animation.flipX) {
				animation.flipX = this.config['default'].flipX;
			}
		}
		if (this.config['default'].flipY) {
			if (!animation.flipY) {
				animation.flipY = this.config['default'].flipY;
			}
		}
		if (this.config['default'].reverse) {
			if (!animation.reverse) {
				animation.reverse = this.config['default'].reverse;
			}
		}
		if (!animation.frames) {
			return;
		}
		for (var i = 0; i < animation.frames.length; i++) {
			if (this.config['default'].x) {
				if (!animation.frames[i].x) {
					animation.frames[i].x = this.config['default'].x;
				}
			}
			if (this.config['default'].y) {
				if (!animation.frames[i].y) {
					animation.frames[i].y = this.config['default'].y;
				}
			}
			if (this.config['default'].w) {
				if (!animation.frames[i].w) {
					animation.frames[i].w = this.config['default'].w;
				}
			}
			if (this.config['default'].h) {
				if (!animation.frames[i].h) {
					animation.frames[i].h = this.config['default'].h;
				}
			}
			if (this.config['default'].nbFrames) {
				if (!animation.frames[i].nbFrames) {
					animation.frames[i].nbFrames = this.config['default'].nbFrames;
				}
			}
		}
	};

	/**
	 * This function is private and have the aim to autoincrement each frame duplicated in order to generate animation.
	 * @param {Object} frame frame which will be transformed
	 * @method _applyFrameIncrementation
	 * @private
	 */
	SpriteSheet.prototype._applyFrameIncrementation = function(frame) {
		if (!frame.way) {
			return;
		}
		switch (frame.way) {
			case "LEFT" :
				frame.x -= frame.w;
				if (frame.x < 0) {
					frame.x = this.image.width - frame.w;
					frame.y += frame.h;
				}
				break;
			case "RIGHT" :
				frame.x += frame.w;
				if (frame.x + frame.w > this.image.width) {
					frame.x = 0;
					frame.y += frame.h;
				}
				break;
			case "UP" :
				frame.y -= frame.h;
				if (frame.y < 0) {
					frame.x += frame.w;
					frame.y = this.image.height - frame.h;
				}
				break;
			case "DOWN" :
				frame.y += frame.h;
				if (frame.y + frame.h > this.image.height) {
					frame.x += frame.w;
					frame.y = 0;
				}
				break;
		}
		//delete frame.way;
	};

	SpriteSheet.prototype._setLitteralHotPoint = function(frame, stringHotpoint) {
		var hotPoint = {
			x: 0,
			y: 0
		};

		switch (stringHotpoint) {
			case "LEFT-TOP":
				hotPoint.x = 0;
				hotPoint.y = 0;
				break;
			case "CENTER-TOP":
				hotPoint.x = frame.w / 2;
				hotPoint.y = 0;
				break;
			case "RIGHT-TOP":
				hotPoint.x = frame.w;
				hotPoint.y = 0;
				break;
			case "LEFT-CENTER":
				hotPoint.x = 0;
				hotPoint.y = frame.h / 2;
				break;
			case "CENTER-CENTER":
				hotPoint.x = frame.w / 2;
				hotPoint.y = frame.h / 2;
				break;
			case "RIGHT-CENTER":
				hotPoint.x = frame.w;
				hotPoint.y = frame.h / 2;
				break;
			case "LEFT-BOTTOM":
				hotPoint.x = 0;
				hotPoint.y = frame.h;
				break;
			case "CENTER-BOTTOM":
				hotPoint.x = frame.w / 2;
				hotPoint.y = frame.h;
				break;
			case "RIGHT-BOTTOM":
				hotPoint.x = frame.w;
				hotPoint.y = frame.h;
				break;
		}
		frame.hotpoint = hotPoint;
	};

	/**
	 * The _applyHotPoint is private and set some parameters about the hot points.
	 * @method _applyHotPoint
	 * @param animationEntry
	 * @param frames
	 * @private
	 */
	SpriteSheet.prototype._applyHotPoint = function(animationEntry, frames) {
		var xHotPoint;
		var yHotPoint;

		if (animationEntry.hotpoint) {
			for (var i = 0; i < frames.length; i++) {
				if (typeof animationEntry.hotpoint === "string") {
					this._setLitteralHotPoint(frames[i], animationEntry.hotpoint);
				} else {
					if (!animationEntry.hotpoint.x || !animationEntry.hotpoint.y ||
					    isNaN(animationEntry.hotpoint.x) || isNaN(animationEntry.hotpoint.y)) {
						return;
					}
					xHotPoint = animationEntry.hotpoint.x;
					yHotPoint = animationEntry.hotpoint.y;
					frames[i].hotpoint = {x: xHotPoint, y: yHotPoint};
				}
			}
		}
	};

	/**
	 * This function is private and have the aim to clone an animation entry.
	 * @private
	 * @method developAnimationFrames
	 * @param {Object} animationEntry
	 */
	SpriteSheet.prototype.developAnimationFrames = function(animationEntry) {
		var newFrames = [];
		var offset = 0;
		var frameClone;

		this.applyDefaultValuesToFrames(animationEntry);
		if (!animationEntry.frames) {
			return;
		}
		for (var i = 0; i < animationEntry.frames.length; i++) {
			if (animationEntry.frames[i].nbFrames && animationEntry.frames[i].nbFrames >= 1) {
				for (var j = 0; j < animationEntry.frames[i].nbFrames; j++) {
					if (j === 0) {
						frameClone = clone(animationEntry.frames[i]);
					} else {
						frameClone = clone(newFrames[offset - 1]);
					}
					if (j > 0) {
						this._applyFrameIncrementation(frameClone);
					}
					newFrames.push(frameClone);
					delete newFrames[offset].nbFrames;
					offset++;
				}
			} else {
				newFrames.push(clone(animationEntry.frames[i]));
			}
		}
		this._applyHotPoint(animationEntry, newFrames);
		animationEntry.frames = newFrames;
	};

	/**
	 * addAnimation method allows you to add an animation to the current SpriteSheet object.
	 * Note that if you add an animation with the same name than a previous one, the older will be overwritted.
	 *
	 * @method addAnimation
	 * @param {String} name it is the name of the animation
	 * @param {Object} config it is an object which contains the description of the name animation.
	 */
	SpriteSheet.prototype.addAnimation = function(name, config) {
		this.config[name] = clone(config);
		if (this.config[name].alias) {
			if (this.listAnimation[this.config[name].alias]) {
				this.config[name].frames = clone(this.listAnimation[this.config[name].alias].frames);
			}
		}
		this.developAnimationFrames(this.config[name]);
		this.listAnimation[name] = this.config[name];
	};

	/**
	 * rmAnimation method allows you to suppress an animation from the current SpriteSheet object.
	 *
	 * @method rmAnimation
	 * @param {String} name it is the name of the animation to delete
	 * @return {Boolean} the rmAnimation returns true if the name animation have been successfuly suppressed
	 * from the current SpriteSheet object.
	 */
	SpriteSheet.prototype.rmAnimation = function(name) {
		if (this.config[name] && this.listAnimation[name]) {
			delete this.config[name];
			delete this.listAnimation[name];
			return true;
		} else {
			return false;
		}
	};

	/**
	 * getAnimation method allows you to get a description of the name animation.
	 *
	 * @method getAnimation
	 * @param {String} name it is the name of the animation which you want to get the description
	 * @return {Object} the getAnimation method returns the description of the name animation on success.
	 * Otherwise it returns null
	 */
	SpriteSheet.prototype.getAnimation = function(name) {
		if (this.config[name]) {
			return clone(this.config[name]);
		} else {
			return null;
		}
	};


	/**
	 * setAnimation method allows you to set a new animation inside of the current SpriteSheet object.
	 *
	 * @method setAnimation
	 * @param {String} name it is the name of the new animation to be set.
	 * @param {Object} config it is the config object which describe the name animation.
	 */
	SpriteSheet.prototype.setAnimation = function(name, config) {
		this.addAnimation(name, config);
	};

	/**
	 * getListAnim method allows you to get the list of the animation contained inside of the
	 * current SpriteSheet object.
	 *
	 * @method getListAnim
	 * @return {Object} returns an object containing the animations of the SpriteSheet object.
	 */
	SpriteSheet.prototype.getListAnimation = function() {
		return this.config;
	};


	TW.Graphic.SpriteSheet = SpriteSheet;
	return SpriteSheet;
});
