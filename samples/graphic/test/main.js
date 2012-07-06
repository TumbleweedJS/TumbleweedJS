
//globals variables declaration


//Width of the map to display

var width_map = 19;

//Height of the map to display
var height_map = 6;


//Reference of the rabbit sprite
var sprite_rabbit;
//Reference of the first View
var view;
//Reference of the second View
var view2;
//Reference of the third View
var view3;

//Reference of the first text to display
var text1;
//Reference of the second text to display
var text2;

//boolean var to determine if left arraow is pressed
var left_pressed = false;

//boolean var to determine if right arrow is pressed
var right_pressed = false;

//boolean var to determine if up arrow is pressed
var up_pressed = false;

//boolean var to determine if down arrow is pressed
var down_pressed = false;

//boolean var to determine if the r key is pressed
var r_pressed = false;

//global angle of rotation
var angle = 0;

//scale of the graphical objects
var scale = 1.0;


//listen to the keydown events
window.addEventListener('keydown', function MyOnKeyDown(event)
{
 var KeyID = event.keyCode;
 
 //listen to the left arrow
 if (KeyID == 37)
 {
  left_pressed = true;
 }
 //listen to the up arrow
 if (KeyID == 38)
 {
  up_pressed = true;
 }
 //listen to the right arrow
 if (KeyID == 39)
 {
  right_pressed = true;
 }
 //listen to the down arrow
 if (KeyID == 40)
 {
  down_pressed = true;
 }
 //listen to the r
 if (KeyID == 82)
 {
  r_pressed = true;
 }
}, false);

//listen to keyup events
window.addEventListener('keyup', function MyOnKeyUp(event)
{
var KeyID = event.keyCode;

 //listen to the left arrow
 if (KeyID == 37)
 {
  left_pressed = false;
 }
 //listen to the up arrow
 if (KeyID == 38)
 {
  up_pressed = false;
 }
 //listen to the right arrow
 if (KeyID == 39)
 {
  right_pressed = false;
 }
 //listen to the down arrow
 if (KeyID == 40)
 {
  down_pressed = false;
 }
 //listen to the r key
 if (KeyID == 82)
 {
  r_pressed = false;
 }
}, false);



//Defining the map of sprites
//0 = no tiles
//1 = floor
//2 = bumper
//3 = crate
//4 = rabbit

var map = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		   0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		   0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		   0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		   0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		   0,0,3,3,3,0,0,3,3,3,0,0,0,0,0,2,0,4,0,
		   1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,];

//Loading the floor texture
 var img_floor = new Image();
 img_floor.src = "../images/herbe.png";
//Loading the bumper texture
 var img_bumper = new Image();
 img_bumper.src = "../images/trampoline.png";
//Loading the crate texture
 var img_crate = new Image();
 img_crate.src = "../images/caisse_cassable.png";
//Loading the rabbit texture
 var img_rabbit = new Image();
 img_rabbit.src = "../images/lapin_pointe_nyan.png";
//Loading the sky texture
 var img_ciel = new Image();
 img_ciel.src = "../images/sky.png";
//Loading the mountain texture
 var img_montagne = new Image();
 img_montagne.src = "../images/parallax_montage1.png";
 
 //Create the image rects objects (in aim to select a sub area in the textures)
 var img_floor_rect = new TW.Graphic.ImageRect(img_floor, 0, 0, 64,64);
 var img_bumper_rect = new TW.Graphic.ImageRect(img_bumper, 0, 0, 64,64);
 var img_crate_rect = new TW.Graphic.ImageRect(img_crate, 0,0,64,64);
 var img_rabbit_rect = new TW.Graphic.ImageRect(img_rabbit, 0,0,64,64);
 var img_ciel_rect = new TW.Graphic.ImageRect(img_ciel, 0,0,1200,500);
 var img_montagne_rect = new TW.Graphic.ImageRect(img_montagne,0,0,1200,500);
 
 //creating sky sprite
 var sprite_ciel = new TW.Graphic.Sprite(0,0,1200,500,img_ciel_rect);
 //Set the center point of the sky sprite
 sprite_ciel.setCenterPoint(sprite_ciel.getWidth() / 3, sprite_ciel.getHeight() / 3);
 //creating mountain sprite
 var sprite_montagne = new TW.Graphic.Sprite(0,0,1200,500,img_montagne_rect);
 //Set the center point of the mountain sprite
 sprite_montagne.setCenterPoint(sprite_montagne.getWidth() / 3, sprite_montagne.getHeight() / 3);
 

 //Function of sprite generation
 function createSprites(array)
 {
  var i = 0;
  var y = 0;
  var x = 0;
  var sprite_tmp;
  var length = map.length;
  array.push(sprite_ciel);
  array.push(sprite_montagne);
  while (i < length)
   {
    if (i % width_map == 0)
	{
	 y += 64;
	 x = 0;
	}
    else
	{
	 x += 64;
	}
	//`if (map[i] == 1)` then we generate a floor sprite and save it to the array.
	if (map[i] == 1)
	 {
	  sprite_tmp = new TW.Graphic.Sprite(x, y, 64, 64, img_floor_rect);
	  array.push(sprite_tmp);
	  sprite_tmp.setCenterPoint(sprite_tmp.getWidth() / 3, sprite_tmp.getHeight() / 3);
	 }
	 // `if (map[i] == 2)` then we generate a bumper sprite and save it to the array.
	if (map[i] == 2)
	 {
	  sprite_tmp = new TW.Graphic.Sprite(x, y, 64, 64, img_bumper_rect);
	  array.push(sprite_tmp);
	  sprite_tmp.setCenterPoint(sprite_tmp.getWidth() / 3, sprite_tmp.getHeight() / 3);
	 }
	// `if (map[i] == 3)` then we generate a crate sprite and save it to the array.
	if (map[i] == 3)
	 {
	  sprite_tmp = new TW.Graphic.Sprite(x,y,64,64,img_crate_rect);
	  array.push(sprite_tmp);
	  sprite_tmp.setCenterPoint(sprite_tmp.getWidth() / 3, sprite_tmp.getHeight() / 3);
	 }
	 // `if (map[i] == 4)` then we generate a rabbit sprite and save it to the array.
	if (map[i] == 4)
	{
	 sprite_rabbit = new TW.Graphic.Sprite(x,y,64,64,img_rabbit_rect);
	 sprite_rabbit.setCenterPoint(sprite_rabbit.getWidth() / 3, sprite_rabbit.getHeight() / 3);
	 array.push(sprite_rabbit);
	}
    i++;
   }
 }
 

 //Function who adds the contents of a Sprite's array to a View
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
   text1 = new TW.Graphic.Text2D(200, 50, 29, 'Calibri', "Premier test d'affichage");
   text2 = new TW.Graphic.Text2D(200, 200, 15, 'Calibri', "Second test d'affichage");
   text1.setCenterPoint(100,10);
   text1.setAlpha(0.5);
   text1.setFontStyle("normal");
   text1.setFont("arial");
   text1.setRVBColor(255, 0, 0);
   view.pushText2D(text1);
   view.pushText2D(text2);
 }
 
 //Function who rotate all the sprites contained in array_sprite by an angle
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
 
 //Function who scale all the sprites contained in array_sprite by a scale factor
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

