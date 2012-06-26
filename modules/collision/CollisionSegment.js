//classe permettant de pouvoir faire des intersections entre segments
function CollisionSegment(x1, y1, x2, y2)
{
 this.px = x1;
 this.py = y1;
 this.vector = new Vector2d(x2 - x1, y2 - y1);
}

//Permet de recuperer le vecteur du segment
CollisionSegment.prototype.getVector = function() {
	return this.vector;
}

//Permet de recuperer la coordonnee x du point de depart du vecteur
CollisionSegment.prototype.getPx = function() {
	return this.px;
}

//Permet de recuperer la coordonnee y du point de depart du vecteur
CollisionSegment.prototype.getPy = function(){
	return this.py;
}

//Permet de tester si un segment est en collision avec un autre.
//si this rentre en collision avec segment, alors la fonction renvoi true
//sinon la fonction renvoi false
CollisionSegment.prototype.isCollidingSegment = function(segment) {
 var ax = this.px;
 var ay = this.py;
 var cx = segment.getPx();
 var cy = segment.getPy();
 var vector_i = this.getVector();
 var vector_j = segment.getVector();
 var k;
 var m;

 var denominateur = (vector_i.getX() * vector_j.getY()) - (vector_i.getY() * vector_j.getX());
 if (denominateur == 0)
 	return false;
 m = -((-vector_i.getX() * ay) + (vector_i.getX() * cy) + (vector_i.getY() * ax) - (vector_i.getY() * cx)) / denominateur;
 k = -((ax * vector_j.getY()) - (cx * vector_j.getY()) - (vector_j.getX() * ay) + (vector_j.getX() * cy)) / denominateur
 if (0 <= m && m <= 1 && 0 <= k && k <= 1)
  return true;
 else
  return false; 
}

//Permet de tester si un segment est en collision avec un cercle
//si this est en collision avec cercle alors la fonction renvoi true
//sinon la fonction renvoi false
CollisionSegment.prototype.isCollidingCircle = function(circle) {
 var a_x = this.px;
 var a_y = this.py;
 var b_x = ax + this.vector.getX();
 var b_y = ay + this.vector.getY();
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
//TODO, le reste de la classe permettant de tester des intersections entre les segments.