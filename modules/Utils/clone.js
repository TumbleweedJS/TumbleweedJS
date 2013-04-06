/**
 * @module Utils
 * @namespace Utils
 */

var TW = TW || {};
define([], function() {

	TW.Utils = TW.Utils || {};

	/**
	 * Copy an object and all its members recursively. Numbers and others non-objects values
	 * are simply copied.
	 *
	 * *Note: `inherit` is not a class but a standalone function.*
	 *
	 * Inherited members are also copied.
	 *
	 * *Warning:* if your object contains several references to the same object,
	 * this object will be copied several times.<br />
	 * In case of crossed references, this method will never terminate.
	 *
	 * @class clone
	 * @constructor
	 *
	 * @param {*} srcInstance
	 * @return {*} copy of `srcInstance`.
	 */
	TW.Utils.clone = function(srcInstance) {
		if (typeof(srcInstance) !== 'object' || srcInstance === null) {
			return srcInstance;
		}
		var newInstance = new srcInstance.constructor();

		/* jshint forin: false */
		for (var i in srcInstance) {
			newInstance[i] = TW.Utils.clone(srcInstance[i]);
		}
		return newInstance;
	};

	return TW.Utils.clone;
});
