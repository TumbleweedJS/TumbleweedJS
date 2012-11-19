/**
 @module Graphic
 @namespace Graphic
 */

var TW = TW || {};

(function(TW) {

    if (typeof window.define === "function" && window.define.amd) {
        define([], initWrap(init));
    } else {
        initWrap(init);
    }

    function initWrap(f) {
        TW.Graphic = TW.Graphic ||  {};
        TW.Graphic.SpatialContainer = f();
        return TW.Graphic.SpatialContainer;
    }


    function init() {

        /**
         * A spatial container is a data structure used for storage of spatial 2D objects (generally {{#crossLink}}{{/crossLink}}.
         * It propose many method for manipulate these objects using theirs coordinates.
         *
         * This class provide a basic implementation of all methods, and also represent an interface to others spatial containers.
         * Different containers provides different complexities, and for each situation, someone are more adapted than others.
         *
         * @class SpatialContainer
         * @constructor
         */
        function SpatialContainer() {
            this.containerList = [];
        }

        /**
         * This method allow you to add a GraphicalObject to the SpatialContainer
         *
         * @method addElement
         * @param {Object} element this object will be added to the internal list of the SpatialContainer.
         *  element *SHOULD BE* a GraphicObject, otherwise the spatial container would have undetermined behavior.
         */
        SpatialContainer.prototype.addElement = function(element) {
            this.containerList.push(element);
            this.containerList.sort(function(a, b) {
                return (a._zIndex - b._zIndex);
            });
        };

        /**
         * This method allow you to remove a graphical element from the SpatialContainer
         *
         * @method removeElement
         * @param {Object} element the reference to the object to remove from the SpatialContainer List.
         * @return {Boolean} true if the element to remove from the list was found. Otherwise it returns false.
         */
        SpatialContainer.prototype.removeElement = function(element) {
            for (var i = 0; i < this.containerList.length; i++) {
                if (element === this.containerList[i]) {
                    this.containerList.splice(i, 1);
                    return true;
                }
            }
            return false;
        };

        /**
         * This method allow you to apply a callback for every GraphicObject contained in the SpatialContainer.
         *
         * The callback shouldn't remove directly an element until the end of `applyAll`. The behavior in this case is undefined.
         *
         * @method applyAll
         * @param {Function} callback must be a function object defined like `function callback(element){Do some things;}`
         *  @param {Object} callback.element element contained in spatial container.
         * @return {Boolean} true if callback is a function object and callback has been applied to every GraphicObject, otherwise it returns true.
         */
        SpatialContainer.prototype.applyAll = function(callback) {
            if (typeof(callback) === "function") {
                for (var i = 0; i < this.containerList.length; i++) {
                    callback(this.containerList[i]);
                }
                return true;
            } else {
                return false;
            }
        };

        /**
         * This method allow you to apply a callback to the GraphicObject who are at the specified position.
         * __TODO: not available__
         *
         * @method applyToPoint
         * @param {Number} x represent the x position where the GraphicObject must be to get the callback applied on them
         * @param {Number} y represent the y position where the GraphicObject must be to get the callback applied on them.
         * @param {Function} callback represent the callback to apply to every GraphicObject which position match the x, y
         * parameters.
         */
        SpatialContainer.prototype.applyToPoint = function(x, y, callback) {
            for (var i = 0; i < this.containerList.length; i++) {
                if (this.containerList[i].x === x && this.containerList[i].y === y) {
                    callback(this.containerList[i]);
                }
            }
        };

        /**
         * It returns the det of two vectors, it is used internally by the applyToZone method.
         *
         * @method computeDet
         * @param {Object} d represent a vector
         * @param {Object} t represent a vector
         * @return {Number} return the det of the vectors d and t.
         * @private
         */
        SpatialContainer.prototype._computeDet = function(d, t) {
            return ((d.x * t.y) - (d.y * t.x));
        };

        /**
         * This method allow you to apply a callback only on the object that are inside of the polygon specified by the points.
         *
         * @method applyToZone
         * @param {Array} pointsArray array of points like `{{10,0},{0,10},{2,3}} *Note that the polygon MUST BE composed at
         * least of 3 points, otherwise the method will not do anything and then it'll return false.`
         * @param {Function} callback function to be called on every GraphicObject that are inside of the polygon specified
         * by pointsArray.
         * @return {Boolean} return true if the pointArray was a valid array of points, otherwise it will return false.
         */
        SpatialContainer.prototype.applyToZone = function(pointsArray, callback) {

            if (!(pointsArray && pointsArray.length >= 3)) {
                return false;
            }
            for (var j = 1; j < this.containerList.length; j++) {
                var outside = false;
                for (var i = 1; i < pointsArray.length; i++) {
                    var vector_polygon_edge = {x: (pointsArray[i].x - pointsArray[i - 1].x), y: (pointsArray[i].x -
                        pointsArray[i - 1].x)};
                    var vector_to_point = {x: (this.containerList[j].x -
                        pointsArray[i - 1].x), y: (this.containerList[j].y -
                        pointsArray[i - 1].y)};
                    var det = this._computeDet(vector_polygon_edge, vector_to_point);
                    if (det > 0) {
                    }
                    outside = true;
                }
                if (outside === false) {
                    callback(this.containerList[j]);
                }
            }
        };

        return SpatialContainer;
    }

}(TW));
