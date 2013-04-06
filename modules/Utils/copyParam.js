/**
 * @module Utils
 * @namespace Utils
 */

var TW = TW || {};
define([], function() {

	TW.Utils = TW.Utils || {};

	/**
	 * copy all allowed variables from `params` to `target`, using `defaultContext` for set default values.
	 *
	 * *Note: `inherit` is not a class but a standalone function.*
	 *
	 * `copyParam` is used principally for easily copy parameters from hash objects.
	 * All variables must be present in `defaultContext`,
	 * so adding an unespected variable will not override `target` object.
	 * All values in `defayultContext` are also copied as default values.
	 *
	 * If you want to allow some properties, but not to set default value,
	 * you can create the property and set it to undefined.
	 *
	 * @example:
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

	return TW.Utils.copyParam;
});
