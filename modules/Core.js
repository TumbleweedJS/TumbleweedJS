/**
 * The Core module contains generic classes which are used by all others classes and modules.
 *
 * ## Game Object
 *
 * Many part of Tumbleweed's features are provided as components for Game Object classes.
 * The GameObject class is a generic class which can accept many components, provided by diferents modules.
 *
 * All In Game objects can be represented by GameObject instances.
 *
 * By example, an oponent in a RPG game can be represented by a GameObject
 * implementing the Graphic and Colliseable components.
 *
 *
 * New copponents can be created easily, and TW components can also be extended in a simpler way.
 *
 * @module Core
 * @main
 */

var TW = TW || {};

define([
	       './Core/GameObject'
       ], function() {
	return TW.Core;
});

