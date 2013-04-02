/**
 * @module Utils
 * @namespace Utils
 */





define([], function() {
	var TW = TW || {};
	TW.Utils = TW.Utils || {};


	/**
	 * Provide an useful way to use inheritance
	 *
	 * @class inherit
	 * @constructor
	 *
	 * @param child
	 * @param parent
	 */
	TW.Utils.inherit = function(child, parent) {

		function Foo() {}

		//TODO: must be deleted after require.js clean
		var tmp = {};

		Foo.prototype = parent.prototype;
		TW.Utils.copyParam(tmp, {}, child.prototype);
		child.prototype = new Foo();
		TW.Utils.copyParam(child.prototype, {}, tmp);
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
	 * @class clone
	 * @constructor
	 *
	 * @param {*} srcInstance
	 * @return {*} copy of `srcInstance`.
	 */
	TW.Utils.clone = function(srcInstance) {
		if (typeof(srcInstance) !== 'object' || srcInstance === null) {
			return srcInstance;
		}
		var newInstance = new srcInstance.constructor();

		/* jshint forin: false */
		for (var i in srcInstance) {
			newInstance[i] = TW.Utils.clone(srcInstance[i]);
		}
		return newInstance;
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
	 *      var defaultContext = {
	 *          foo:    "default value",
	 *          bar:    33,
	 *          baz:    undefined           // baz is allowed, but has not default value.
	 *      };
	 *
	 *      Utils.copyParam(target, { foo: "some value", unknown: 3 }, defaultContext);
	 *      console.log(target);
	 *      // Object {foo: "some value", bar: 33}
	 *      //unknown is not copied because not allowed.
	 *
	 * @class copyParam
	 * @constructor
	 *
	 * @param {Object} target
	 * @param {Object} params
	 * @param {Object} defaultContext
	 */
	TW.Utils.copyParam = function(target, params, defaultContext) {
		for (var i in defaultContext) {
			if (defaultContext.hasOwnProperty(i)) {
				if (typeof params !== "undefined" && typeof params.hasOwnProperty === "function" &&
				    params.hasOwnProperty(i)) {
					target[i] = params[i];
				} else if (defaultContext[i] !== undefined) {
					target[i] = defaultContext[i];
				}
			}
		}
	};

	return TW.Utils.inherit;
});

