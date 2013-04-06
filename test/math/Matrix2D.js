
define(['TW/math/Matrix2D'], function(Matrix2D) {

	module("Matrix2D");

	test("default matrix is identity Matrix", function() {
		var matrix = new Matrix2D();

		equal(matrix.isIdentity(), true);
		deepEqual(TW.Math.Matrix2D.identity(), matrix);
	});

	test("isIdentity after transformations reverted", function() {
		var matrix = new Matrix2D();

		matrix.setTransform(1, 0, 0, 1, 0, 0);
		equal(matrix.isIdentity(), true);
		matrix.rotate(45);
		equal(matrix.isIdentity(), false);
		matrix.rotate(-45);
		equal(matrix.isIdentity(), true);

		matrix.setTransform(1, 1, 1, 1, 1, 1);
		equal(matrix.isIdentity(), false);
	});

});
