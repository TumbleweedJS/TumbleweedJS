/**
 @module Utils
 @namespace Utils
 */

var TW = TW || {};

(function(TW) {

    TW.Utils = TW.Utils ||  {};

    if (typeof window.define === "function" && window.define.amd) {
        define([], function() {
            return TW.Utils;
        });
    }

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

}(TW));

