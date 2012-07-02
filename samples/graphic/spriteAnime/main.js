var width_map = 19;
var height_map = 6;
var sprite_rabbit;
var view;
var view2;
var view3;

var text1;
var text2;

var left_pressed = false;
var right_pressed = false;
var up_pressed = false;
var down_pressed = false;
var r_pressed = false;
var angle = 0;
var scale = 1.0;

window.addEventListener('keydown', function MyOnKeyDown(event)
{
 var KeyID = event.keyCode;
 
 //left arraw
 if (KeyID == 37)
 {
  left_pressed = true;
 }
 //up arrow
 if (KeyID == 38)
 {
  up_pressed = true;
 }
 //right arrow
 if (KeyID == 39)
 {
  right_pressed = true;
 }
 //down arrow
 if (KeyID == 40)
 {
  down_pressed = true;
 }
 //r key
 if (KeyID == 82)
 {
  r_pressed = true;
 }
}, false);


window.addEventListener('keyup', function MyOnKeyUp(event)
{
var KeyID = event.keyCode;

 //left arraw
 if (KeyID == 37)
 {
  left_pressed = false;
 }
 //up arrow
 if (KeyID == 38)
 {
  up_pressed = false;
 }
 //right arrow
 if (KeyID == 39)
 {
  right_pressed = false;
 }
 //down arrow
 if (KeyID == 40)
 {
  down_pressed = false;
 }
 //r key
 if (KeyID == 82)
 {
  r_pressed = false;
 }
}, false);

 var img_ciel = new Image();
 img_ciel.src = "../images/running.png";
 

 var running_rect = new ImageRect(img_ciel,0,0,240,296);
 var running_sprite_animated = new SpriteAnime(running_sprite_sheet, running_rect);
  running_sprite_animated.setCenterPoint(running_sprite_animated.getWidth() / 3, running_sprite_animated.getHeight() / 3);
 
 function createSprites(array)
 {
  array.push(running_sprite_animated);
 }
 
 function addSpritesToView(array, view)
 {
  var i = 0;
  var length = array.length;
  
  while (i < length)
   {
    array[i].getAlpha();
	array[i].setAlpha(0.5);
    view.pushSprite(array[i]);
    i++;
   }
 }
 
 function RotateAllSprites(angle, array_sprite)
 {
  var i = 1;
  var length = array_sprite.length;
  while (i < length)
  {
   array_sprite[i].setAngle(angle);
   i++;
  }
 }
 
 function ScaleAllSprites(scale, array_sprite)
 {
  var i = 1;
  var length = array_sprite.length;
  while (i < length)
  {
   array_sprite[i].setScale(scale, scale);
   i++;
  }
 }
 
window.onload = function()
{
   var context = document.getElementById("my_canvas").getContext("2d");
   var my_window = new Window(1200, 500, context);
   view = new View(context, 0, 0, 1200, 500);
   var array_sprite = new Array();
   
   createSprites(array_sprite);
   addSpritesToView(array_sprite, view);
   my_window.pushView(view);
   view.setCenterPoint(600, 250);
   function callback()
   {
    context.fillStyle = 'rgb(0,0,0)';
    context.fillRect(0,0,1200,500);
	if (up_pressed)
	{
	 scale += 0.1;
	}
	if (down_pressed)
	{
	 scale -= 0.1;
	}
    if (r_pressed)
	{
	 RotateAllSprites(angle, array_sprite);
	 angle += 3;
	}
	ScaleAllSprites(scale, array_sprite);
	view.setRotation(angle);
	view.setScale(scale, scale);
    my_window.draw();
	window.setTimeout(callback, 1000 / 30);
   }
   window.setTimeout(callback, 1000 / 60);
}