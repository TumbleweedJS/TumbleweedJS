/**
 * @module Core
 * @namespace Core
 */

var TW = TW || {};

define(['TW/Utils/inherit', 'TW/Utils/mixin', 'TW/Event/EventProvider'],
       function(inherit, mixin, EventProvider) {

	TW.Core = TW.Core || {};

	/**
	 * Base class for any game object wich want to use components.
	 *
	 * GameObject is a special class destined to contains many components,
	 * wich can have other components dependency.
	 * It's a way to use inheritance more flexible than classical `inherit` method,
	 * and more strict than `mixin` method.
	 *
	 * A GameObject can have zero or more components, listed has dependencies.
	 * Each components can have it's own dependendies.
	 * All components needed are merged in a new class inherited from GameObject.
	 * The new created class can be used like any other class.
	 *
	 *
	 * A Component is a special class crated by `GameObject.makeComponent`.
	 *
	 *
	 *     var Comp1 = GameObject.makeComponent('comp1', [], function(params) {
	 *       //component constructor
	 *     });
	 *
	 *     var Class1 = GameObject.makeClass([Comp1], function(params) {
	 *       //class constructor
	 *       //called after all components constructor
	 *     });
	 *
	 *     //params are passed to all composant constructors.
	 *     var instance = new Class1(params);
	 *
	 *
	 *     //Component can also be called alone.
	 *     var instance2 = new Comp1(params);
	 *
	 *
	 *     //If you want to modify a GameObject class, you should use a new level of inheritance
	 *     function MyClass() {
	 *       Class1.call(this, params);
	 *     };
	 *
	 *     inherit(MyClass, Class1);
	 *
	 *
	 *     MyClass.prototype.func = function() {};
	 *
	 *
	 * **This constructor should never be called directly.
	 * Use `GameObject.makeClass` instead.**
	 *
	 * @class GameObject
	 * @constructor
	 */
	function GameObject(deps, params) {
		this._components = this._components || [];

		deps.forEach(function(component) {
			if (this._components.indexOf(component.componentName) === -1) {
				component.call(this, params);
			}
		}, this);
	}

	/**
	 * Create a new class extending GameObject,
	 * containing all components listed in `deps` merged directly
	 * in the class.
	 *
	 * This method should be used to make a GameObject inherited class,
	 * instead of classical inheritance.
	 *
	 * @example
	 *
	 *    var myClass = GameObject.makeClass([Rect, Collisionable], function(params) {
	 *        //constructor here
	 *    });
	 *
	 *    var instance = new myClass(params);
	 *
	 * @method makeClass
	 * @param {Component[]} deps list of all components to mix in the class.
	 * @param {Function} [ctor] constructor of the new created class.
	 *  @param {Object} [ctor.params] parameters passed to constructor when a new instance is created.
	 *    Should be a litteral object.
	 * @return {Function} new class wich can be extended.
	 */
	GameObject.makeClass = function(deps, ctor) {
		var obj = function(params) {
			GameObject.call(this, deps, params);
			if (ctor !== undefined) {
				ctor.apply(this, arguments);
			}
		};
		inherit(obj, GameObject);

		deps.forEach(function(component) {
			mixin(obj.prototype, component.prototype);
		});

		return obj;
	};


	/**
	 * Create a new component class wich can be used as a dependency for
	 * GameObject classes and others components.
	 *
	 * All component listed in `deps` are mixed directly in the created component class.
	 *
	 * This method should be used to create new components.
	 *
	 * Note: a component is also a gameObject and can be instancied like any other class.
	 *
	 * @method makeComponent
	 * @param {String} name component name
	 * @param {Component[]} deps list of all components to mix in the class.
	 * @param {Function} [ctor] constructor of component.
	 *  @param {Object} [ctor.params] parameters passed to constructor
	 *    when a new instance of GameObject containing this component is created.
	 *    Should be a litteral object.
	 * @returns {Component} the new created component class.
	 */
	GameObject.makeComponent = function(name, deps, ctor) {
		var obj = function() {
			GameObject.call(this, deps);
			if (ctor !== undefined) {
				ctor.apply(this, arguments);
			}
			this._components.push(name);
		};
		inherit(obj, GameObject);
		obj.componentName = name;

		deps.forEach(function(component) {
			mixin(obj.prototype, component.prototype);
		});


		return obj;
	};

	inherit(GameObject, EventProvider);

	/**
	 * List all components wich are included in the class.
	 *
	 * @method listComponents
	 * @returns {String[]} components
	 */
	GameObject.prototype.listComponents = function() {
		return this._components;
	};

	/**
	 * Check if a component has been included in the class.
	 *
	 * @method hasComponent
	 * @param {String} name searched behavior name
	 * @returns {Boolean}
	 */
	GameObject.prototype.hasComponent = function(name) {

		for (var i = 0; i < this._components.length; i++) {
			if (this._components[i] === name) {
				return true;
			}
		}
		return false;
	};


	TW.Core.GameObject = GameObject;
	return GameObject;
});

