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
 var dist = Math.sqrl((circle_x - this.x)*(circle_x - this.x)) + ((circle_y - this.y)*(circle_y - this.y)));
 if (dist < this.radius + circle.getRadius())
  {
   return true;
  }
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
 //TODO, code de collision box box (en prenant en compte les rotations.)
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


//Fonction permettant de configurer la rotation du cercle
CollisionCircle.prototype.setRotation = function(val)
{
 this.angle = val;
}

//Fonction permettant de recuperer la rotation du cercle
CollisionCircle.prototype.getRotation = function()
{
 return this.angle;
}

//Fonction permettant de set le point central du cercle (c'est lui qui joue le role de pivot de rotation)
CollisionCircle.prototype.setCenterPoint = function(valX, valY)
{
 this.x_centerPoint = valX;
 this.y_centerPoint = valY;
}

//Permet de recuperer le centerPoint du cercle (le point de pivot de rotation du cercle) via un objet contenant les coordonnees x et y.
//Par exemple pour recuperer les coordonnees du centerPoint du cercle, il faut faire
//var center_point = cercle.getCenterPoint();
//var x_center_point = center_point.x;
//var y_center_point = center_point.y;
CollisionCircle.prototype.getCenterPoint = function()
{
 return {x: x_centerPoint, y: y_centerPoint};
}


//Permet de recuperer le radius du cercle
CollisionCircle.prototype.getRadius = function()
{
 return this.radius;
}