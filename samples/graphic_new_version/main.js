
//Update function of the GameLayer. This function makes the greens moutains moves from left to right periodically.
function funcUpdateLayerJeu()
{
	TW.Graphic.Layer.prototype.update.apply(this);
	if (this.direction)
	{
		if (this.direction === "LEFT")
		{
			this.setPosition(this.x - 1, this.y);
			if (this.x <= -200) {
				this.direction = "RIGHT";
			}
		}
		if (this.direction === "RIGHT")
		{
			this.setPosition(this.x + 1, this.y);
			if (this.x >= 200) {
				this.direction = "LEFT";
			}
		}
	}
	else
	{
		this.direction = "LEFT";
	}
}

//This function create the frame Layer content.
function setupLayerFrame(myLayerFrame)
{
	var image = new Image();
	image.onload = function() {
		var spriteFrame = new TW.Graphic.Sprite({image:image, width:800, height:500});
		myLayerFrame.addChild(spriteFrame);
	};
	image.src = "ressources/frame.png";
}

//This function animate the carots to make them growing and shrinking.
function scaleCarot(carot) {
	if (carot.scale_factor) {
		if (carot.growing) {
			carot.scale_factor+=0.01;
		}
		else {
			carot.scale_factor-=0.01;
		}
		if (carot.scale_factor > 3.0)
		{
			carot.growing = !carot.growing;
			carot.scale_factor = 3.0;
		}
		if (carot.scale_factor < 1.0)
		{
			carot.growing = !carot.growing;
			carot.scale_factor = 1.0;
		}
	}
	else
	{
		carot.growing = true;
		carot.scale_factor = 1.0;
	}
	carot._matrix = TW.Math.Matrix2D.identity();
	carot.scale(carot.scale_factor, carot.scale_factor);
}

//This function makes carots skewing.
function skewCarot(carot) {
	if (carot.skew_factor) {
		if (carot.skewing) {
			carot.skew_factor+=0.01;
		}
		else {
			carot.skew_factor-=0.01;
		}
		if (carot.skew_factor > 2.0)
		{
			carot.skewing = !carot.skewing;
			carot.skew_factor = 2.0;
		}
		if (carot.skew_factor < 1.0)
		{
			carot.skewing = !carot.skewing;
			carot.skew_factor = 1.0;
		}
	}
	else
	{
		carot.skewing = true;
		carot.skew_factor = 1.0;
	}
	carot._matrix = TW.Math.Matrix2D.identity();
	carot.skew(0, carot.skew_factor);
}

//This function update carots each frame. it makes them moving along a vector.
function update_carot() {
	if (this.vector_direction)
	{
		this.x += this.vector_direction.x;
		this.y += this.vector_direction.y;
		if (this.x + this.width >= this.parent.width || this.x <= 0)
		{
			this.vector_direction.x *= -1.0;
		}
		if (this.y + this.height >= this.parent.height || this.y <= 0)
		{
			this.vector_direction.y *= -1.0;
		}
	}
	else
	{
		this.vector_direction = new TW.Math.Vector2D(1, 0);
		this.vector_direction.setAngle(Math.random() * 360.0);
		this.vector_direction.setLength(2);
		this.operation_type = Math.floor(Math.random() * 4.0);
	}
	if (this.operation_type)
	{
		switch(this.operation_type)
		{
			case 0:
				this.rotate(-1);
				break;
			case 1:
				this.rotate(1);
				break;
			case 2:
				scaleCarot(this);
				break;
			case 3:
				skewCarot(this);
				break;
		}
	}
}

//This function create some carots sprites and add them to the GameLayer.
function createAndAddCarots(myLayerJeu)
{
	var image_carot = new Image();
	image_carot.onload = function(){
		var carot;
		for (var i = 0; i <= 5; i++) {
			carot = new TW.Graphic.Sprite({x:(Math.random() * myLayerJeu.width), y:(Math.random() * myLayerJeu.height), width:image_carot.width, height:image_carot.height, image:image_carot});
			myLayerJeu.addChild(carot);
			carot.update = update_carot;
		}
	};
	image_carot.src = "ressources/carrote.png";
}

