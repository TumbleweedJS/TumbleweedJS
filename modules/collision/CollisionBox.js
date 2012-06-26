//La classe collisionBox permet de pouvoir tester les collisions entre une box et d'autres primitives
//Le constructeur de la classe CollisionBox prend les arguments suivants :
//x pour la position en abscisse de la box.
//y pour la position en ordonnee de la box.
//w pour la largeur de la box.
//h pour la hauteur de la box.
function CollisionBox(x, y, w, h)
{
 this.type = "CollisionBox";
 this.x = x;
 this.y = y;
 this.w = w;
 this.h = h;
 this.x_centerPoint = 0;
 this.y_centerPoint = 0;
 this.angle = 0;
}

//Fonction permettant de pouvoir tester si un point est dans la box
//px est l'abscisse du point
//py est l'ordonnee du point
CollisionBox.prototype.isPointInside = function(px, py)
{
 if (px >= this.getX() && px <= this.getX() + this.getWidth() &&
	 py >= this.getY() && py <= this.getY() + this.getHeight())
  return true;
 else
  return false;
}

//Fonction permettant de pouvoir tester si un segment est en collision avec un cercle.
//[ax; ay] definissent le point de depart du segment
//[bx;by] definissent le point de fin du segment
//circle represente le cercle avec lequel on veux tester l'intersection
CollisionBox.prototype.isSegmentCollidingCircle = function(val_a_x, val_a_y, val_b_x, val_b_y, circle)
{
 var a_x = val_a_x;
 var a_y = val_a_y;
 var b_x = val_b_x;
 var b_y = val_b_y;
 var v_x = b_x - a_x;
 var v_y = b_y - a_y;
 var radius = circle.getRadius();
 a_x = a_x - circle.getX();
 a_y = a_y - circle.getY();
var delta = (((2 * a_x * v_x) + (2 * a_y * v_y)) * ((2 * a_x * v_x) + (2 * a_y * v_y))) - (4 * ((v_x * v_x) + (v_y * v_y)) * ((a_x * a_x) + (a_y * a_y) - (radius * radius)));
 if (delta >= 0)
  {
   if ((((2 * a_x * v_x + 2 * a_y * v_y) * -1) + (Math.sqrt(delta)))/(2 * ((v_x * v_x) + (v_y * v_y))) < 1.0 && 
       (((2 * a_x * v_x + 2 * a_y * v_y) * -1) + (Math.sqrt(delta)))/(2 * ((v_x * v_x) + (v_y * v_y))) > 0.0)
	   return true;
   if ((((2 * a_x * v_x + 2 * a_y * v_y) * -1) - (Math.sqrt(delta)))/(2 * ((v_x * v_x) + (v_y * v_y))) < 1.0 && 
       (((2 * a_x * v_x + 2 * a_y * v_y) * -1) - (Math.sqrt(delta)))/(2 * ((v_x * v_x) + (v_y * v_y))) > 0.0)
	   return true;
  }
 return false;
}

//Fonction permettant de pouvoir tester les collisions de la box avec un cercle.
//considerons l'exemple suivant
//var cercle = new CollisionCircle(x,y,radius);
//var box = new CollisionBox(x2, x2, width, height);
//var result = box.isCollidingCircle(cercle);
//Si result vaux true, alors l'objet box est en collision avec l'objet cercle.
//Si result vaux false, alors l'objet box n'est pas en collision avec l'objet cercle.
CollisionBox.prototype.isCollidingCircle = function(circle)
{
var radius = circle.getRadius();

 //On check si la boite englobante du cercle rentre en collision avec this
 if (circle.getX() + radius < this.x)
  return false;
 if (circle.getX() - radius > this.x + this.w)
  return false;
 if (circle.getY() + radius < this.y)
  return false;
 if (this.y - radius > this.y + this.h)
  return false;
 //On check si un des segments de la box rentre en collision avec le cercle
 if (this.isSegmentCollidingCircle(this.x, this.y, this.x + this.w, this.y, circle))
  return true; 
if (this.isSegmentCollidingCircle(this.x + this.w, this.y, this.x + this.w, this.y + this.h, circle))
  return true; 
 if (this.isSegmentCollidingCircle(this.x + this.w, this.y + this.h, this.x, this.y + this.h, circle))
  return true;
 if (this.isSegmentCollidingCircle(this.x, this.y + this.h, this.x, this.y, circle))
  return true;
  //On check si le centre du cercle est dans la box.
  if (circle.getX() > this.x && circle.getX() < this.x + this.w && circle.getY() > this.y && circle.getY() < this.y + this.h)
   return true;
  //on check si les sommets de la box sont a une distance plus petite que le rayon du cercle
  if (Math.sqrt(((this.x - circle.getX()) * (this.x - circle.getX())) + ((this.y - circle.getY()) * (this.y - circle.getY()))) < radius)
   return true;
  if (Math.sqrt(((this.x + this.w - circle.getX()) * (this.x + this.w - circle.getX())) + ((this.y - circle.getY()) * (this.y - circle.getY()))) < radius)
   return true;
  if (Math.sqrt(((this.x + this.w - circle.getX()) * (this.x + this.w - circle.getX())) + ((this.y + this.h - circle.getY()) * (this.y + this.h - circle.getY()))) < radius)
   return true;
  if (Math.sqrt(((this.x - circle.getX()) * (this.x - circle.getX())) + ((this.y + this.h - circle.getY()) * (this.y + this.h - circle.getY()))) < radius)
   return true;
 return false;
}

//Fonction permettant de pouvoir tester les collisions de la box avec une autre box
//considerons l'exemple suivant
//var box1 = new CollisionBox(x1,y1,width1, height1);
//var box2 = new CollisionBox(x2, x2, width2, height2);
//var result = box1.isCollidingBox(box2);
//Si result vaux true, alors l'objet box1 est en collision avec l'objet box2.
//Si result vaux false, alors l'objet box1 et l'objet box2 ne sont pas en collision.
CollisionBox.prototype.isCollidingBox = function(box)
{
 var box_x = box.getX();
 var box_y = box.getY();
 var box_width = box.getWidth();
 var box_height = box.getHeight();
 
 if (this.x + this.w < box_x)
  return false;
 if (this.x > box_x + box_width)
  return false;
 if (this.y + this.h < box_y)
  return false;
 if (this.y > box_y + box_height)
  return false;
return true;
}

//Fonction permettant de configurer la position horizontale de la box
CollisionBox.prototype.setX = function(val)
{
 this.x = val;
}

//Fonction permettant de recuperer la position horizontale de la box
CollisionBox.prototype.getX = function()
{
 return this.x;
}

//Focntion permettant de configurer la position verticale de la box
CollisionBox.prototype.setY = function(val)
{
 this.y = val;
}

//Fonction permettant de recuperer la position verticale de la box
CollisionBox.prototype.getY = function()
{
 return this.y;
}

//Fonction permettant de configurer la largeur de la box
CollisionBox.prototype.setWidth = function(val)
{
 this.w = val;
}

//Fonction permettant de recuperer la largeur de la box
CollisionBox.prototype.getWidth = function()
{
 return this.w;
}

//fonction permettant de configurer la hauteur de la box
CollisionBox.prototype.setHeight = function(val)
{
 this.h = val;
}

//Fonction permettant de recuperer la hauteur de la box
CollisionBox.prototype.getHeight = function()
{
 return this.h;
}
