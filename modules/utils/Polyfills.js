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
    }


    function init() {

        // see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/bind
        if (!Function.prototype.bind) {
            Function.prototype.bind = function(this_context) {
                var args;
                var func = function() {};
                var fToBind, fBound;

                if (typeof this !== "function") {
                    throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
                }

                args = Array.prototype.slice.call(arguments, 1);
                fToBind = this;
                fBound = function() {
                    return fToBind.apply(this instanceof func && this_context ? this : this_context,
                        args.concat(Array.prototype.slice.call(arguments)));
                };

                func.prototype = this.prototype;
                fBound.prototype = new func();

                return fBound;
            };
        }

        return true;
    }
}(TW));
