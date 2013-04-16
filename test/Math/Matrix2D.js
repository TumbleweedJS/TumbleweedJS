
define(['TW/Math/Matrix2D'], function(Matrix2D) {

	module("Matrix2D");

	test("default matrix is identity Matrix", function() {
		var matrix = new Matrix2D();

		equal(matrix.isIdentity(), true);
		deepEqual(Matrix2D.identity(), matrix);
		ok(Matrix2D.rotation(10).identity().isIdentity());
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

	test("copy()", function() {
		var matrix = new Matrix2D();
		matrix.setTransform(1, 2, 3, 4, 5, 6);

		var m2 = matrix.copy();
		deepEqual(m2, matrix);
		notStrictEqual(m2, matrix);
	});

	test("getData()", function() {
		var matrix = new Matrix2D();
		matrix.setTransform(1, 2, 3, 4, 5, 6);

		deepEqual(matrix.getData(), [
			[1, 2, 0],
			[3, 4, 0],
			[5, 6, 1]
		]);

		deepEqual(matrix.getData(), matrix.data);
		notStrictEqual(matrix.getData(), matrix.data);
	});

	test("inverse()" , function() {
		var matrix = Matrix2D.rotation(30);

		deepEqual(matrix.inverse(), Matrix2D.rotation(-30));

		matrix = Matrix2D.translation(34, 89);
		deepEqual(matrix.inverse(), Matrix2D.translation(-34, -89));

		matrix = Matrix2D.rotation(66).scale(2, 2);
		deepEqual(matrix.inverse(), Matrix2D.rotation(-66).scale(0.5, 0.5));

		ok(Matrix2D.identity().inverse().isIdentity());
	});

	test("multiply() matrix", function() {
		deepEqual(Matrix2D.rotation(25).multiplyMatrix(Matrix2D.rotation(25)), Matrix2D.rotation(50));
		deepEqual(Matrix2D.translation(25, 10).multiplyMatrix(Matrix2D.translation(25, -10)),
		          Matrix2D.translation(50, 0));
		deepEqual(Matrix2D.scale(2, 2).multiplyMatrix(Matrix2D.scale(2, 2)),
		          Matrix2D.scale(4, 4));

		var matrix = Matrix2D.scale(2, 2).multiplyMatrix(Matrix2D.skew(3, 3));
		deepEqual(matrix, matrix.copy().multiplyMatrix(Matrix2D.identity()));
	});
});
