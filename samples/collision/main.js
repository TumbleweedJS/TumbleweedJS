//Set the canvas dimensions
var canvas_height = 500;
var canvas_width = 500;

window.onload = function () {
//Select the canvas object
    var canvas = document.getElementById("my_canvas");
//Select the context of the canvas
    var context = canvas.getContext("2d");
//Create a collide manager
    var collide_manager = new CollideManager();
//Create a map of CollisionCircles and CollisionBoxes objects
//0 = nothing
//1 = circle
//2 = box
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
//Fill the collide manager with CollisionCircles and CollisionBoxes
    fillCollideManager(collide_manager, map);
//Create the callback
    callback = function(){
        collide_manager.update();
        context.clearRect(0, 0, 900, 900);
        collide_manager.draw(context);
    }
//setup the callback
    window.setInterval(callback, 1000 / 30);
};

//declare fillCollideManager function
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

//Declare CollideManager
function CollideManager(){
    this.collideArrayCircle = new Array();
    this.collideArrayBox = new Array();
}

//This function allow the CollideManager to add a CollideBox to his list.
CollideManager.prototype.pushBox = function(box)
{
    this.collideArrayBox.push(box);
}

//This function allow the CollideManager to add a CollisionCircle to his list.
CollideManager.prototype.pushCircle = function(circle)
{
    this.collideArrayCircle.push(circle);
}

//This function allow the CollideManager to draw all the Circles and the Box in aim to see their interactions.
CollideManager.prototype.draw = function(context)
{
    var length = this.collideArrayBox.length;
    var  i = 0;
    while (i < length)
    {
        //this.collideArrayBox[i].getCollision().draw(context);
        this.collideArrayBox[i].draw(context);
        i++;
    }
    i = 0;
    length = this.collideArrayCircle.length;
    while (i < length)
    {
        //this.collideArrayCircle[i].getCollision().draw(context);
        this.collideArrayCircle[i].draw(context);
        i++;
    }
}

