var canvas_height = 500;
var canvas_width = 500;

window.onload = function () {
//0 = nothing
//1 = circle
//2 = box
 var canvas = document.getElementById("my_canvas");
 var context = canvas.getContext("2d");
 var collide_manager = new CollideManager();
 var map = [0,0,0,0,0,0,0,0,0,0,
			0,1,0,2,0,1,0,2,0,0,
			0,0,0,0,0,0,0,0,0,0,
			0,1,0,0,0,2,0,2,0,0,
			0,0,2,0,1,0,0,0,0,0,
			2,0,0,0,0,0,0,1,0,0,
			0,0,1,2,0,0,0,0,0,0,
			0,0,0,0,0,0,2,0,1,0,
			0,1,0,1,0,0,0,0,0,0,
			0,0,2,0,0,0,2,0,2,0];
 fillCollideManager(collide_manager, map);
 callback = function(){
 collide_manager.update();
 context.clearRect(0, 0, 900, 900);
 collide_manager.draw(context); 
 }
 window.setInterval(callback, 1000 / 30);
// collide_manager.update();
// collide_manager.draw(context);
};

function fillCollideManager(collide_manager, map)
{
 var i = 0;
 var length = map.length;
 
 while (i < length)
 {
  if (map[i] == 1)
   {
    collide_manager.pushCircle(new Circle(((i % 10) * 50) + 25,(Math.floor(i / 10) * 50) + 25,25));
   }
  if (map[i] == 2)
   {
    collide_manager.pushBox(new Rect((i % 10) * 50, Math.floor(i / 10) * 50, 50, 50));
   }
  i++;
 }
}


function CollideManager(){
 this.collideArrayCircle = new Array();
 this.collideArrayBox = new Array();
}

CollideManager.prototype.pushBox = function(box)
{
 this.collideArrayBox.push(box);
}

CollideManager.prototype.pushCircle = function(circle)
{
 this.collideArrayCircle.push(circle);
}

CollideManager.prototype.draw = function(context)
{
 var length = this.collideArrayBox.length;
 var  i = 0;
 while (i < length)
 {
  this.collideArrayBox[i].draw(context);
  i++;
 }
 i = 0;
 length = this.collideArrayCircle.length;
 while (i < length)
 {
  this.collideArrayCircle[i].draw(context);
  i++;
 }
}

CollideManager.prototype.update = function()
{
 var length = this.collideArrayBox.length;
 var i = 0;
 
 while (i < length)
 {
  this.collideArrayBox[i].setColor(0, 0, 0);
  i++;
 }
 i = 0;
 length = this.collideArrayCircle.length;
 while (i < length)
 {
  this.collideArrayCircle[i].setColor(0, 0, 0);
  i++;
 }
 //check des collision entre box
 i = 0;
 length = this.collideArrayBox.length;
 while (i < length)
 {
  var i2 = 0;
  while (i2 < length)
  {
   if (i != i2)
    {
	 if (this.collideArrayBox[i].getCollisionBox().isCollidingBox(this.collideArrayBox[i2]))
	 {
		this.collideArrayBox[i].setColor(255, 0, 0);
		this.collideArrayBox[i2].setColor(255, 0, 0);
	 }
	}
   i2++;
  }
  i++;
 }
 //Check des collisons entre cercles
 var length = this.collideArrayCircle.length;
i = 0;
 while (i < length)
 {
  var i2 = 0;
  while (i2 < length)
  {
   if (i != i2)
    {
	 if (this.collideArrayCircle[i].getCollisionCircle().isCollidingCircle(this.collideArrayCircle[i2]))
	 {
		this.collideArrayCircle[i].setColor(255, 0, 0);
		this.collideArrayCircle[i2].setColor(255, 0, 0);
	 }
	}
   i2++;
  }
  i++;
 }
 //check des collisions entre cercles et box
/*i = 0;
var length_box = this.collideArrayBox.length;
length = this.collideArrayCircle.length;
 while (i < length)
 {
  var i2 = 0;
  while (i2 < length_box)
  {
	 if (this.collideArrayCircle[i].getCollisionCircle().isCollidingBox(this.collideArrayBox[i2]))
	 {
		this.collideArrayCircle[i].setColor(255, 0, 0);
		this.collideArrayBox[i2].setColor(255, 0, 0);
	 }
   i2++;
  }
  i++;
 }*/
//check de collisions entre box et cercles
i = 0;
var length_box = this.collideArrayBox.length;
length = this.collideArrayCircle.length;
 while (i < length_box)
 {
  var i2 = 0;
  while (i2 < length)
  {
	 if (this.collideArrayBox[i].getCollisionBox().isCollidingCircle(this.collideArrayCircle[i2]))
	 {
		this.collideArrayBox[i].setColor(255, 0, 0);
		this.collideArrayCircle[i2].setColor(255, 0, 0);
	 }
   i2++;
  }
  i++;
 }
 
 //update des position des cercles
 i = 0;
 length = this.collideArrayCircle.length;
 while (i < length)
 {
  if (this.collideArrayCircle[i].getY() > canvas_height)
   {
    this.collideArrayCircle[i].setDirY(this.collideArrayCircle[i].getDirY() * -1);
   }
  if (this.collideArrayCircle[i].getY() < 0)
  {
   this.collideArrayCircle[i].setDirY(this.collideArrayCircle[i].getDirY() * -1);
  }
  if (this.collideArrayCircle[i].getX() > canvas_width)
  {
   this.collideArrayCircle[i].setDirX(this.collideArrayCircle[i].getDirX() * -1);
  }
  if (this.collideArrayCircle[i].getX() < 0)
  {
   this.collideArrayCircle[i].setDirX(this.collideArrayCircle[i].getDirX() * -1);
  }
  this.collideArrayCircle[i].setX(this.collideArrayCircle[i].getDirX() + this.collideArrayCircle[i].getX());
  this.collideArrayCircle[i].setY(this.collideArrayCircle[i].getDirY() + this.collideArrayCircle[i].getY());
  i++;
 }
 //update des position des rectangles.
 i = 0;
 length = this.collideArrayBox.length;
 while (i < length)
 {
  if (this.collideArrayBox[i].getY() > canvas_height)
   {
    this.collideArrayBox[i].setDirY(this.collideArrayBox[i].getDirY() * -1);
   }
  if (this.collideArrayBox[i].getY() < 0)
  {
   this.collideArrayBox[i].setDirY(this.collideArrayBox[i].getDirY() * -1);
  }
  if (this.collideArrayBox[i].getX() > canvas_width)
  {
   this.collideArrayBox[i].setDirX(this.collideArrayBox[i].getDirX() * -1);
  }
  if (this.collideArrayBox[i].getX() < 0)
  {
   this.collideArrayBox[i].setDirX(this.collideArrayBox[i].getDirX() * -1);
  }
  this.collideArrayBox[i].setX(this.collideArrayBox[i].getDirX() + this.collideArrayBox[i].getX());
  this.collideArrayBox[i].setY(this.collideArrayBox[i].getDirY() + this.collideArrayBox[i].getY());
  i++;
 } 
}

