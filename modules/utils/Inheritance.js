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

	/**
	 * copy all allowed variables from `params` to `target`, using `defaultContext` for set default values.
	 *
	 * `copyParam` is used principally for easily copy parameters from hash objects.
	 * All variables must be present in `defaultContext`,
	 * so adding an unespected variable will not override `target` object.
	 * All values in `defayultContext` are also copied as default values.
	 *
	 * If you want to allow some properties, but not to set default value,
	 * you can create the property and set it to undefined.
	 *
	 * @examples:
	 *
	 *      var target = {};
	 *      var default_context = {
	 *          foo:    "default value",
	 *          bar:    33,
	 *          baz:    undefined           // baz is allowed, but has not default value.
	 *      };
	 *
	 *      Utils.copyParam(target, { foo: "some value", unknown: 3 }, default_context);
	 *      console.log(target);
	 *      // Object {foo: "some value", bar: 33}
	 *      //unknown is not copied because not allowed.
	 *
	 * @method copyParam
	 *
	 *
	 * @param {Object} target
	 * @param {Object} params
	 * @param {Object} default_context
	 */
	TW.Utils.copyParam = function(target, params, default_context) {
		for (var i in default_context) {
			if (default_context.hasOwnProperty(i)) {
				if (params.hasOwnProperty(i)) {
					target[i] = params[i];
				} else if (default_context[i] !== undefined) {
					target[i] = default_context[i];
				}
			}
		}
	};


}(TW));

