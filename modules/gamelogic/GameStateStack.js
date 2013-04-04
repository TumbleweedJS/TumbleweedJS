/**
 * @module GameLogic
 * @namespace GameLogic
 */

define([], function() {
	var TW = TW || {};
	TW.GameLogic = TW.GameLogic || {};


	/**
	 * This class allows you to manipulate some GameStates. It is quite useful and widely used in Game Programming
	 * The default usage of this GameStateStack is to be added to a Gameloop which will call periodically the
	 * GameStateStack's update and draw methods.
	 * The GameStateStack class act like the Window class. When you create a GameStateStack object you must give
	 * it a canvas.
	 * You can add and suppress GameState objects from the GameStateStack.
	 * The main difference with the Window class is that the GameStateStack organize Layers in differents GameStates.
	 * And the focused GameState can change be change at runtime.
	 *
	 * Let's take an example, you want to do a little game which contains 2 states :
	 *
	 * - Paused
	 * - In Game
	 *
	 * Each state have to contains its own layers which represent it. But it is not the purpose of this Class.
	 * Refer to GameState class for more informations about that.
	 *
	 * You have to add the first State to the GameStateStack, in our case it is the "In Game" state.
	 * Then you can add the GameStateStack to the Gameloop.
	 * Then during updating process. Your "In Game" state will be updated. And during its update it can change the
	 * current state of the GameStateStack.
	 * For example, if the "In Game" state detect that you have pressed "space" to set the game in pause.
	 * Then a new State must be pushed to the GameStateStack which will be the "Paused" state.
	 *
	 * Then, the pause state will be the focused state. if it detects that the "space" key is pressed again. Then the
	 * current state of the GameStateStack must be poped.
	 * Then, the current state will be again the "In Game" state, and it will be resume where the "pause" state have
	 * been created.
	 * That's why this class is called a Stack, because internally, the GameStates are stacked and saved. It allows you
	 * to manage and save differents states.
	 * Like in the previous example you can save the current state of the game and set it in pause.
	 *
	 * Note that all the States are drawn on the canvas during draw procedure. Also note that only the last State which
	 * have been added to the GameState is updated.
	 * That's why all other states are paused. Because they are no more updated.
	 *
	 * @class GameStateStack
	 * @constructor
	 * @param {HTMLCanvasElement} canvas the canvas on which the States will be drawn.
	 */
	function GameStateStack(canvas) {
		this.viewStack = [];
		if (canvas) {
			this.localContext = canvas.getContext("2d");
		} else {
			this.localContext = null;
		}
	}

	/**
	 * This method allows you to add a State to the GameStateStack. Notice that when you push a GameState other states
	 * will be paused, It means that only the State that you've add to the GameStatePattern will be updated.
	 *
	 * @method push
	 * @param {GameState} gameState The gameState which will be the current GameState to be active.
	 */
	GameStateStack.prototype.push = function(gameState) {
		if (this.viewStack.length > 0) {
			this.viewStack[this.viewStack.length - 1].onSleep();
		}
		this.viewStack.push(gameState);
		gameState.setGameStateStack(this);
		gameState.onCreation();
	};

	/**
	 * This method allows you to destroy the current GameState. Notice that when you pop a GameState it will be
	 * destroyed and the previous state will be resume.
	 *
	 * @method pop
	 */
	GameStateStack.prototype.pop = function() {
		if (this.viewStack.length > 0) {
			var index = this.viewStack.length - 1;
			this.viewStack[index].onDelete();
			this.viewStack.splice(index, 1);
		}
		if (this.viewStack.length > 0) {
			this.viewStack[this.viewStack.length - 1].onWakeUp();
		}
	};

	/**
	 * This method try to find a State in the stack which has a specific name.
	 * It allows you to jump from a state to another.
	 *
	 * @method goToState
	 * @param {String} name this parameter specify the name of the state to find in the stack.
	 * @return {Boolean} returns true if a state with the specified name has been finded and set active on the stack.
	 * Otherwise it will return false.
	 */
	GameStateStack.prototype.goToState = function(name) {
		var length = this.viewStack.length;
		for (var i = length - 1; i >= 0; i--) {
			if (this.viewStack[i].name === name) {
				this.viewStack[length - 1].onSleep();
				for (var j = i + 1; j < length; j++) {
					this.viewStack[j].onDelete();
				}
				this.viewStack.splice(i + 1, length - i);
				this.viewStack[i].onWakeUp();
				return true;
			}
		}
		return false;
	};

	/**
	 * This method allows you to update the GameStateStack, notice that only the last GameState will be updated.
	 *
	 * @method update
	 * @param elapsedTime
	 */
	GameStateStack.prototype.update = function(elapsedTime) {
		if (this.viewStack.length > 0) {
			this.viewStack[this.viewStack.length - 1].update(elapsedTime);
		}
	};

	/**
	 * This method allows you to draw the GameStateStack, notice that all the GameState will be drawn. From the last
	 * GameState to the first.
	 *
	 * @method draw
	 */
	GameStateStack.prototype.draw = function() {
		if (this.localContext) {
			this.localContext.clearRect(0, 0, this.localContext.canvas.width, this.localContext.canvas.height);
			for (var i = 0; i < this.viewStack.length; i++) {
				this.viewStack[i].draw(this.localContext);
			}
		}
	};

	TW.GameLogic.GameStateStack = GameStateStack;
	return GameStateStack;
});
