/**
 * This module contain some useful functions and helpers used in the Tumbleweed framework.
 * It include some pollyfills and a way to use inheritance.
 *
 * The {{#crossLink "Utils.inherit"}}inherit(){{/crossLink}} function is a powerfull inheritance method, used by all
 * Tumbleweed classes.
 *
 * {{#crossLink "Utils.clone" }}clone(){{/crossLink}} and {{#crossLink "Utils.copyParam"}}copyParam(){{/crossLink}}
 * are both function manipulating objects to perform common tasks, like copying recursively an object,
 * or copying properties to another object with control and default values.
 *
 * The Polyfills file contains some polyfills for give a more large browser compatibility.
 *
 * @module Utils
 * @main
 */


var TW = TW || {};

define([
	       './utils/Inheritance'
       ], function() {
	return TW.Utils;
});
