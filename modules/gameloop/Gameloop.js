/**
 * @module Gameloop
 * @namespace Gameloop
 */


var TW = TW || {};

(function(TW) {

    TW.Gameloop = TW.Gameloop ||  {};
    TW.Gameloop.Gameloop = Gameloop;

    if (typeof window.define === "function" && window.define.amd) {
        define([], function() {
            return Gameloop;
        });
    }

    var anim_frame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        null;
    var cancel_anim_frame = window.cancelAnimationFrame ||
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
        this._last_id = 0;
        this._update_handler = null;
        this._draw_handler = null;
	    this._start_date = new Date();
	    this._fps_object = {
		    fps_amount: 0,
		    date_repository: new Date(),
		    counter: 0
	    };
	    this._time_last_update = new Date().getTime();
		this._tps_object = {
			tps_amount: 0,
			date_repository: new Date(),
			counter: 0
		};
	    this.object_to_suppress = [];
        /**
         The value that limits the maximum number of frames per second.
         Used only if requestAnimationFrame is not found
         .       Note: changes are effective only when gameloop is restarted.

         @property {Integer} fps
         @default 30
         */
        this.fps = 30;

        /**
         The frequency of function calls update
         Note: changes are effective only when gameloop is restarted.

         @property {Integer} tick_per_second
         @default 60
         */
        this.tick_per_second = 60;


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
         */
        this.object = [];
    }

	    /**
	     * This function allows you to get a Date object which represents the instant when you called
	     * the start method of the gameloop.
	     *
	     * @method getStartDate
	     * @return {Date} if the gameloop has already been started this function returns an object which represent
	     * the start of the gameloop otherwise this method returns null.
	     */
	Gameloop.prototype.getStartDate = function() {
		return this._start_date;
	};

	    /**
	     * this method returns the average fps off ten seconds.
	     * @method getRealFPS
	     * @return {Number} returns the average fps off ten seconds.
	     */
	Gameloop.prototype.getRealFPS = function() {
		return this._fps_object.fps_amount;
	};

	    /**
	     * This method returns the average of TPS (average of update calls) in ten seconds.
	     * @method getRealTPS
	     * @return {Number} returns the average of tps in ten seconds.
	     */
	Gameloop.prototype.getRealTPS = function() {
		return this._tps_object.tps_amount;
	};

	    /**
	     * This method allows you to add an object to the Gameloop.
	     * when the gameloop is refreshing itself it tries to call the update and draw function of each object which
	     * are in its list. You can add any kind of object. you should add draw and update method to these objects
	     * because the gameloop will call them each cycle.
	     * @param {Object} object it is an object which will be added to the Gameloop's internal list.
	     * @return {Boolean} returns true on success otherwise returns false.
	     */
	Gameloop.prototype.addObject = function(object) {
		this.object.push(object);
	};

	    /**
	     * This method allows you to remove an object from the Gameloop's list.
	     * @param {Object} object a reference to the object that you want to suppress from the Gameloop's list.
	     * @return {Boolean} return true on success (the object have successfully been removed)
	     * otherwise it returns false.
	     */
	Gameloop.prototype.rmObject = function(object) {
		this.object_to_suppress.push(object);
	};

    /**
     start or unpause the gameloop.
     If gameloop is already stated, do nothing.

     @method start
     */
    Gameloop.prototype.start = function() {
        if (this._update_handler === null) {
            this._update_handler = setInterval(this.update.bind(this),
                1000 / this.tick_per_second);
        }
        if (this._draw_handler === null) {
            if (anim_frame !== null) {
                this._draw_handler = anim_frame(this.draw.bind(this));
            } else {
                //Compatibility mode
                this._draw_handler = setInterval(this.draw.bind(this), 1000 / this.fps);
            }
        } /* else {
            Console.log("Gameloop already started");
        } */
    };

    /**
     stop the update Gameloop
     Elements are still drawn, but not updated.
     You can resume the game with start

     @method pause
     */
    Gameloop.prototype.pause = function() {
        if (this._update_handler !== null) {
            clearInterval(this._update_handler);
            this._update_handler = null;
        }
    };

    /**
     stop the gameloop
     Both update and draw are stopped.
     The elements are not removed, so you can use start to resume play.
     If you need to keep the screen displayed, you should instead use pause.

     @method stop
     */
    Gameloop.prototype.stop = function() {
        this.pause();
        if (this._draw_handler !== null) {
            if (anim_frame !== null && cancel_anim_frame !== null) {
                cancel_anim_frame(this._draw_handler);
            } else {
                clearInterval(this._draw_handler);
            }
            this._draw_handler = null;
        }
    };


    /**
     update the logic one step.
     called automatically each step by start.

     @method update
     */
    Gameloop.prototype.update = function() {
	    var current_date = new Date();
	    for (var indexObjectToSuppress = 0; indexObjectToSuppress < this.object_to_suppress.length; indexObjectToSuppress++) {
		    for (var indexObject = 0; indexObject < this.object.length; indexObject++) {
			    if (this.object_to_suppress[indexObjectToSuppress] === this.object[indexObject]) {
				    this.object.splice(indexObject, 1);
				    indexObject--;
			    }
		    }
	    }
        for (var i = 0; i < this.object.length; i++) {
            if (typeof this.object[i] === "function") {
                this.object[i](current_date.getTime() - this._time_last_update);
            }
            if (typeof this.object[i] === "object") {
                if (typeof this.object[i].update !== "undefined") {
                    this.object[i].update(current_date.getTime() - this._time_last_update);
                }
            }
        }
	    this._tps_object.counter++;
	    var time;
	    time = current_date.getTime();
	    if (time - this._tps_object.date_repository.getTime() >= 1000) {
		    this._tps_object.date_repository = new Date();
		    this._tps_object.tps_amount = this._tps_object.counter;
		    this._tps_object.counter = 0;
	    }
	    this._time_last_update = current_date.getTime();
    };

    /**
     draw the content of gameloop.
     called automatically at the beginning of each step.

     @method draw
     */
    Gameloop.prototype.draw = function() {
        var i;
        for (i = 0; i < this.object.length; i++) {
            if (typeof this.object[i] === "object" &&
                typeof this.object[i].draw !== "undefined") {
                this.object[i].draw();
            }
        }
        if (anim_frame !== null) {
            this._draw_handler = anim_frame(this.draw.bind(this));
        }
	    this._fps_object.counter++;
	    var time;
	    time = new Date().getTime();
	    if (time - this._fps_object.date_repository.getTime() >= 1000) {
		    this._fps_object.date_repository = new Date();
		    this._fps_object.fps_amount = this._fps_object.counter;
		    this._fps_object.counter = 0;
	    }
    };

}(TW));
