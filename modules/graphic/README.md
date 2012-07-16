Graphics module
===============

    The aim of this module is to give you graphical tools to display elements on a canvas.
The module contains the following javascript classes :

ImageRect
---------
    This class creates an object who represents an inner part of a picture or the entire part of the picture.
It is very useful to select specific elements in a spritesheet for example.

Sprite
------
    This class creates an object from an ImageRect object who can be displayed on the canvas.

View
----
    This class creates objects who can contain Sprites. Note that you MUST add a Sprite to a View object before trying to display the Sprite object.

Window
------
    The Window class instance handles Views, note that you must add View object to a Window object before trying to display the View object.
The Window object has a draw function who takes one parameter, the context of te canvas, when the draw function of the class Window is fired
all Views handled by the Window object caller are drawned, and every Sprite who are handled by the Views object are drawned.	

Text2D
------
    This class creates objects who works like Sprite's object, you must add them to a View before trying to display them.
	
SpriteAnime
-----------
    This class creates objects that inherits from Sprite and describe a list of ImageRect.
The SpriteAnime has a method update who actualize the current frame of the SpriteAnime object.