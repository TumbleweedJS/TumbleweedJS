function main()
{
	var myCanvas = document.getElementById("my_Canvas");
	var myCanvasContext = myCanvas.getContext("2d");

	var myWindow = new TW.Graphic.Window(myCanvas);
	
	var myLayer1 = new TW.Graphic.Layer({width:800, height:800});
	var myLayer2 = new TW.Graphic.Layer({width:800, height:800});
	var myLayer3 = new TW.Graphic.Layer({width:800, height:800});
	
	var mySprite = new TW.Graphic.Sprite({x : 0, y : 0, width : 50, height : 50});

	var image = new Image();
	image.src = "test.jpg";
	mySprite.setImage(image);

	myWindow.addChild(myLayer1);
	myLayer1.addChild(myLayer2);
	myLayer2.addChild(myLayer3);
	
	
	myLayer1.addChild(mySprite);
	myLayer2.addChild(mySprite);
	//myLayer3.addChild(myLayer1);
	myLayer3.addChild(mySprite);
	
	myLayer1.translate(300, 50);
	myLayer1.rotate(45);
	myLayer2.translate(50, 50);
	myLayer2.rotate(45);
	myLayer3.translate(50, 50);
	myLayer3.rotate(45);
	
	var i = 0;
	myLayer3.update  = function() {
		i = i+1;
		//console.log(i);
		this.rotate(i);
	};

	//var camera = myWindow.getCamera();
	//camera.translate(100, 100);
	//camera.rotate(45);
	//myLayer.rotate(20);
	//myLayer.translate(100,100);
    //mySprite.translate(200, 100);
	//mySprite.scale(5,5);
	mySprite.rotate(45);
	//mySprite.translate(200, 100);

	//myWindow.draw();

	var gl = new TW.Gameloop.Gameloop();
	gl.object.push(myWindow);
	//gl.start();
	//mySprite.draw(myCanvasContext);
}

window.onload = function() {
    main();
};
