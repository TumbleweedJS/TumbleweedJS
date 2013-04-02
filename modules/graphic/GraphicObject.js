/**
 * @module Graphic
 * @namespace Graphic
 */


define(['../math/Matrix2D', '../utils/Inheritance'], function(Matrix2D) {
	var TW = TW || {};
	TW.Graphic = TW.Graphic || {};


	/**
	 * GraphicObject represent an object that has a relationship with graphical context.
	 * It is the root class of every graphical component of the framework.
	 *
	 * ## General
	 *
	 * It provide many method for manipulate object in 2D space,
	 * keeping a internal matrix. It contain also dimensions, and a reference point
	 * for all transformations (center point).<br />
	 * Each object can have a parent, which is informed to any child modification, with the method `onChange()`.
	 *
	 * GraphicObject contain many properties which can be modified easily. **However, you should use `setAttr` instead
	 * of directly modifing properties, to regenerate the caches if necessary. Direct access don't invalidate caches.**
	 *
	 * ## extend this class
	 *
	 * All 2D graphical objects should inherit from this class.
	 * All inherited class should implement the {{#crossLink "Graphic.GraphicObject/draw"}}{{/crossLink}} method,
	 * not implemented by default.<br />
	 * Inherited class must also inform the parent (if any) after each modification that influence the graphical
	 * render, by calling protected method {{#crossLink "Graphic.GraphicObject/notifyParentChange"}}{{/crossLink}}
	 *
	 *
	 * @class GraphicObject
	 * @param {Object} [params] it is an object that represent the parameters of the graphicalObject to set.
	 *  @param {Number} [params.x=0] position on X axis.
	 *  @param {Number} [params.y=0] position on Y axis.
	 *  @param {Number} [params.width=0] width of the element.
	 *  @param {Number} [params.height=0] height of the element.
	 *  @param {Object} [params.centerPoint] centerPoint of the current object
	 *   @param {Object} [params.centerPoint.x=0] x centerPoint value
	 *   @param {Object} [params.centerPoint.y=0] y centerPoint value
	 *  @param {Number} [params.zIndex=0] define display order with other graphic elements. default to 0.
	 *  @param {Number} [params.alpha=1.0] set the transparency, between 0 and 1. default to 1 (completely opaque).
	 *  @param {Matrix2D} [params.matrix] matrix to set to the object. default to identity matrix.
	 *  @param {Number} [params.parent=null] parent of the element.
	 * @constructor
	 */
	function GraphicObject(params) {
		TW.Utils.copyParam(this, params, {
			/**
			 * position on X axis
			 *
			 * @property {Number} x
			 */
			x:            0,

			/**
			 * position on Y axis
			 *
			 * @property {Number} y
			 */
			y:            0,

			/**
			 * @property {Number} width
			 */
			width:        0,

			/**
			 * @property {Number} height
			 */
			height:       0,

			/**
			 * default center of all matrix transformations.
			 *
			 * values are exprimed depending on the size of the object.
			 * 0;0 is the up-left corner.
			 *
			 * @property {Object} centerPoint
			 *   @property {Object} centerPoint.x
			 *   @property {Object} centerPoint.y
			 */
			centerPoint: {
				x: 0,
			    y: 0
			},

			/**
			 * zIndex, used to determine the drawing order. Hight zIndex are drawn first.
			 *
			 * @property {Number} zIndex
			 */
			zIndex:       0,

			/**
			 * value of opacity, between 0.0 (fully transparent) and 1.0 (opaque)
			 *
			 * @property {Number} alpha
			 */
			alpha:        1.0,

			/**
			 * matrix applied to this object before draw.
			 *
			 * @property {Matrix} matrix
			 */
			matrix:       Matrix2D.identity(),

			/**
			 * parent containing this object.
			 *
			 * @property {Layer} parent
			 * @memberOf {GraphicObject}
			 */
			parent:       null
		});
	}

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
	 * @param {Object} attrs GraphicObject attributs. See the constructor for more details.
	 * @chainable
	 */
	GraphicObject.prototype.setAttr = function(attrs) {
		TW.Utils.copyParam(this, attrs, this);
		this.notifyParentChange();
		return this;
	};

	/**
	 * This method is aimed to be overrides by the classes who extends GraphicObject class.
	 *
	 * @method draw
	 * @param {CanvasRenderingContext2D} context represent the context of the canvas to draw on.
	 */
	GraphicObject.prototype.draw = function(context) {

	};

	/**
	 * This method allow you to translate the GraphicalObject,
	 * Internally this method modify the GraphicObject's matrix.
	 *
	 * @method translate
	 * @param {Number} x this is the translation scalar of the x axis.
	 * @param {Number} y this is the translation scalar of the y axis.
	 * @chainable
	 */
	GraphicObject.prototype.translate = function(x, y) {
		this.matrix.translate(x, y);
		this.notifyParentChange();
		return this;
	};

	/**
	 * This method allow you to rotate the Graphical object around the center point of the GraphicalObject.
	 *
	 * @method rotate
	 * @param {Number} angle represent the angle of rotation, it's expressed in degree.
	 * @chainable
	 */
	GraphicObject.prototype.rotate = function(angle) {
		this.matrix.rotate(angle);
		this.notifyParentChange();
		return this;
	};

	/**
	 * this method allow you to do a scale on the GraphicObject.
	 *
	 * @method scale
	 * @param {Number} x this is the x scale factor
	 * @param {Number} y this is the y scale factor
	 * @chainable
	 */
	GraphicObject.prototype.scale = function(x, y) {
		this.matrix.scale(x, y);
		this.notifyParentChange();
		return this;
	};

	/**
	 * This method allow you to do a skew transform on the GraphicObject.
	 *
	 * @method skew
	 * @param {Number} a the factor of skew on the y axis
	 * @param {Number} b the factor of skew on the x axis
	 * @chainable
	 */
	GraphicObject.prototype.skew = function(a, b) {
		this.matrix.skew(a, b);
		this.notifyParentChange();
		return this;
	};

	/**
	 * This method notify the parent that a change has been done, and that it should clear his cache.
	 *
	 * @method notifyParentChange
	 * @protected
	 */
	GraphicObject.prototype.notifyParentChange = function() {
		if (this.parent) {
			this.parent.onChange(this);
		}
	};

	TW.Graphic.GraphicObject = GraphicObject;
	return GraphicObject;
});