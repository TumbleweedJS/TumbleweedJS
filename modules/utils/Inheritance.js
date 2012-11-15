/**
 @module Utils
 @namespace Utils
 */

var TW = TW || {};

(function(TW) {

    if (typeof window.define === "function" && window.define.amd) {
        define([], initWrap(init));
    } else {
        initWrap(init);
    }

    function initWrap(f) {
        TW.Utils = TW.Utils ||  {};
        TW.Utils.inherit = f();
        return TW.Event.inherit;
    }


    function init() {


        /**
         * Provide an useful way to use inheritance
         *
         * @param child
         * @param parent
         * @class inherit
         */
        TW.Utils.inherit  = function(child, parent) {

            function F() {}

            F.prototype = parent.prototype;
            child.prototype = new F();
        };

        return TW.Utils.inherit;
    }
}(TW));

