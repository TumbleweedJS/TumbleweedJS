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
        TW.Graphic.Layer = f();
        return TW.Graphic.Layer;
    }

    function init() {
        /**
         * The Layer class can hold several GraphicObjects and it provides some transformations methods to move or scale all the
         * GraphicalObjects that it contains. This is helpful when you want for example apply the same plane transformation to some
         * GraphicalObjects
         *
         * @class Layer
         * @extends GraphicObject
         * @constructor
         * @param {Object} param All properties given to {{#crossLink "Graphic.GraphicObject"}}{{/crossLink}} are available.
         *   @param {Camera} [param.camera] camera used be the layer. if not set, a new Camera is created.
         *   @param {SpatialContainer} [param.spatialContainer]
         *   @param {CanvasRenderingContext2D} [param.localCanvas] you can set directly the canvas used by the layer.
         */
        function Layer(param) {
            TW.Graphic.GraphicObject.call(this, param);

            this._camera =  param.camera ? param.camera : new TW.Graphic.Camera();
            this._spatialContainer = param.spatialContainer ? param.spatialContainer : new TW.Graphic.SpatialContainer();
            this._localCanvas = param.localCanvas ? param.localCanvas : document.createElement('canvas').getContext("2d");
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
         * @param {CanvasRenderingContext2D} context
         */
        Layer.prototype.draw = function(context) {
            if (this._needToRedraw === true) {
                this._localCanvas.save();
                this._camera.prepare(this._localCanvas);
                this._spatialContainer.applyAll(function(child) {
                    child.draw(this._localCanvas);
                }.bind(this));
                this._localCanvas.restore();
                this._needToRedraw = false;
            }
            context.save();
            this._matrix.transformContext(context);
            context.drawImage(this._localCanvas.canvas, 0, 0, this.width, this.height);
            context.restore();
        };

        /**
         * This method allow you to set the dimensions of the layer.
         *
         * @method setDimensions
         * @param {Object} obj this object must contains the width and the height of the object like this : `{obj.width, obj.height}`
         * @return {Boolean} this method returns false if the obj parameter isn't a valid object, otherwise this method
         * returns true.
         */
        Layer.prototype.setDimensions = function(obj) {
            if (obj && obj.width && obj.height && obj.width > 0 && obj.height > 0) {
                this.width = obj.width;
                this.height = obj.height;
                this._localCanvas.width = obj.width;
                this._localCanvas.height = obj.height;
                this.notifyParentChange();
                return true;
            } else {
                return false;
            }
        };

        /**
         * This method allow you to set the camera object of the layer.
         *
         * @method setCamera
         * @param {Camera} camera this object is the camera object to affect to the Layer.
         */
        Layer.prototype.setCamera = function(camera) {
            this.notifyParentChange();
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
                this.notifyParentChange();
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
         * @param {GraphicObject} graphicObject this parameter must be a valid GraphicObject, otherwise the method will have an undefined
         * behavior.
         * @return {Boolean} this method will return false if the graphicObject parameter is a valid object. Otherwise it
         * will returns true.
         */
        Layer.prototype.addChild = function(graphicObject) {
            if (graphicObject) {
                this.notifyParentChange();
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
         * @return {Boolean} if the graphicObject was found in the childs of the current layer then the method
         * will returns true, otherwise the method will returns true.
         */
        Layer.prototype.rmChild = function(graphicObject) {
            this.notifyParentChange();
            return this._spatialContainer.removeElement(graphicObject);
        };


        /**
         * This method will allow you to update the layer and all the childs within the layer.
         *
         * @method update
         * @return {Boolean} if every childs of the layer have been updated with success then the method will returns true.
         * Otherwise the method will returns false.
         */
        Layer.prototype.update = function() {
            this._spatialContainer.applyAll(function(child) {
                if (child.update) {
                    child.update();
                }
            });
        };

        /**
         * This method will be called when a child is changed. By using this method it will notice the current Layer to redraw the local canvas.
         *
         * @method onChange
         * @param {GraphicObject} child this object represent the child who has been changed.
         */
        Layer.prototype.onChange = function(child) {
			this._needToRedraw = true;
               return this.notifyParentChange();
        };

        return Layer;
    }
}(TW));
