/**
 @module Utils
 @namespace Utils
 */

var TW = TW || {};

//TODO: how to document this ?

(function(TW) {

    TW.Utils = TW.Utils ||  {};

    if (typeof window.define === "function" && window.define.amd) {
        define([], function() {
            return true;
        });
    }

    // see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/bind
    if (!Function.prototype.bind) {
        Function.prototype.bind = function(this_context) {
            var Func = function() {};
            var args, f2bind, f_bound;

            if (typeof this !== "function") {
                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            }

            args = Array.prototype.slice.call(arguments, 1);
            f2bind = this;
            f_bound = function() {
                return f2bind.apply(this instanceof Func && this_context ? this : this_context,
                    args.concat(Array.prototype.slice.call(arguments)));
            };

            Func.prototype = this.prototype;
            f_bound.prototype = new Func();

            return f_bound;
        };
    }

}(TW));