//This function configure the Game layer by adding in the mountain sprites.
function setupLayerJeu(myLayerJeu)
{
 var cadre = new TW.Graphic.Rect({width:myLayerJeu.width, height:myLayerJeu.height});
 cadre.setStrokeColor("BLACK");
 cadre.setMode("WIRED");
 var imageMontagne = new Image();
 imageMontagne.onload = function(){
	var spriteMontagne = new TW.Graphic.Sprite({width:800, height:480, image:imageMontagne});
	myLayerJeu.addChild(spriteMontagne);
	myLayerJeu.addChild(cadre);
	createAndAddCarots(myLayerJeu);
	myLayerJeu.update = funcUpdateLayerJeu;
 };
 imageMontagne.src = "ressources/montagne.png";
}


//This function makes the balck ball to be updated and moves it along a directionnal vector.
function updateBall()
{
	if (this.vector_direction)
	{
		this.x += this.vector_direction.x;
		this.y += this.vector_direction.y;
		if (this.x > this.parent.width || this.x < 0)
		{
			this.vector_direction.x = this.vector_direction.x * -1.0;
		}
		if (this.y > this.parent.height || this.y < 0)
		{
			this.vector_direction.y = this.vector_direction.y * -1.0;
		}
	}
	else
	{
		this.vector_direction = new TW.Math.Vector2D(1,0);
		this.vector_direction.setAngle(Math.random() * 360.0);
		this.vector_direction.setLength(3);
	}
}

//This function updates the black square and makes it moving along a vector and rotating.
function updateSquare()
{
	if (this.vector_direction)
	{
		this.x += this.vector_direction.x;
		this.y += this.vector_direction.y;
		if (this.x > this.parent.width || this.x < 0)
		{
			this.vector_direction.x = this.vector_direction.x * -1.0;
		}
		if (this.y > this.parent.height || this.y < 0)
		{
			this.vector_direction.y = this.vector_direction.y * -1.0;
		}
	}
	else
	{
		this.vector_direction = new TW.Math.Vector2D(1,0);
		this.vector_direction.setAngle(Math.random() * 360.0);
		this.vector_direction.setLength(3);
	}
	this.rotate(1);
}

//This function updates the layer which contains the black shapes to make them moving.
function updateLayerParticule() {
	TW.Graphic.Layer.prototype.update.apply(this);
	if (this.direction_vector)
	{
		if (this.x + this.width > this.parent.width || this.x < 0)
		{
			this.direction_vector.x *= -1;
		}
		if (this.y + this.height > this.parent.height || this.y < 0)
		{
			this.direction_vector.y *= -1;
		}
		this.x += this.direction_vector.x;
		this.y += this.direction_vector.y;
	}
	else
	{
		this.direction_vector = new TW.Math.Vector2D(1,0);
		this.direction_vector.setAngle(Math.random() * 360);
		this.direction_vector.setLength(3);
	}
}


//This function create black shapes (square and circle) and then add them to the Layer which will contain them.
function setupLayerParticules(myLayerParticule)
{
 var cadre = new TW.Graphic.Rect({width:200, height:200});
 cadre.setMode("WIRED");
 cadre.setStrokeColor("BLACK");
	myLayerParticule.addChild(cadre);
 var ball = new TW.Graphic.Circle({x:50, y:100, radius:25});
 ball.setMode("FILLED");
 ball.setFillColor("BLACK");
 ball.update = updateBall;
 var square = new TW.Graphic.Rect({x:50, y:50, width:20, height:20});
 square.setMode("FILLED");
 square.setFillColor("BLACK");
 square.update = updateSquare;

 myLayerParticule.update = updateLayerParticule;
 myLayerParticule.addChild(ball);
 myLayerParticule.addChild(square);
}

//This function stuff a layer with a mountain sprite.
function setupLayerMontagneGrise(layer)
{
	var imageMontagneGrise = new Image();
	imageMontagneGrise.onload = function(){
	var spriteMontagneGrise = new TW.Graphic.Sprite({y:50, width:800, height:600, image:imageMontagneGrise});
	layer.addChild(spriteMontagneGrise);	
	};
	imageMontagneGrise.src = "ressources/montagneGrise.png";
}

