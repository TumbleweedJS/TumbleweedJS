/**
 * This module contain some useful functions and helpers used in the Tumbleweed framework.
 * It include some pollyfills and a way to use inheritance.
 *
 * Polyfills are not requested, but give a more large browser compatibility.
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
