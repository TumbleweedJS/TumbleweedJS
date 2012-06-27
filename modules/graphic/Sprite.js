/**
@module Graphic
*/

/**
The class Sprite let you specify a Sprite object from x and y coordinates, the width and the height of the Sprite and the imageRect to display.
@class Sprite
@constructor
@param {integer} value on the x axis
@param {integer} value on the y axis
@param {integer} width of the Sprite
@param {integer} height of the Sprite
@param {imgRect} the imgRect who specify the inner part of a picture to display
*/
function Sprite(x, y, width, height, imgRect)
{
 this.x = x;
 this.y = y;
 this.alpha = 1.0;
 this.x_centerPoint = 0;
 this.y_centerPoint = 0;
 this.height = height;
 this.width = width;
 this.scaleX = 1.0;
 this.scaleY = 1.0;
 this.rotation = 0.0;
 this.imgRect = imgRect;
}

/**
The setCenterPoint method allow you to specify the rotation center of an object Sprite
@method setCenterPoint
@param {integer} set the x value of the centerPoint of the Sprite (note that this x value is on the local orthonormal system of the sprite)
@param {integer} set the y value of the centerPoint of the Sprite (note that this y value is on the local orthonormal system of the sprite)
*/
Sprite.prototype.setCenterPoint = function(x, y)
{
 if (x >= 0 && x <= this.width && y >= 0 && y <= this.height)
  {
   this.x_centerPoint = x;
   this.y_centerPoint = y;
  }
}

/**
This method allow you to specify the transparency value of the Sprite
@method setAlpha
@param {Integer} alpha transparency value. Must be between 0 and 1.
*/
Sprite.prototype.setAlpha = function(alpha)
{
 if (alpha > 1.0)
 {
  this.alpha = 1.0;
  return;
 }
 if (alpha < 0.0)
 {
 this.alpha = 0.0;
 return;
 }
 this.alpha = alpha;
}

/**
This method allow you to get the transparency value of the Sprite
@method getAlpha
*/
Sprite.prototype.getAlpha = function()
{
 return this.alpha;
}

/**
This method allow you to draw the sprite on the specified context
@method draw
@param {canvasContext2d} the canvas's context which will be drawn on by the draw method.
*/
Sprite.prototype.draw = function(context)
{
 context.save();
 var saveAlpha = context.globalAlpha;
 context.globalAlpha = this.alpha;
 context.transform(1, 0, 0, 1, this.x + this.x_centerPoint, this.y + this.y_centerPoint);
 context.transform(Math.cos(this.rotation), -Math.sin(this.rotation), Math.sin(this.rotation), Math.cos(this.rotation), 0, 0);
 context.transform(this.scaleX, 0, 0, this.scaleY, 0, 0);
 context.transform(1, 0, 0, 1, -this.x_centerPoint, -this.y_centerPoint);
 context.drawImage(this.imgRect.getImage(),this.imgRect.getX(), this.imgRect.getY(), this.imgRect.getWidth(), this.imgRect.getHeight(),0, 0, this.width, this.height);
 context.restore();
}

/**
This method allow you to set the x coordinate of the Sprite object
@method setX
@param {x} the x position of the Sprite to be set
*/
Sprite.prototype.setX = function(x)
{
 this.x = x;
}

/**
This method allow you to set the y coordinate of the Sprite object
@method setY
@param {y} the y position of the Sprite to be set
*/
Sprite.prototype.setY = function(y)
{
 this.y = y;
}


/**
The method allow to specify the angle of rotation of the Sprite
@method setAngle
@param {float} the angle parameter is a degree value who specify the rotation of the Sprite
*/
Sprite.prototype.setAngle = function(angle)
{
 this.rotation = angle / 180.0 * Math.PI;
}

/**
The method getAngle allow you to get the angle of rotation of the Sprite
@method getAngle
@return {float} the rotation angle of the Sprite in degree value
*/
Sprite.prototype.getAngle = function()
{
 return this.rotation * 180.0 / Math.PI;
}

/**
The method setScale allow you to specify the scale factors of the Sprite
@method setScale
@param {float} the x parameter specify the x factor of scale of the Sprite
@param {float} the y parameter specify the y factor of scale of the Sprite
*/
Sprite.prototype.setScale = function(x, y)
{
 this.scaleX = x;
 this.scaleY = y;
}

/**
The method getScale allow you to get the scale factors of the Sprite
@method getScale
@return {array} the return value is an object containing the scale factors as this {scaleX : valx, scaleY : valy}
*/
Sprite.prototype.getScale = function()
{
 return {scaleX: this.scaleX, scaleY: this.scaleY};
}

/**
The method getX allow you to get the x value of the Sprite (the abscissa value of the Sprite)
@method getX
@return {integer} return the absissa value of the Sprite
*/
Sprite.prototype.getX = function()
{
 return this.x;
}

/**
The method getY allow you to get the y value of the Sprite (the vertical axis value of the Sprite)
@method getY
@return {integer} return the vertical axis value of the Sprite
*/
Sprite.prototype.getY = function ()
{
 return this.y;
}

/**
The method getHeight allow you to get the height of the Sprite
@method getHeight
@return {integer} return the height value of this Sprite
*/
Sprite.prototype.getHeight = function ()
{
 return this.height;
}

/**
The method getWidth allow you to get the width of the Sprite
@method getWidth
@return {integer} return the Width value of this Sprite
*/
Sprite.prototype.getWidth = function()
{
 return this.width;
}