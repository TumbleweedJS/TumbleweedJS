//La classe CollisionWorld est faite pour contenir des primitives de collisions comme
//le CollisionCircle ou la CollisionBox.
function CollisionWorld()
{
 this.listBox = new Array();
 this.listCircle = new Array();
}

//fonction permettant d'ajouter une box de collision dans le CollisionWorld
CollisionWorld.prototype.addCollisionBox = function(box)
{
 this.listBox.push(box);
 return true;
}

//Fonction permettant d'ajouter un cercle de collision dans le CollisionWorld
CollisionWorld.prototype.addCollisionCircle = function(circle)
{
 this.listCircle.push(circle);
 return true;
}

//Fonction permettant de supprimer une collisionbox du collisionWorld
CollisionWorld.prototype.suppressCollisionBox = function(box)
{
 var length = this.listBox.length;
 var  i = 0;
 while (i < length)
  {
   if (this.listBox[i] === box)
    {
	 this.listBox.split(i, 1);
	 return true;
	}
   i++;
  }
  return false;
}

//Fonction permettant de supprimer une collisionCircle du collisionWorld
CollisionWorld.prototype.suppressCollisionCircle = function(circle)
{
 var length = this.listCircle.length;
 var i = 0;
 while (i < length)
  {
   if (this.listCircle[i] === box)
    {
	 this.listCircle.split(i, 1);
	 return true;
	}
   i++;
  }
  return false;
}

