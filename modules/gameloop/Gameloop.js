/**
 * @module Gameloop
 * @namespace Gameloop
 */


var TW = TW || {};

(function(TW) {

    if (typeof window.define === "function" && window.define.amd) {
        define(['../utils/Polyfills'], initWrap(init));
    } else {
        initWrap(init);
    }

    function initWrap(f) {
        TW.Gameloop = TW.Gameloop ||  {};
        TW.Gameloop.Gameloop = f();
        return TW.Gameloop.Gameloop;
    }


    function init() {


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
     A class to manage the game logic and time.

     @class Gameloop
     @param {Object} [params] ...
     @constructor
     */
    function Gameloop(params) {
        this._last_id = 0;
        this._update_handler = null;
        this._draw_handler = null;

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
         array which contains all games elements.
         You must add elements to `object` for updating
         and drawing these elements.

         If an element is a function, it's called during update phase.
         If it's an object, its draw function will be called during draw phase, an its update function during update phase.
         If a function does not exist, the gameloop will ignore it. update and draw functions are not mandatory.

         @property {Array} object
         */
        this.object = [];
    }

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
        } else {
            //Console.log("Gameloop already started");
        }
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
        var i;
        for (i = 0; i < this.object.length; i++) {
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
        var i;
        for (i = 0; i < this.object.length; i++) {
            if (typeof this.object[i] === "object"
                && typeof this.object[i].draw !== "undefined") {
                this.object[i].draw();
            }
        }
        if (anim_frame !== null) {
            this._draw_handler = anim_frame(this.draw.bind(this));
        }
    };

    return Gameloop;
    }
}(TW));
