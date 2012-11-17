/**
 @module Layer
 @namespace Graphic
 */

var TW = TW || {};
TW.Graphic = TW.Graphic || {};

/* The Layer class can hold several GraphicObjects and it provides some transformations methods to move or scale all the
GraphicalObjects that it contains. This is helpful when you want for example apply the same plane transformation to some
GraphicalObjects

@type {Layer}
@constructor
 */

TW.Graphic.Layer = function() {
	function Layer(param) {
		TW.Graphic.GraphicObject.call(this, param);

		this._camera = (param.camera ? param.camera : null);
		this._spatialContainer = (param.spatialContainer ? param.spatialContainer : this._spatialContainer = new TW.Graphic.SpatialContainer());
		(param.localCanvas ? this._localCanvas = param.localCanvas : this._localCanvas = document.createElement('canvas').getContext("2d"));
		this._localCanvas.canvas.width = param.width;
		this._localCanvas.canvas.height = param.height;
		this._needToRedraw = true;
	}

	TW.Utils.inherit(Layer, TW.Graphic.GraphicObject);

	/**
	 * This method allow the user to get the current camera used into the Layer.
	 * @method getCamera
	 * @return {TW.Graphic.Camera}
	 */

	Layer.prototype.getCamera = function() {
		return this._camera;
	};
	
	
	
	
	/**
	* This method allow the user to draw on the canvas's context. If nothing has changed in the childs of the layer, then a buffered layer is printed on the canvas. Otherwise
	* all the canvas is redraw.
	* 
	* @method draw
	*/
	Layer.prototype.draw = function(context) {
		if (this._needToRedraw === true) {
			this.localCanvas.save();
			this._camera.prepare(this.localCanvas);
			this.spatialContainer.applyAll(function(child) {
				child.draw(this.localCanvas);
			}.bind(this));
			this.localCanvas.restore();
			this._needToRedraw = false;
		}
		context.save();
		this._matrix.transformContext(context);
		context.drawImage(this.localCanvas, 0, 0, this.localCanvas.width, this.localCanvas.height);
		context.restore();
	};

	/**
	 * This method allow you to set the dimensions of the layer.
	 *
	 * @method setDimensions
	 * @param obj this object must contains the width and the height of the object like this : `{obj.width, obj.height}`
	 * @return {Boolean} this method returns false if the obj parameter isn't a valid object, otherwise this method
	 * returns true.
	 */
	Layer.prototype.setDimensions = function(obj) {
		this._callParentOnChange();
		if (obj && obj.width && obj.height && obj.width > 0 && obj.height > 0) {
	        this.width = obj.width;
	        this.height = obj.height;
			this._localCanvas.width = obj.width;
			this._localCanvas.height = obj.height;
			return true;
		} else {
			return false;
		}
	};

	/**
	 * This method allow you to set the camera object of the layer.
	 *
	 * @method setCamera
	 * @param camera this object is the camera object to affect to the Layer.
	 */
	Layer.prototype.setCamera = function(camera) {
		this._callParentOnChange();
		this._camera = camera;
	};

	/**
	 * This method allow you yo get the spatial container of the Layer.
	 *
	 * @method getSpatialContainer
	 * @return {TW.Graphic.SpatialContainer} this function returns the spatial container of the layer. If no spatial
	 * container was assigned to the Layer object. Then this method will returns null
	 */
	Layer.prototype.getSpatialContainer = function() {
		return this._spatialContainer;
	};

	/**
	 * This method allow you to set the spatial container of the Layer.
	 *
	 * @method setSpatialContainer
	 * @param spatialContainer this parameter must be a valid spatialContainer, otherwise the method will have an
	 * undefined behavior.
	 * @return {Boolean} this method will returns true if the spatialContainer is a valid object, otherwise it will return false.
	 */
	Layer.prototype.setSpatialContainer = function(spatialContainer) {
		if (spatialContainer) {
this._callParentOnChange();
			this._spatialContainer = spatialContainer;
			return true;
		} else {
			return false;
		}
	};

	/**
	 * This method will allow you to add a child to the current Layer.
	 *
	 * @method addChild
	 * @param graphicObject this parameter must be a valid GraphicObject, otherwise the method will have an undefined
	 * behavior.
	 * @return {Boolean} this method will return false if the graphicObject parameter is a valid object. Otherwise it
	 * will returns true.
	 */
	Layer.prototype.addChild = function(graphicObject) {
		if (graphicObject) {
			this._callParentOnChange();
			this._spatialContainer.addElement(graphicObject);
			graphicObject.setParent(this);
			return true;
		} else {
			return false;
		}
	};

	/**
	 * This method will allow you to remove a child from the current Layer.
	 *
	 * @method rmChild
	 * @param {GraphicObject} graphicObject this parameter is the GraphicObject that the method will try to find inside the child of
	 * the current layer.
	 * @return {Boolean} if the graphicObject was finded in the childs of the current layer then the method
	 * will returns true, otherwise the method will returns true.
	 */
	Layer.prototype.rmChild = function(graphicObject) {
		this._callParentOnChange();
		return this.spatialContainer.rmElement(graphicObject);
	};
	
	
	/**
	* This method is called when something is changed into the layer or into the layer's childs.
	*
	* @private
	* @method _callParentOnChange
	* @return {Boolean} if the method succeed then it returns true otherwise it returns false.
	* @protected
	*/
	Layer.prototype._callParentOnChange = function() {
	 this._needToRedraw = true;
	 if (this.parent) {
		this.parent.onChange(this);
		return true;
	 }
	 return false;
	};

	/**
	 * This method will allow you to update the layer and all the childs within the layer.
	 *
	 * @return {Boolean} if every childs of the layer have been updated with success then the method will returns true.
	 * Otherwise the method will returns false.
	 */
	Layer.prototype.update = function() {
		this.spatialContainer.applyAll(function(child) {
			if (this._childs.update) {
				this._childs.update();
			}
		});
	};

	/**
	* This method will be called when a child is changed. By using this method it will notice the current Layer to redraw the local canvas.
	*
	* @param {GraphicObject} child this object represent the child who has been changed.
	* @return {Boolean} This function will return true if the onChange function otherwise it will return false.	
	*/
	Layer.prototype.onChange = function(child) {
		if (child && this.parent && this.parent.onChange) {
			this._callParentOnChange();
		}
		else {
		 return false;
		}
	};

 return Layer;
}();
