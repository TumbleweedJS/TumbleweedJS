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
		child.prototype.constructor = child;
	};

	return TW.Utils.inherit;
});
