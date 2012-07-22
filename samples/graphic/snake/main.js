var fruit_img;
var fruit_img_rect;
var snake_head_img;
var snake_head_img_rect;
var my_view;
var my_layer;
var canvas;
var context;
var snake_head_sprite;
var fruit_sprite;
var gameloop;
var x_snake_head = 5;
var y_snake_head = 4;
var x_fruit = 3;
var y_fruit = 2;
var tile_width = 64;
var tile_height = 64;
var snake_direction = "left";
var corps_snake = new Array();
var score_text;
var score = 0;
var nb_tiles_width = 12;
var nb_tiles_height = 12;

window.onresize = function(){
my_view.setFullBrowserCanvas(document.getElementById("my_canvas"));
};

window.onload = function() {
//Creating ressources
fruit_img = new Image();
fruit_img.src = "../images/carrote.png";
fruit_img_rect = new TW.Graphic.ImageRect(fruit_img, 0, 0, 64, 64);
snake_head_img = new Image();
snake_head_img.src = "../images/caisse_cassable.png";
snake_head_img_rect = new TW.Graphic.ImageRect(snake_head_img, 0,0,64,64);
my_view = new TW.Graphic.View(768, 768, context);
my_layer = new TW.Graphic.Layer(context, 0, 0, 768, 768);
canvas = document.getElementById('my_canvas');
context = canvas.getContext("2d");
snake_head_sprite = new TW.Graphic.Sprite(x_snake_head * tile_width,
							   y_snake_head * tile_height,
							   tile_width, tile_height,
							   snake_head_img_rect, my_layer);
corps_snake.push(snake_head_sprite);
fruit_sprite = new TW.Graphic.Sprite(x_fruit * tile_width, y_fruit * tile_height, tile_width, tile_height, fruit_img_rect, my_layer);
score_text = new TW.Graphic.Text2D(10, 30, 30, 'Calibiri', "Score : "+score);
//End of creating ressources

//Linking ressources togethers
my_layer.pushSprite(snake_head_sprite);
my_layer.pushSprite(fruit_sprite);
my_layer.pushSprite(score_text);
my_view.pushLayer(my_layer);
//End of linking

//Creating gameloop
gameloop = new GameLoop();

//Creating snakeManager
snakemanager = new SnakeManager();

my_view.setFullBrowserCanvas(document.getElementById("my_canvas"));

//Setting graphical context to draw on
gameloop.SetContext(context);
//add the window object to the gameLoop
gameloop.AddObject(my_view);
//add the snakeManager object to the gameLoop
gameloop.AddObject(snakemanager);
//Start running the GameLoop
gameloop.Run();
}

window.addEventListener('keydown', function(event) {
									event.preventDefault();
									var keyCode = event.keyCode;
											   //left arrow
											   if (keyCode == 37)
											     {
												  snake_direction = "left";
												 }
											   //up arrow
											   if (keyCode == 38)
											     {
												  snake_direction = "up";
												 }
											   //right arrow
											   if (keyCode == 39)
											     {
												  snake_direction = "right";
												 }
											   //down arrow
											   if (keyCode == 40)
											    {
												 snake_direction = "down"
												}
											   });
											   
function SnakeManager(){
this.alive = true;
this.accept_alert = false;
}

SnakeManager.prototype.update = function(){
 if (fruit_sprite.getX() == snake_head_sprite.getX() &&
     fruit_sprite.getY() == snake_head_sprite.getY())
	 {
	  score++;
	  score_text.setText("Score : "+score);
	  var new_x_fruit = Math.floor(Math.random() * 12) * tile_width;
	  var new_y_fruit = Math.floor(Math.random() * 12) * tile_height;
	  fruit_sprite.setX(new_x_fruit);
	  fruit_sprite.setY(new_y_fruit);
	  var snake_elem = new TW.Graphic.Sprite(0,0,tile_width, tile_height, snake_head_img_rect, my_layer);
	  corps_snake.push(snake_elem);
	  my_layer.pushSprite(snake_elem);
	 }
 if (this.alive)
 {
  this.update_snake_tail();
	if (snake_direction == "left")
		snake_head_sprite.setX(snake_head_sprite.getX() - tile_width);
	if (snake_direction == "right")
		snake_head_sprite.setX(snake_head_sprite.getX() + tile_width);
	if (snake_direction == "down")
		snake_head_sprite.setY(snake_head_sprite.getY() + tile_height);
	if (snake_direction == "up")
		snake_head_sprite.setY(snake_head_sprite.getY() - tile_height);
	this.teleport_head_if_necessary();
	this.check_death();
 }
 else
 {
  if (this.accept_alert == false)
  {
    alert('Tu as perdu !');
	this.accept_alert = true;
  }
 }
}

SnakeManager.prototype.teleport_head_if_necessary = function() {
if (snake_head_sprite.getX() < 0)
 {
  snake_head_sprite.setX((tile_width * (nb_tiles_width - 1)));
 }
if (snake_head_sprite.getX() > (tile_width * (nb_tiles_width - 1)))
 {
  snake_head_sprite.setX(0);
 }
if (snake_head_sprite.getY() < 0)
 {
  snake_head_sprite.setY((tile_height * (nb_tiles_height - 1)));
 }
if (snake_head_sprite.getY() > (tile_height * (nb_tiles_height - 1)))
 {
  snake_head_sprite.setY(0);
 }
}

SnakeManager.prototype.update_snake_tail = function() {
var last_id = corps_snake.length;
 if (last_id > 0)
  last_id--;
	while (last_id > 0)
	{
		corps_snake[last_id].setX(corps_snake[last_id - 1].getX());
		corps_snake[last_id].setY(corps_snake[last_id - 1].getY());
		last_id--;
	}  
}

SnakeManager.prototype.check_death = function(){
 var length = corps_snake.length;
 var i = 1;
 while (i < length)
  {
   if ((corps_snake[0].getX() == corps_snake[i].getX()) &&
	   (corps_snake[0].getY() == corps_snake[i].getY()))
	   {
	    this.alive = false;
	    return true;
	   }
   i++;
  }
 this.alive = true;
 return false;
}
