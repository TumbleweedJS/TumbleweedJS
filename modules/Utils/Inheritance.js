/**
 * @module Utils
 * @namespace Utils
 */

var TW = TW || {};
define([], function() {

	TW.Utils = TW.Utils || {};


	/**
	 * Provide an useful way to use inheritance.
	 *
	 * *Note: `inherit` is not a class but a standalone function.*
	 *
	 * Internally, `inherit` use a intermediate dummy function as prototype.
	 * So, `inherit` doesn't call the parent constructor, unlike to the classic inheritance method.
	 *
	 *     // class Parent
	 *     function Parent(arg) {
	 *          do_some_stuff(arg);
	 *     }
	 *
	 *     Parent.prototype.foo = "Hello";
	 *
	 *     //class Child
	 *     function Child(arg, arg2) {
	 *          //Parent constructor call.
	 *          Parent.call(this, arg);
	 *
	 *          do_other_stuff(arg2);
	 *     }
	 *
	 *     inherit(Child, Parent);
	 *
	 *     var child = new Child(1, 2);
	 *
	 *     console.log(child instanceof Parent);    //true
	 *     console.log(child.foo);                  //"Hello"
	 *
	 * **Warning: this function rewrite the prototype of `child`. All change must be done after the call to `inherit`,
	 * otherwise they will be erased.**
	 *
	 * @class inherit
	 * @constructor
	 *
	 * @param child Child class
	 * @param parent Parent class
	 */
	TW.Utils.inherit = function(child, parent) {

		function Foo() {}

		Foo.prototype = parent.prototype;
		child.prototype = new Foo();
	};

	/**
	 * Copy an object and all its members recursively. Numbers and others non-objects values
	 * are simply copied.
	 *
	 * *Note: `inherit` is not a class but a standalone function.*
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

	return TW.Utils.inherit;
});

