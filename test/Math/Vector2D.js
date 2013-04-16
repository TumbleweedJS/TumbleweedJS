
define(['TW/Math/Vector2D'], function(Vector2D) {

	module("Vector2D");

	test("constructor", function() {
		var v = new Vector2D(10, 20);
		equal(v.x, 10, "vector.x");
		equal(v.y, 20, "vector.y");
	});

	test("add / sub /div /mult", function() {
		var v = new Vector2D(10, 20);

		v.div(2);
		deepEqual(v, new Vector2D(5, 10), "div by 2");
		v.mult(10);
		deepEqual(v, new Vector2D(50, 100), "mult * 10");

		v.sub(new Vector2D(20, 70));
		deepEqual(v, new Vector2D(30, 30), "sub with a vector");
		v.add(new Vector2D(10, 25));
		deepEqual(v, new Vector2D(40, 55), "add a vector");

		v.sub({x: 12, y: -3});
		deepEqual(v, new Vector2D(28, 58), "sub with a vector");
		v.add({x: 2, y: 12});
		deepEqual(v, new Vector2D(30, 70), "add a vector");

		var v2 = v.add({x: 1, y: 2})
			.sub({x: 1, y: 2})
			.mult(5)
			.div(5);
		strictEqual(v2, v, "chainable calls");
	});

	test("crossProduct", function() {
		var v = new Vector2D(2, 3);
		equal(v.crossProduct(new Vector2D(4, 5)), -2, "classic crossProduct");
		equal(v.crossProduct(new Vector2D(0, 0)), 0, "with vector 0;0");
		equal(v.crossProduct({x: 10, y: 20}), 10, "product with a JSON object");
	});

	test("dotProduct", function() {
		var v = new Vector2D(7, 9);
		equal(v.dotProduct(new Vector2D(3, 6)), 75, "classic dotProduct");
		equal(v.dotProduct(new Vector2D(0, 0)), 0, "with vector 0;0");
		equal(v.dotProduct({x: 4, y: 4}), 64, "dot product with a JSON object");
	});

	test("getAngle()", function() {
		var v = new Vector2D(1, 0);
		equal(v.getAngle(), 0);
		v.y = 1;
		equal(v.getAngle(), 45);
		v.y = -1;
		equal(v.getAngle(), -45);
		v.x = 0;
		v.y = -1;
		equal(v.getAngle(), -90);
		v.x = -1;
		equal(v.getAngle(), -135);
		v.y = 1;
		equal(v.getAngle(), 135);
		v.x = -1;
		v.y = 0;
		equal(v.getAngle(), 180);
	});

});
