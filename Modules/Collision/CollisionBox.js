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

//Fonction permettant de pouvoir tester les collisions de la box avec un cercle.
//considerons l'exemple suivant
//var cercle = new CollisionCircle(x,y,radius);
//var box = new CollisionBox(x2, x2, width, height);
//var result = box.isCollidingCircle(cercle);
//Si result vaux true, alors l'objet box est en collision avec l'objet cercle.
//Si result vaux false, alors l'objet box n'est pas en collision avec l'objet cercle.
CollisionBox.prototype.isCollidingCircle = function(circle)
{
 //TODO, code de collision cercle box (en prenant en compte les rotations of course).
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
 //TODO, code de collision box box (en prenant en compte les rotations.)
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


//Fonction permettant de configurer la rotation de la box
CollisionBox.prototype.setRotation = function(val)
{
 this.angle = val;
}

//Fonction permettant de recuperer la rotation de la box
CollisionBox.prototype.getRotation = function()
{
 return this.angle;
}

//Fonction permettant de set le point central de la box (c'est lui qui joue le role de pivot de rotation)
CollisionBox.prototype.setCenterPoint = function(valX, valY)
{
 this.x_centerPoint = valX;
 this.y_centerPoint = valY;
}

//Permet de recuperer le centerPoint de la box (le point de pivot de rotation de la box) via un objet contenant les coordonnees x et y.
//Par exemple pour recuperer les coordonnees du centerPoint de la box, il faut faire
//var center_point = box.getCenterPoint();
//var x_center_point = center_point.x;
//var y_center_point = center_point.y;
CollisionBox.prototype.getCenterPoint = function()
{
 return {x: x_centerPoint, y: y_centerPoint};
}
