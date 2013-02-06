/**
 * @module Collision
 * @namespace Collision
 */

var TW = TW || {};

(function(TW) {

	if (typeof window.define === "function" && window.define.amd) {
		define('collision/CollisionBox',[], initWrap(init));
	} else {
		initWrap(init);
	}

	function initWrap(f) {
		TW.Collision = TW.Collision ||  {};
		TW.Collision.CollisionBox = f();
		return TW.Collision.CollisionBox;
	}


	function init() {