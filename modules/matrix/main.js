
window.onload = function() {
var mat1 = new Matrix(3, 3);
mat1.setData(3,3,[Math.cos(0), -Math.sin(0), 0,
                  Math.sin(0), Math.cos(0), 0,
 				  0, 0, 1]);
				  
mat1.scale(2, 1);
mat1.rotate(90);
mat1.translate(1, 0);
var vector = new Vector2d(1, 0);
var vector_result = mat1.multByVector2d(vector);
mat1.dump();
vector_result.dump();
};