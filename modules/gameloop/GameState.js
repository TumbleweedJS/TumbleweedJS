/**
 @module Gameloop
 @namespace Gameloop
 */

var TW = TW || {};

(function(TW) {

	TW.Gameloop = TW.Gameloop ||  {};
	TW.Gameloop.GameState = GameState;

	if (typeof window.define === "function" && window.define.amd) {
		define(['./Gameloop', '../utils/Inheritance'], function() {
			return GameState;
		});
	}

	/**
	 * The GameState class provides an object which handle severals methods which can be called by the GameStateStack.
	 * Each GameState object contains some methods :
	 *
	 * - onUpdate       this method is called when the GameState is updating.
	 * - onDraw         this method is called when the GameState is drawing
	 * - onCreation     this method is called when the GameState is added to a GameStateStack
	 * - onDelete       this method is called when the GameState is removed from a GameStateStack
	 * - onSleep        this method is called when the GameState looses the focus.
	 * - onWakeUp       this method is called when the GameState takes back the focus.
	 *
	 * There are two ways to define these methods:
	 *
	 * - If you have a lot of code for the state, you can inherit from `GameState` and override these methods.
	 *   Or more simply directly redefine a method of an instance :
	 *
	 *         var myGameState = new TW.Gameloop.GameState();
	 *         myGameState.onUpdate = myOnUpdateFunc;
	 *         myGameState.onDraw = myOnDrawFunc;
	 *
	 * - For a little state, with just few code, methods can be passed in arguments:
	 *
	 *         new TW.Gameloop.GameState({
	 *              onUpdate: function(elapsedTime) {
	 *                  //before update
	 *              },
	 *              onDraw() {
	 *                  //before draw
	 *              }
	 *         });
	 *
	 *
	 * You can also insert Layers into the GameState. You can sort them by their z-index in asc or desc order.
	 * Layers allows you to render something on the context of the GameStateStack.
	 *
	 * You can also insert Callbacks into the GameState some callbacks which will be executed when the
	 * GameState is updating.
	 * Notice that callbacks are executed after the onUpdate event.
	 * You can sort the callbacks by specifiying a priority order.
     *
	 * Note that you can also interact with the GameStateStack which own the GameState object.
	 * You can :
	 * - push states
	 * - pop states
	 * - go to a special state in the stack
	 *
	 * Here is an example on which i show how you can push state, pop state and go to a special state :
	 *
	 *     this.getGameStateStack().push(newState);
	 *     this.getGameStateStack().pop();
	 *     this.getGameStateStack().goToState("state_name");
	 *
     * @class GameState
	 * @param {Object} params this object should contain severals members
	 *   @param {String} [params.name] which is the name of the State.
	 *   @param {Boolean} [params.sortLayerAsc=true] which is a boolean.
     *   It must be equal to true if you want to sort Layers by ascendant order.
	 *   Otherwise it must be equal to false. Default value equals true.
	 *   @param {Boolean} [params.sortCallbackAsc=true] which is a boolean. It must be equal to true if you
	 *   want to sort Callbacks by ascendant order. Otherwise it must be equal to false. default value equals true.
	 *   @param {Function} [params.onUpdate] called when the GameState is updating.
	 *   @param {Function} [params.onDraw] called when the GameState is drawing.
	 *   @param {Function} [params.onCreation] called when the GameState is added to a GameStateStack.
	 *   @param {Function} [params.onDelete] called when the GameState is removed from a GameStateStack.
	 *   @param {Function} [params.onSleep] called when the GameState looses the focus.
	 *   @param {Function} [params.onWakeUp] called when the GameState takes back the focus.
	 *
	 * @constructor
	 */
	function GameState(params) {
		this._gameStateStack = null;
		this.layerList = [];
		this.callbackList = [];

		//noinspection JSHint,JSHint
		TW.Utils.copyParam(this, params, {
			name:               "",
			sortLayerAsc:       true,
			sortCallbackAsc:    true,

			/**
			 * method called before each update. Can be overridden or given as argument to the constructor.
			 *
			 * @method onUpdate0
			 * @param {Number} elapsedTime represents the amount of milliseconds elapsed since the last update call.
			 */
			/* jshint:unused:false */
			onUpdate:           function(elapsedTime) {},

			/**
			 * method called before each draw. Can be overridden or given as argument to the constructor.
			 *
			 * @method onDraw
			 */
			onDraw:             function() {},

			/**
			 * method called when the state is created and placed on the stack.
			 * Can be overridden or given as argument to the constructor.
			 *
			 * @method onCreation
			 */
			onCreation:         function() {},

			/**
			 * method called when the state is removed from the stack.
			 * Can be overridden or given as argument to the constructor.
			 *
			 * **Note:** The state object is not always really deleted, and can be reused later.
			 * This method should put the GameState as if it has never been used.
			 *
			 * @method onDelete
			 */
			onDelete:           function() {},

			/**
			 * method called when the state becomes active.
			 * Can be overridden or given as argument to the constructor.
			 *
			 * @method onWakeUp
			 */
			onWakeUp:           function() {},

			/**
			 * method called when the state is put to sleep (another state becomes active).
			 * Can be overridden or given as argument to the constructor.
			 *
			 * @method onSleep
			 */
			onSleep:            function() {}
		});
	}

	/**
	 * The setSortLayer order allows you to define the sort order of the Layers.
	 * Note that the Layers are ordered by their z-index values.
	 * @method setSortLayerOrder
	 * @param {Boolean} asc represents the sort order.
     * If asc is equal to true it means that your layers will be sort by ascendant order.
	 * Otherwise, your layers will be sorted by descendant order.
	 */
	GameState.prototype.setSortLayerOrder = function(asc) {
		this.sortLayerAsc = asc;
	};

	/**
	 * The setCallbackOrder order allows you to define the sort order of the Callbacks
	 * @method setCallbackOrder
	 * @param {Boolean} asc represents the sort order.
     * If asc is equal to true it means that your layers will be sort by ascendant order.
	 * Otherwise, your layers will be sorted by descendant order.
	 */
	GameState.prototype.setCallbackOrder = function(asc) {
		this.sortCallbackAsc = asc;
	};

	/**
	 * The getName method allows you to retrieve the name which is associated to the current GameState.
	 * @method getName
	 * @return {String} return the name of the current GameState object.
	 */
	GameState.prototype.getName = function() {
		return this.name;
	};

	/**
	 * The addLayer function allow you to add a Layer to the GameState.
	 * By default the addLayer method order Layers by ascendant order by their z-depth values.
	 * @method addLayer
	 * @param {TW.Graphic.Layer} layer the Layer which will have to be added to the GameState.
	 */
	GameState.prototype.addLayer = function(layer) {
		this.layerList.push(layer);
		this.sortLayers();
	};

	/**
	 * This method allows you to remove a layer from the GameState.
	 * @method removeLayer
	 * @param {TW.Graphic.Layer} refLayer a reference to the layer that you want to suppress from the GameState.
	 * @return {Boolean} if the refLayer have been successfully finded and suppressed from the GameState object it will
	 * returns true. Otherwise it will returns false.
	 */
	GameState.prototype.removeLayer = function(refLayer) {
		for (var i = 0; i < this.layerList.length; i++) {
			if (refLayer === this.layerList[i]) {
				this.layerList.splice(i, 1);
				return true;
			}
		}
		return false;
	};

	/**
	 * The addCallback function allow you to add a callback to the current GameState object.
	 * @method addCallback
	 * @param {Object} param This object must contain a number called 'priority' and a reference to the callback
	 * called 'callback'.
	 * @param {Number} [param.priority] represent the execution priority of the callback.
	 * @param {Function} [param.callback] represent the function to execute.
	 * @return {Boolean} return true if param contains a priority and a callback members. otherwise it will
	 * returns false.
	 */
	GameState.prototype.addCallback = function(param) {
		if (param.priority && param.callback) {
			this.callbackList.push(param);
			this.sortCallbacks();
			return true;
		} else {
			return false;
		}
	};

	/**
	 * This method allows you to remove a callback from the current GameState object.
	 * @method removeCallback
	 * @param {Function} refCallback a reference to the callback function to remove from the current GameState object.
	 * @return {Boolean} if the refCallback have been successfully finded and suppressed then the method will return
	 * true. Otherwise it will return false.
	 */
	GameState.prototype.removeCallback = function(refCallback) {
		for (var i = 0; i < this.callbackList.length; i++) {
			if (refCallback === this.callbackList[i]) {
				this.callbackList.splice(i, 1);
				return true;
			}
		}
		return false;
	};

	/**
	 * The sortLayers method allow you to sort layers by their z-order.
	 * @method sortLayers
	 */
	GameState.prototype.sortLayers = function() {
		if (this.sortLayerAsc === true) {
			this.layerList.sort(function(a, b) {return a.zIndex - b.zIndex;});
		} else {
			this.layerList.sort(function(a,b) {return b.zIndex - a.zIndex;});
		}
	};

	/**
	 * The sortCallbacks method allow you yo sort callbacks by their priority member.
	 * @method sortCallbacks
	 */
	GameState.prototype.sortCallbacks = function() {
		if (this.sortCallbackAsc === true) {
			this.callbackList.sort(function(a, b){return a.priority - b.priority;});
		}   else {
			this.callbackList.sort(function(a,b){return b.priority - a.priority;});
		}
	};

	/**
	 * This method allows you to set the GameStateStack parent of the gameState. Note that this method
	 * is use internally
	 * by the GameStateStack implementation.
	 * You should not use it from your own.
	 * @private
	 * @method setGameStateStack
	 * @param {GameStateStack} gameStateStack represents the gameStateStack object which the GameState object
	 * belongs to.
	 */
	GameState.prototype.setGameStateStack = function(gameStateStack) {
	 this._gameStateStack = gameStateStack;
	};

	/**
	 * This method allows you to get the GameStateStack pattern which the current gameState belongs to.
	 * @method getGameStateStack
	 * @return {GameStateStack} if the current GameState object have not already been linked with a GameStateStack
	 * it will return null.
	 */
	GameState.prototype.getGameStateStack = function() {
	 return this._gameStateStack;
	};

	/**
	 * This method is private, you do not have to use it, it is used internally by the GameStateStack class.
	 * @method update
	 * @param {Number} elapsedTime time elapsed since last update call.
	 */
	GameState.prototype.update = function(elapsedTime) {
		this.onUpdate(elapsedTime);
		for (var i = 0; i < this.callbackList.length; i++) {
			this.callbackList[i]();
		}
	};

	/**
	 * This method is private, you do not have to use it, it is used internally by the GameStateStack class.
	 * @method draw
	 * @param {CanvasRenderingContext2D} canvas_context graphicalContext on which graphical contents will be drawn.
	 */
	GameState.prototype.draw = function(canvas_context) {
		this.onDraw();
		for (var i = 0; i < this.layerList.length; i++) {
			this.layerList[i].draw(canvas_context);
		}
	};

}(TW));
