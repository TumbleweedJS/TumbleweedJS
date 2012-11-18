function main()
{
	var myCanvas = document.getElementById("my_Canvas");
	var myCanvasContext = myCanvas.getContext("2d");

	var myWindow = new TW.Graphic.Window(myCanvas);
	var myLayer = new TW.Graphic.Layer({width:800, height:800});
	var mySprite = new TW.Graphic.Sprite({x : 0, y : 0, width : 50, height : 50});

	var image = new Image();
	image.src = "test.jpg";
	mySprite.setImage(image);

	myLayer.addChild(mySprite);
	myWindow.addChild(myLayer);

	var camera = myWindow.getCamera();
	camera.translate(100, 100);
	//camera.rotate(45);
    mySprite.scale(5,5);
    myLayer.rotate(20);
	//myLayer.translate(100,100);
    //mySprite.translate(200, 100);
	//mySprite.scale(5,5);
	mySprite.rotate(45);
	//mySprite.translate(200, 100);

	myWindow.draw();

	//mySprite.draw(myCanvasContext);
}

window.onload = function() {
    main();
};
