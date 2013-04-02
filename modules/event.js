/**
 * The event module provide all tools for catching input events, manipulate them and generate custom events.
 *
 * All events represent a state changeling from an {{#crossLink "Event.EventProvider"}}{{/crossLink}}.<br />
 * Because an event is not useful without data, each event provider has a number of custom states,
 * defined in the documentation.
 *
 * Each time a state change, an event is detected and all callbacks listening this event are called.
 * Because all classes have a common format, it's possible to easy combine and manipulate many providers.
 *
 * ## Input provider
 *
 * Two eventProviders are defined, giving access to the two most used input:
 * {{#crossLink "Event.KeyboardInput"}}{{/crossLink}} and {{#crossLink "Event.MouseInput"}}{{/crossLink}}.<br />
 * States available are mouse position, main mouse buttons, and all standard keyboard keys.
 *
 * ## Manipulate events
 *
 * The {{#crossLink "Event.InputMapper"}}{{/crossLink}} class provide an easy way to hide real used event,
 * allowing you to easily change an event (like specific keyboard key) for an action given.
 *
 * @module Event
 * @main
 */

var TW = TW || {};

define([
	       './event/EventProvider',
	       './event/KeyboardInput',
	       './event/MouseInput',
	       './event/InputMapper'
       ], function() {
	return TW.Event;
});

