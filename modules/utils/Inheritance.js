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
        return f();
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

		TW.Utils.clone = function(srcInstance) {
			if(typeof(srcInstance) !== 'object' || srcInstance === null)
			{
				return srcInstance;
			}
			var newInstance = srcInstance.constructor();
			for(var i in srcInstance)
			{
				newInstance[i] = TW.Utils.clone(srcInstance[i]);
			}
			return newInstance;
		};
    }

        return {
			inherit: TW.Utils.inherit,
            mixin: TW.Utils.clone
        };
}(TW));

