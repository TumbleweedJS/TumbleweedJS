/**
 @module SpatialContainer
 @namespace Graphic
 */

var TW = TW || {};
TW.Graphic = TW.Graphic || {};

/**
 * @type {SpatialContainer}
 */

TW.Graphic.SpatialContainer = function() {

	/**
	 * This class allow you to build a SpatialContainer who can holds some GraphicalObjects and provide methods
	 * to draw them faster.
	 * @constructor
	 */
	function SpatialContainer() {
		this.containerList = [];
	}

	/**
	 * This method allow you to add a GraphicalObject to the SpatialContainer
	 *
	 * @param {GraphicObject} graphicObject this object will be added to the internal list of the SpatialContainer. graphicObject *MUST BE* a GraphicObject, otherwise the spatial container would have undetermined behavior.
	 * @return {Boolean} return true if graphicObject seems to be a valid argument, otherwise it will returns false.
	 */
	SpatialContainer.prototype.addElement = function(graphicObject) {
		this.containerList.push(graphicObject);
		return true;
	};

	/**
	 * This method allow you to remove a graphical element from the SpatialContainer
	 *
	 * @param {GraphicObject} graphicObject the reference to the object to remove from the SpatialContainer List.
	 * @return {Boolean} return true if the GraphicObject to remove from the list was found. Otherwise it returns false.
	 */
	SpatialContainer.prototype.removeElement = function(graphicObject) {
		for (var i = 0; i < this.containerList.length; i++) {
			if (graphicObject === this.containerList[i]) {
				this.containerList.splice(i, 1);
			    return true;
			}
		}
	 return false;
	};

	/**
	 * This method allow you to apply a callback for every GraphicObject contained in the SpatialContainer.
	 *
	 * @param {Function} callback must be a function object defined like `function callback(graphicObject){Do some things;}`
	 * @return {Boolean} return true if callback is a function object and callback has been applied to every GraphicObject, otherwise it returns true.
	 */
	SpatialContainer.prototype.applyAll = function(callback) {
		if (typeof(callback) == "function") {
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
	 * This method is private. It returns the det of two vectors, it is used internally by the applyToZone method.
	 *
	 * @method computeDet
	 * @param {Vector} d represent a vector
	 * @param {Vector} t represent a vector
	 * @return {Number} return the det of the vectors d and t.
	 * @private
	 */
	SpatialContainer.prototype._computeDet = function(d, t) {
		return ((d.x * t.y) - (d.y * t.x));
	};

	/**
	 * This method allow you to apply a callback only on the object that are inside of the polygon specified by the points.
	 *
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
}();
