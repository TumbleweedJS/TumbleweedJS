/**
 * @module Event
 * @namespace Event
 */

var TW = TW || {};
define(['./DeviceInput', '../Utils/inherit', '../Utils/Polyfills'], function(DeviceInput, inherit) {

	TW.Event = TW.Event || {};


	/**
	 * InputMapper is a virtual device input used to redirect event under an other event.
	 *
	 * It allow to create custom events (user-defined), following others deviceInputs.
	 * Its role is to act as an interface, hiding real event which can be changed without the user noticing.
	 *
	 * A typical utilisation is the remapping is to let the choice of controls keyboard to the player.
	 *
	 *      var keyboardEvents = new KeyboardInput();
	 *      var inputMapper = new InputMapper();
	 *
	 *      inputMapper.addEvent("ATTACK");
	 *      inputMapper.bind("ATTACK", "KEY_Q", keyboardEvents);
	 *
	 *      inputMapper.on("ATTACK", function(event, value, provider) {
     *      }, KeyboardInput.isPressed);
	 *
	 * @class InputMapper
	 * @extends Event.DeviceInput
	 * @constructor
	 */
	function InputMapper() {

		DeviceInput.call(this);

		/**
		 * By default when a source event is bound to an event already bound, the new source replaces the old one.
		 * If allowMultiInput is set to `true`, the both source events match to the same output event.
		 *
		 * @property {Boolean} allowMultiInput
		 * @defualt false
		 */
		this.allowMultiInput = false;

		this._binds = [];
	}

	inherit(InputMapper, DeviceInput);


	/**
	 * Getting the name of event bind with localEvent.
	 *
	 * If many remote events are bound to this event (with `allowMultiInput === true`), only the first one is returned.
	 *
	 * @method getRealEvent
	 * @param {String}  localEvent
	 * @return {String} Name of the real event if it exist or `null`
	 */
	InputMapper.prototype.getRealEvent = function(localEvent) {
		var i = this.states.indexOf(localEvent);

		if (i === -1) {
			return null;
		}

		return this._binds[i].length ? this._binds[i][0].event : null;
	};


	/**
	 * Getting an array of all no mapped local event.
	 *
	 * @method getNoMappedEvents
	 * @return {String[]} Array with all local events who is not already bound
	 */
	InputMapper.prototype.getNoMappedEvents = function() {
		var i, len, arr;

		arr = [];
		for (i = 0, len = this._binds.length; i < len; ++i) {
			if (this._binds[i].length === 0) {
				arr.push(this.states[i]);
			}
		}
		return arr;
	};

	/**
	 * Adding a local event.
	 *
	 * @method addEvent
	 * @param {String}  name
	 * @return {Boolean} true if success, false if failure
	 */
	InputMapper.prototype.addEvent = function(name) {
		if (this.states.indexOf(name) !== -1) {
			return false;
		}

		this.states.push(name);
		this._binds.push([]);
		this._values.push(undefined);

		return true;
	};

	/**
	 * Removing a local event.
	 *
	 * @method rmEvent
	 * @param {String}  name
	 * @return {Boolean} true if success, false if failure
	 */
	InputMapper.prototype.rmEvent = function(name) {
		var i = this.states.indexOf(name);

		if (i === -1) {
			return false;
		}
		this.states.splice(i, 1);
		for (var j = 0; j < this._binds[i].length; j++) {
			this._binds[i][j].input.off(this._binds[i][j].event, this._binds[i][j].callback);
		}
		this._binds.splice(i, 1);
		this._values.splice(i, 1);

		return true;
	};

	/**
	 * Bind a remote event to a local event.
	 *
	 * @method bindEvent
	 * @param {String} localEvent
	 * @param {String} remoteEvent
	 * @param {DeviceInput} input device firing the remote event
	 * @chainable
	 */
	InputMapper.prototype.bindEvent = function(localEvent, remoteEvent, input) {
		var i = this.states.indexOf(localEvent);
		var callback = function(remoteEvent, data) {
			this.emit(localEvent, data);
		}.bind(this);

		if (i === -1) {
			this.addEvent(localEvent);
			i = this.states.length - 1;
		}

		if (!this.allowMultiInput && this._binds[i].length > 0) {
			this._binds[i][0].input.off(this._binds[i][0].event, this._binds[i][0].callback);
			this._binds[i] = [];
		}
		this._binds[i].push({
            event: remoteEvent,
            input: input,
            callback: callback
        });
		this._values[i] = input.get(remoteEvent);
		input.on(remoteEvent, callback);

		return this;
	};


	/**
	 * Bind a remote event to a local event by listening to the next event of input.
	 *
	 * After a call to bindListen, the first event from the input device will be bound.
	 *
	 * @method bindListen
	 * @param {String}  localEvent event to bind
	 * @param {DeviceInput}  input input from which we wait an event.
	 * @param {Function} [onBound=null] if set, callback called when a remote event is bound.
	 * @param {String} [onBound.localEvent] local event bound.
	 * @param {String} [onBound.remoteEvent] remote event bound.
	 * @param {Function} [predicate] predicate used to accept an event or not.
	 *   Only the first accepted event will be linked. Should return `true` or `false`.
	 * @param {Function} [predicate.event] predicate used to accept an event or not.
	 * @param {Function} [predicate.data] predicate used to accept an event or not.
	 * @param {Function} [predicate.emitter] predicate used to accept an event or not.
	 *
	 * @example
	 *
	 * The predicate argument can be useful for allowing only a subset of events to be mapped:
	 *
	 *
	 *     BindListen('ACTION', keyboard, null, function(event, value, provider) {
	 *          //Only letters are accepted
	 *          Return /KEY_[A-Z]/.test(value);
	 *     });
	 *
	 *     BindListen('ACTION', mouse, null, function(event, value, provider) {
	 *          //This predicates assures that only a button action will be mapped (and not a mouse move)
     *          Return typeof value == 'boolean';
     *     });
	 *
	 * @chainable
	 */
	InputMapper.prototype.bindListen = function(localEvent, input, onBound, predicate) {
		var i = this.states.indexOf(localEvent);

		if (i === -1) {
			this.addEvent(localEvent);
			i = this.states.length - 1;
		}

		if (!this.allowMultiInput && this._binds[i].length > 0) {
			this._binds[i][0].input.off(this._binds[i][0].event, this._binds[i][0].callback);
			this._binds[i].splice(i, 1);
		}

		this.stopBindListen();

		var callback = function(bindIndex, event, data, provider) {
			if (predicate === undefined || predicate(event, data, provider)) {
				this.bindEvent(localEvent, event, input);

				if (typeof onBound === "function") {
					onBound(localEvent, event);
				}
				if (this.allowMultiInput) {
					this._binds[i].splice(bindIndex, 1);
					input.off(null, callback);
				}
			}
		}.bind(this, this._binds[i].length);
		this._binds[i].push({
            event: null,
            input: input,
            callback: callback,
			listen: true
        });
		input.any(callback);
		return this;
	};

	/**
	 * Stop a listening of the function bindListen.
	 *
	 * @method stopBindListen
	 */
	InputMapper.prototype.stopBindListen = function() {
		var i, len;

		for (i = 0, len = this._binds.length; i < len; ++i) {
			for (var j = 0; j < this._binds[i].length; j++) {
				if (this._binds[i][j].listen) {
					this._binds[i][j].input.off(this._binds[i][j].event, this._binds[i][j].callback);
					this._binds[i].splice(j, 1);
				}
			}
		}
	};

	InputMapper.prototype._isStateBound = function(idState, remoteEvent, input, startIndex) {
		for (var i = startIndex || 0; i < this._binds[idState].length; i++) {
			if (remoteEvent === this._binds[idState][i].event && input === this._binds[idState][i].input) {
				return true;
			}
		}
		return false;
	};

	/**
	 * Search and returns a list of all remote events which are linked to many events.
	 *
	 * It's useful to prevent unexpected behavior after a keyboard mapping, for example.
	 *
	 * Note that if a remote event is bound twice to the same action,
	 * it's considered as a conflict (with only one output event)
	 *
	 * @method getConflicts
	 * @return {Array} list of all conflicts. Each input event in conflict will be represented by an object, containing
	 *  itself and the list of all output events corresponding.
	 *
	 * @example
	 *
	 *     mapper.getConflicts();
	 *     //[{
	 *     //     inputEvent: "KEY_A",
	 *     //     outputEvent: [ "ACTION1", "ACTION2" ],
	 *     //     input: <KeyboardInput>
	 *     //}]
	 */
	InputMapper.prototype.getConflicts = function() {
		var result = [];

		for (var i = 0; i < this._binds.length; i++) {
			for (var j = 0; j < this._binds[i].length; j++) {
				var conflicts = [this.states[i]];

				for (var k = i + 1; k < this._binds.length; k++) {

					if (this._isStateBound(k, this._binds[i][j].event, this._binds[i][j].input)) {
						conflicts.push(this.states[k]);
					}
				}
				if (conflicts.length > 1 ||
				    this._isStateBound(i, this._binds[i][j].event, this._binds[i][j].input, j + 1)) {

					result.push({
						inputEvent: this._binds[i][j].event,
						outputEvent: conflicts,
						inputProvider: this._binds[i][j].input
		            });
				}
			}
		}
		return result;
	};

	TW.Event.InputMapper = InputMapper;
	return InputMapper;
});
