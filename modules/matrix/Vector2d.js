//Classe permettant de definir des vecteurs 2d
function Vector2d(x, y)
{
 this.x = x;
 this.y = y;
}

//Focntion permettant d'ajouter deux vecteurs
Vector2d.prototype.add = function(vector) {
 return new Vector2d(this.x + vector.getX(), this.y + vector.getY());
}

//Fonction permettant de soustraire deux vecteurs
Vector2d.prototype.sub = function(vector) {
 return new Vector2d(this.x - vector.getX(), this.y - vector.getY());
}

//Fonction permettant de multiplier un vecteur par un scalaire
Vector2d.prototype.mult = function(scalar) {
 return new Vector2d(this.x * scalar, this.y * scalar);
}

//Focntion permettant de diviser un vecteur par un scalaire
Vector2d.prototype.div = function(scalar) {
 return new Vector2d(this.x / scalar, this.y / scalar);
}

//Permet de recuperer la valeur de x du vecteur
Vector2d.prototype.getX = function() {
 return this.x;
}

//Permet de recuperer la valeur de y du vecteur
Vector2d.prototype.getY = function() {
 return this.y;
}

//Permet de set la valeur de x du vecteur
Vector2d.prototype.setX = function(x) {
 this.x = x;
}

//Permet de set la valeur de y du vecteur
Vector2d.prototype.setY = function(y) {
 this.y = y;
}

//Permet de normaliser le vecteur
Vector2d.prototype.normalize = function() {
 var length = Math.sqrt((this.x * this.x) + (this.y * this.y));
 this.x = this.x / length;
 this.y = this.y / length;
}

//Permet de recuperer la longueur du vecteur
Vector2d.prototype.getLength = function() {
 return Math.sqrt((this.x * this.x) + (this.y * this.y));
}

//Permet de pouvoir configurer la longueur du vecteur
Vector2d.prototype.setLength = function(length) {
 this.normalize();
 this.x = this.x * length;
 this.y = this.y * length;
}

//Permet de pouvoir recuperer l'angle du vecteur (en degree)
Vector2d.prototype.getAngle = function() {
 if (this.x == 0)
  {
   if (this.y > 0)
    return 90;
   if (this.y < 0)
    return -90;
   if (this.y == 0)
    return 0;
  }
 return Math.atan(this.y / this.x) * 180.0 / Math.PI;
}


//Permet de pouvoir set l'angle du vecteur (en degree)
Vector2d.prototype.setAngle = function(angle) {
 var length = this.getLength();
 this.x = Math.cos(angle / 180.0 * Math.PI) * length;
 this.y = Math.sin(angle / 180.0 * Math.PI) * length;
}

//Dot product
Vector2d.prototype.dotProduct = function(vector2) {
 return ((this.x * vector2.getX()) + (this.y * vector2.getY()));
}

//Permet de recuperer l'angle entre deux vecteurs (en degree)
Vector2d.prototype.getAngleBeetween = function(vector2) {
 var dot_prod = this.dotProduct(vector2);
 var length_v1 = this.getLength();
 var length_v2 = vector2.getLength();
 var cos = dot_prod / (length_v1 * length_v2);
 return Math.acos(cos) * 180.0 / Math.PI;
}

//Permet de recuperer le cross product (produit scalaire)
Vector2d.prototype.crossProduct = function(vector2) {
 return ((this.x * vector2.getY())-(this.y * vector2.getX()));
}

//Permet de recuperer le determinant des deux vecteurs
//si la fonction return une valeur > 0 alors vector est a gauche de this
//si la fonction return une valeur < 0 alors vector est a droite de this
//si la fonction return une valeur = 0 alors vector est superpose a this
//Peut etre tres utile pour certains algos de collisions !
Vector2d.prototype.getDet = function(vector) {
 return this.crossProduct(vector);
}

//Permet d'afficher le vecteur
Vector2d.prototype.dump = function() {
 window.alert("[x="+this.x +"; y="+this.y+"]");
}
