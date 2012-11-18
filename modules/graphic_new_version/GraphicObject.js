/**
 @module Graphic
 @namespace Graphic
 */

var TW = TW || {};

(function(TW) {

    if (typeof window.define === "function" && window.define.amd) {
        window.define([], initWrap(init));
    } else {
        initWrap(init);
    }

    function initWrap(f) {
        TW.Graphic = TW.Graphic ||  {};
        TW.Graphic.GraphicObject = f();
        return TW.Graphic.GraphicObject;
    }


    function init() {

        /**
         * GraphicObject represent an object that has a relationship with graphical context. It is the root class of every graphical component of the framework.
         *
         * @class GraphicObject
         * @param {Object} param it is an object that represent the parameters of the graphicalObject to set.
         *  @param {Number} param.zIndex define display order with other graphic elements. default to 0.
         *  @param {Matrix2D} param.matrix matrix to set to the object. default to identity matrix.
         *  @param {Number} param.alpha set the transparency, between 0 and 1. default to 1 (completely opaque).
         *  @param {Number} param.width width of the element.
         *  @param {Number} param.height height of the element.
         *  @param {Number} param.x position on X axis.
         *  @param {Number} param.y position on Y axis.
         *  @param {Number} param.parent parent of the element.
		 *  @param {Number} param.xCenter x position of the center in the current object
		 *  @param {Number} param.yCenter y position of the center in the current object
         * @constructor
         */
        function GraphicObject(param) {
            this._zIndex =  param.zIndex ? param.zIndex : 0;
            this._matrix = param.matrix ? param.matrix : TW.Math.Matrix2D.identity();
            this._alpha =  param.alpha ? param.alpha : 1.0;
            this.width =  param.width ? param.width : 0;
            this.height =  param.height ? param.height : 0;
            this.x =  param.x ? param.x : 0;
            this.y = param.y ? param.y : 0;
			this.xCenterPoint = param.xCenterPoint ? param.xCenterPoint : 0;
			this.yCenterPoint = param.yCenterPoint ? param.yCenterPoint : 0;
            this.parent = param.parent ? param.parent : null;
        }

        /**
         * This method is aimed to be overrides by the classes who extends GraphicObject class.
         *
         * @method draw
         * @param {CanvasRenderingContext2D} context represent the context of the canvas to draw on.
         */
        GraphicObject.prototype.draw = function(context) {

        };

        /**
         * This method allows the user to get the parent of the current GraphicalObject.
         *
         * @method getParent
         * @return {GraphicObject} return the parent of the current GraphicalObject.
         */
        GraphicObject.prototype.getParent = function () {
            return this.parent;
        };

        /**
         * This method allows the user to set the parent of the current GraphicObject.
         *
         * @method setParent
         * @param {GraphicObject} parent the parent GraphicalObject.
         * @return {Boolean} return false if the setParent method fails otherwise it returns true.
         */
        GraphicObject.prototype.setParent = function(parent) {
            if (parent instanceof TW.Graphic.GraphicObject) {
                this.parent = parent;
                return true;
            }	else {
                return false;
            }
        };

        /**
         * This method allows the user to get the dimensions of the current GraphicObject.
         *
         * @method getDimensions
         * @return {Object} return an object that contains the width and the height values of the current GraphicObject.
         */
        GraphicObject.prototype.getDimensions = function() {
            return {width: this.width, height: this.height};
        };

        /**
         * This method allows the user to get the coordinates of the current GraphicObject.
         *
         * @method getLocalPosition
         * @return {Object} return an object that contains the x and the y position of the GraphicObject onto its parent.
         */
        GraphicObject.prototype.getLocalPosition = function() {
            return {x: this.x, y: this.y};
        };

        /**
         * This method set the dimensions of the GraphicObject.
         *
         * @method setDimensions
         * @param {Object} obj contains the width and the height to apply to the current GraphicObject.
         *  @param {Number} obj.width
         *  @param {Number} obj.height
         * @return {Boolean} return false if the obj does not contains width and height or if their values are not positives numbers.
         */
        GraphicObject.prototype.setDimensions = function(obj) {
            if (obj && obj.width && obj.height && obj.width > 0 && obj.height > 0) {
                this.width = obj.width;
                this.height = obj.height;
                this.notifyParentChange();
                return true;
            } else {
                return false;
            }
        };

        /**
         * This method allow the user to set the local position of the GraphicObject.
         *
         * @method setLocalPosition
         * @param {Object} obj contains the x and the y position to apply to the current GraphicObject.
         *  @param {Number} obj.x position on X axis
         *  @param {Number} obj.y position on Y axis
         * @return {Boolean} return false if the obj does not contains x and y components or if their values are not defined.
         */
        GraphicObject.prototype.setLocalPosition = function(obj) {
            if (obj && obj.x && obj.y) {
                this.x = obj.x;
                this.y = obj.y;
                this.notifyParentChange();
                return true;
            } else {
                return false;
            }
        };

        /**
         * This method allow the user to get the z-index value.
         *
         * @method getZIndex
         * @return {Number}
         */
        GraphicObject.prototype.getZIndex = function() {
            return this._zIndex;
        };

        /**
         * This method allow you to set the z-index value of the GraphicObject
         *
         * @method setZIndex
         * @param {Number} value the value to affect to the zIndex of the GraphicalObject.
         */
        GraphicObject.prototype.setZIndex = function(value) {
            this._zIndex = value;
            this.notifyParentChange();
        };

        /**
         * This method allow you to get the alpha value of GraphicObject *Note: alpha means the opacity factor of the GraphicObject, alpha is always between 0.0 and 1.0.*
         *
         * @method getAlpha
         * @return {Number} The alpha value of the GraphicObject.
         */
        GraphicObject.prototype.getAlpha = function() {
            return this._alpha;
        };

        /**
         * This method allow you to set the alpha value of the GraphicObject. *Note: alpha must be a number factor between 0.0 and 1.0*.
         *
         * @method setAlpha
         * @param {Number} alpha
         */
        GraphicObject.prototype.setAlpha = function(alpha) {
            this._alpha = alpha;
            this.notifyParentChange();
        };

        /**
         * This method allow you to translate the GraphicalObject, internally this method modify the GraphicObject's matrix.
         *
         * @method translate
         * @param {Number} x this is the translation scalar of the x axis.
         * @param {Number} y this is the translation scalar of the y axis.
         * @return {GraphicObject} this is the GraphicObject itself, it allows chainable calls of translate.
         */
        GraphicObject.prototype.translate = function(x, y) {
            this._matrix.translate(x, y);
            this.notifyParentChange();
            return this;
        };

        /**
         * This method allow you to set the position of the GraphicalObject. Internally, it reset the translation matrix and set it with the x and y scalars.
         *
         * @method setPosition
         * @param {Number} x this is the scalar of the x axis.
         * @param {Number} y this is the scalar of the y axis.
         */
        GraphicObject.prototype.setPosition = function(x, y) {
            //this._matrix = this._matrix.identity();
            this.x = x;
            this.y = y;
            this.notifyParentChange();
            //this._matrix.translate(x, y);
        };

        /**
         * This method allow you to rotate the Graphical object around the center point of the GraphicalObject.
         *
         * @method rotate
         * @chainable
         * @param {Number} angle represent the angle of rotation, it's expressed in degree.
         * @return {GraphicObject} return the object itself. Allow the chainable calls.
         */
        GraphicObject.prototype.rotate = function(angle) {
            this._matrix.rotate(angle);
            this.notifyParentChange();
            return this;
        };

        /**
         * this method allow you to do a scale on the GraphicObject.
         *
         * @method scale
         * @chainable
         * @param {Number} x this is the x scale factor
         * @param {Number} y this is the y scale factor
         * @return {GraphicObject} return the object itself. Allow chainable calls.
         */
        GraphicObject.prototype.scale = function(x, y) {
            this._matrix.scale(x, y);
            this.notifyParentChange();
            return this;
        };

        /**
         * This method allow you to do a skew transform on the GraphicObject.
         *
         * @method skew
         * @chainable
         * @return {GraphicObject} return the object itself. Allow chainable calls.
         * @param {Number} a the factor of skew on the y axis
         * @param {Number} b the factor of skew on the x axis
         */
        GraphicObject.prototype.skew = function(a, b) {
            this._matrix.skew(a, b);
            this.notifyParentChange();
            return this;
        };

        /**
         * This method allow you to set the centerPoint of the GraphicObject. centerPoint means the point around the
         * rotations are done. it also means the translation origin point of the GraphicObject.
         * *Note that the methods `setCenterPoint(centerPoint);` and `setCenterPoint(x, y);` are doing the same thing,
         * only the syntax differs.
         *
         * @method setCenterPoint
         * @param {Number} x represent the x axis value of the centerPoint
         * @param {Number} y represent the y axis value of the centerPoint
         * @return {Boolean} return true if the setCenterPoint method was called with valid arguments. Otherwise it returns
         * false. Valid arguments means coordinate within GraphicObject dimension.
         */
        GraphicObject.prototype.setCenterPoint = function(x, y) {
            if (x && x >= 0 && x <= this.width && y && y >= 0 && y <= this.height) {
                this.x_center = x;
                this.y_center = y;
                this.notifyParentChange();
                return true;
            } else {
                return false;
            }
        };

        /**
         * This method allow you to get the CenterPoint of the GraphicalObject.
         *
         * @method getCenterPoint
         * @return {Object} return an object containing the x and y coordinate of the CenterPoint. Like `{x:12, y:65}`.
         */
        GraphicObject.prototype.getCenterPoint = function() {
            return {x:this.x_center, y:this.y_center};
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


        return GraphicObject;
    }
}(TW));
