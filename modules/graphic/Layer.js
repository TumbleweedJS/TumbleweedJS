/**
 * @module Graphic
 * @namespace Graphic
 */

var TW = TW || {};
define(['./GraphicObject', './SpatialContainer', './Camera', '../utils/Inheritance', '../utils/Polyfills'],
       function(GraphicObject, SpatialContainer, Camera, inherit) {

	       TW.Graphic = TW.Graphic || {};


	       /**
	        * The Layer class can hold several GraphicObjects and it provides some transformations methods to move or
	        * scale all the GraphicalObjects that it contains. This is helpful when you want for example apply
	        * the same plane transformation to some GraphicalObjects.
	        *
	        * @class Layer
	        * @extends Graphic.GraphicObject
	        * @constructor
	        * @param {Object} params All properties given to
	        *   {{#crossLink "Graphic.GraphicObject"}}GraphicObject{{/crossLink}} are available.
	        *   @param {Camera} [params.camera] camera used be the layer. if not set, a new `Camera` is created.
	        *   @param {SpatialContainer} [params.spatialContainer]
	        *   @param {CanvasRenderingContext2D} [params.localContext] you can set directly
	        *   the graphic canvascontext used by the layer.
	        */
	       function Layer(params) {
		       GraphicObject.call(this, params);
		       params = params || {};

		       /**
		        * camera of the layer.
		        *
		        * **Note: this property should be modified only with `setAttr`.**
		        *
		        * @property {Camera} camera
		        */
		       this.camera = params.camera || new Camera();

		       /**
		        * **Note: this property should be modified only with `setAttr`.**
		        * @property {SpatialContainer} spatialContainer
		        */
		       this.spatialContainer = params.spatialContainer || new SpatialContainer();

		       /**
		        * All layers use a local 2D context canvas for rendering object.
		        * It is used as a cache layer, and redrawn only when needed.
		        *
		        * Directly set the cache context can be usefull for debug.
		        *
		        * **Note: this property should be modified only with `setAttr`.**
		        *
		        * @property {CanvasRenderingContext2D} localContext
		        */
		       this.localContext = params.localContext || document.createElement('canvas').getContext("2d");

		       this.localContext.canvas.width = this.width;
		       this.localContext.canvas.height = this.height;

		       /**
		        * indicate when the cache must be updated.
		        *
		        * @property {Boolean} _needToRedraw
		        * @private
		        */
		       this._needToRedraw = true;
	       }

	       inherit(Layer, GraphicObject);


	       /**
	        * Setter availlable for updating attibuts and correctly clear the caches.
	        * You can set all attributes supported by this instance
	        * (see the GraphicObject constructor for common available properties)
	        *
	        * @example
	        *
	        *      object.setAttr({
			*          width: 20,
	        *          height: 20
	        *      });
	        *
	        *      object.setAttr({
	        *          pos: {
	        *              x: 0,
	        *              y: 0
	        *          }
	        *      });
	        *
	        * @method setAttr
	        * @param {Object} attrs Layer attributs. See the constructor for more details.
	        * @chainable
	        */
	       Layer.prototype.setAttr = function(attrs) {
		       GraphicObject.setAttr(attrs);
		       this.localContext.canvas.width = this.width;
		       this.localContext.canvas.height = this.height;
	       };

	       /**
	        * This method allow the user to draw on the canvas's context.
	        * If nothing has changed in the childs of the layer, then a buffered layer is printed on the canvas.
	        * Otherwise all the canvas is redraw.
	        *
	        * @method draw
	        * @param {CanvasRenderingContext2D} context
	        */
	       Layer.prototype.draw = function(context) {
		       if (this._needToRedraw === true) {
			       this.localContext.save();
			       this.camera.prepare(this.localContext);
			       this.spatialContainer.applyToZone([
				                                         {x: 0, y: 0},
				                                         {x: 0, y: this.height},
				                                         {x: this.width, y: this.height},
				                                         {x: this.width, y: 0}
			                                         ], function(child) {
				       child.draw(this.localContext);
			       }.bind(this));
			       this.localContext.restore();
			       this._needToRedraw = false;
		       }
		       context.save();
		       context.translate(this.x, this.y);
		       this.matrix.transformContext(context);
		       context.drawImage(this.localContext.canvas, -this.centerPoint.x, -this.centerPoint.y, this.width,
		                         this.height);
		       context.restore();
	       };

	       /**
	        * This method will allow you to add a child to the current Layer.
	        *
	        * @method addChild
	        * @param {GraphicObject} graphicObject this parameter must be a valid GraphicObject, otherwise the method
	        * will have an undefined behavior.
	        */
	       Layer.prototype.addChild = function(graphicObject) {
		       if (!(graphicObject instanceof GraphicObject)) {
			       throw new Error("bad param");
		       }
		       this.spatialContainer.addElement(graphicObject);
		       graphicObject.parent = this;
		       this.onChange(graphicObject);
	       };

	       /**
	        * This method will allow you to remove a child from the current Layer.
	        *
	        * @method rmChild
	        * @param {GraphicObject} graphicObject this parameter is the GraphicObject that the method will try
	        * to find inside the child of the current layer.
	        */
	       Layer.prototype.rmChild = function(graphicObject) {
		       this.spatialContainer.removeElement(graphicObject);
		       this.onChange(null);
	       };

	       /**
	        * This method will allow you to update the layer and all the childs within the layer.
	        *
	        * @method update
	        */
	       Layer.prototype.update = function(elapsedTime) {
		       this.spatialContainer.applyAll(function(child) {
			       if (child.update) {
				       child.update(elapsedTime);
			       }
		       });
	       };

	       /**
	        * This method will be called when a child is changed.
	        * By using this method it will notice the current Layer to redraw the local canvas.
	        *
	        * This method is called automatically when a child object change.
	        * You can call this method for clear internal cache.
	        *
	        * @method onChange
	        * @param {GraphicObject} [child] this object represent the child who has been changed.
	        */
	       Layer.prototype.onChange = function(child) {
		       this._needToRedraw = true;
		       return this.notifyParentChange();
	       };

	       TW.Graphic.Layer = Layer;
	       return Layer;
       });
