var angle = Math.PI / 2;

window.onload = function() {
var mat1 = new Matrix(3, 3);
mat1.setData(3,3,[Math.cos(angle), -Math.sin(angle), 0,
                  Math.sin(angle), Math.cos(angle), 0,
 				  0, 0, 1]);
				  
var mat2 = new Matrix(3, 3);
mat2.setData(3,3,[1, 0, 2,
                  0, 1, 0,
 				  0, 0, 1]);
var mat3 = mat1.multByMatrix(mat2);
var vector = new Vector2d(1, 0);
var vector_result = mat3.multByVector2d(vector);
mat1.dump();
mat2.dump();
mat3.dump();
vector.dump();
vector_result.dump();
};