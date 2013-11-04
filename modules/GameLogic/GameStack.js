/**
 * @module GameLogic
 * @namespace GameLogic
 */

var TW = TW || {};
define(['../Utils/inherit', '../Event/EventProvider', '../GameLogic/GameState'],
       function(inherit, EventProvider, GameState) {

	TW.GameLogic = TW.GameLogic || {};


	/**
	 * This class allows you to manipulate some `GameState`. I's a pattern quite useful and widely used
	 * in Game Programming.
	 *
	 * The `GameStack` class is a proper way to manage differents states of game.
	 * A state, represented by the `GameState` class, is generally a particular screen
	 * (each menu screen, the lobyy screen) or a specific state wich takes the focus (like a cut-scene).
	 *
	 * The purpose of this design pattern is to easily switch between several states,
	 * and update and draw them only when needed.
	 * It's represented as a stack, where the top element is the only one active (ie: updated and drawn).
	 *
	 * ____
	 *
	 * You can add and suppress `GameState` instances from the `GameStack` with `pop()` and `push()` methods.
	 * `push()` will put the state on the top of the stack.
	 * `pop()` destroy the current state (an doptionnaly return a value to the parent).
	 *
	 *
	 * `GameStack` has two method: `update()` and `draw()` wich retransmit call to the good `GameState`.
	 * The easiest way to use it is to add the `GameStack` to a `Gameloop` instance. The gameloop will call
	 * periodically the `GameStack`'s `update()` and `draw()` methods.
	 *
	 *
	 * ### Example
	 *
	 * Let's take an example, you want to do a little game which contains 2 states :
	 *
	 * - Paused
	 * - In Game
	 *
	 * Each state have to contains its own drawing methods which represent it. But it is not the purpose of this Class.
	 * Refer to GameState class for more informations about that.
	 *
	 * You have to add the first State to the GameStack, in our case it is the "In Game" state.
	 * Then you can add the GameStack to the Gameloop.
	 * Then during updating process. Your "In Game" state will be updated. And during its update it can change the
	 * current state of the GameStack.
	 * For example, if the "In Game" state detect that you have pressed "space" to set the game in pause.
	 * Then a new State must be pushed to the GameStack which will be the "Paused" state.
	 *
	 * Then, the pause state will be the focused state. if it detects that the "space" key is pressed again. Then the
	 * current state of the GameStack must be poped.
	 * Then, the current state will be again the "In Game" state, and it will be resume where the "pause" state have
	 * been created.
	 * That's why this class is called a Stack, because internally, the GameStates are stacked and saved. It allows you
	 * to manage and save differents states.
	 * Like in the previous example you can save the current state of the game and set it in pause.
	 *
	 * By default, only the active state is updated and drawn. This behavior can be modified by using
	 * `GameState.isModal` and `GameState.isTransparent` attributes. See the class `GameState` for more details.
	 *
	 * ### key/value storage
	 *
	 * The `GameState` class has a key/value storage system, wich is used to share data between all states.
	 * It's patyiculary usefull for sharing global draw context, or global object (like keyboard, ...)
	 *
	 * For use it, the `get()` and `set()` method are availlable.
	 *
	 *
	 * ### Finite State Machine
	 *
	 * Although the use of `GameStack` as a stack is the main purpose of the class,
	 * it is also possible to consider as a finite state machine.
	 *
	 * The stack point of view is very usefull for small states wich keep the same creation order
	 * (like menu and submenus), but doesn't fully meet all needs.
	 * It consider that the state should known who is its successor
	 * and how to call them, creating a direct dependency.
	 *
	 * The FSM allow you to create link code outside all states, called when a state pop.
	 * so, all code of transitions between states are grouped in a genral class.
	 *
	 * To do this, the `GameStack` class has a `link()` method, to make link between states.
	 * See the `link()` documentation.
	 *
	 * @class GameStack
	 * @constructor
	 */
	function GameStack() {

		EventProvider.call(this);

		/**
		 * Emitted when the `GameStack` is updated
		 * @event update
		 */

		/**
		 * Emitted when the `GameStack` is drawn.
		 * @event draw
		 */

		/**
		 * the stack containing all `GameState`.
		 *
		 * @property {Array} _stack
		 * @private
		 */
		this._stack = [];

		/**
		 * shared map used by `get()` and `set()` method.
		 * It's a key/value storage system, used to share data between states.
		 *
		 * @property {Object} _shared_map
		 * @private
		 */
		this._shared_map = {};

		/**
		 * List of link callback.
		 * See `link()` method.
		 *
		 * @property {Array}
		 * @private
		 */
		this._links = [];
	}

	inherit(GameStack, EventProvider);

	/**
	 * Add a State to the GameStack. This state is now the active one.
	 *
	 * When you push a GameState other states will be paused;
	 * It means that only the State that you've add to the GameStatePattern will be updated.
	 *
	 * @method push
	 * @param {GameState} gameState The gameState which will be the current GameState to be active.
	 */
	GameStack.prototype.push = function(gameState) {
		if (this._stack.length > 0) {
			this._stack[this._stack.length - 1].sleep();
		}
		this._stack.push(gameState);
		gameState.setGameStack(this);
	};

	/**
	 * Removes the current GameState.
	 *
	 * Notice that when you pop a GameState it will be
	 * destroyed (`dispose` event will be called) and the previous state will be resume.
	 *
	 * @method pop
	 * @param {*} [ret] optionnal returned value. It's transmitted to the `wakeUp()` call.
	 */
	GameStack.prototype.pop = function(ret) {
		if (this._stack.length > 0) {
			var index = this._stack.length - 1;
			var state = this._stack[index];
			state.dispose();
			this._stack.splice(index, 1);

			//apply links
			for (var i = 0; i < this._links.length; i++) {
				var link = this._links[i];
				if (state === link.ended_state ||
				    (typeof link.ended_state === "function" && state instanceof link.ended_state)) {
					this.push(link.callback(ret));
					return;
				}
			}
		}
		if (this._stack.length > 0) {
			this._stack[this._stack.length - 1].wakeUp(ret);
		}
	};

	/**
	 * Detect when a specific state (or instance of a specific class) is deleted,
	 * for adding the next state.
	 *
	 * It's pretty usefull for using `GameStack` as a finite state machine.
	 *
	 * @method link
	 * @param {GameState|Function} ended_state state which triggers the link when deleted.
	 * If an instance of state is given, only this instance trigegrs the link.
	 * If a class constructor is given, all instances of this class (and it's subclasses) triggers the link.
	 * @param {Function} NextState callback or GameState class.
	 * If a class inherited of GameState is given, a new instance of this class is created and pushed to the stack.
	 * Ths return value given to `pop()` is passed in parameter.
	 * If a callback is given, it's called with the return value given to `pop()`,
	 * and must return a `GameState` instance.
	 * This instance will be push to the stack.
	 *
	 * @example
	 *
	 *      var my_state = new State1;
	 *
	 *      //set link
	 *      stack.link(my_state, function(arg) {
	 *          if (arg === 1)
	 *              return new State1("method1");
	 *          else
	 *              return new State1("method2");
	 *      });
	 *
	 *      //set another link
	 *      stack.link(State1, State3);
	 *
	 *      stack.push(my_state);
	 *      //...
	 *
	 *      stack.pop(1);
	 *      //my_state is removed form the stack.
	 *      //the first link is triggered: value passed to pop() are transmitted
	 *      //a new State1 is created with "method1" args, and pushed to the stack.
	 *
	 *      //...
	 *      stack.pop("arg for State3 constructor");
	 *      //the State1 instance is removed, and the second link is triggered
	 *      //a new State3 is created and pushed to the stack.
	 */
	GameStack.prototype.link = function(ended_state, NextState) {
		var defaultCallback = function(arg) {
			return new NextState(arg);
		};

		var link = {
			ended_state:    ended_state,
			callback:       NextState,
			name:           '[' + (NextState.name || "function") + "()]"
		};

		if (NextState === GameState || NextState.prototype instanceof GameState) {
			//It's a class, and not a callback
			link.callback = defaultCallback;
			link.name = "new " + (NextState.name || "Class") + "()]";
		}

		this._links.push(link);
	};

	/**
	 * This method allows you to update the GameStack.
	 *
	 * When called, the active state are updated.
	 * Other states can be updated, but only if all states upper in the stack are non-modal.
	 *
	 * A state is no-modal if it's `isModal` attribute is set to `false`;
	 *
	 * When it's a modal state, only the active state is updated.
	 *
	 * If the `isModal`'s current state attribute is `false`,
	 * the previous state in the stack is also updated.
	 *
	 * @method update
	 * @param {Number} [elapsedTime] elapsed time since the last update (in miliseconds).
	 */
	GameStack.prototype.update = function(elapsedTime) {
		if (this._stack.length > 0) {
			var first = this._stack.length - 1;
			while (first > 0 && !this._stack[first].isModal) {
				first--;
			}
			for (; first < this._stack.length; first++) {
				this._stack[first].update(elapsedTime);
			}
		}
		this.emit('update', elapsedTime);
	};

	/**
	 * Draw the active GameStack.
	 *
	 * Only visible states are drawn. A state is visible if it's the active state on the top,
	 * or if all states upper in the stack are transparent.
	 *
	 * A `GameState` is transparent if the `isTransparent` attribute is set to `true`.
	 *
	 * @method draw
	 * @param {*} [arg] parameter passed to `draw()` GameState methods.
	 */
	GameStack.prototype.draw = function(arg) {
		if (this._stack.length > 0) {
			var first = this._stack.length - 1;
			while(first > 0 && this._stack[first].isTransparent) {
				first--;
			}
			for (; first < this._stack.length; first++) {
				this._stack[first].draw(arg);
			}
		}
		this.emit('draw', arg);
	};

	/**
	 * get an object from the shared key/value GameStack storage.
	 *
	 * @method get
	 * @param {String} key the jey to search
	 * @return the selected object; null if not found.
	 */
	GameStack.prototype.get = function(key) {
		return this._shared_map.hasOwnProperty(key) ? this._shared_map[key] : null;
	};

	/**
	 * set an object in the shared key/value GameStack storage.
	 *
	 * If the key is already defined, its value is overwritten.
	 *
	 * @method set
	 * @param {String} key the key of the object.
	 * @param {*} value value associated to the key.
	 */
	GameStack.prototype.set = function(key, value) {
		this._shared_map[key] = value;
	};

	TW.GameLogic.GameStack = GameStack;
	return GameStack;
});
