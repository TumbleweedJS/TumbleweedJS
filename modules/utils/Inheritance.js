/**
 @module Utils
 @namespace Utils
 */

var TW = TW || {};
TW.Utils = TW.Utils || {};


/**
 * Provide an useful way to use inheritance
 *
 * @param child
 * @param parent
 * @method inherit
 */
TW.Utils.inherit  = function(child, parent) {
    var F = function() {};
    F.prototype = parent.prototype;
    child.prototype = new F();
};
