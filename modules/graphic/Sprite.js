/**
@module Graphic
*/

/**
la classe sprite permet de pouvoir specifier un sprite a partir d'une position x, une position y, une largeur,
un hauteur, un rectangle de texture, et une vue parente a laquelle l'associer
@class Sprite
@constructor
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
permet de pouvoir setter le centre de l'objet Sprite
ce centre represente le point de rotation du sprite.
les coordonnees du point ne doivent pas deborder des dimensions du sprite
autrement dit x doit etre < a width et y doit etre inferieur a height.

@method setCenterPoint
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
permet de set la valeur alpha (transparence) du sprite (1.0 opaque 0.0 totalement transparent, en fait la valeur est le facteur d'opacite)

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

//permet de get la transparence du sprite
Sprite.prototype.getAlpha = function()
{
 return this.alpha;
}

//permet de pouvoir dessiner un sprite sur une view.
//il faut forcement que le sprite soit associer a une view pour que le dessin fonctionne
//Sprite.prototype.draw = function(context, view, x_local, y_local)
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

//permet de pouvoir specifier le x du sprite
Sprite.prototype.setX = function(x)
{
 this.x = x;
}

//permet de pouvoir specifier le y du sprite
Sprite.prototype.setY = function(y)
{
 this.y = y;
}


//permet de pouvoir specifier l'angle du sprite
Sprite.prototype.setAngle = function(angle)
{
 this.rotation = angle / 180.0 * Math.PI;
}

//permet de pouvoir recuperer l'angle du sprite
Sprite.prototype.getAngle = function()
{
 return this.rotation;
}

//permet de pouvoir set la scale du sprite (autrement dit la mise a l'echelle)
Sprite.prototype.setScale = function(x, y)
{
 this.scaleX = x;
 this.scaleY = y;
}

//permet de pouvoir recuperer la scale du sprite (autrement dit la mise a l'echelle)
Sprite.prototype.getScale = function()
{
 return {scaleX: this.scaleX, scaleY: this.scaleY};
}

//permet de recuperer la coordonnee x du sprite
Sprite.prototype.getX = function()
{
 return this.x;
}

//permet de recuperer la coordonne y du sprite
Sprite.prototype.getY = function ()
{
 return this.y;
}

//permet de recuperer la height du sprite
Sprite.prototype.getHeight = function ()
{
 return this.height;
}

//permet de recuperer la width du sprite
Sprite.prototype.getWidth = function()
{
 return this.width;
}

//permet de pouvoir set la view a laquelle appartient le sprite
Sprite.prototype.setView = function(view)
{
 this.parentView = view;
}

//permet de pouvoir recuperer la view a laquelle appartient le sprite
Sprite.prototype.getView = function()
{
 return this.parentView;
}