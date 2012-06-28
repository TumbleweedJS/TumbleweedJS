//la classe Window est l'objet de base.
//il permet de contenir les view. Ce sont ces memes Views qui contiennent les sprites.
//le constructeur de la view prend en parametre la width la height et le context 
//(le context est le context2d du canvas sur lequel la window dessinera)
function Window(width, height, context)
{
 this.width = width;
 this.height = height;
 this.viewList = new Array();
 this.rotation = 0;
 this.x_center = 0;
 this.y_center = 0;
 this.x = 0;
 this.y = 0;
 this.scale_x = 1.0;
 this.scale_y = 1.0;
 this.context = context;
}

//Permet de definir la scale
Window.prototype.setScale = function(x, y)
{
 this.scale_x = x;
 this.scale_y = y;
}

//Permet de recuperer la scale
Window.prototype.getScale = function()
{
 return {x: this.scale_x, y: this.scale_y};
}

//Permet de definir la position x de la window
Window.prototype.setX = function(x)
{
 this.x = x;
}

//Permet de recuperer la valeur x de la window
Window.prototype.getX = function()
{
 return this.x;
}

//Permet de recuperer la valeur y de la window
Window.prototype.getY = function()
{
 return this.y;
}

//Permet de definir la position y de la window
Window.prototype.setY = function(y)
{
 this.y = y;
}

//Permet de definir l'angle de la rotation de la window
Window.prototype.setRotation = function(angle)
{
 this.rotation = angle / 180.0 * Math.PI;
}

//Permet de definir le point central de la window
Window.prototype.setCenterPoint = function(x, y)
{
 this.x_center = x;
 this.y_center = y;
}

//Permet de recuperer le point central de la view
Window.prototype.getCenterPoint = function()
{
 return {x: this.x_center, y: this.y_center};
}

//permet de recuperer l'angle de rotation
Window.prototype.getRotation = function()
{
 return this.rotation;
}

//permet de dessiner les objets sur la window
//la fonction de dessin dessine tous les sprites de toutes les views
Window.prototype.draw = function (context)
{
 var viewListLength = this.viewList.length;
 var i = 0;
 var ctx_tmp = context || 1;
 
 if (ctx_tmp == 1)
  ctx_tmp = this.context;
 
 ctx_tmp.save();
 ctx_tmp.clearRect(0,0,this.width, this.height);
 ctx_tmp.transform(1, 0, 0, 1, this.x + this.x_center, this.y + this.y_center);
 ctx_tmp.transform(Math.cos(this.rotation), -Math.sin(this.rotation), Math.sin(this.rotation), Math.cos(this.rotation), 0, 0);
 ctx_tmp.transform(this.scale_x, 0, 0, this.scale_y, 0, 0);
 ctx_tmp.transform(1, 0, 0, 1, -this.x_center, -this.y_center);
 while (i < viewListLength)
 {
  if (this.viewList[i].getX() < this.width && this.viewList[i].getX() + this.viewList[i].getWidth() >= 0 &&
      this.viewList[i].getY() < this.height && this.viewList[i].getY() + this.viewList[i].getHeight() >= 0)
    this.viewList[i].draw(ctx_tmp);
  i++;
 }
 ctx_tmp.restore();
}

//permet de recuperer la largeur de la window
Window.prototype.getWidth = function ()
{
 return this.width;
}

//permet de recuperer la height de la window
Window.prototype.getHeight = function ()
{
 return this.height;
}

//permet de recuperer le contexte de la window
Window.prototype.getContext = function ()
{
 return this.context;
}

//permet de set le context de la window
Window.prototype.setContext = function (context)
{
 this.context = context;
}

//permet d'ajouter une view pour pouvoir dessiner son contenu
Window.prototype.pushView = function(view)
{
 view.setWindow(this);
 this.viewList.push(view);
}

//permet de retirer une view de la window
Window.prototype.popView = function(ref)
{
 var size = this.viewList.length;
 var i = 0;

 while (i < size)
 {
  if (this.viewList[i] === ref)
   {
    this.viewList.splice(i, 1);
   }
  else
   {
    i++;
   }
 }
}