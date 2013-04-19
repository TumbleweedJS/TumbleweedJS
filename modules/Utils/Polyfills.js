/**
 * @module Utils
 * @namespace Utils
 */

define([], function() {


	/**
	 * This module only contains polyfills; it's not a class.
	 *
	 * It's a way to use some polyfills if some features are not available for all browser.
	 * Actually, it contain only two polyfill:
	 *
	 *  - `Function.prototype.bind`
	 *
	 *    Mozilla implementation of the bind function.
	 *    See the documentation
	 *    [on the MDN](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/bind).
	 *
	 *  - `Array.prototype.indexOf`
	 *
	 *  Implementation of the `indexOf` method, for IE < 9.
	 *  See the documentation
	 *  [on the MDN](https://developer.mozilla.org/fr/docs/JavaScript/Reference/Global_Objects/Array/indexOf)
	 *
	 * **Usage example:**
	 *
	 *     define(['TW/Utils/Polyfills'], function() {
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


	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
			"use strict";
			if (this == null) {
				throw new TypeError();
			}
			var t = Object(this);
			var len = t.length >>> 0;
			if (len === 0) {
				return -1;
			}
			var n = 0;
			if (arguments.length > 1) {
				n = Number(arguments[1]);
				if (n != n) { // shortcut for verifying if it's NaN
					n = 0;
				} else if (n != 0 && n != Infinity && n != -Infinity) {
					n = (n > 0 || -1) * Math.floor(Math.abs(n));
				}
			}
			if (n >= len) {
				return -1;
			}
			var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
			for (; k < len; k++) {
				if (k in t && t[k] === searchElement) {
					return k;
				}
			}
			return -1;
		}
	}
});
