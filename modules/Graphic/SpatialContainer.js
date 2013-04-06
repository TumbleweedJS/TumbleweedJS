/**
 * @module Graphic
 * @namespace Graphic
 */

var TW = TW || {};
define(['../Math/Vector2D'], function(Vector2D) {

	TW.Graphic = TW.Graphic || {};

	/**
	 * A spatial container is a data structure used for storage of spatial 2D objects
	 * (generally {{#crossLink "Graphic.GraphicObject" }}GraphicObject{{/crossLink}}).
	 * It propose many method for manipulate these objects using theirs coordinates.
	 *
	 * This class provide a basic implementation of all methods,
	 * and also represent an interface to others spatial containers.
	 * Different containers provides different complexities, and for each situation,
	 * someone are more adapted than others.
	 *
	 * @class SpatialContainer
	 * @constructor
	 */
	function SpatialContainer() {
		this._containerList = [];
	}

	/**
	 * This method allow you to add a GraphicalObject to the SpatialContainer
	 *
	 * @method addElement
	 * @param {Object} element this object will be added to the internal list of the SpatialContainer.
	 *  element *SHOULD BE* a GraphicObject, otherwise the spatial container would have undetermined behavior.
	 */
	SpatialContainer.prototype.addElement = function(element) {
		this._containerList.push(element);
		this._containerList.sort(function(a, b) {
			return (a.zIndex - b.zIndex);
		});
	};

	/**
	 * This method allow you to remove a graphical element from the SpatialContainer
	 *
	 * @method removeElement
	 * @param {Object} element the reference to the object to remove from the SpatialContainer List.
	 * @return {Boolean} `true` if the element to remove from the list was found. Otherwise it returns `false`.
	 */
	SpatialContainer.prototype.removeElement = function(element) {
		for (var i = 0; i < this._containerList.length; i++) {
			if (element === this._containerList[i]) {
				this._containerList.splice(i, 1);
				return true;
			}
		}
		return false;
	};

	/**
	 * This method allow you to apply a callback for every GraphicObject contained in the SpatialContainer.
	 *
	 * The callback shouldn't remove directly an element until the end of `applyAll`.
	 * The behavior in this case is undefined.
	 *
	 * @method applyAll
	 * @param {Function} callback must be a callback function
	 *  @param {Object} callback.element element contained in spatial container.
	 *
	 * @example
	 *
	 *     container.applyAll(function(element) {
	 *          element.draw();
	 *     });
	 */
	SpatialContainer.prototype.applyAll = function(callback) {
		for (var i = 0; i < this._containerList.length; i++) {
			callback(this._containerList[i]);
		}
	};

	/**
	 * This method allow you to apply a callback to the GraphicObject who are at the specified position.
	 *
	 * @method applyToPoint
	 * @param {Number} x the x position where the GraphicObject must be to get the callback applied on them
	 * @param {Number} y the y position where the GraphicObject must be to get the callback applied on them.
	 * @param {Function} callback to apply to every GraphicObject which position match the x, y parameters.
	 */
	SpatialContainer.prototype.applyToPoint = function(x, y, callback) {
		var length = this._containerList.length;

		for (var i = 0; i < length; i++) {
			var target = this._containerList[i];

			var point = target.matrix.inverse().multiplyVector(new Vector2D(x - target.x, y - target.y));
			point.add(target.centerPoint);

			if (point.x >= 0 && point.x <= target.width &&
			    point.y >= 0 && point.y <= target.height) {
				callback(this._containerList[i]);
			}
		}
	};

	/**
	 * This method allow you to apply a callback only on the object that are inside of the polygon
	 * specified by the points.
	 *
	 * The goal is to process optimization to apply callback only if necessary, for improve speed. Objects that are not
	 * in the zone can be used: somes optimizations can be aproximate.
	 *
	 *
	 * The default method use directly `applyAll` and no optimization is done. (selecting good and bas objects
	 * whithout tree structure take more time than display them)
	 *
	 * @method applyToZone
	 *
	 * @param {Array} pointsArray array of points like `{{10,0},{0,10},{2,3}}
	 *  *Note that the polygon MUST BE composed at least of 3 points,
	 *  otherwise the method will throw an error.*
	 *
	 * @param {Function} callback function to be called on every GraphicObject that are inside of
	 *  the polygon specified by pointsArray.
	 */
	SpatialContainer.prototype.applyToZone = function(pointsArray, callback) {
		if (!(pointsArray && pointsArray.length >= 3)) {
			throw new Error("Bad params");
		}

		this.applyAll(callback);
	};

	TW.Graphic.SpatialContainer = SpatialContainer;
	return SpatialContainer;
});
