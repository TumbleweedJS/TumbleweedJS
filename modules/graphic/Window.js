/**
* @module Graphic
*/

/**
The Window class allow you to define an object who can hold Views. Views are likes layers. You can rotate, scale, and set the position of the window.
@class Window
@constructor
@param {integer} width the width of the window, if a View is out of bounds of the window's width object then it will not be drawn
@param {integer} height the height of the window, if a View is out of bounds of the window's height object then it will not be drawn
@param {graphicalContext2d} context the canvas' context on which Views will be drawn
*/
function Window(width, height, context)
{
 this.width = width;
 this.height = height;
 this.viewList = new Array();
 this.rotation = 0;
 this.x_center = 0;
 this.y_center = 0;
 this.x = 0;
 this.y = 0;
 this.scale_x = 1.0;
 this.scale_y = 1.0;
 this.context = context;
}

/**
The setFullBrowserCanvas allow you to apply the same dimension of the actual browser to the canvas object in parameter
@method setFullBrowserCanvas
@param {Canvas} canvas the canvas to resize.
*/
Window.prototype.setFullBrowserCanvas = function(canvas)
{
 var myWidth;
 var myHeight;
 var oldWidth = canvas.style.width;
 var oldHeight = canvas.style.height;
	
 myWidth = window.document.body.clientWidth;
 myHeight = window.document.body.clientHeight;   
 canvas.style.top = '0px';
 canvas.style.left = '0px';
 canvas.style.width = myWidth + 'px';
 canvas.style.height = myHeight + 'px';
 this.context = canvas.getContext('2d');
 var scaleX = myWidth / oldWidth;
 var scaleY = myHeight / oldHeight;
 this.setScale(scaleX, scaleY);
}

/**
The setScale method allow you to set the scales factor of the Window, note that you can scale each axis independently.
@method setScale
@param {float} x scale factor
@param {float} y scale factor
*/
Window.prototype.setScale = function(x, y)
{
 this.scale_x = x;
 this.scale_y = y;
}

/**
The getScale method allow you to get the scales factors of the Window object.
@method getScale
@return {Object} returns an Object containing the x scale factor and the y scale factor like this one {x: scale_x, y: scale_y}.
*/
Window.prototype.getScale = function()
{
 return {x: this.scale_x, y: this.scale_y};
}

/**
The setX method allow you to set the x coordinate of the Window object.
@method setX
@param {integer} x the x coordinate of the window
*/
Window.prototype.setX = function(x)
{
 this.x = x;
}

/**
The getX method allow you to get the x coordinate of the Window object.
@method getX
@return {integer} returns the  x coordinate of the Window object
*/
Window.prototype.getX = function()
{
 return this.x;
}

/**
The getY method allow you to get the y coordinate of the Window object.
@method getY
@return {integer} returns the y coordinate of the Window object
*/
Window.prototype.getY = function()
{
 return this.y;
}

/**
The setY method allow you to set the y coordinate of the window object
@method setY
@param {integer} y the y coordinate of the window
*/
Window.prototype.setY = function(y)
{
 this.y = y;
}

/**
The setRotation method allow you to set the angle of rotation of the window object
@method setRotation
@param {integer} angle the angle expressed in degree of the window object
*/
Window.prototype.setRotation = function(angle)
{
 this.rotation = angle / 180.0 * Math.PI;
}

/**
The setCenterPoint method allow you to set the center point (the center of rotation, scale, and translation) of the window object
@method setCenterPoint
@param {integer} x the x coordinate of the center point of the window object.
@param {integer} y the y coordinate of the center point of the window object.
*/
Window.prototype.setCenterPoint = function(x, y)
{
 this.x_center = x;
 this.y_center = y;
}

/**
The getCenterPoint method allow you to get the center point of the window object
@method getCenterPoint
@return {Object} returns an object that contains the [x; y] coordinate of the center point of the window object.
*/
Window.prototype.getCenterPoint = function()
{
 return {x: this.x_center, y: this.y_center};
}

/**
The getRotation method allow you to get the rotation angle of the window object
@method getRotation
@return {integer} returns the rotation angle of the window object expressed in degree.
*/
Window.prototype.getRotation = function()
{
 return this.rotation * 180.0 / Math.PI;
}

/**
The draw method allow you to draw all the views contained into the Window object, note that draw function will draw recursively all the Views and apply every transformations recursively too.
@method draw
@param {graphicalContext2d} context the canvas's context on which draw method will draw. 
*/
Window.prototype.draw = function (context)
{
 var viewListLength = this.viewList.length;
 var i = 0;
 var ctx_tmp = context || 1;
 
 if (ctx_tmp == 1)
  ctx_tmp = this.context;
 
 ctx_tmp.save();
 ctx_tmp.clearRect(0,0,this.width, this.height);
 ctx_tmp.transform(1, 0, 0, 1, this.x + this.x_center, this.y + this.y_center);
 ctx_tmp.transform(Math.cos(this.rotation), -Math.sin(this.rotation), Math.sin(this.rotation), Math.cos(this.rotation), 0, 0);
 ctx_tmp.transform(this.scale_x, 0, 0, this.scale_y, 0, 0);
 ctx_tmp.transform(1, 0, 0, 1, -this.x_center, -this.y_center);
 while (i < viewListLength)
 {
  if (this.viewList[i].getX() < this.width && this.viewList[i].getX() + this.viewList[i].getWidth() >= 0 &&
      this.viewList[i].getY() < this.height && this.viewList[i].getY() + this.viewList[i].getHeight() >= 0)
    this.viewList[i].draw(ctx_tmp);
  i++;
 }
 ctx_tmp.restore();
}

/**
The getWidth method allow you to get the width of the window.
@method getWidth
@return {integer} returns the width of the window
*/
Window.prototype.getWidth = function ()
{
 return this.width;
}

/**
The getHeight method allow you to get the height of the Window
@method getHeight
@return {integer} returns the height of the window
*/
Window.prototype.getHeight = function ()
{
 return this.height;
}

/**
The getContext method allow you to get the context of the Window
@method getContext
@return {graphicalContext2d} canvas' context of the window.
*/
Window.prototype.getContext = function ()
{
 return this.context;
}

/**
The setContext method allow you to set the context of the window
@method setContext
@param {graphicalContext2d} context the canvas' context to set on the window object.
*/
Window.prototype.setContext = function (context)
{
 this.context = context;
}

/**
The pushView method allow you to add a View to the Window object.
@method pushView
@param {View} view the View object to add to the Window object
*/
Window.prototype.pushView = function(view)
{
 view.setWindow(this);
 this.viewList.push(view);
}

/**
The popView method allow you to suppress a View from the Window object.
@method popView
@param {View} ref the reference of the View object to suppress from the current Window object.
*/
Window.prototype.popView = function(ref)
{
 var size = this.viewList.length;
 var i = 0;

 while (i < size)
 {
  if (this.viewList[i] === ref)
   {
    this.viewList.splice(i, 1);
   }
  else
   {
    i++;
   }
 }
}
