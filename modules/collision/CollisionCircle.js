//La classe collisionCircle permet de pouvoir tester les collisions entre un cercle et d'autres primitives
//Le constructeur de la classe CollisionCircle prend les arguments suivants :
//x pour la position en abscisse du cercle.
//y pour la position en ordonnee du cercle.
//radius pour le rayon du cercle
function CollisionCircle(x, y, radius)
{
 this.type = "CollisionCircle";
 this.x = x;
 this.y = y;
 this.radius = radius;
 this.x_centerPoint = 0;
 this.y_centerPoint = 0;
 this.angle = 0;
}

//Fonction permettant de pouvoir tester les collisions du cercle avec un autre cercle.
//considerons l'exemple suivant
//var cercle = new CollisionCircle(x,y,radius);
//var cercle2 = new CollisionCircle(x2, x2, radius2);
//var result = cercle.isCollidingCircle(cercle2);
//Si result vaux true, alors l'objet cercle est en collision avec l'objet cercle2.
//Si result vaux false, alors l'objet cercle n'est pas en collision avec l'objet cercle2.
CollisionCircle.prototype.isCollidingCircle = function(circle)
{
 var circle_x = circle.getX();
 var circle_y = circle.getY();

 var dist = Math.sqrt(((circle_x - this.x)*(circle_x - this.x)) + ((circle_y - this.y)*(circle_y - this.y)));
 if (dist < this.radius + circle.getRadius())
  {
   return true;
  }
  return false;
}

//Fonction permettant de pouvoir tester si un segment est en collision avec un cercle.
//[ax; ay] definissent le point de depart du segment
//[bx;by] definissent le point de fin du segment
//circle represente le cercle avec lequel on veux tester l'intersection
CollisionCircle.prototype.isCollidingSegment = function(val_a_x, val_a_y, val_b_x, val_b_y)
{
 var a_x = val_a_x;
 var a_y = val_a_y;
 var b_x = val_b_x;
 var b_y = val_b_y;
 var v_x = b_x - a_x;
 var v_y = b_y - a_y;
 var circle = this;
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


//Fonction permettant de tester si un point est a l'interieur du cercle
//px est l'abscisse du point
//py est l'ordonnee du point
CollisionCircle.prototype.isPointInside = function(px, py)
{
 px = px - this.getX();
 py = py - this.getY();
 if (Math.sqrt((px * px) + (py * py)) <= this.getRadius())
  return true;
 else
  return false;
}

//Fonction permettant de pouvoir tester les collisions du cercle avec une box
//considerons l'exemple suivant
//var cercle = new CollisionCircle(x, y, radius);
//var box = new CollisionBox(x1, y2, width, height);
//var result = cercle.isCollidingBox(box);
//Si result vaux true, alors l'objet cercle est en collision avec l'objet box.
//Si result vaux false, alors l'objet cercle et l'objet box ne sont pas en collision.
CollisionCircle.prototype.isCollidingBox = function(box)
{
 //On check si la boite englobante du cercle rentre en collision avec this
 if (this.x + this.radius < box.getX())
  return false;
 if (this.x - this.radius > box.getX() + box.getWidth())
  return false;
 if (this.y + this.radius < box.getY())
  return false;
 if (this.y - this.radius > box.getY() + box.getHeight())
  return false;
 //On check si les segments de la boite rentrent en collision avec le cercle
 if (this.isCollidingSegment(box.getX(), box.getY(), box.getX() + box.getWidth(), box.getY()))
  return true;
 if (this.isCollidingSegment(box.getX() + box.getWidth(), box.getY(), box.getX() + box.getWidth(), box.getY() + box.getHeight()))
  return true;  
  if (this.isCollidingSegment(box.getX() + box.getWidth(), box.getY() + box.getHeight(), box.getX(), box.getY() + box.getHeight()))
  return true;
  if (this.isCollidingSegment(box.getX(), box.getY() + box.getHeight(), box.getX(), box.getY()))
  return true;
  //On check si le centre du cercle est dans la box.
  if (this.getX() > box.getX() && this.getX() < box.getX() + box.getWidth() && this.getY() > box.getY() && this.getY() < box.getY() + box.getHeight())
   return true;
  //on check si les sommets de la box sont a une distance plus petite que le rayon du cercle
  if (Math.sqrt(((box.getX() - this.getX()) * (box.getX() - this.getX())) + ((box.getY() - this.getY()) * (box.getY() - this.getY()))) < this.radius)
   return true;
  if (Math.sqrt(((box.getX() + box.getWidth() - this.getX()) * (box.getX() + box.getWidth() - this.getX())) + ((box.getY() - this.getY()) * (box.getY() - this.getY()))) < this.radius)
   return true;
  if (Math.sqrt(((box.getX() + box.getWidth() - this.getX()) * (box.getX() + box.getWidth() - this.getX())) + ((box.getY() + box.getHeight() - this.getY()) * (box.getY() + box.getHeight() - this.getY()))) < this.radius)
   return true;
  if (Math.sqrt(((box.getX() - this.getX()) * (box.getX() - this.getX())) + ((box.getY() + box.getHeight() - this.getY()) * (box.getY() + box.getHeight() - this.getY()))) < this.radius)
   return true;
 return false;
}

//Fonction permettant de configurer la position horizontale du cercle
CollisionCircle.prototype.setX = function(val)
{
 this.x = val;
}

//Fonction permettant de recuperer la position horizontale du cercle
CollisionCircle.prototype.getX = function()
{
 return this.x;
}

//Focntion permettant de configurer la position verticale du cercle
CollisionCircle.prototype.setY = function(val)
{
 this.y = val;
}

//Fonction permettant de recuperer la position verticale du cercle
CollisionCircle.prototype.getY = function()
{
 return this.y;
}

//Fonction permettant de configurer la largeur du cercle
CollisionCircle.prototype.setWidth = function(val)
{
 this.w = val;
}

//Fonction permettant de recuperer la largeur du cercle
CollisionCircle.prototype.getWidth = function()
{
 return this.w;
}

//fonction permettant de configurer la hauteur du cercle
CollisionCircle.prototype.setHeight = function(val)
{
 this.h = val;
}

//Fonction permettant de recuperer la hauteur du cercle
CollisionCircle.prototype.getHeight = function()
{
 return this.h;
}


//Permet de recuperer le radius du cercle
CollisionCircle.prototype.getRadius = function()
{
 return this.radius;
}