function Rect(x, y, w, h){
 this.box = new CollisionBox(x, y, w, h);
 this.x = x;
 this.y = y;
 this.w = w;
 this.h = h;
 this.r = 0;
 this.v = 0;
 this.b = 0;
 this.dir_x = Math.random() * 5;
 this.dir_y = Math.random() * 5;
}

Rect.prototype.setDir = function(x, y)
{
 this.dir_x = x;
 this.dir_y = y;
}

Rect.prototype.setDirX = function(x)
{
 this.dir_x = x;
}

Rect.prototype.setDirY = function(y)
{
 this.dir_y = y;
}

Rect.prototype.getDirX = function()
{
 return this.dir_x;
}

Rect.prototype.getDirY = function()
{
 return this.dir_y;
}

Rect.prototype.getCollisionBox = function()
{
 return this.box;
}

Rect.prototype.getX = function()
{
 return this.x;
}

Rect.prototype.getY = function()
{
 return this.y;
}

Rect.prototype.getWidth = function()
{
 return this.w;
}

Rect.prototype.getHeight = function()
{
 return this.h;
}

Rect.prototype.setX = function(x)
{
 this.x = x;
 this.box.setX(this.x);
}

Rect.prototype.setY = function(y)
{
 this.y = y;
 this.box.setY(this.y);
}

Rect.prototype.setWidth = function(width)
{
 this.w = width;
 this.box.setWidth(this.w);
}

Rect.prototype.setHeight = function(height)
{
 this.h = height;
 this.box.setHeight(this.h);
}

Rect.prototype.setColor = function(r, v, b)
{
 this.r = r;
 this.v = v;
 this.b = b;
}

Rect.prototype.draw = function(context)
{
 context.save();
 context.fillStyle = "rgb("+this.r+","+this.v+","+this.b+")";
 context.fillRect(this.x, this.y, this.w, this.h);
 context.restore();
}




function Circle(x, y, radius){
 this.circle = new CollisionCircle(x, y, radius);
 this.x = x;
 this.y = y;
 this.radius = radius;
 this.r = 0;
 this.v = 0;
 this.b = 0;
 this.dir_x = Math.random() * 5;
 this.dir_y = Math.random() * 5;
}

Circle.prototype.setDir = function(x, y)
{
 this.dir_x = x;
 this.dir_y = y;
}

Circle.prototype.setDirX = function(x)
{
 this.dir_x = x;
}

Circle.prototype.setDirY = function(y)
{
 this.dir_y = y;
}

Circle.prototype.getDirX = function()
{
 return this.dir_x;
}

Circle.prototype.getDirY = function()
{
 return this.dir_y;
}

Circle.prototype.getCollisionCircle = function()
{
 return this.circle;
}

Circle.prototype.getX = function()
{
 return this.x;
}

Circle.prototype.getY = function()
{
 return this.y;
}

Circle.prototype.getRadius = function()
{
 return this.radius;
}

Circle.prototype.setX = function(x)
{
 this.x = x;
 this.circle.setX(this.x);
}

Circle.prototype.setY = function(y)
{
 this.y = y;
 this.circle.setY(this.y);
}

Circle.prototype.setRadius = function(radius)
{
 this.radius = radius;
 this.circle.setRadius(this.radius);
}

Circle.prototype.setColor = function(r, v, b)
{
 this.r = r;
 this.v = v;
 this.b = b;
}

Circle.prototype.draw = function(context)
{
 context.save();
 context.fillStyle = "rgb("+this.r+","+this.v+","+this.b+")";
 context.beginPath();
 context.arc(this.x, this.y, this.radius,Math.PI * 2, 0, true);
 context.closePath();
 context.fill();
 context.restore();
}