/**
 @module Utils
 @namespace Utils
 */

var TW = TW || {};

//TODO: how to document this ?

(function(TW) {

    if (typeof window.define === "function" && window.define.amd) {
        define([], initWrap(init));
    } else {
        initWrap(init);
    }

    function initWrap(f) {
        TW.Utils = TW.Utils ||  {};
        f();
    }


    function init() {

        // see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/bind
        if (!Function.prototype.bind) {
            Function.prototype.bind = function(this_context) {
                var args;
                var func = function() {};
                var f2bind, f_bound;

                if (typeof this !== "function") {
                    throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
                }

                args = Array.prototype.slice.call(arguments, 1);
                f2bind = this;
                f_bound = function() {
                    return f2bind.apply(this instanceof func && this_context ? this : this_context,
                        args.concat(Array.prototype.slice.call(arguments)));
                };

                func.prototype = this.prototype;
                f_bound.prototype = new func();

                return f_bound;
            };
        }

        return true;
    }
}(TW));
