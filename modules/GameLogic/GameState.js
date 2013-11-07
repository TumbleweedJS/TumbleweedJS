/**
 * @module GameLogic
 * @namespace GameLogic
 */

var TW = TW || {};
define(['../Utils/copyParam', '../Utils/inherit', '../Event/EventProvider'],
       function(copyParam, inherit, EventProvider) {

	TW.GameLogic = TW.GameLogic || {};


	/**
	 * The GameState class represente a state of game (like the start screen, the ingame state, or the lobby).
	 *
	 * A game is generally composed of several `GameState`, which can be used together, managed by a `GameStack`.
	 *
	 *
	 * The GameState class provides many events to handle the use and the transitions between states:
	 *
	 * - `update` and `draw` are emited when the state is updated and draw.
	 * - `sleep` is called when the state is put in background, and `wakeUp` when it become the active state.
	 * - `init` and `dispose` are called when the state is added and removed to/from the stack.
	 *
	 * A state is a purely logical class, which transfer `update()` and `draw()` calls to its childs without interfer.
	 * It does not have specific graphic code.
	 *
	 *
	 * You can add and remove childs objects or functions with the `addObject()` and `rmObject()` methods.
	 * An object can be anything. If it's a function, it will be called during each update.
	 * If it's an object, its `update()` method (if it has one) will be called during each update,
	 * and its `draw()` method during each draw.
	 *
	 *
	 * The `GameStack` is availlable at any moment using the method `getStack()`.
	 * So, you can easily `GameStack.push()` a new state
	 * or `GameStack.pop()` for removing the state itself from the stack.
	 *
	 * It's possible to use shared objects between all states with the GameStack, see the methods `GameStack.get()`
	 * and `GameStack.set()`.
	 *
	 * @class GameState
	 * @constructor
	 * @param {Object} params this object should contain severals members
	 *   @param {Boolean} [params.isTransparent=false]
	 *   Indicate that this state can be transparent or do not cover all the screen when drawn.
	 *   See the `isTransparent` attribute.
	 *   @param {Boolean} [params.isModal=true]
	 *   Indicate that background states should always be updated when this state is on the foreground.
	 *   See the `isModal` attribute.
	 */
	function GameState(params) {
		EventProvider.call(this, params);
		this._stack = null;

		/**
		 * List of all child object and functions.
		 * @property {Array} _objects
		 * @private
		 */
		this._objects = [];


		copyParam(this, params, {


			/**
			 * Tell if the lower state in the stack should be drawn or not.
			 *
			 * The default behavior is to draw only the active state (on the top of the stack).
			 * If this attribute is set to `true`, the previous state will also be drawn.
			 *
			 * It's usefull if a state don't cover all the screen, or has transparent effects.
			 *
			 * @property {Boolean} isTransparent
			 * @default false
			 */
			isTransparent: false,

			/**
			 * Tell if the lower state in the stack should be updated or not.
			 *
			 * The default dehavior is to update only the active state. (background states are not updated).
			 * If this attribute is set to `false`, then the previous state in the stack will also be updated.
			 *
			 * It's usefull when you should not stop the game, but display another screen,
			 * like display a menu in a multiplayer game.
			 *
			 * @property {Boolean} isModal
			 * @default true
			 */
			isModal: true
		});

		/**
		 * event emited before each update.
		 *
		 * @event update
		 * @param {Number} elapsedTime represents the amount of milliseconds elapsed since the last update call.
		 */

		/**
		 * event emited before each draw.
		 *
		 * @event draw
		 * @param {arg} argument passed to all `draw()` method
		 */

		/**
		 * event emited when the state is removed from the stack.
		 *
		 * This event is the perfect place to clean and destroy all objects.
		 *
		 * @event dispose
		 */

		/**
		 * event emited when the state is added to a stack.
		 *
		 * @event dispose
		 */

		/**
		 * event emited when the state becomes active.
		 *
		 * @event wakeUp
		 * @param [arg] argument receveid from `stack.pop()`.
		 */

		/**
		 * event emited when the state is put to sleep (another state becomes active).
		 *
		 * @event sleep
		 */

	}

	inherit(GameState, EventProvider);


	/**
	 * The addLayer function allow you to add a Layer to the GameState.
	 * By default the addLayer method order Layers by ascendant order by their z-depth values.
	 *
	 * @method addObject
	 * @param {*} layer the Layer which will have to be added to the GameState.
	 */
	GameState.prototype.addObject = function(obj) {
		this._objects.push(obj);
	};

	/**
	 * removes an object (or a function) from the state.
	 *
     * @method rmObject
     * @param {*} obj object to remove
     */
	GameState.prototype.rmObject = function(obj) {
		var length = this._objects.length;
		for (var i = 0; i < length; i++) {
			if (this._objects[i] === obj) {
				this._objects.splice(i, 1);
			}
		}
	};

	/**
	 * This method allows you to set the GameStack parent of the gameState.
	 *
	 * Note that this method is use internally by the GameStack implementation.
	 * You should not use it from your own.
	 *
	 * @method setGameStack
	 * @param {GameStack} gameStack represents the GameStack object which the GameState object
	 * belongs to.
	 */
	GameState.prototype.setGameStack = function(gameStack) {
		this._stack = gameStack;
	};

	/**
	 * return the `GameStack` class which the current gameState belongs to.
	 *
	 * @method getStack
	 * @return {GameStack} if the current GameState object have not already been linked with a GameStack
	 * it will return null.
	 */
	GameState.prototype.getStack = function() {
		return this._stack;
	};

	/**
	 * Update all child objects by calling `object.update()`.
	 * If the object is a function it's executed.
	 * If the object has no `update()` method, it have no effect;
	 *
	 * @method update
	 * @param {Number} elapsedTime time elapsed since last update call.
	 */
	GameState.prototype.update = function(elapsedTime) {
		this.emit('update', elapsedTime);
		for (var i = 0; i < this._objects.length; i++) {
			var obj = this._objects[i];
			if (typeof obj === "function") {
				obj(elapsedTime);
			} else if (typeof obj.update === "function") {
				obj.update(elapsedTime);
			}
		}
	};

	/**
	 * try to draw all child objects (by calling object.draw() with the same argument).
	 * If the object is a function, or has no `draw()` method, then it's ignored.
	 *
	 * @method draw
	 * @param {*} [param] parameters received from `GameStack`.
	 */
	GameState.prototype.draw = function(param) {
		this.emit('draw', param);
		for (var i = 0; i < this._objects.length; i++) {
			if (typeof this._objects[i].draw === "function") {
				this._objects[i].draw(param);
			}
		}
	};

	/**
	 * Called when the state is added to a stack.
	 * @method init
	 */
	GameState.prototype.init = function() {
		this.emit('init');
	};

	/**
	 * Called when the state is put in foreground.
	 *
	 * @method sleep
     */
	GameState.prototype.sleep = function() {
		this.emit('sleep');
	};

   /**
    * Called when the state wake up (become the active one, after a sleep).
    *
    * @method wakeUp
    * @param [arg] argument passed to the `pop()` method.
    */
    GameState.prototype.wakeUp = function(arg) {
		this.emit("wakeUp", arg);
    };

	/**
	 * Called when the state is removed from the stack.
	 * It's the best location for cleaning stuff.
	 *
	 * @method dispose
	 */
    GameState.prototype.dispose = function() {
		this.emit("dispose");
    };

	TW.GameLogic.GameState = GameState;
	return GameState;
});
