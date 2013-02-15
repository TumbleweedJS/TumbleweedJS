/**
 @module Graphic
 @namespace Graphic
 */

var TW = TW || {};

(function(TW) {

    TW.Graphic = TW.Graphic ||  {};
    TW.Graphic.Window = Window;

    if (typeof window.define === "function" && window.define.amd) {
        define(['./Layer', '../utils/Inheritance'], function() {
            TW.Utils.inherit(Window, TW.Graphic.Layer);
            return Window;
        });
    } else {
        TW.Utils.inherit(Window, TW.Graphic.Layer);
    }

    /**
     * This class represent a window associated to a canvas element.
     * It's the first class used in Graphic module, wrapping all graphic objects.
     *
     * @class Window
     * @extends Layer
     * @constructor
     * @param {HTMLCanvasElement} [canvas] main canvas for the window
     */
    function Window(canvas) {
        this._realCanvas = (canvas === undefined ? document.createElement('canvas') : canvas);
        TW.Graphic.Layer.call(this, {
            localCanvas: this._realCanvas.getContext("2d"),
            width:	canvas.width,
            height: canvas.height
        });
    }

    /**
     * @method getCanvas
     * @return {HTMLCanvasElement} associated canvas to the window, that can be added in DOM.
     */
    Window.prototype.getCanvas = function() {
        return this._realCanvas;
    };

    /**
     * @method setCanvas
     * @param {HTMLCanvasElement} canvas a HTML canvas to associate to the window.
     */
    Window.prototype.setCanvas = function(canvas) {
        this._realCanvas = canvas;
        this.width = canvas.width;
        this.height = canvas.height;
        this.notifyParentChange();
    };

    /**
     * Draw all graphic elements on the associated canvas.
     *
     * @method draw
     */
    Window.prototype.draw = function() {
        if (this._needToRedraw === true) {
            this._localCanvas.save();
            this._camera.prepare(this._localCanvas);
            this._spatialContainer.applyAll(function(child) {
                child.draw(this._localCanvas);
            }.bind(this));
            this._localCanvas.restore();
            this._needToRedraw = false;
        }
    };

}(TW));
