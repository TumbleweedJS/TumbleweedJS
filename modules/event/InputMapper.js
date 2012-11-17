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

		function InputMapper(target) {

			TW.Event.EventProvider.call(this);


			if (target === undefined) {
				target = window.document;
			}

			this.enable = true;

			this._binds = [];
		}

		TW.Utils.inherit(InputMapper, TW.Event.EventProvider);


		/**
		 * return the EventProvider type.
		 *
		 * @method getType
		 * @return {String}     "MAPPER"
		 */
		InputMapper.prototype.getType = function() {
			return "MAPPER";
		};

		InputMapper.prototype.getRealEvent = function(localEvent) {
			var i;
			i = this.states.indexOf(localEvent);

			if (i === -1) {
				return null;
			}

			return this._binds[i] ? this._binds[i].event : null;
		};

		InputMapper.prototype.getNoMappedEvents = function() {
			var i, len, arr;

			arr = [];
			for (i = 0, len = this._binds.length; i < len; ++i) {
				if (this._binds[i] === undefined) {
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
			this._binds.push(undefined);
			this.values.push(undefined);
			this.oldValues.push(undefined);

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
			var i;
			i = this.states.indexOf(name);

			if (i === -1) {
				return false;
			}
			this.states.splice(i, 1);
			this._binds.splice(i, 1);
			this.values.splice(i, 1);
			this.oldValues.splice(i, 1);

			return true;
		};

		/**
		 * Bind a remote event to a local event.
		 *
		 * @method bind
		 * @param {String}  localEvent
		 * @param {String}  remoteEvent
		 * @param {EventProvider}  input
		 */
		InputMapper.prototype.bind = function(localEvent, remoteEvent, input) {
			var i, id;
			i = this.states.indexOf(localEvent);

			if (i === -1 || input.getStateList().indexOf(remoteEvent) === -1) {
				return false;
			}

			if ( this._binds[i] !== undefined ) {
				this._binds[i].input.rmListener(this._binds[i].id);
			}

			id = input.addListener(remoteEvent, this._bindEvent.bind(this));
			this._binds[i] = {event: remoteEvent, input: input, id: id};
		};

		InputMapper.prototype.bindListen = function(localEvent, input) {
			var i, id;
			i = this.states.indexOf(localEvent);

			if (i === -1) {
				return false;
			}

			if ( this._binds[i] !== undefined ) {
				this._binds[i].input.rmListener(this._binds[i].id);
			}

			this.stopBindListen();

			id = input.addListener(this._bindListenEvent.bind(this));
			this._binds[i] = {event: undefined, input: input, id: id};
		};

		InputMapper.prototype.stopBindListen = function() {
			var i, len;

			for (i = 0, len = this._binds.length; i < len; ++i) {
				if (this._binds[i] !== undefined && this._binds[i].event === undefined) {
					this._binds[i].input.rmListener(this._binds[i].id);
					this._binds.splice(i, 1);
					return;
				}
			}
		};

		InputMapper.prototype._bindEvent = function(event, new_value, object) {
			var i, len;
			if (this.enable) {
				for (i = 0, len = this._binds.length; i < len; ++i) {
					if (this._binds[i] === undefined) {
						continue;
					}
					if (this._binds[i].event === event && this._binds[i].input === object) {
						this.modifyState(this.states[i], new_value);
					}
				}
			}
		};

		InputMapper.prototype._bindListenEvent = function(event, new_value, object) {
			var i, len;
			for (i = 0, len = this._binds.length; i < len; ++i) {
				if (this._binds[i] === undefined) {
					continue;
				}
				if (this._binds[i].event === undefined && this._binds[i].input === object) {
					this._binds[i].input.rmListener(this._binds[i].id);

					this.bind(this.states[i], event, object);
				}
			}
		};

		return InputMapper;
	}

}(TW));