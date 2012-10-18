/**
 @module Graphic
 @namespace View
 */
/*jshint smarttabs: true */
var TW = TW || {};
TW.Graphic = TW.Graphic || {};

TW.Graphic.View = function() {

	/**
	 The View class allow you to define an object who can hold Layers. You can rotate, scale, and set the position of the View.
	 @class View
	 @constructor
	 @param {Integer} width the width of the View, if a Layer is out of bounds of the View's width object then it will not be drawn
	 @param {Integer} height the height of the View, if a Layer is out of bounds of the View's height object then it will not be drawn
	 @param {CanvasRenderingContext2D} context the canvas' context on which Layers will be drawn
	 */
	function View(width, height, context) {
		this.width = width;
		this.height = height;
		this.layerList = [];
		this.hudList = [];
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
	 @param {HTMLCanvasElement} canvas the canvas to resize.
	 */
	View.prototype.setFullBrowserCanvas = function(canvas) {
		var myWidth;
		var myHeight;
		var oldWidth = canvas.style.width;
		var oldHeight = canvas.style.height;

		myWidth = window.document.body.clientWidth;
		myHeight = window.document.body.clientHeight;
		canvas.style.position = "absolute";
		canvas.style.top = '0px';
		canvas.style.left = '0px';
		canvas.style.width = myWidth + 'px';
		canvas.style.height = myHeight + 'px';
		this.context = canvas.getContext('2d');
		var scaleX = myWidth / oldWidth;
		var scaleY = myHeight / oldHeight;
		this.setScale(scaleX, scaleY);
	};

	/**
	 The setScale method allow you to set the scales factor of the View, note that you can scale each axis independently.
	 @method setScale
	 @param {Number} x scale factor
	 @param {Number} y scale factor
	 */
	View.prototype.setScale = function(x, y) {
		this.scale_x = x;
		this.scale_y = y;
	};

	/**
	 The getScale method allow you to get the scales factors of the View object.
	 @method getScale
	 @return {Object} returns an Object containing the x scale factor and the y scale factor like this one {x: scale_x, y: scale_y}.
	 */
	View.prototype.getScale = function() {
		return {x: this.scale_x, y: this.scale_y};
	};

	/**
	 The setX method allow you to set the x coordinate of the View object.
	 @method setX
	 @param {Integer} x the x coordinate of the View
	 */
	View.prototype.setX = function(x) {
		this.x = x;
	};

	/**
	 The getX method allow you to get the x coordinate of the View object.
	 @method getX
	 @return {Integer} returns the  x coordinate of the View object
	 */
	View.prototype.getX = function() {
		return this.x;
	};

	/**
	 The getY method allow you to get the y coordinate of the View object.
	 @method getY
	 @return {Integer} returns the y coordinate of the View object
	 */
	View.prototype.getY = function() {
		return this.y;
	};

	/**
	 The setY method allow you to set the y coordinate of the View object
	 @method setY
	 @param {Integer} y the y coordinate of the View
	 */
	View.prototype.setY = function(y) {
		this.y = y;
	};

	/**
	 The setRotation method allow you to set the angle of rotation of the View object
	 @method setRotation
	 @param {Integer} angle the angle expressed in degree of the View object
	 */
	View.prototype.setRotation = function(angle) {
		this.rotation = angle / 180.0 * Math.PI;
	};

	/**
	 The setCenterPoint method allow you to set the center point (the center of rotation, scale, and translation) of the View object
	 @method setCenterPoint
	 @param {Integer} x the x coordinate of the center point of the View object.
	 @param {Integer} y the y coordinate of the center point of the View object.
	 */
	View.prototype.setCenterPoint = function(x, y) {
		this.x_center = x;
		this.y_center = y;
	};

	/**
	 The getCenterPoint method allow you to get the center point of the View object
	 @method getCenterPoint
	 @return {Object} returns an object that contains the [x; y] coordinate of the center point of the View object.
	 */
	View.prototype.getCenterPoint = function() {
		return {x: this.x_center, y: this.y_center};
	};

	/**
	 The getRotation method allow you to get the rotation angle of the View object
	 @method getRotation
	 @return {Integer} returns the rotation angle of the View object expressed in degree.
	 */
	View.prototype.getRotation = function() {
		return this.rotation * 180.0 / Math.PI;
	};

	/**
	 The draw method allow you to draw all the Layers contained into the View object, note that draw function will draw recursively all the Layers and apply every transformations recursively too.
	 @method draw
	 @param {CanvasRenderingContext2D} context the canvas's context on which draw method will draw.
	 */
	View.prototype.draw = function(context) {
		var layerListLength = this.layerList.length;
		var i = 0;
		var ctx_tmp = context || 1;

		if (ctx_tmp == 1) {
			ctx_tmp = this.context;
		}
		ctx_tmp.save();
		ctx_tmp.clearRect(0, 0, this.width, this.height);
		ctx_tmp.transform(1, 0, 0, 1, this.x, this.y);
		ctx_tmp.transform(this.scale_x, 0, 0, this.scale_y, 0, 0);
		ctx_tmp.transform(1, 0, 0, 1, this.x_center, this.y_center);
		ctx_tmp.transform(Math.cos(this.rotation), -Math.sin(this.rotation), Math.sin(this.rotation),
		                  Math.cos(this.rotation), 0, 0);
		ctx_tmp.transform(1, 0, 0, 1, -this.x_center, -this.y_center);
		while (i < layerListLength) {
			if (this.layerList[i].getX() < this.width && this.layerList[i].getX() + this.layerList[i].getWidth() >= 0 &&
			    this.layerList[i].getY() < this.height &&
			    this.layerList[i].getY() + this.layerList[i].getHeight() >= 0) {
				this.layerList[i].draw(ctx_tmp);
			}
			i++;
		}
		ctx_tmp.restore();

		var hudListLength = this.hudList.length;
		i = 0;
		while (i < hudListLength) {
			ctx_tmp.save();
			if (this.hudList[i].position == "relative") {
				if (this.hudList[i].left !== null) {
					//On transforme avec la marges left
					ctx_tmp.transform(1, 0, 0, 1, this.hudList[i].left, 0);
				}
				if (this.hudList[i].right !== null) {
					//On transforme avec la marges right
					ctx_tmp.transform(1, 0, 0, 1, this.width - this.hudList[i].right - this.hudList[i].width, 0);
				}
				if (this.hudList[i].top !== null) {
					//On transforme avec la marges top
					ctx_tmp.transform(1, 0, 0, 1, 0, this.hudList[i].top);
				}
				if (this.hudList[i].bottom !== null) {
					//On transforme avec la marges bottom
					ctx_tmp.transform(1, 0, 0, 1, 0, this.height - this.hudList[i].bottom - this.hudList[i].h +
					                                 this.hudList[i].y_center);
				}
				ctx_tmp.transform(this.hudList[i].scale_x, 0, 0, this.hudList[i].scale_y, 0, 0);
				ctx_tmp.transform(1, 0, 0, 1, this.hudList[i].x_center, this.hudList[i].y_center);
				ctx_tmp.transform(Math.cos(this.hudList[i].rotation), -Math.sin(this.hudList[i].rotation),
				                  Math.sin(this.hudList[i].rotation), Math.cos(this.hudList[i].rotation), 0, 0);
				ctx_tmp.transform(1, 0, 0, 1, -this.hudList[i].x_center, -this.hudList[i].y_center);
				this.hudList[i].draw(ctx_tmp);
			} else {
				ctx_tmp.transform(1, 0, 0, 1, this.hudList[i].x, this.hudList[i].y);
				ctx_tmp.transform(this.hudList[i].scale_x, 0, 0, this.hudList[i].scale_y, 0, 0);
				ctx_tmp.transform(1, 0, 0, 1, this.hudList[i].x_center, this.hudList[i].y_center);
				ctx_tmp.transform(Math.cos(this.hudList[i].rotation), -Math.sin(this.hudList[i].rotation),
				                  Math.sin(this.hudList[i].rotation), Math.cos(this.hudList[i].rotation), 0, 0);
				ctx_tmp.transform(1, 0, 0, 1, -this.hudList[i].x_center, -this.hudList[i].y_center);
				this.hudList[i].draw(ctx_tmp);
			}
			ctx_tmp.restore();
			i++;
		}
	};

	/**
	 The getWidth method allow you to get the width of the View.
	 @method getWidth
	 @return {Integer} returns the width of the View
	 */
	View.prototype.getWidth = function() {
		return this.width;
	};

	/**
	 The getHeight method allow you to get the height of the View
	 @method getHeight
	 @return {Integer} returns the height of the View
	 */
	View.prototype.getHeight = function() {
		return this.height;
	};

	/**
	 The getContext method allow you to get the context of the View
	 @method getContext
	 @return {CanvasRenderingContext2D} canvas' context of the View.
	 */
	View.prototype.getContext = function() {
		return this.context;
	};

	/**
	 The setContext method allow you to set the context of the View
	 @method setContext
	 @param {CanvasRenderingContext2D} context the canvas' context to set on the View object.
	 */
	View.prototype.setContext = function(context) {
		this.context = context;
	};

	/**
	 The pushLayer method allow you to add a Layer to the View object.
	 @method pushLayer
	 @param {Layer} layer the Layer object to add to the View object
	 */
	View.prototype.pushLayer = function(layer) {
		layer.setView(this);
		this.layerList.push(layer);
		this.layerList.sort(this._sortLayersByDepth);
	};

	/**
	 The _sortLayersByDepth method is private and sort the Layers of the View by depth in ascending order.
	 @method _sortLayerByDepth
	 @private
	 */
	View.prototype._sortLayersByDepth = function(a, b) {
		return (a.zDepth - b.zDepth);
	};

	/**
	 The pushHUD method allow you to add a HUD object to the View object.
	 @method pushHUD
	 @param {HUD} hudObject the hud object to add to the View object
	 */
	View.prototype.pushHUD = function(hudObject) {
		this.hudList.push(hudObject);
	};

	/**
	 The popHUD method allow you to suppress a HUD object from the View object.
	 @method popHUD
	 @param {HUD} hudObject the hud object to suppress from the View object
	 */
	View.prototype.popHUD = function(hudObject) {
		var size = this.hudList.length;
		var i = 0;

		while (i < size) {
			if (this.hudList[i] === hudObject) {
				this.hudList.splice(i, 1);
			}
			else {
				i++;
			}
		}
	};

	/**
	 The popLayer method allow you to suppress a Layer from the View object.
	 @method popLayer
	 @param {Layer} ref the reference of the Layer object to suppress from the current View object.
	 */
	View.prototype.popLayer = function(ref) {
		var size = this.layerList.length;
		var i = 0;

		while (i < size) {
			if (this.layerList[i] === ref) {
				this.layerList.splice(i, 1);
			} else {
				i++;
			}
		}
	};

	return View;
}();