//This function update the cloud sprite and make it moving from left to right periodically.
function updateNuage()
{
	if (this.direction)
	{
		if (this.direction === "LEFT")
		{
			this.setPosition(this.x-0.2,0);
			if (this.x <= 0)
			{
				this.direction = "RIGHT";
			}
		}
		else if (this.direction === "RIGHT")
		{
			this.setPosition(this.x+0.2, 0);
			if (this.x >= 400)
			{
				this.direction = "LEFT";
			}
		}
	}
	else
	{
		this.direction = "RIGHT";
	}
}

//This function setup a sky layer by adding it a blue rect which is the sky background. And a cloud sprite which will be updated periodically to makes it moving.
function setupLayerSky(layer)
{
	var cadre = new TW.Graphic.Rect({width:800, height:400});
	cadre.setMode("WIRED");
	cadre.setStrokeColor("BLACK");
	var rectSky = new TW.Graphic.Rect({width:800, height:400});
	rectSky.setMode("FILLED");
	rectSky.setFillColor("BLUE");
	layer.addChild(rectSky);
	var imageNuages = new Image();
	imageNuages.onload = function(){
	var spriteNuage = new TW.Graphic.Sprite({width:800, height:400, image:imageNuages});
	layer.addChild(spriteNuage);
	layer.addChild(cadre);
	spriteNuage.update = updateNuage;
	};
	imageNuages.src = "ressources/nuage.png";
}

var ref_layer_montagne_grise;

//This function is the main one. Here, window, layers and gameloop are created and then used.
function main()
{
	//Get the canvas on which draw on.
	var myCanvas = document.getElementById("myCanvas");
	//Retrieve the canvas' context.
	var myCanvasContext = myCanvas.getContext("2d");
	//Create the window by giving it the canvas on which the window object must draw on.
	var myWindow = new TW.Graphic.Window(myCanvas);
	//Create a Layer which will be used to display a Frame.
	var myLayerFrame = new TW.Graphic.Layer({width:800, height:500});
	//Create a Layer which will be used to display green moving mountains.
	var myLayerJeu = new TW.Graphic.Layer({width:800, height:600});
	//Create a Layer which will be used to display grey mountains.
	var myLayerMontagneGrise = new TW.Graphic.Layer({width:800, height:600});
	//Create a Layer which will be used to display the black Shapes (Rectangle and Circle)
	var myLayerParticules = new TW.Graphic.Layer({x:100, y:70, width:200, height:200});
	//Create a Layer which will be used to display sky background and clouds.
	var myLayerSky = new TW.Graphic.Layer({width:800, height:600});
	//Create the gameloop. the gameloop will refresh periodically the window which will refresh Layers which
	// will refresh Sprites which will be drawn on the window's canvas.
	var gl = new TW.Gameloop.Gameloop();

	
	ref_layer_montagne_grise = myLayerMontagneGrise;
	//Add the frame layer to the window
	myWindow.addChild(myLayerFrame);
	//Add the sky Layer to the frame Layer
	myLayerFrame.addChild(myLayerSky);
	//Add the Grey mountains Layer to the frame Layer.
	myLayerFrame.addChild(myLayerMontagneGrise);
	//Add the game layer to frame Layer.
	myLayerFrame.addChild(myLayerJeu);
	//Add the black shapes layer to the game layer.
	myLayerJeu.addChild(myLayerParticules);
	//Stuffing the frame layer.
	setupLayerFrame(myLayerFrame);
	//Stuffing the Sky layer.
	setupLayerSky(myLayerSky);
	//Stuffing the Game layer
	setupLayerJeu(myLayerJeu);
	//Stuffing the grey mountain Layer.
	setupLayerMontagneGrise(myLayerMontagneGrise);
	//Create black shapes and stuff them into the Layer.
	setupLayerParticules(myLayerParticules);
	//Add the window to the gameloop.
	gl.object.push(myWindow);
	//Start the gameloop.
	gl.start();
}

//Calling the main function on the load event of the window.
window.onload = function() {
	main();
};