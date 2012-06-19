//Classe herite de Sprite. Elle permet de stocket plusieurs inages et de les faire se suivre.
//Meme parametres que Sprite sauf que imgRectArray est un tableau de imgRect (les differentes images qui compose l'animation)
function SpriteAnime(x, y, width, height, imgRectArray, parentView, fps)
{
	this.superClass = Sprite;
	this.superClass(x, y, width, height, imgRectArray[0], parentView);
	delete this.superclass;
	
	this.imgRectArray = imgRectArray;
	this.startDate = 0;
	this.current = 0;
	this.fps = fps;
	this.speed = 1000 / this.fps;
	this.frame = imgRectArray.length;
}

//Update qui vise a modifier l'imgRect en cours.
SpriteAnime.prototype.update = function()
{
	var currentDate = new Date();
	var count = currentDate.valueOf() - this.startDate.valueOf();
	count /= this.speed;
		
	if (this.startDate == 0)
		this.startDate = currentDate;
	else if (count > 1)
	{
		this.startDate = currentDate;
		this.current += count;
		this.current %= this.frame;
		this.imgRect = this.imgRectArray[this.current];
	}
	alert (this.imgRect);
}

SpriteAnime.prototype.reset =  function()
{
	this.current = 0;
	this.startDate = 0;
	this.imgRect = this.imgRectArray[0];
}
/*
var arrayT = new Array("Fraise", "Pomme", "Poire", "Abricot");
var t = new SpriteAnime(0,0,1200,500, arrayT, 0, 30);
t.update();
t.update();
t.update();
t.update();
t.update();
t.update();
t.update();
t.update();
t.update();
t.update();
t.update();
*/