//This function is the heart of the CollideManager, it test collisions beetween Boxes/Boxes, Boxes/Circles, Circles/Circles.
//If there's a collision, then, the objects who are colliding become red. When they aren't colliding anymore they return to black color.
CollideManager.prototype.update = function()
{
    var length = this.collideArrayBox.length;
    var i = 0;

	//Set to black the color of all the boxes
    while (i < length)
    {
        this.collideArrayBox[i].setColor(0, 0, 0);
        i++;
    }
	
	//Set to black the color of all the circles
    i = 0;
    length = this.collideArrayCircle.length;
    while (i < length)
    {
        this.collideArrayCircle[i].setColor(0, 0, 0);
        i++;
    }
	
    //check collisions beetween boxes
    i = 0;
    length = this.collideArrayBox.length;
    while (i < length)
    {
        var i2 = 0;
        while (i2 < length)
        {
            if (i != i2)
            {
			//if a box is colliding another box, then, we color them in red.
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
    //Check des collisons beetween circles
    var length = this.collideArrayCircle.length;
    i = 0;
    while (i < length)
    {
        var i2 = 0;
        while (i2 < length)
        {
            if (i != i2)
            {
			//if a circle is colliding another circle, we color them in red.
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
//check collisions beetween circles and boxes
    i = 0;
    var length_box = this.collideArrayBox.length;
    length = this.collideArrayCircle.length;
    while (i < length_box)
    {
        var i2 = 0;
        while (i2 < length)
        {
		 //if a box is colliding another box, we color them in red.
            if (this.collideArrayBox[i].getCollisionBox().isCollidingCircle(this.collideArrayCircle[i2]))
            {
                this.collideArrayBox[i].setColor(255, 0, 0);
                this.collideArrayCircle[i2].setColor(255, 0, 0);
            }
            i2++;
        }
        i++;
    }

    //update circle position
	//this loop makes circles bouncing on the walls
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

    //update boxes position
	//this loop makes boxes bouncing on the walls
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

//Declaring rect object
function Rect(x, y, w, h){
    this.box = new TW.Collision.CollisionBox(x, y, w, h);
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

//This function allow the user to get the CollisionBox contained in the Rect object.
Rect.prototype.getCollision = function()
{
    return this.box;
}

//This function allow the user to set the direction of the Rect object.
Rect.prototype.setDir = function(x, y)
{
    this.dir_x = x;
    this.dir_y = y;
}

//This function allow the user to set the x coord direction value.
Rect.prototype.setDirX = function(x)
{
    this.dir_x = x;
}

//This function allow the user to set the y coord direction value.
Rect.prototype.setDirY = function(y)
{
    this.dir_y = y;
}

//This function get the x coord direction value.
Rect.prototype.getDirX = function()
{
    return this.dir_x;
}

//This function get the y coord direction value.
Rect.prototype.getDirY = function()
{
    return this.dir_y;
}

//Get the collisionBox of the Rect object
Rect.prototype.getCollisionBox = function()
{
    return this.box;
}

//Get the x coordinate of the Rect object
Rect.prototype.getX = function()
{
    return this.x;
}

//Get the y coordinate of the Rect object
Rect.prototype.getY = function()
{
    return this.y;
}

//Get the width of the Rect object
Rect.prototype.getWidth = function()
{
    return this.w;
}

//Get the height of the Rect object
Rect.prototype.getHeight = function()
{
    return this.h;
}

//Set the x coordinate of the Rect object
Rect.prototype.setX = function(x)
{
    this.x = x;
    this.box.setX(this.x);
}

//Set the y coordinate of the Rect object
Rect.prototype.setY = function(y)
{
    this.y = y;
    this.box.setY(this.y);
}

//Set the width of the Rect object
Rect.prototype.setWidth = function(width)
{
    this.w = width;
    this.box.setWidth(this.w);
}

//Set the height of the Rect object
Rect.prototype.setHeight = function(height)
{
    this.h = height;
    this.box.setHeight(this.h);
}

//Set the color of the Rect object
Rect.prototype.setColor = function(r, v, b)
{
    this.r = r;
    this.v = v;
    this.b = b;
}

//Draw the rect object on the defined context.
Rect.prototype.draw = function(context)
{
    context.save();
    context.fillStyle = "rgb("+this.r+","+this.v+","+this.b+")";
    context.fillRect(this.x, this.y, this.w, this.h);
    context.restore();
}



//Constructor of the Circle object, this object contains a CollisionCircle object.
function Circle(x, y, radius){
    this.circle = new TW.Collision.CollisionCircle(x, y, radius);
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.r = 0;
    this.v = 0;
    this.b = 0;
    this.dir_x = Math.random() * 5;
    this.dir_y = Math.random() * 5;
}

//This function get the Collision circle contained by the Circle object
Circle.prototype.getCollision = function()
{
    return this.circle;
}

//This function set direction of the CollisionCircle object
Circle.prototype.setDir = function(x, y)
{
    this.dir_x = x;
    this.dir_y = y;
}

//This function set x coordinate direction of the Circle object
Circle.prototype.setDirX = function(x)
{
    this.dir_x = x;
}

//This function set the y coordinate direction of the Circle object
Circle.prototype.setDirY = function(y)
{
    this.dir_y = y;
}

//This function allow you to get the x coordinate direction of the Circle object
Circle.prototype.getDirX = function()
{
    return this.dir_x;
}

//This function allow you to get the y direction of the Circle object
Circle.prototype.getDirY = function()
{
    return this.dir_y;
}

//This function allow you to get the CollisionCircle of the Circle object
Circle.prototype.getCollisionCircle = function()
{
    return this.circle;
}

//This function allow you to get the x coordinate of the circle object
Circle.prototype.getX = function()
{
    return this.x;
}

//This function allow you to get the y coordinate of the circle object
Circle.prototype.getY = function()
{
    return this.y;
}

//This function allow you to get the radius of the circle object.
Circle.prototype.getRadius = function()
{
    return this.radius;
}

//This function allow you to set the X coordinate of the Circle object
Circle.prototype.setX = function(x)
{
    this.x = x;
    this.circle.setX(this.x);
}

//This function allow you to set the y coordinate of the Circle object
Circle.prototype.setY = function(y)
{
    this.y = y;
    this.circle.setY(this.y);
}

//This function allow you to set the radius of the Circle object
Circle.prototype.setRadius = function(radius)
{
    this.radius = radius;
    this.circle.setRadius(this.radius);
}

//This function allow you to set the color of the Circle object
Circle.prototype.setColor = function(r, v, b)
{
    this.r = r;
    this.v = v;
    this.b = b;
}

//This function draw the Circle object on the screen on 
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