//classe permettant de pouvoir faire des intersections entre segments
function CollisionSegment(x1, y1, x2, y2)
{
 this.px = x1;
 this.py = y1;
 this.vector = new Vector2d(x2 - x1, y2 - y1);
}

//TODO, le reste de la classe permettant de tester des intersections entre les segments.