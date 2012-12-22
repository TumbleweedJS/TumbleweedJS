/**
 @module Event
 @namespace Event
 */

var TW = TW || {};

(function(TW) {

	if (typeof window.define === "function" && window.define.amd) {
		define(['./EventProvider', '../utils/Inheritance'], initWrap(init));
	} else {
		initWrap(init);
	}

	function initWrap(f) {
		TW.Event = TW.Event ||  {};
		TW.Event.InputMapper = f();
		return TW.Event.InputMapper;
	}

	function init() {

		/**
		 * InputMapper is a virtual event provider used to redirect event under an other event.
		 *
		 * It allow to create custom events (user-defined), following others eventProviders.
		 * Its role is to act as an interface, hiding real event which can be changed without the user noticing.
		 *
		 * A typical utilisation is the remapping is to let the choice of controls keyboard to the player.
		 *
		 * @example
		 *
		 *      var keyboardEvents = new KeyboardInput();
		 *      var inputMapper = new InputMapper();
		 *
		 *      inputMapper.addEvent("ATTACK");
		 *      inputMapper.bind("ATTACK", "KEY_Q", keyboardEvents);
		 *
		 *      inputMapper.addListener("ATTACK", KeyboardInput.KEY_PRESSED, function(event, value, provider) {
		 *      });
		 *
		 * @class InputMapper
		 * @constructor
		 */
		function EventCombination() {

			TW.Event.EventProvider.call(this);

			this._combinations = [];
			this._events = [];
			this._eventsBind = [];

			this.enable = true;
		}

		TW.Utils.inherit(EventCombination, TW.Event.EventProvider);


		/**
		 * return the EventProvider type.
		 *
		 * @method getType
		 * @return {String}     "COMBINATION"
		 */
		EventCombination.prototype.getType = function() {
			return "COMBINATION";
		};

		/**
		 * Bind a remote event to a local event.
		 *
		 * @method bindEvent
		 * @param {String}  localEvent
		 * @param {String}  remoteEvent
		 * @param {EventProvider}  input
		 */
		EventCombination.prototype.addCombination = function(localEvent, remoteEvents) {
			var i, id, len, arr;
			i = this.states.indexOf(localEvent);

			if (i !== -1 || remoteEvents.length === 0) {
				return false;
			}

			this.states.push(localEvent);

			for (i = 0, len = remoteEvents.length; i < len; ++i) {
				if (this._events.indexOf(remoteEvents[i]) === -1) {
					this._events.push(remoteEvents[i]);
					this._eventsBind.push([localEvent]);
				}
				else {
					this._eventsBind[i].push(localEvent);
				}
				arr.push({event: remoteEvents[i], value: undefined});
			}
			this._combinations.push(arr);
			return true;
		};

		return EventCombination;
	}

	/**
	 * Callback function who bind a local event with remote event.
	 *
	 * @method _bindEvent
	 * @param {String}   event
	 * @param {Boolean|Object}   new_value
	 * @param {EventProvider}   object
	 * @private
	 */
	EventCombination.prototype._combinationEvent = function(event, new_value, object) {
		var i, len, localEvents;
		if (this.enable) {
			i = this._events.indexOf(event);
			if (i === -1) {
				return;
			}
			localEvents = this._eventsBind[i];
			for (i = 0, len = localEvents.length; i < len; ++i) {

				if (this._binds[i] !== undefined && this._binds[i].event === event &&
				    this._binds[i].input === object) {
					this.modifyState(this.states[i], new_value);
				}
			}
		}
	};


}(TW));
