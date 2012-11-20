/**
 * The graphic module contains a set of classes
 * extending HTML 2D canvas API.
 * It include matrix manipulation, graphic scope management, graphic cache and tools for improve performances.
 *
 * ### drawable objects
 *
 * All drawable object inherit from {{#crossLink "Graphic.GraphicObject"}}{{/crossLink}}.
 * This class contain some methods for manipulate Matrix and set general graphic properties.
 *
 * Tumbleweed provide two object categories: {{#crossLink "Graphic.Shape"}}{{/crossLink}} and
 * {{#crossLink "Graphic.Sprite"}}{{/crossLink}}.<br />
 * Sprites are used for draw an image or a part of image.<br />
 * Shapes are dedicated to rendering forms like rectangles or Circles.
 *
 * ### graphic scope & matrix transformation
 *
 * Although it's possible to draw a GraphicObject directly by passing a canvas context, the most easy way is to
 * use {{#crossLink "Graphic.Window"}}{{/crossLink}} and {{#crossLink "Graphic.Layer"}}{{/crossLink}}.<br />
 * A layer is a graphicalObject which can contain others graphical objects.
 * The interest is to add matrix transformations and share them to many objects.<br />
 * `Window` is a special layer keeping a reference from a HTML Canvas Element.
 *
 *
 * ### performance
 *
 * For improve graphic performances, two way are possible: draw less objects each time or draw less often.
 * The graphic module contain methods for reduce both number of redraw and useless draw.<br />
 * The first point is treated by the cache management, provided by {{#crossLink "Graphic.Layer"}}{{/crossLink}}
 * and {{#crossLink "Graphic.Window"}}{{/crossLink}} classes. After a first draw, a canvas cache is kept in memory
 * for don't redraw until object has changed.<br />
 *
 * The second point is the purpose of the class {{#crossLink "Graphic.SpatialContainer"}}{{/crossLink}},
 * used by {{#crossLink "Graphic.Layer"}}{{/crossLink}}
 * and {{#crossLink "Graphic.Window"}}{{/crossLink}}.
 *
 * Each SpatialContainer check for draw only a part of all objects, and not try to draw objects
 * which are not in the screen.
 * Because different type of scenes exist, each container is adapted to specific context.
 *
 * @module Graphic
 * @main
 */


var TW = TW || {};

if (typeof window.define === "function" && window.define.amd) {

    define([
        './graphic/Camera',
        './graphic/Circle',
        './graphic/GraphicObject',
        './graphic/Layer',
        './graphic/Rect',
        './graphic/Shape',
        './graphic/SpatialContainer',
        './graphic/Sprite',
        './graphic/Window'
    ], function() {
        return TW.Math;
    });

}

