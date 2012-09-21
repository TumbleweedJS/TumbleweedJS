/**
 @module Graphic
 @namespace Graphic
 */
/*jshint smarttabs: true */


var TW = TW || {};
TW.Graphic = TW.Graphic || {};

TW.Graphic.Layer = function() {

	/**
	 The Layer container is like a layer where you pin other Layers and some Sprites.
	 You can set the position, scale and rotation of the Layer, pinned elements are transformed by the position scale and rotation of the Layer.
	 The constructor Layer takes the following parameters : context, x, y, width, height.

	 @class Layer
	 @constructor
	 @param {CanvasRenderingContext2D} context the graphical context used by the Layer to draw on.
	 @param {Integer} x the x coordinate of the Layer
	 @param {Integer} y the y coordinate of the Layer
	 @param {Integer} width the width of the Layer
	 @param {Integer} height the height of the Layer
	 */
	function Layer(context, x, y, width, height) {
		/**
		 the x coordinate of the Layer
		 @property {Integer} x
		 */
		this.x = x;
		/**
		 the display depth of the Layer
		 @property {Integer} zDepth
		 */
		this.zDepth = 0;
		/**
		 the y coordinate of the Layer
		 @property {Integer} y
		 */
		this.y = y;
		/**
		 the width of the Layer
		 @property {Integer} width
		 */
		this.width = width;
		/**
		 The height of the Layer
		 @property {Integer} height
		 */
		this.height = height;
		this.listSprite = [];
		this.listLayer = [];
		this.context = context;
		this.parentView = 0;
		this.parentLayer = 0;
		this.rotation = 0;
		this.x_center = 0;
		this.y_center = 0;
		this.x_scale = 1.0;
		this.y_scale = 1.0;
	}

	/**
	 This method allow the user to get the width of the Layer

	 @method getWidth
	 @return {Integer} width the width of the Layer
	 */
	Layer.prototype.getWidth = function() {
		return this.width;
	};

	/**
	 The method allow the user to get the height of the Layer

	 @method getHeight
	 @return {Integer} height the height of the Layer
	 */
	Layer.prototype.getHeight = function() {
		return this.height;
	};

	/**
	 This method allow you to set the rotation angle of the Layer

	 @method setRotation
	 @param {float} rot the angle of rotation in degree
	 */
	Layer.prototype.setRotation = function(rot) {
		this.rotation = rot / 180.0 * Math.PI;
	};

	/**
	 This method allow you to get the rotation angle of the Layer

	 @method getRotation
	 @return {Number} angle return the angle of rotation of the Layer
	 */
	Layer.prototype.getRotation = function() {
		return this.rotation * 180.0 / Math.PI;
	};

	/**
	 This method allow you to set the center point of the Layer, Note that the center point is the center of rotation and the center of scale.

	 @method setCenterPoint
	 @param {Integer} x the x coordinate of the Layer
	 @param {Integer} y the y coordinate of the Layer
	 */
	Layer.prototype.setCenterPoint = function(x, y) {
		this.x_center = x;
		this.y_center = y;
	};

	/**
	 This method allow you to get the center point of the Layer

	 @method getCenterPoint
	 @return {Object} the return value of the getCenterPoint who's structured like this {x: x_center, y: y_center}.
	 */
	Layer.prototype.getCenterPoint = function() {
		return {x: this.x_center, y: this.y_center};
	};

	/**
	 This method allow you to set the scale of the Layer, note that all Layer's child are transformed by the scale value

	 @method setScale
	 @param {float} x x scale factor of the Layer
	 @param {float} y y scale factor of the Layer
	 */
	Layer.prototype.setScale = function(x, y) {
		this.x_scale = x;
		this.y_scale = y;
	};

	/**
	 This method allow you to get the scale of the Layer.

	 @method getScale
	 @return {Object} obj the return object contains the x and the y factor {x: x_scale, y: y_scale}.
	 */
	Layer.prototype.getScale = function() {
		return {x: this.x_scale, y: this.y_scale};
	};

	/**
	 This method allow you to set the parent View of the Layer.

	 @method setView
	 @param {View} view_object the parent view of the Layer.
	 */
	Layer.prototype.setView = function(view_object) {
		this.parentView = view_object;
	};

	/**
	 This method allow you to set the parent Layer of the current Layer object.

	 @method setParentLayer
	 @param {Layer} layer the parent Layer of the current Layer.
	 */
	Layer.prototype.setParentLayer = function(layer) {
		this.parentLayer = layer;
	};

	/**
	 This method allow you to get the parent Layer of the current Layer

	 @method getParentLayer
	 @return {Layer} Layer the parent Layer of the current Layer object.
	 */
	Layer.prototype.getParentLayer = function() {
		return this.parentLayer;
	};

	/**
	 This method allow you to set the parent View of the Layer

	 @method setParentView
	 @param {View} view the parent View of the Layer
	 */
	Layer.prototype.setParentView = function(view) {
		this.parentView = view;
	};

	/**
	 This method allow you to get the parent view of the Layer

	 @method getView
	 @return {View} view the parent View of the Layer
	 */
	Layer.prototype.getView = function() {
		return this.parentView;
	};

	/**
	 This method allow you to resize the Layer

	 @method resize
	 @param {Integer} w the width of the Layer
	 @param {Integer} h the height of the Layer
	 */
	Layer.prototype.resize = function(w, h) {
		this.width = w;
		this.height = h;
	};

	/**
	 This method allow you to specify the new position of the Layer

	 @method move
	 @param {Integer} x the new x coordinate of the Layer
	 @param {Integer} y the new y coordinate of the Layer
	 */
	Layer.prototype.move = function(x, y) {
		this.x = x;
		this.y = y;
	};

	/**
	 This method allow you to get the position of the Layer

	 @method getPos
	 @return {Object} position an object who specify the coordinates of the Layer like this {x : x_pos, y : y_pos}
	 */
	Layer.prototype.getPos = function() {
		return {x: this.x, y: this.y};
	};

	/**
	 This method allow you to get the dimensions (width and height) of the Layer

	 @method getDim
	 @return {Object} dimension an object who specify the width and the height of the Layer like this {w: width, h: height}
	 */
	Layer.prototype.getDim = function() {
		return {w: this.width, h: this.height};
	};

	/**
	 This method allow you to push a Layer into the Layer, note that a Layer can hold other Layer, that make a kind of tree.

	 @method pushLayer
	 @param {Layer} layer the Layer object to add to the current Layer
	 */
	Layer.prototype.pushLayer = function(layer) {
		this.listLayer.push(layer);
		this.listLayer.sort(this._sortSpritesByDepth);
	};

	/**
	 This method allow you supress an internal Layer from the current Layer.

	 @method popLayer
	 @param {Layer} ref the reference to the Layer to erase from the current Layer.
	 @return {boolean} bool return true if the ref was succesfully removed from the current Layer, otherwise it returns false.
	 */
	Layer.prototype.popLayer = function(ref) {
		var length = this.listLayer.length;
		var i = 0;

		while (i < length) {
			if (this.listLayer[i] === ref) {
				this.listLayer.split(i, 1);
				return true;
			}
			else {
				i++;
			}
		}
		return false;
	};

	/**
	 This method allow you to draw a Layer on a specified context, Note that when you add a Layer to a view object and then call the draw method of the view object, then the draw method of the Layers are called recursively.

	 @method draw
	 @param {CanvasRenderingContext2D} ctx the canvas' context to draw on.
	 */
	Layer.prototype.draw = function(ctx) {
		var length = this.listLayer.length;
		var i = 0;
		var tmp_ctx = ctx || 1;

		if (tmp_ctx == 1) {
			tmp_ctx = this.context;
		}
		tmp_ctx.save();
		tmp_ctx.transform(1, 0, 0, 1, this.x, this.y);
		tmp_ctx.transform(this.x_scale, 0, 0, this.y_scale, 0, 0);
		tmp_ctx.transform(1, 0, 0, 1, this.x_center, this.y_center);
		tmp_ctx.transform(Math.cos(this.rotation), -Math.sin(this.rotation), Math.sin(this.rotation),
		                  Math.cos(this.rotation), 0, 0);
		tmp_ctx.transform(1, 0, 0, 1, -this.x_center, -this.y_center);
		while (i < length) {
			if (this.listLayer[i].getX() < this.width && this.listLayer[i].getX() + this.listLayer[i].getWidth() >= 0 &&
			    this.listLayer[i].getY() < this.height &&
			    this.listLayer[i].getY() + this.listLayer[i].getHeight() >= 0) {
				this.listLayer[i].draw();
			}
			i++;
		}
		length = this.listSprite.length;
		i = 0;
		while (i < length) {
			if (this.listSprite[i].getX() < this.width &&
			    this.listSprite[i].getX() + this.listSprite[i].getWidth() >= 0 &&
			    this.listSprite[i].getY() < this.height &&
			    this.listSprite[i].getY() + this.listSprite[i].getHeight() >= 0) {
				this.listSprite[i].draw(tmp_ctx);
			}
			i++;
		}
		tmp_ctx.restore();
	};

	/**
	 This method allow you to set a new graphical context to draw on

	 @method setContext
	 @param {CanvasRenderingContext2D} context the canvas' context to draw on.
	 */
	Layer.prototype.setContext = function(context) {
		this.context = context;
	};

	/**
	 This method allows you to get the context of the Layer

	 @method getContext
	 @return {CanvasRenderingContext2D} context the canvas' context.
	 */
	Layer.prototype.getContext = function() {
		return this.context;
	};


	/**
	 This method allow you to push a sprite on the Layer, when a sprite is pushed on a Layer, it is automatically drawned by the draw method of the parent View. the pushed Sprite is transformed by the scale, position and rotation of his View owner.

	 @method pushSprite
	 @param {Sprite} sprite the sprite to push on the Layer
	 */
	Layer.prototype.pushSprite = function(sprite) {
		this.listSprite.push(sprite);
		this.listSprite.sort(this._sortSpritesByDepth);
	};

	/**
	 This method allow you to push a Text2D object on a Layer object.

	 @method pushText2D
	 @param {Text2D} textObject the text object to add to the Layer
	 */
	Layer.prototype.pushText2D = function(textObject) {
		this.pushSprite(textObject);
	};

	/**
	 The _sortSpritesByDepth method is private and sort the Sprites of the Layer by depth in ascending order.
	 @method _sortSpritesByDepth
	 @private
	 */
	Layer.prototype._sortSpritesByDepth = function(a, b) {
		return (a.zDepth - b.zDepth);
	};

	/**
	 This method allow you to erase a sprite from the current Layer

	 @method popSprite
	 @param {Sprite} ref the sprite to erase from the Layer
	 */
	Layer.prototype.popSprite = function(ref) {
		var spriteListLength = this.spriteList.length;
		var i = 0;

		while (i < spriteListLength) {
			if (this.spriteList[i] === ref) {
				this.spriteList.splice(i, 1);
			} else {
				i++;
			}
		}
	};

	/**
	 This method allow you to get the x coordinate of the Layer

	 @method getX
	 @return {Integer} x the x coordinate of the Layer
	 */
	Layer.prototype.getX = function() {
		return this.x;
	};

	/**
	 This method allow you to get the y coordinate of the Layer

	 @method getY
	 @return {Integer} y the y coordinate of the Layer*/
	Layer.prototype.getY = function() {
		return this.y;
	};

	return Layer;

}();