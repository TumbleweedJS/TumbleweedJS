/**
 * @module Utils
 * @namespace Utils
 */


	//TODO: how to document this ?


define([], function() {


	// see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/bind
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

	return true;
});