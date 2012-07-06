/**
   @module Graphic
   @namespace Graphic
*/

/**
 This is the constructor of the SpriteAnime class. It will create all the information in way to play several
 animation

 @method SpriteAnime
 @param {Object} properties is the object wich contain all the properties of the sprite sheet given
                (see json.js to see the structure)
 @param {ImgRect} spriteSheet the image containing all the frame of the different animation
 @constructor
*/

function SpriteAnime(properties, spriteSheet){
    this._properties = properties;
    this._current_animation = properties[0];

	TW.Graphic.Sprite.call(this, this._current_animation.sprites[0].x, this._current_animation.sprites[0].y,
            this._current_animation.sprites[0].w, this._current_animation.sprites[0].h, spriteSheet);
	this._startDate = 0;
	this._currentFrame = 0;
	this._speed = 1000 / this._current_animation.frame_rate;
	this._frame = this._current_animation.sprites.length;
}

for (var element in TW.Graphic.Sprite.prototype) {
	SpriteAnime.prototype[element] = TW.Graphic.Sprite.prototype[element];
}

/**
 Change all the property in way to show the good frame a the good time.
 This function is called in the gameLoop.

 @method update
 */
SpriteAnime.prototype.update = function(){
	var currentDate = new Date();
	var count = currentDate.valueOf() - this._startDate.valueOf();
	count /= this._speed;
		
	if (this._startDate == 0){
		this._startDate = currentDate;
    }
	else if (count > 1){
		this._startDate = currentDate;
		this._currentFrame += Math.floor(count);
		this._currentFrame %= this._frame;
        this.imgRect.x = this._current_animation.sprites[this._currentFrame].x;
        this.imgRect.y = this._current_animation.sprites[this._currentFrame].y;
        this.imgRect.width = this._current_animation.sprites[this._currentFrame].w;
        this.imgRect.height = this._current_animation.sprites[this._currentFrame].h;
	}
};

/**
 This function is used to change the current animation. It will stop the current and restart the new one that will
 become the current one.

 @method _myMethod
 @param {String} name the name of the animation to select to play
 */
SpriteAnime.prototype.setCurrentAnimation = function(name){

    for (var property in this._properties) {
        if (property.name === name) {
            this._current_animation = property;
            this._startDate = 0;
            this._currentFrame = 0;
            this._speed =  1000 / this._current_animation.frame_rate;
            this._frame =this._current_animation.sprites.length;
            this.imgRect.x = this._current_animation.sprites[this._currentFrame].x;
            this.imgRect.y = this._current_animation.sprites[this._currentFrame].y;
            this.imgRect.width = this._current_animation.sprites[this._currentFrame].w;
            this.imgRect.height = this._current_animation.sprites[this._currentFrame].h;
            break;
        }
    }

};
