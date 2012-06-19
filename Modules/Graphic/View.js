//la classe view joue le role de conteneur.
//cette classe peut contenir d'autres view que l'on ajoute avec pushView
//Le view peuvent contenir des sprites.
//pour ajouter un sprite a une view il faut utiliser la methode pushSprite
//le constructeur de la view prend en parametre  le context, la position x;y,
//une largeur une hauteur.
function View(context, x, y, width, height)
{
 this.x = x;
 this.y = y;
 this.width = width;
 this.height = height;
 this.listSprite = new Array();
 this.listView = new Array();
 this.context = context;
 this.parentWindow = 0;
 this.parentView = 0;
 this.rotation = 0;
 this.x_center = 0;
 this.y_center = 0;
 this.x_scale = 1.0;
 this.y_scale = 1.0;
}

//Permet de recuperer la width
View.prototype.getWidth = function()
{
 return this.width;
}

//Permet de recuperer la height
View.prototype.getHeight = function()
{
 return this.height;
}

//Permet de set la rotation de la view rot est en degree
View.prototype.setRotation = function(rot)
{
 this.rotation = rot / 180.0 * Math.PI;
}

//Permet de recuperer la rotation de la vue en degree
View.prototype.getRotation = function()
{
 return this.rotation;
}

//Permet de set le centre de la view
View.prototype.setCenterPoint = function(x, y)
{
 this.x_center = x;
 this.y_center = y;
}

//Permet recuperer le centre de la view
View.prototype.getCenterPoint = function()
{
 return {x: this.x_center, y: this.y_center};
}

//Permet de set la scale de la view
View.prototype.setScale = function(x, y)
{
 this.x_scale = x;
 this.y_scale = y;
}

//Permet de get la scale de la view
View.prototype.getScale = function()
{
 return {x: this.x_scale, y: this.y_scale};
}

//set la window a laquelle appartient la view
View.prototype.setWindow = function(window)
{
 this.parentWindow = window;
}

//permet de set la vue parente.
View.prototype.setParentView = function(view)
{
 this.parentView = view;
}

//getPrentView permet de pouvoir recuperer la vue parente
View.prototype.getParentView = function()
{
 return this.parentView;
}

//permet de set la window dont fait parti la View
View.prototype.setParentWindow = function(window)
{
 this.parentWindow = window;
}

//getter de la window a laquelle appartient la vue
View.prototype.getWindow = function()
{
 return this.parentWindow;
}

//resizeur de la view (n'a pour le moment aucun effet reel hormis la modification de la width et la height de la view)
View.prototype.resize = function(w, h)
{
 this.width = w;
 this.height = h;
}

//place la view a la position x, y
View.prototype.move = function(x, y)
{
 this.x = x;
 this.y = y;
}

//recupere la position de la view sous forme d'un objet qui contient un membre x et un membre y.
View.prototype.getPos = function()
{
 return {x: this.x, y: this.y};
}

//recupere les dimensions de la view sous la forme d'un objet qui contient les attributs
//w pour la width et h pour la height.
View.prototype.getDim = function()
{
 return {w: this.width, h: this.height};
}

//permet d'ajouter une view fille
View.prototype.pushView = function(view)
{
 this.listView.push(view);
}

//permet de retirer une view a partir de sa reference
View.prototype.popView = function (ref)
{
 var length = this.listView.length;
 var i = 0;

 while (i < length)
 {
  if (this.listView[i] === id)
   {
    this.listView.split(i, 1);
   }
  else
   {
    i++;
   }
 }
}

//permet de dessiner une view
View.prototype.draw = function(ctx)
{
var length = this.listView.length;
var i = 0;
var tmp_ctx = ctx || 1;

if (tmp_ctx == 1)
tmp_ctx = this.context;
 
 tmp_ctx.save();
 tmp_ctx.transform(1, 0, 0, 1, this.x + this.x_center, this.y + this.y_center);
 tmp_ctx.transform(Math.cos(this.rotation), -Math.sin(this.rotation), Math.sin(this.rotation), Math.cos(this.rotation), 0, 0);
 tmp_ctx.transform(this.x_scale, 0, 0, this.y_scale, 0, 0);
 tmp_ctx.transform(1, 0, 0, 1, -this.x_center, -this.y_center);
 while (i < length)
  {
  if (this.listView[i].getX() < this.width && this.listView[i].getX() + this.listView[i].getWidth() >= 0 &&
      this.listView[i].getY() < this.height && this.listView[i].getY() + this.listView[i].getHeight() >= 0)
     this.listView[i].draw();
   i++;
  }
 length = this.listSprite.length;
 i = 0;
 while (i < length)
  {
  if (this.listSprite[i].getX() < this.width && this.listSprite[i].getX() + this.listSprite[i].getWidth() >= 0 &&
      this.listSprite[i].getY() < this.height && this.listSprite[i].getY() + this.listSprite[i].getHeight() >= 0)
     this.listSprite[i].draw(tmp_ctx);
   i++;
  }
  tmp_ctx.restore();
}

//permet de set un nouveau contexte graphique
View.prototype.setContext = function(context)
{
 this.context = context;
}

//permet de get le contexte actuel
View.prototype.getContext = function()
{
 return this.context;
}


//permet d'ajouter un sprite a la vue
View.prototype.pushSprite = function(sprite)
{
 //sprite.setView(this);
 this.listSprite.push(sprite);
}

//permet d'ajouter un objet text a la view
View.prototype.pushText2D = function(textObject)
{
 this.listSprite.push(textObject);
}

//permet de retirer un sprite de la vue a partir de sa reference
View.prototype.popSprite = function(ref)
{
 var spriteListLength = this.spriteList.length;
 var i = 0;

 while (i < spriteListLength)
 {
  if (spriteList[i] === ref)
   this.spriteList.splice(i,1);
  else
   i++;
 }
}

//permet de recuperer la position x de la view
View.prototype.getX = function()
{
 return this.x;
}

//permet de recuperer la positiony de la view
View.prototype.getY = function()
{
 return this.y;
}