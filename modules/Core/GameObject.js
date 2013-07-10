/**
 * @module Core
 * @namespace Core
 */

var TW = TW || {};

define([], function() {

	TW.Core = TW.Core || {};

	/**
	 * TODO description GameObject
	 *
	 * --Le concept GameObject
	 * -- La classe GameObject -- les mixins
	 * -- Les Components possible, et comment les développer.
	 *
	 * @class GameObject
	 * @constructor
	 */
	function GameObject() {

		this._components = [];

	}

	/**
	 * @method listComponents
	 * @returns {Array} components
	 */
	GameObject.prototype.listComponents = function() {
		return this._components;
	};

	/**
	 * @method hasComponent
	 * @param name searched behavior name
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