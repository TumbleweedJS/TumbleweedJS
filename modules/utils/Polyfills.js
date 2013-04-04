/**
 * @module Utils
 * @namespace Utils
 */

define([], function() {


	/**
	 * This module only contains polyfills; it's not a class.
	 *
	 * It's a way to use some polyfills if some features are not available for all browser.
	 * Actually, it contain only one polyfill:
	 *
	 *  - `Function.bind`
	 *
	 *    Mozilla implementation of the bind function.
	 *    See the documentation
	 *    [on the MDN](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/bind).
	 *
	 * **Usage example:**
	 *
	 *     define(['TW/utils/Polyfills'], function() {
	 *         //Now i'm sure that `bind()` exist.
	 *         setTimeout(myFunc.bind(), 100);
	 *     });
	 *
	 * **Note: the module don't return anything.**
	 *
	 * @class Polyfill
	 */
	if (!Function.prototype.bind) {
		Function.prototype.bind = function(context) {
			var Func = function() {};
			var args, f2bind, fBound;

			if (typeof this !== "function") {
				throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
			}

			args = Array.prototype.slice.call(arguments, 1);
			f2bind = this;
			fBound = function() {
				return f2bind.apply(this instanceof Func && context ? this : context,
				                    args.concat(Array.prototype.slice.call(arguments)));
			};

			Func.prototype = this.prototype;
			fBound.prototype = new Func();

			return fBound;
		};
	}

});