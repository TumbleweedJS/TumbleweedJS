/**
   @module Graphic
   @namespace Graphic
*/

var TW = TW || {};
TW.Graphic = TW.Graphic || {};

TW.Graphic.View = function() {

    /**
       The View container is like a layer where you pin other Views and some Sprites.
       You can set the position, scale and rotation of the View, pinned elements are transformed by the position scale and rotation of the View.
       The constructor View takes the following parameters : context, x, y, width, height.

       @class View
       @constructor
       @param {graphicalContext2d} context the graphical context used by the View to draw on.
       @param {integer} x the x coordinate of the View
       @param {integer} y the y coordinate of the View
       @param {integer} width the width of the View
       @param {integer} height the height of the View 
    */
    function View(context, x, y, width, height)
    {
	/**
	   the x coordinate of the View
	   @property {integer} x
	*/
	this.x = x;
	/**
	   the y coordinate of the View
	   @property {integer} y
	*/
	this.y = y;
	/**
	   the width of the View
	   @property {integer} width
	*/
	this.width = width;
	/**
	   The height of the View
	   @property {integer} height
	*/
	this.height = height;
	this.listSprite = new Array();
	this.listView = new Array();
	this.context = context;
	this.parentWindow = 0;
	this.parentView = 0;
	this.rotation = 0;
	this.x_center = 0;
	this.y_center = 0;
	this.x_scale = 1.0;
	this.y_scale = 1.0;
    }

    /**
       This method allow the user to get the width of the View

       @method getWidth
       @return {integer} width the width of the View
    */
    View.prototype.getWidth = function()
    {
	return this.width;
    }

    /**
       The method allow the user to get the height of the View

       @method getHeight
       @return {integer} height the height of the View
    */
    View.prototype.getHeight = function()
    {
	return this.height;
    }

    /**
       This method allow you to set the rotation angle of the View

       @method setRotation
       @param {float} rot the angle of rotation in degree
    */
    View.prototype.setRotation = function(rot)
    {
	this.rotation = rot / 180.0 * Math.PI;
    }

    /**
       This method allow you to get the rotation angle of the View

       @method getRotation
       @return {float} angle return the angle of rotation of the View
    */
    View.prototype.getRotation = function()
    {
	return this.rotation * 180.0 / Math.PI;
    }

    /**
       This method allow you to set the center point of the View, Note that the center point is the center of rotation and the center of scale.

       @method setCenterPoint
       @param {integer} x the x coordinate of the View
       @param {integer} y the y coordinate of the View
    */
    View.prototype.setCenterPoint = function(x, y)
    {
	this.x_center = x;
	this.y_center = y;
    }

    /**
       This method allow you to get the center point of the View

       @method getCenterPoint
       @return {Object} the return value of the getCenterPoint who's structured like this {x: x_center, y: y_center}.
    */
    View.prototype.getCenterPoint = function()
    {
	return {x: this.x_center, y: this.y_center};
    }

    /**
       This method allow you to set the scale of the View, note that all View's child are transformed by the scale value

       @method setScale
       @param {float} x x scale factor of the View
       @param {float} y y scale factor of the View
    */
    View.prototype.setScale = function(x, y)
    {
	this.x_scale = x;
	this.y_scale = y;
    }

    /**
       This method allow you to get the scale of the View.

       @method getScale
       @return {Object} obj the return object contains the x and the y factor {x: x_scale, y: y_scale}.
    */
    View.prototype.getScale = function()
    {
	return {x: this.x_scale, y: this.y_scale};
    }

    /**
       This method allow you to set the parent window of the View.

       @method setWindow
       @param {Window} window_object the parent window of the View.
    */
    View.prototype.setWindow = function(window_object)
    {
	this.parentWindow = window_object;
    }

    /**
       This method allow you to set the parent view of the current view object.

       @method setParentView
       @param {View} view the parent view of the current view.
    */
    View.prototype.setParentView = function(view)
    {
	this.parentView = view;
    }

    /**
       This method allow you to get the parent view of the current view

       @method getParentView
       @return {View} view the parent view of the current view object.
    */
    View.prototype.getParentView = function()
    {
	return this.parentView;
    }

    /**
       This method allow you to set the parent Window of the View

       @method setParentWindow
       @param {Window} window the parent window of the View
    */
    View.prototype.setParentWindow = function(window)
    {
	this.parentWindow = window;
    }

    /**
       This method allow you to get the parent window of the View

       @method getWindow
       @return {Window} window the parent window of the View
    */
    View.prototype.getWindow = function()
    {
	return this.parentWindow;
    }

    /**
       This method allow you to resize the View

       @method resize
       @param {integer} the width of the View
       @param {integer} the height of the View
    */
    View.prototype.resize = function(w, h)
    {
	this.width = w;
	this.height = h;
    }

    /**
       This method allow you to specify the new position of the View

       @method move
       @param {integer} the new x coordinate of the View
       @param {integer} the new y coordinate of the View
    */
    View.prototype.move = function(x, y)
    {
	this.x = x;
	this.y = y;
    }

    /**
       This method allow you to get the position of the View

       @method getPos
       @return {Object} position an object who specify the coordinates of the View like this {x : x_pos, y : y_pos}
    */
    View.prototype.getPos = function()
    {
	return {x: this.x, y: this.y};
    }

    /**
       This method allow you to get the dimensions (width and height) of the View

       @method getDim
       @return {Object} dimension an object who specify the width and the height of the View like this {w: width, h: height}
    */
    View.prototype.getDim = function()
    {
	return {w: this.width, h: this.height};
    }

    /**
       This method allow you to push a view into the view, note that a view can hold other view, that make a kind of tree.

       @method pushView
       @param {View} view the View object to add to the current View
    */
    View.prototype.pushView = function(view)
    {
	this.listView.push(view);
    }

    /**
       This method allow you supress an internal view from the current view.

       @method popView
       @param {View} ref the reference to the view to erase from the current view.
       @return {boolean} bool return true if the ref was succesfully removed from the current View, otherwise it returns false.
    */
    View.prototype.popView = function (ref)
    {
	var length = this.listView.length;
	var i = 0;

	while (i < length)
	{
	    if (this.listView[i] === id)
	    {
		this.listView.split(i, 1);
		return true;
	    }
	    else
	    {
		i++;
	    }
	}
	return false;
    }

    /**
       This method allow you to draw a View on a specified context, Note that when you add a view to a window object and then call the draw method of the window object, then the draw method of the window's views methods are called.

       @method draw
       @param {graphicalContext2d} ctx the canvas' context to draw on.
    */
    View.prototype.draw = function(ctx)
    {
	var length = this.listView.length;
	var i = 0;
	var tmp_ctx = ctx || 1;

	if (tmp_ctx == 1)
	    tmp_ctx = this.context;
	
	tmp_ctx.save();
	tmp_ctx.transform(1, 0, 0, 1, this.x + this.x_center, this.y + this.y_center);
	tmp_ctx.transform(Math.cos(this.rotation), -Math.sin(this.rotation), Math.sin(this.rotation), Math.cos(this.rotation), 0, 0);
	tmp_ctx.transform(this.x_scale, 0, 0, this.y_scale, 0, 0);
	tmp_ctx.transform(1, 0, 0, 1, -this.x_center, -this.y_center);
	while (i < length)
	{
	    if (this.listView[i].getX() < this.width && this.listView[i].getX() + this.listView[i].getWidth() >= 0 &&
		this.listView[i].getY() < this.height && this.listView[i].getY() + this.listView[i].getHeight() >= 0)
		this.listView[i].draw();
	    i++;
	}
	length = this.listSprite.length;
	i = 0;
	while (i < length)
	{
	    if (this.listSprite[i].getX() < this.width && this.listSprite[i].getX() + this.listSprite[i].getWidth() >= 0 &&
		this.listSprite[i].getY() < this.height && this.listSprite[i].getY() + this.listSprite[i].getHeight() >= 0)
		this.listSprite[i].draw(tmp_ctx);
	    i++;
	}
	tmp_ctx.restore();
    }

    /**
       This method allow you to set a new graphical context to draw on

       @method setContext
       @param {graphicalContext2d} context the canvas' context to draw on.
    */
    View.prototype.setContext = function(context)
    {
	this.context = context;
    }

    /**
       This method allows you to get the context of the View

       @method getContext
       @return {graphicalContext2d} context the canvas' context.
    */
    View.prototype.getContext = function()
    {
	return this.context;
    }


    /**
       This method allow you to push a sprite on the View, when a sprite is pushed on a View, it is automatically drawned by the draw method of the parent View. the pushed Sprite is transformed by the scale, position and rotation of his View owner.

       @method pushSprite
       @param {Sprite} sprite the sprite to push on the View
    */
    View.prototype.pushSprite = function(sprite)
    {
	this.listSprite.push(sprite);
    }

    /**
       This method allow you to push a Text2D object on a View object.

       @method pushText2D
       @param {Text2D} textObject the text object to add to the View
    */
    View.prototype.pushText2D = function(textObject)
    {
	this.listSprite.push(textObject);
    }

    /**
       This method allow you to erase a sprite from the current View

       @method popSprite
       @param {Sprite} ref the sprite to erase from the View
    */
    View.prototype.popSprite = function(ref)
    {
	var spriteListLength = this.spriteList.length;
	var i = 0;

	while (i < spriteListLength)
	{
	    if (spriteList[i] === ref)
		this.spriteList.splice(i,1);
	    else
		i++;
	}
    }

    /**
       This method allow you to get the x coordinate of the View

       @method getX
       @return {integer} x the x coordinate of the View
    */
    View.prototype.getX = function()
    {
	return this.x;
    }

    /**
       This method allow you to get the y coordinate of the View

       @method getY
       @return {integer} y the y coordinate of the View*/
    View.prototype.getY = function()
    {
	return this.y;
    }

    return View;

}();