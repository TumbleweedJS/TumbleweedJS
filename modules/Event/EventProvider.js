/**
 * @module Event
 * @namespace Event
 */

var TW = TW || {};
define([], function() {

	TW.Event = TW.Event || {};


	/**
	 * An EventProvider is a object that can dispatch events (or message) using an Observer pattern.
	 *
	 * It provides methods to subscribe or unsubscribe to events, and to emit events.
	 *
	 *     var bus = new EventProvider();
	 *
	 *     bus.on('start', function(event, data, provider) {
	 *         console.log('Start callback : ' + data.msg);
	 *     });
	 *
	 *     bus.once('start', function(event, data, provider) {
	 *         console.log('This function will be called only one time.');
	 *     });
	 *
	 *     bus.any(function(event, data, provider) {
	 *         console.log('an event occurs: ' + event);
	 *     });
	 *
	 *     bus.emit('start', { msg: 'A new start' });
	 *
	 * @class EventProvider
	 * @constructor
	 */
	function EventProvider() {

		/**
		 * List of all listeners.
		 *
		 * @property {Array} _listeners
		 *   @param {Boolean} [_listeners.once] if defined and true, callback will be deleted after be called.
		 *   @param {String} _listeners.event=null event expected to call the callback.
		 *     If null, any event are accepted.
		 *   @param {Function} _listeners.callback callback to call when event is fired.
		 *
		 *    - *{String}* **callback.event** event name.
		 *    - **callback.data** data passed to `emit`.
		 *    - *{EventProvider}* **callback.provider** emitter of the event.
		 *
		 *   @param {Function} _listeners.predicate=null predicate to determine if callback should be called.
		 *
		 *    - *{String}* **predicate.event** event name.
		 *    - **predicate.data** data passed to `emit`.
		 *    - *{EventProvider}* **predicate.provider** emitter of the event.
		 *
		 * @protected
		 */
		this._listeners = [];
	}

	/**
	 * Add a subscriber to an event.
	 * The callback will be called each time the event is fired.
	 *
	 * @method on
	 * @param {String} event event name
	 * @param {Function} callback callback to call when an event is fired.
	 *   @param {String} callback.event event name.
	 *   @param callback.data data passed to `emit`.
	 *   @param {EventProvider} callback.provider emitter of the event.
	 * @param {Function} [predicate] predicate used to determine if the callback should be called.
	 *   Must return a boolean.
	 *   @param {String} predicate.event .
	 *   @param predicate.data data passed to `emit`.
	 *   @param {EventProvider} predicate.provider emitter of the event.
	 * @chainable
	 */
	EventProvider.prototype.on = function(event, callback, predicate) {
		this._listeners.push({
			event: event,
			callback: callback,
			predicate: predicate || null
		});
		return this;
	};

	/**
	 * Add a subscriber to an event.
	 * The callback will be called once, next time the event is fired.
	 * After been called, the callback will automatically unsubscribed.
	 *
	 * @method once
	 * @param {String} event event name
	 * @param {Function} callback callback to call when an event is fired.
	 *   @param {String} callback.event event name.
	 *   @param callback.data data passed to `emit`.
	 *   @param {EventProvider} callback.provider emitter of the event.
	 * @param {Function} [predicate] predicate used to determine if the callback should be called.
	 *   Must return a boolean.
	 *   @param {String} predicate.event .
	 *   @param predicate.data data passed to `emit`.
	 *   @param {EventProvider} predicate.provider emitter of the event.
	 * @chainable
	 */
	EventProvider.prototype.once = function(event, callback, predicate) {
		this._listeners.push({
			once: true,
			event: event,
			callback: callback,
			predicate: predicate || null
        });
		return this;
	};

	/**
	 * Add a global callback, called when an event is fired.
	 *
	 * Alias of for `on(null, callback, predicate)`.
	 *
	 * @method any
	 * @param {Function} callback callback to call when an event is fired.
	 *   @param {String} callback.event event name.
	 *   @param callback.data data passed to `emit`.
	 *   @param {EventProvider} callback.provider emitter of the event.
	 * @param {Function} [predicate] predicate used to determine if the callback should be called.
	 *   Must return a boolean.
	 *   @param {String} predicate.event .
	 *   @param predicate.data data passed to `emit`.
	 *   @param {EventProvider} predicate.provider emitter of the event.
	 * @chainable
	 */
	EventProvider.prototype.any = function(callback, predicate) {
		return this.on(null, callback, predicate);
	};

	/**
	 * removes the first occurrence of a subscriber from the list.
	 * If no occurrence is found, nothing will happen.
	 *
	 * @method off
	 * @param {String} event event name. If null, global callbacks added by `any` are removed.
	 * @param {Function} callback Callback to remove.
	 * @chainable
	 */
	EventProvider.prototype.off = function(event, callback) {
		var length = this._listeners.length;
		for (var i = 0; i < length; i++) {
			if (this._listeners[i].event === event &&
			    this._listeners[i].callback === callback) {
				this._listeners.splice(i, 1);
				return this;
			}
		}
		return this;
	};

	/**
	 * removes all listeners.
	 *
	 * @method removeAll
	 * @chainable
	 */
	EventProvider.prototype.removeAll = function() {
		this._listeners = [];
		return this;
	};

	/**
	 * Emit an event and call all subscibers to this event.
	 *
	 * @method emit
	 * @param {String} event event name
	 * @param data event data. Can be anything.
	 * @chainable
	 */
	EventProvider.prototype.emit = function(event, data) {
		var length = this._listeners.length;
		for (var i = 0; i < length; i++) {
			if ((this._listeners[i].event === null ||
			     this._listeners[i].event === event) &&
			    (this._listeners[i].predicate === null ||
			     this._listeners[i].predicate(event, data, this))) {
				this._listeners[i].callback(event, data, this);
				if (this._listeners[i].once) {
					this._listeners.splice(i, 1);
					i--;
					length--;
				}
			}
		}
		return this;
	};

	TW.Event.EventProvider = EventProvider;
	return EventProvider;
});
