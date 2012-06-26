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

 var img_floor = new Image();
 img_floor.src = "../images/herbe.png";
 var img_bumper = new Image();
 img_bumper.src = "../images/trampoline.png";
 var img_crate = new Image();
 img_crate.src = "../images/caisse_cassable.png";
 var img_rabbit = new Image();
 img_rabbit.src = "../images/lapin_pointe_nyan.png";
 var img_ciel = new Image();
 img_ciel.src = "../images/sky.png";
 var img_montagne = new Image();
 img_montagne.src = "../images/parallax_montage1.png";
 
 var img_floor_rect = new ImageRect(img_floor, 0, 0, 64,64);
 var img_bumper_rect = new ImageRect(img_bumper, 0, 0, 64,64);
 var img_crate_rect = new ImageRect(img_crate, 0,0,64,64);
 var img_rabbit_rect = new ImageRect(img_rabbit, 0,0,64,64);
 var img_ciel_rect = new ImageRect(img_ciel, 0,0,1200,500);
 var img_montagne_rect = new ImageRect(img_montagne,0,0,1200,500);
 
 var sprite_ciel = new Sprite(0,0,1200,500,img_ciel_rect);
 sprite_ciel.setCenterPoint(sprite_ciel.getWidth() / 3, sprite_ciel.getHeight() / 3);
 var sprite_montagne = new Sprite(0,0,1200,500,img_montagne_rect);
 //var sprite_montagne = new Sprite(0,0,1200,500,img_montagne_rect);
 sprite_montagne.setCenterPoint(sprite_montagne.getWidth() / 3, sprite_montagne.getHeight() / 3);
 
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
	if (map[i] == 1)
	 {
	  sprite_tmp = new Sprite(x, y, 64, 64, img_floor_rect);
	  array.push(sprite_tmp);
	  sprite_tmp.setCenterPoint(sprite_tmp.getWidth() / 3, sprite_tmp.getHeight() / 3);
	 }
	if (map[i] == 2)
	 {
	  sprite_tmp = new Sprite(x, y, 64, 64, img_bumper_rect);
	  array.push(sprite_tmp);
	  sprite_tmp.setCenterPoint(sprite_tmp.getWidth() / 3, sprite_tmp.getHeight() / 3);
	 }
	if (map[i] == 3)
	 {
	  sprite_tmp = new Sprite(x,y,64,64,img_crate_rect);
	  array.push(sprite_tmp);
	  sprite_tmp.setCenterPoint(sprite_tmp.getWidth() / 3, sprite_tmp.getHeight() / 3);
	 }
	if (map[i] == 4)
	{
	 sprite_rabbit = new Sprite(x,y,64,64,img_rabbit_rect);
	 sprite_rabbit.setCenterPoint(sprite_rabbit.getWidth() / 3, sprite_rabbit.getHeight() / 3);
	 array.push(sprite_rabbit);
	}
    i++;
   }
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
   text1 = new Text2D(200, 50, 15, 'Calibri', "Bonjour le monde.");
   text2 = new Text2D(200, 200, 15, 'Calibri', "Bonjour la ville.");
   text1.setCenterPoint(100,10);
   text1.setAlpha(50);
   text1.setFontStyle("normal");
   text1.setFont("arial");
   text1.setText("Wesh Wesh");
   text1.setSize(29);
   text1.getAlpha();
   text1.setRVBColor(255, 0, 0);
   view.pushText2D(text1);
   view.pushText2D(text2);
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
 
window.onload = function ()
{
   var context = document.getElementById("myCanvas").getContext("2d");
   var my_window = new Window(1200, 500, context);
   view = new View(context, 0, 0, 1200, 500);
   view2 = new View(context, 0, 0, 1200, 500);
   view3 = new View(context, 0, 0, 1200, 500);
   var array_sprite = new Array();
   
   createSprites(array_sprite);
   addSpritesToView(array_sprite, view);
   addSpritesToView(array_sprite, view2);
   addSpritesToView(array_sprite, view3);
   
   my_window.pushView(view);
   view.setCenterPoint(600, 250);
   view.pushView(view2);
   view2.pushView(view3);
   view2.setCenterPoint(600, 250);
   view2.setScale(0.5, 0.5);
   view3.setScale(0.5, 0.5);
   view3.setCenterPoint(600, 250);
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
    if (left_pressed)
	{
	 sprite_rabbit.setX(sprite_rabbit.getX() - 5);
	}
	if (right_pressed)
	{
	 sprite_rabbit.setX(sprite_rabbit.getX() + 5);
	}
	//text1.setRotation(angle);
	//text1.setScale(scale, scale);
	view.setRotation(angle);
	view2.setRotation(angle);
	view3.setRotation(angle);
	view.setScale(scale, scale);
    my_window.draw();
	window.setTimeout(callback, 1000 / 30);
   }
   window.setTimeout(callback, 1000 / 60);
}