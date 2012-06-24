//La classe Text2D permet de definir un objet capable d'afficher du texte
//x position locale du texte en abscisse
//y position locale du texte en ordonnee
//size taille de la police
//fontName nom de la police a utiliser
//text texte a afficher.
//par exemple, pour creer un objet texte qui s'affiche a la position [50;60] avec une taille de 15 en police calibri on fait
//var mytext = new Text2D(50, 60, 15, 'calibri', 'Bonjour le monde.');
function Text2D(x, y, size, fontName, text)
{
 this.x = x;
 this.y = y;
 this.text = text;
 this.size = size + 'pt';
 this.fontName = fontName;
 this.redColor = 0;
 this.greenColor = 0;
 this.blueColor = 0;
 this.alpha = 1.0;
 this.x_centerPoint = 0;
 this.y_centerPoint = 0;
 this.scaleX = 1.0;
 this.scaleY = 1.0;
 this.rotation = 0.0;
 this.fontStyle = ""; //"" = normal, "italic" = italic, "bold" = bold
}

//Permet d'obtenir la largeur du texte, on doit forcement fournir le context pour pouvoir mesurer le texte
Text2D.prototype.getWidth = function()
{
 //var metrics = ctx.measureText(this.text);
 //return metrics.width;
 return 0;
}

//Permet d'obtenir la hauteur du texte, on doit forcement fournir le context pour pouvoir mesurer le texte
Text2D.prototype.getHeight = function()
{
 //var metrics = ctx.measureText(this.text);
 return 0;
}

//Permet de definir le point de centre (pour les rotations les translations des objets texte)
Text2D.prototype.setCenterPoint = function(x, y)
{
 this.x_centerPoint = x;
 this.y_centerPoint = y;
}

//Permet de recuperer le x
Text2D.prototype.getX = function()
{
 return this.x;
}

//Permet de recuperer le y
Text2D.prototype.getY = function()
{
 return this.y;
}

//Permet de definir la mise a l'echelle du texte
Text2D.prototype.setScale = function(x, y)
{
 this.scaleX = x;
 this.scaleY = y;
}

//Permet de definir la rotation du texte
Text2D.prototype.setRotation = function(rot)
{
 this.rotation = rot / 180.0 * Math.PI;
}

//la methode setRVBColor permet de pouvoir definir la couleur du texte.
//la valeur des compansantes red, green et blue vont de 0 a 255.
Text2D.prototype.setRVBColor = function(red, green, blue)
{
 this.redColor = red;
 this.greenColor = green;
 this.blueColor = blue;
}

//permet de set la transparence du text
Text2D.prototype.setAlpha = function(alpha)
{
 if (alpha > 1.0)
 {
  this.alpha = 1.0;
  return;
 }
 if (alpha < 0.0)
 {
 this.alpha = 0.0;
 return;
 }
 this.alpha = alpha;
}

//permet de get la transparence du text
Text2D.prototype.getAlpha = function()
{
 return this.alpha;
}

//setFontStyle permet de definir le style de la police
//italic = ecriture italique
//bold = ecriture grasse
//normal = ecriture normale
Text2D.prototype.setFontStyle = function(fontStyle)
{
 if (fontStyle == "italic")
    this.fontStyle = "italic";
 if (fontStyle == "bold")
    this.fontStyle = "bold";
 if (fontStyle == "normal")
    this.fontStyle = "";
}

//permet de definir la taille de la police (meme grandeur que la taille de police dans les editeurs de texte type Word)
//par exemple, pour que la police soit de taille 10 on fait
//setSize(10);
Text2D.prototype.setSize = function(size)
{
 this.size = size + "pt";
}

//Permet de definir le texte a afficher
Text2D.prototype.setText = function(text)
{
 this.text = text;
}

//permet de definir la police a utiliser, par exemple pour utiliser la police calibri on fait
//setFont("calibri");
Text2D.prototype.setFont = function(font)
{
 this.fontName = font;
}

//Dessine l'objet texte.
Text2D.prototype.draw = function(context)
{
 context.save();
 var saveFont = context.font;
 var saveFillStyle = context.fillStyle;
 context.fillStyle = "rgb("+this.redColor+","+this.greenColor+","+this.blueColor+")";
 context.font = this.fontStyle + " " + this.size + " " + this.fontName;
 context.globalAlpha = this.alpha;
 context.transform(1, 0, 0, 1, this.x + this.x_centerPoint, this.y + this.y_centerPoint);
 context.transform(this.scaleX, 0, 0, this.scaleY, 0, 0);
 context.transform(Math.cos(this.rotation), -Math.sin(this.rotation), Math.sin(this.rotation), Math.cos(this.rotation), 0, 0);
 context.transform(1, 0, 0, 1, this.x_centerPoint * -1, this.y_centerPoint * -1);
 context.fillText(this.text, 0, 0);
 context.restore();
}