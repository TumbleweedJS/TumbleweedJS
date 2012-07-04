/**
 * Created with JetBrains WebStorm.
 * User: Aymeric CHAUVIN
 * Date: 26/06/12
 * Time: 18:00
 *
 * @module Gameloop
 * @namespace Gameloop
 */


/**
 A class to manage the game logic and time

 @class GameLoop
 @static
 */
var GameLoop = function ()
{
    /**
     The value that limits the maximum frames per second
     @property {Integer} fps
     */
    var fps;

    /**
     The function to update the game logic
     @property {Function} updateFunc
     */
    var updateFunc;

    /**
     The function to draw the game graphics
     @property {Function} drawFunc
     */
    var drawFunc;

    /**
     This method is used to initialize any game logic parameters

     @method Initialize
     @param {Function} _updateFunc The update function
     @param {Function} _drawFunc The draw function
     @param {Integer} _fps The maximum frames per second value
     @return {Boolean} `true` if ok; otherwise `false`
     @private
     */
    function Initialize(_updateFunc, _drawFunc, _fps)
    {
        if (typeof(_updateFunc) != 'undefined' && typeof(_drawFunc) != 'undefined' && typeof(_fps) != 'undefined')
        {
            this.updateFunc = _updateFunc;
            this.drawFunc = _drawFunc;
            this.fps = _fps;
        }
        else
        {
            return false;
        }
        return true;
    }

    /**
     This function handles the GameLoop time logic

     @method Run
     @return {Nothing}
     @private
     */
    function Run()
    {
        setInterval(function ()
        {
            this.updateFunc();
            this.drawFunc();
        }, 1000 / this.fps);
    }

    return function ()
    {
        this.Initialize = Initialize;
        this.Run = Run;
    }

}();
