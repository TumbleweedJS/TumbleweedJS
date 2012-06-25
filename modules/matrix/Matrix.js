//Classe Matrix, permet de pouvoir creer une matrice
//width est la largeur de la matrice
//height est la hauteur de la matrice
//La matrice est set a l'identite lors de sa creation
//C'est a dire que pour une matrice de 4*4 cree comme ceci : new Matrix(4,4);
//On obtient ceci :
//[1 0 0 0]
//[0 1 0 0]
//[0 0 1 0]
//[0 0 0 1]
function Matrix(width, height) {
 this.data = Array();
 this.width = width;
 this.height = height;
 var i = 0;
 while (i < height)
  {
   var j = 0;
   this.data.push(new Array());
   while (j < width)
    {
	 if (i == j)
	  this.data[i].push(1);
	 else
	  this.data[i].push(0);
	 j++;
	}
   i++;
  }
}

//Permet de set les donnees de la matrice
//on redefinit la hauteur de la matrice par i
//on redefinit la largeur de la matrice par j
//on fourni les donnees depuis un tableau avec array_of_data
//retourn false si une erreur se produit
//retourne true si tout s'est bien passee.
Matrix.prototype.setData = function(i, j, array_of_data) {
 if (i < 0 || j < 0 || i * j != array_of_data.length)
  return false;
 var length = array_of_data.length;
 var  step = 0;
 this.width = j;
 this.height = i;
 
 this.data = Array();
 var i2 = 0;
 var j2 = 0;
 while (i2 < this.height)
  {
   var j2 = 0;
   this.data.push(new Array());
   while (j2 < this.width)
    {
	  this.data[i2].push(array_of_data[i2 * j + j2]);
	 j2++;
	}
   i2++;
  }
}

//Permet de recuperer la largeur de la matrice
Matrix.prototype.getWidth = function() {
 return this.width;
}

//Permet de recuperer la hauteur de la matrice
Matrix.prototype.getHeight = function() {
 return this.height;
}

//Permet de recuperer le scalaire aux coordonnees i,j de la matrice
Matrix.prototype.getScalar = function(i, j) {
 return this.data[i][j];
}

//Permet de set le scalaire aux coordonnees i,j en lui affectant la valeur val
//retourne true si tout s'est bien passe, et retourn false si une erreur est survenue durant l'affectation (parametres non valides)
Matrix.prototype.setScalar = function(i, j, val) {
 if (i > this.height || i < 0 || j > this.width || j < 0)
  return false;
 this.data[i][j] = val;
 return true;
}

//Permet de calculer l'addition de deux matrices
//return ret_matrix si tout s'est bien passe
//return false si une erreur est survenue
Matrix.prototype.add = function(matrix) {
 if (matrix.getWidth() != this.width || matrix.getHeight() != this.height)
  return false;
 var ret_matrix = new Matrix(this.width, this.height);
 var i = 0;
 var j = 0;
 while (i < this.height)
  {
   j = 0;
   while (j < this.width)
    {
	 ret_matrix.setScalar(i, j, this.getScalar(i, j) + matrix.getScalar(i, j));
	 j++;
	}
   i++;
  }
 return ret_matrix;
}

//Permet de calculer la soustraction de deux matrices
//return ret_matrix si tout s'est bien passe
//return false si une erreur est survenue
Matrix.prototype.sub = function(matrix) {
 if (matrix.getWidth() != this.width || matrix.getHeight() != this.height)
  return false;
 var ret_matrix = new Matrix(this.width, this.height);
 var i = 0;
 var j = 0;
 while (i < this.height)
  {
   j = 0;
   while (j < this.width)
    {
	 ret_matrix.setScalar(i, j, this.getScalar(i, j) - matrix.getScalar(i, j));
	 j++;
	}
   i++;
  }
 return ret_matrix;  
}

//Permet de calculer le resultat de la multiplication de deux matrices pour un scalaire
Matrix.prototype.multScalar = function(i, j, matrix){
 var step = 0;
 var sum = 0;
 while (step < this.width)
  {
   sum = sum + (this.getScalar(i, step) * matrix.getScalar(step, j));
   step++;
  }
 return sum;
}

//Permet de calculer la multiplication de deux matrices
//return ret_matrix si tout s'est bien passe
//return false si une erreur est survenue
Matrix.prototype.multByMatrix = function(matrix) {
 if (this.height != matrix.getWidth() || this.width != matrix.getHeight())
  return false;
 var ret_matrix = new Matrix(this.width, this.height);
 var i = 0;
 var j = 0;
 while (i < this.height)
  {
   j = 0;
   while (j < this.width)
    {
	 ret_matrix.setScalar(i, j, this.multScalar(i, j, matrix));
	 j++;
	}
   i++;
  }
 return ret_matrix;   
}

//Permet de multiplier une matrice par un vecteur 2d
Matrix.prototype.multByVector2d = function(vector) {
 if (this.height > 3)
  return false;
 var vector2d = [vector.getX(), vector.getY(), 1];
 var height = 0;
 var step = 0;
 var val_tmp = 0;
 var composant_counter = 0;
 var ret_vector_2d = [0, 0, 0];
 while (height < this.height)
  {
   step = 0;
   val_tmp = 0;
   while (step < this.width)
   {
    val_tmp += this.getScalar(height, step) * vector2d[step];
    step++;
   }
   ret_vector_2d[height] = val_tmp;
   height++;
  }
 return new Vector2d(ret_vector_2d[0], ret_vector_2d[1]);
}

//Permet d'afficher dans un alert le contenu de la matrice
Matrix.prototype.dump = function() {
 var i = 0;
 var j = 0;
 var chain_to_display = "";
 while (i < this.height)
  {
   j = 0;
   while (j < this.width)
   {
    chain_to_display += this.getScalar(i, j) + " ";
    j++;
   }
   chain_to_display += "\n";
   i++;
  }
 window.alert(chain_to_display);
}
