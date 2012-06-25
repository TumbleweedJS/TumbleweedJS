//la classe image rect permet de pouvoir specifier un quadrilatere dans une image afin
//de ne dessiner que la partie de l'image faisant partie du quadrilatere.
//utile pour faire une animation sur une sprite sheet par exemple.

function ImageRect(img, x, y, w, h)
{
 this.image = img;
 this.x = x;
 this.y = y;
 this.width = w;
 this.height = h;
}

//getter du x...
ImageRect.prototype.getX = function ()
{
 return this.x;
}

//getter du y...
ImageRect.prototype.getY = function ()
{
 return this.y;
}

//setter du x
ImageRect.prototype.setX = function(x)
{
 this.x = x;
}

//setter du y
ImageRect.prototype.setY = function(y)
{
 this.y = y;
}

//getter de la largeur
ImageRect.prototype.getWidth = function()
{
 return this.width;
}

//getter de la hauteur
ImageRect.prototype.getHeight = function()
{
 return this.height;
}

//setter de la largeur
ImageRect.prototype.setWidth = function(width)
{
 this.width = width;
}

//setter de la hauteur
ImageRect.prototype.setHeight = function(height)
{
 this.height = height;
}

//setter de l'image
ImageRect.prototype.setImage = function(image)
{
 this.img = image;
}

//getter de l'image
ImageRect.prototype.getImage = function()
{
 return this.image;
}