/**
 * @module Event
 * @namespace Event
 */
var TW = TW || {};
TW.Event = TW.Event || {};

TW.Event.InputShortcut = function() {
	/**
	 *  A class for manage callback with input event
	 * @InputShortcut
	 * @constructor
	 */
	function InputShortcut() {
		/**
		 * Collection of function pointer
		 * @type {Array}
		 * @private
		 */
		this._callBack = [];
	}

	/**
	 * Add a function into the callback collection
	 * @param {TW.Event} arrayKey
	 * @param {Function} fun
	 * @return {Number}
	 */
	InputShortcut.prototype.add = function(arrayKey, fun) {
		var callBackStruct = [];
		callBackStruct.fct = fun;
		callBackStruct.args = [];

		for (var i = 0; i < arrayKey.length; i++) {
			callBackStruct.args.push(arrayKey[i]);
		}

		this._callBack.push(callBackStruct);

		return this._callBack.length - 1;
	};

	/**
	 * Delete the function from the callback collection
	 * @param {Number} funId
	 */
	InputShortcut.prototype.delete = function(funId) {
		this._callBack.splice(funId, 1);
	};

	/**
	 * Call the pointer function when all the key combinaiton match
	 */
	InputShortcut.prototype.update = function() {
		for (var it = 0; it < this._callBack.length; it++) {
			var tBool = true;

			for (var it2 = 0; it2 < this._callBack[it].args.length; it2++) {
				if (TW.Event.KeyboardService.isKeyUp(this._callBack[it].args[it2])) {
					tBool = false;
					break;
				}
			}
			if (tBool && this._callBack[it].args.length > 0) {
				this._callBack[it].fct();
			}
		}
	};

	return InputShortcut;
}();