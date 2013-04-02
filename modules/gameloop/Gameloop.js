/**
 * @module Gameloop
 * @namespace Gameloop
 */



define([], function() {
	var TW = TW || {};
	TW.Gameloop = TW.Gameloop || {};


	var animFrame = window.requestAnimationFrame ||
	                 window.webkitRequestAnimationFrame ||
	                 window.mozRequestAnimationFrame ||
	                 window.oRequestAnimationFrame ||
	                 window.msRequestAnimationFrame ||
	                 null;
	var cancelAnimFrame = window.cancelAnimationFrame ||
	                        window.webkitCancelAnimationFrame ||
	                        window.mozCancelAnimationFrame ||
	                        window.oCancelAnimationFrame ||
	                        window.msCancelAnimationFrame ||
	                        null;

	/**
	 * A class to manage the game logic and time.
	 * Provide the simplest way to use a regular loop, splitting draw and update.
	 * All elements added in `object` are updated or draw when te loop is started.
	 *
	 * @class Gameloop
	 *
	 * @constructor
	 */
	function Gameloop() {
		this._lastId = 0;
		this._updateHandler = null;
		this._drawHandler = null;
		this._fpsObject = {
			fpsAmount:      0,
			dateRepository: new Date(),
			counter:         0
		};
		this._timeLastUpdate = new Date().getTime();
		this._tpsObject = {
			tpsAmount:      0,
			dateRepository: new Date(),
			counter:         0
		};
		this.objectToSuppress = [];

		/**
		 * a Date object which represents the instant when you called
		 * the start method of the gameloop. `null` if not started.
		 *
		 * @propertyv {Date} startDate
		 * @readonly
		 */
		this.startDate = null;

		/**
		 The value that limits the maximum number of frames per second.
		 Used only if requestAnimationFrame is not found
		 .       Note: changes are effective only when gameloop is restarted.

		 @property {Number} fps
		 @default 30
		 */
		this.fps = 30;

		/**
		 The frequency of function calls update
		 Note: changes are effective only when gameloop is restarted.

		 @property {Number} tickPerSecond
		 @default 60
		 */
		this.tickPerSecond = 60;


		/**
		 * array which contains all games elements.
		 * You must add elements to `object` for updating
		 * and drawing these elements.
		 *
		 * If an element is a function, it's called during update phase.
		 * If it's an object, its draw function will be called during draw phase,
		 * an its update function during update phase.
		 * If a function does not exist, the gameloop will ignore it. update and draw functions are not mandatory.
		 *
		 * @property {Array} object
		 * @protected
		 */
		this.object = [];
	}

	/**
	 * this method returns the average fps off ten seconds.
	 *
	 * @method getRealFPS
	 * @return {Number} returns the average fps off ten seconds.
	 */
	Gameloop.prototype.getRealFPS = function() {
		return this._fpsObject.fpsAmount;
	};

	/**
	 * This method returns the average of TPS (average of update calls) in ten seconds.
	 *
	 * @method getRealTPS
	 * @return {Number} returns the average of tps in ten seconds.
	 */
	Gameloop.prototype.getRealTPS = function() {
		return this._tpsObject.tpsAmount;
	};

	/**
	 * This method allows you to add an object to the Gameloop.
	 * when the gameloop is refreshing itself it tries to call the update and draw function of each object which
	 * are in its list. You can add any kind of object. you should add draw and update method to these objects
	 * because the gameloop will call them each cycle.
	 *
	 * @method addObject
	 * @param {Object} object it is an object which will be added to the Gameloop's internal list.
	 */
	Gameloop.prototype.addObject = function(object) {
		this.object.push(object);
	};

	/**
	 * This method allows you to remove an object from the Gameloop's list.
	 *
	 * @method rmObject
	 * @param {Object} object a reference to the object that you want to suppress from the Gameloop's list.
	 */
	Gameloop.prototype.rmObject = function(object) {
		this.objectToSuppress.push(object);
	};

	/**
	 * start or unpause the gameloop.
	 * If gameloop is already stated, do nothing.
	 *
	 * @method start
	 */
	Gameloop.prototype.start = function() {
		this.startDate = new Date();
		if (this._updateHandler === null) {
			this._updateHandler = setInterval(this.update.bind(this),
			                                   1000 / this.tickPerSecond);
		}
		if (this._drawHandler === null) {
			if (animFrame !== null) {
				this._drawHandler = animFrame(this.draw.bind(this));
			} else {
				//Compatibility mode
				this._drawHandler = setInterval(this.draw.bind(this), 1000 / this.fps);
			}
		}
	};

	/**
	 * stop the update Gameloop
	 * Elements are still drawn, but not updated.
	 * You can resume the game with start
	 *
	 * @method pause
	 */
	Gameloop.prototype.pause = function() {
		if (this._updateHandler !== null) {
			clearInterval(this._updateHandler);
			this._updateHandler = null;
		}
	};

	/**
	 * stop the gameloop
	 * Both update and draw are stopped.
	 * The elements are not removed, so you can use start to resume play.
	 * If you need to keep the screen displayed, you should instead use pause.
	 *
	 * @method stop
	 */
	Gameloop.prototype.stop = function() {
		this.pause();
		if (this._drawHandler !== null) {
			if (animFrame !== null && cancelAnimFrame !== null) {
				cancelAnimFrame(this._drawHandler);
			} else {
				clearInterval(this._drawHandler);
			}
			this._drawHandler = null;
		}
	};

	/**
	 * indicate if the loop is active or not.
	 *
	 * @method isRunning
	 * @return {Boolean} `true` if loop is running; `false` if the loop is stopped or paused.
	 */
	Gameloop.prototype.isRunning = function() {
		return (this._updateHandler !== null);
	};


	/**
	 * update the logic one step.
	 * called automatically each step by start.
	 *
	 * @method update
	 */
	Gameloop.prototype.update = function() {
		var currentDate = new Date();
		var nbToSuppress = this.objectToSuppress.length;
		for (var indexObjectToSuppress = 0; indexObjectToSuppress < nbToSuppress; indexObjectToSuppress++) {
			for (var indexObject = 0; indexObject < this.object.length; indexObject++) {
				if (this.objectToSuppress[indexObjectToSuppress] === this.object[indexObject]) {
					this.object.splice(indexObject, 1);
					indexObject--;
				}
			}
		}
		this.objectToSuppress = [];

		for (var i = 0; i < this.object.length; i++) {
			if (typeof this.object[i] === "function") {
				this.object[i](currentDate.getTime() - this._timeLastUpdate);
			}
			if (typeof this.object[i] === "object") {
				if (typeof this.object[i].update !== "undefined") {
					this.object[i].update(currentDate.getTime() - this._timeLastUpdate);
				}
			}
		}
		this._tpsObject.counter++;
		var time;
		time = currentDate.getTime();
		if (time - this._tpsObject.dateRepository.getTime() >= 1000) {
			this._tpsObject.dateRepository = new Date();
			this._tpsObject.tpsAmount = this._tpsObject.counter;
			this._tpsObject.counter = 0;
		}
		this._timeLastUpdate = currentDate.getTime();
	};

	/**
	 * draw the content of gameloop.
	 * called automatically at the beginning of each step.
	 *
	 * @method draw
	 */
	Gameloop.prototype.draw = function() {
		for (var i = 0; i < this.object.length; i++) {
			if (typeof this.object[i] === "object" &&
			    typeof this.object[i].draw !== "undefined") {
				this.object[i].draw();
			}
		}
		if (animFrame !== null) {
			this._drawHandler = animFrame(this.draw.bind(this));
		}
		this._fpsObject.counter++;
		var time;
		time = new Date().getTime();
		if (time - this._fpsObject.dateRepository.getTime() >= 1000) {
			this._fpsObject.dateRepository = new Date();
			this._fpsObject.fpsAmount = this._fpsObject.counter;
			this._fpsObject.counter = 0;
		}
	};

	TW.Gameloop.Gameloop = Gameloop;
	return Gameloop;
});