//Start of execution
window.onload = function ()
{
	//get the canvas context
   var context = document.getElementById("myCanvas").getContext("2d");
   //Create a Window object
   var my_window = new TW.Graphic.Window(1200, 500, context);
   //Create three View objects
   view = new TW.Graphic.View(context, 0, 0, 1200, 500);
   view2 = new TW.Graphic.View(context, 0, 0, 1200, 500);
   view3 = new TW.Graphic.View(context, 0, 0, 1200, 500);
   //Create an array to fill it with some sprites
   var array_sprite = new Array();
   //Setting the onresize event to makes the canvas follow the browser's window dimension
   window.onresize = function() {
   my_window.setFullBrowserCanvas(document.getElementById("myCanvas"));
   };
   //create the sprites and push them to the array_sprite array
   createSprites(array_sprite);
   //Adding sprites contained into the array_sprite array to the view object.
   addSpritesToView(array_sprite, view);
   //Adding sprites contained into the array_sprite array to the the view2 object.
   addSpritesToView(array_sprite, view2);
   //Adding sprites contained into the array_sprite array to the view3 object.
   addSpritesToView(array_sprite, view3);
   //Adding view to the window object
   my_window.pushView(view);
   //Setting the center of view object
   view.setCenterPoint(600, 250);
   //Adding view2 to view object.
   view.pushView(view2);
   //Setting the center point of the view2 object
   view2.setCenterPoint(600, 250);
   //Adding view3 to the view2 object
   view2.pushView(view3);
   //Scale the view2 object
   view2.setScale(0.5, 0.5);
   //Scale the view3 object
   view3.setScale(0.5, 0.5);
   //Set the center point of the view3 object
   view3.setCenterPoint(600, 250);
   
   
   //Setting the callback function
   function callback()
   {
	//`if (up_pressed)` then we increase the scale factor of the sprites by 0.1.
	if (up_pressed)
	{
	 scale += 0.1;
	}
	//`if (down_pressed)` then we decrease the scale factor of the sprites by 0.1.
	if (down_pressed)
	{
	 scale -= 0.1;
	}
	//`if (r_pressed)` then we increase the rotation angle by 3 degree then we rotate all the sprites by this angle.
    if (r_pressed)
	{
	 angle += 3;
	 RotateAllSprites(angle, array_sprite);
	}
	//we scale all the sprites by the scale factor
	ScaleAllSprites(scale, array_sprite);
	//`if (left_pressed)` then we change the position of the rabbit on the x axis, we decrement his x coordinate by 5.
    if (left_pressed)
	{
	 sprite_rabbit.setX(sprite_rabbit.getX() - 5);
	}
	//`if (right_pressed)` then we change the position of the rabbit on the x axis, we increment his x coordinate by 5.
	if (right_pressed)
	{
	 sprite_rabbit.setX(sprite_rabbit.getX() + 5);
	}
	//We set the rotation angle of the Views object view, view2, view3 to angle degree
	view.setRotation(angle);
	view2.setRotation(angle);
	view3.setRotation(angle);
	//We set the scale of the view object to scale factor.
	view.setScale(scale, scale);
	//We call the window's draw function to refresh the screen.
    my_window.draw();
   }
   //configure the callback to 60 calls per seconds
   window.setInterval(callback, 1000 / 60);
}