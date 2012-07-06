//The main view who contains the animated sprite
var view;
//a boolean to store the left key state
var left_pressed = false;
//a boolean to store the right key state
var right_pressed = false;
//a boolean to store the up key state
var up_pressed = false;
//a boolean to store the down key state
var down_pressed = false;
//a boolean to store the r key state
var r_pressed = false;
//the angle of rotation of the sprite
var angle = 0;
//the scale of the sprite
var scale = 1.0;

//listen to the keydown events
window.addEventListener('keydown', function MyOnKeyDown(event)
{
 //a variable to store the keycode of the keydown event
 var KeyID = event.keyCode;
 
 //left arrow check
 if (KeyID == 37)
 {
  left_pressed = true;
 }
 //up arrow check
 if (KeyID == 38)
 {
  up_pressed = true;
 }
 //right arrow check
 if (KeyID == 39)
 {
  right_pressed = true;
 }
 //down arrow check
 if (KeyID == 40)
 {
  down_pressed = true;
 }
 //r key check
 if (KeyID == 82)
 {
  r_pressed = true;
 }
}, false);

//listen to the keyup events
window.addEventListener('keyup', function MyOnKeyUp(event)
{
//variable who stores the keycode of the keyup event
var KeyID = event.keyCode;

 //left arrow check
 if (KeyID == 37)
 {
  left_pressed = false;
 }
 //up arrow check
 if (KeyID == 38)
 {
  up_pressed = false;
 }
 //right arrow check
 if (KeyID == 39)
 {
  right_pressed = false;
 }
 //down arrow check
 if (KeyID == 40)
 {
  down_pressed = false;
 }
 //r key check
 if (KeyID == 82)
 {
  r_pressed = false;
 }
}, false);

//load the spritesheet of the running man
 var img_ciel = new Image();
 img_ciel.src = "../images/running.png";
 
//creating an ImageRect object to select a special frame into the spritesheet of the running man.
 var running_rect = new TW.Graphic.ImageRect(img_ciel,0,0,240,296);
//instanciating a SpriteAnime object of the running man.
 var running_sprite_animated = new SpriteAnime(running_sprite_sheet, running_rect);
 //set the center point of rotation of the running_sprite_animated
  running_sprite_animated.setCenterPoint(running_sprite_animated.getWidth() / 2, running_sprite_animated.getHeight() / 2);
 
 
 //transfert the sprites contained into the array object to the View object
 function addSpritesToView(array, view)
 {
  var i = 0;
  var length = array.length;
  
  while (i < length)
   {
    view.pushSprite(array[i]);
    i++;
   }
 }
 
 //Rotate all the sprites contained into the array_sprite object by the angle
 function RotateAllSprites(angle, array_sprite)
 {
  var i = 0;
  var length = array_sprite.length;
  while (i < length)
  {
   array_sprite[i].setAngle(angle);
   i++;
  }
 }
 
 //Scale all the sprites contained into the array_sprite object by the scale factor.
 function ScaleAllSprites(scale, array_sprite)
 {
  var i = 0;
  var length = array_sprite.length;
  while (i < length)
  {
   array_sprite[i].setScale(scale, scale);
   i++;
  }
 }
 
window.onload = function()
{
   //get the canvas' context
   var context = document.getElementById("my_canvas").getContext("2d");
   //instanciate a window object
   var my_window = new TW.Graphic.Window(1200, 500, context);
   //instanciate a view object
   view = new TW.Graphic.View(context, 0, 0, 1200, 500);
   //create an array sprite to hold animated sprites
   var array_sprite = new Array();
   
   //push the running_sprite_animated to the array_sprite object.
   array_sprite.push(running_sprite_animated);
   //transfert the sprites contained by the array_sprite object to the view object.
   addSpritesToView(array_sprite, view);
   //add the view to the Window object.
   my_window.pushView(view);
   
   //declare the callback function
   function callback()
   {
    //increase the scale factor by 0.1 if the up arrow is pressed
	if (up_pressed)
	{
	 scale += 0.1;
	}
	//decrease the scale factor by 0.1 if the down arrow if pressed
	if (down_pressed)
	{
	 scale -= 0.1;
	}
	//increase the angle by 3 degree and then rotate sprites contained into the array_sprite object when r key is pressed
    if (r_pressed)
	{
	 angle += 3;
	 RotateAllSprites(angle, array_sprite);
	}
	//decrease x coordinate of the animate sprite if the left arrow is pressed
	if (left_pressed)
	{
	 running_sprite_animated.setX(running_sprite_animated.getX() - 3);
	}
	//increase x coordinate of the animate sprite if the right arrow is pressed
	if (right_pressed)
	{
	 running_sprite_animated.setX(running_sprite_animated.getX() + 3);
	}
	//Scale all the sprites contained by the array_sprite object.
	ScaleAllSprites(scale, array_sprite);
	//update the running_sprite_animated object.
	running_sprite_animated.update();
	//draw the scene
    my_window.draw();
   }
   //setup the callback.
   window.setInterval(callback, 1000 / 60);
}