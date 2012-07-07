/**
 * Created with JetBrains WebStorm.
 * User: Aymeric CHAUVIN
 * Date: 26/06/12
 * Time: 18:00
 *
 * @module Gameloop
 * @namespace Gameloop
 */

var TW = TW || {};
TW.Gameloop = TW.Gameloop || {};

TW.Gameloop.Gameloop = function() {

    /**
       A class to manage the game logic and time

       @class Gameloop
       @param {Integer} [fps] value that limits the maximum frames per second
       @constructor
    */
    function Gameloop(fps)
    {
	/**
	   The value that limits the maximum frames per second

	   @property {Integer} fps
	   @default 30
	*/
	if (fps)
	 this.fps = fps;
	else
	 this.fps = 30;

	this._timer = null;
	
	/**
	   array which contains all games elements.  
	   You must add elements to `object` for updating 
	   and drawing these elements.

	   If an element is a function, it's called during update phase.
	   If it's an object, its draw function will be called during draw phase, an its update functin during update phase.
	   If a function does not exist, the gameloop will ignore it. update and draw fnctions are not mandatory.
	   
	   @property {Array} object
	 */
	this.object = [];

    }


    /**
       start or restart the gameloop

       @method start
    */
    Gameloop.prototype.start = function() {
	this.stop();
	this._timer = setInterval(function(self) {
		return function() {
			return function() {
				this.update();
				this.draw();
			}.call(self);
		};
	}(this),
	1000 / this.fps);
      };
    
    /**
       pause the gameloop

       @method pause
    */
    Gameloop.prototype.pause = function() {
	if (this._timer !== null) {
	    clearInterval(this._timer);
	}
    };

    /**
       stop the gameloop

       @method stop
     */
    Gameloop.prototype.stop = function() {
	if (this._timer !== null) {
	    clearInterval(this._timer);
	}
    };

    /**
       update the logic one step.  
       called automatically each step by start.
       
       @method update
     */
    Gameloop.prototype.update = function() {
	for (var i = 0; i < this.object.length; i++) {
	    if (typeof this.object[i] === "function") {
		this.object[i]();
	    }
	    if (typeof this.object[i] === "object") {
		if (typeof this.object[i].update !== "undefined") {
		    this.object[i].update();
		}
	    }
	}
    };

    /**
       draw the content of gameloop.  
       called automatically at the beginning of each step.
       
       @method draw
     */
    Gameloop.prototype.draw = function() {
	for (var i = 0; i < this.object.length; i++) {
	    if (typeof this.object[i] === "object"
		&& typeof this.object[i].draw !== "undefined") {
		this.object[i].draw();
	    }
	}
    };

    return Gameloop;
    
}();
