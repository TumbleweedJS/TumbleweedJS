/**
 * TumbleweedJS 0.3 Copyright (c) 2013, Tumbleweed Studio All Rights Reserved.
 * Available via the new BSD license.
 * see: https://github.com/TumbleweedJS/TumbleweedJS for details
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    root.TW = factory();
  }
}(this, function() {

  //TODO: remove after clean.
  window.define = function() {};
  window.define.amd = true;