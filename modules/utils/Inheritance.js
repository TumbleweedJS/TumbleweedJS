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

        function Foo() {}

        Foo.prototype = parent.prototype;
        child.prototype = new Foo();
    };

	/**
	 * Copy an object and all its members recursively. Numbers and others non-objects values
	 * are simply copied.
	 *
	 * Inherited members are also copied.
	 *
	 * *Warning:* if your object contains several references to the same object,
	 * this object will be copied several times.<br />
	 * In case of crossed references, this method will never terminate.
	 *
	 * @mathod clone
	 * @param {*} src_instance
	 * @returns {*} copy of src_instance.
	 */
    TW.Utils.clone = function(src_instance) {
        if(typeof(src_instance) !== 'object' || src_instance === null) {
            return src_instance;
        }
        var new_instance = src_instance.constructor();

	    /* jshint forin: false */
	    for(var i in src_instance)
        {
	        new_instance[i] = TW.Utils.clone(src_instance[i]);
        }
        return new_instance;
    };

}(TW));

