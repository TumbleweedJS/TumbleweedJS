/**
 * @module Utils
 * @namespace Utils
 */

var TW = TW || {};
define([], function() {

	TW.Utils = TW.Utils || {};

	/**
	 * Copy all method and properties from `source` to `dest`.
	 *
	 * *Note: `inherit` is not a class but a standalone function.*
	 *
	 * `mixin` is an efficient way to reuse generic code whitout using inheritance.
	 * An object mixin is a litteral object containing methods and properties.
	 * Contrary to inheritance, a class can use several object mixins.
	 *
	 * Mixin should be used prior to class if the behavior encapsuled
	 * is common to many classes, but is not the first goal of theses classes.
	 * By example, the EventProvider is a mixin because generaly,
	 * emitting events is not the primary role. A Button class could use it,
	 * but is first role is to be a UI Widget.
	 *
	 * Note that mixin don't merge inherited method and properties.
	 * All attributes in the prototype are ignored.
	 *
	 * @example
	 *
	 *    var Round = {
	 *      radius: 10,
	 *      getRadius: function() { return radius; }
	 *    };
	 *
	 *    //class Button
	 *    var Button = function() {
	 *    };
	 *
	 *    var instance = new Button();
	 *
	 *    //instance is a round button.
	 *    mixin(instance, Round);
	 *
	 *    //class RoundLabel
	 *    var RoundLabel = function() {
	 *    }
	 *
	 *    mixin(RoundLabel.prototype, Round);
	 *    //works on class and instances.
	 *
	 * @class mixin
	 * @constructor
	 * @param {Object} dest
	 * @param {Object} source
	 * @chainable
	 */
	TW.Utils.mixin = function(dest, source) {
		for (var i in source) {
			if (source.hasOwnProperty(i)) {
				dest[i] = source[i];
			}
		}
		return dest;
	};

	return TW.Utils.mixin;
});
