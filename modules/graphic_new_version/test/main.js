//Cette fonction est utilisee comme fonction d'update des sprites. elle permet de leur appliquer une rotation.
function function_update_sprite() {
 this.rotate(1);
}

//Cette fonction est utilisee comme fonction d'update des rects. elle permet de leur appliquer une rotation puis une translation. Cela permet de les faire tourner en orbite atour d'un point.
function function_update_rect() {
 this.rotate(1);
 this.translate(3,0);
}

//Cette fonction permet de faire bouger la balle de haut en bas. Comme les deux precedentes elle est utilise en tant que surcharge de la fonction update de l'objet graphique concerne.
function function_update_ball() {
 if (this.direction)
 {
   if (this.direction === "UP")
   {
    this.y--;
	if (this.y <= 0)
	 this.direction = "DOWN";
   }
   if (this.direction === "DOWN")
   {
    this.y++;
	if (this.y >= 800)
	 this.direction = "UP";
   }
 }
 else
 {
  this.direction = "DOWN";
 }
}

//Cette fonction permet de creer un rect de couleur bleu, le passe en mode d'affichage plein et l'ajoute au layer myLayer.
function setupFloor(myLayer) {
	var myFloor = new TW.Graphic.Rect({x:0, y:600, width:800, height:200});
	myFloor.setFillColor("blue");
	myFloor.setMode("FILLED");
	myLayer.addChild(myFloor);
}

//Cette fonction permet de creer 4 sprites de les afficher de leur affecter une position une largeur une hauteur un centre de rotation puis leur affecte une fonction d'update (function_update_sprite)
//Cette fonction d'update permet de les animer a l'ecran.
function setupSprites(myLayer) {
 var image = new Image();
 image.src = "test.jpg";
 var sprite1 = new TW.Graphic.Sprite({x:50, y:550, width:50, height:50, xCenterPoint : 25, yCenterPoint : 25});
 sprite1.setImage(image);
 sprite1.update = function_update_sprite;
 var sprite2 = new TW.Graphic.Sprite({x:150, y:550, width:50, height:50, xCenterPoint : 25, yCenterPoint : 25});
 sprite2.setImage(image);
 sprite2.update = function_update_sprite;
 var sprite3 = new TW.Graphic.Sprite({x:250, y:550, width:50, height:50, xCenterPoint : 25, yCenterPoint : 25});
 sprite3.setImage(image);
 sprite3.update = function_update_sprite;
 var sprite4 = new TW.Graphic.Sprite({x:350, y:550, width:50, height:50, xCenterPoint : 25, yCenterPoint : 25});
 sprite4.setImage(image);
 sprite4.update = function_update_sprite;
 
 myLayer.addChild(sprite1);
 myLayer.addChild(sprite2);
 myLayer.addChild(sprite3);
 myLayer.addChild(sprite4);
}

//Cette fonction permet de creer des rectangles de couleur rouge a l'ecran en mode plein (FILLED). hormis deux qui sont en mode filaire (WIRED).
//Cette fonction configure ces rectangles de maniere a ce qu'ils aient un point central de rotation (xCenterPoint, yCenterPoint) et leur affecte une fonction d'update.
//Cette fonction d'update permet de les animer.
function setupRects(myLayer) {
 var rect1 = new TW.Graphic.Rect({x:400, y:450, width:50, height:100, xCenterPoint : 25, yCenterPoint : 50});
 rect1.setMode("FILLED");
 rect1.setFillColor("red");
 rect1.update = function_update_rect;
 var rect2 = new TW.Graphic.Rect({x:400, y:350, width:50, height:100, xCenterPoint : 25, yCenterPoint : 50});
 rect2.setMode("FILLED");
 rect2.setFillColor("red");
 rect2.update = function_update_rect;
 var rect3 = new TW.Graphic.Rect({x:400, y:250, width:50, height:100, xCenterPoint : 25, yCenterPoint : 50});
 rect3.setMode("FILLED");
 rect3.setFillColor("red");
 rect3.update = function_update_rect;
 var rect4 = new TW.Graphic.Rect({x:400, y:150, width:50, height:100, xCenterPoint : 25, yCenterPoint : 50});
 rect4.setMode("FILLED");
 rect4.setFillColor("red");
 rect4.update = function_update_rect;
 var ball = new TW.Graphic.Circle({x:400, y:100, radius:25});
 ball.setMode("FILLED");
 ball.setFillColor("black");
 ball.update = function_update_ball;
 
 myLayer.addChild(rect1);
 myLayer.addChild(rect2);
 myLayer.addChild(rect3);
 myLayer.addChild(rect4);
 myLayer.addChild(ball);
}

function main()
{
	//On recupere le canvas.
	var myCanvas = document.getElementById("my_Canvas");
	//On recupere le contexte du canvas.
	var myCanvasContext = myCanvas.getContext("2d");
	//On creer la window en lui fournissant le canvas sur lequel elle devra dessiner.
	var myWindow = new TW.Graphic.Window(myCanvas);
	//On creer un layer afin de pouvoir y ajouter ensuite les rect les sprites et la balle.
	var myLayer1 = new TW.Graphic.Layer({width:800, height:800});
	//On creer la gameloop afin de pouvoir animer le tout.
	var gl = new TW.Gameloop.Gameloop();
	
	//On ajout le layer fraichement creer a la window.
	myWindow.addChild(myLayer1);
	//On creer le sol.
	setupFloor(myLayer1);
	//On creer les sprites.
	setupSprites(myLayer1);
	//On creer les rectangles.
	setupRects(myLayer1);
	//On ajoute la window a la gameloop.
	gl.object.push(myWindow);
	//On demarre la gameloop.
	gl.start();
}

//On appelle la fonction main() lorsque tout le contenu web est charge (d'ou l'affectation de la fonction a l'handle onload.)
window.onload = function() {
    main();
};
