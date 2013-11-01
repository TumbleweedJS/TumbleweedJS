
define(['TW/GameLogic/Gameloop'], function(GL) {

	module("GameLoop");

	test("add simple functions", function() {
		var gl = new GL();
		var a = false, b = false;

		gl.addObject(function() {
			a = !a;
		});
		gl.addObject(function() {
			b = !b;
		});

		strictEqual(a, false, 'var a should be false before any update');
		strictEqual(b, false, 'var b should be false before any update');

		gl.update();

		strictEqual(a, true, 'first callback object should have been called with update().');
		strictEqual(b, true, 'second callback object should have been called with update().');

		gl.draw();
		strictEqual(a, true, "callback object shouldn't be called with draw().");
		strictEqual(b, true, "callback object shouldn't be called with draw().");
	});

	test("add objects with update and/or draw method.", function() {
		var gl = new GL();
		var count_update = 0, count_draw = 0;

		//test with empty object.
		gl.addObject({});
		gl.addObject({
			update: function() {
				count_update++;
			},
			draw: function() {
				count_draw++;
			}
		});
		gl.addObject({
			update: function() {
				count_update += 5;
			}
		});
		gl.addObject({
			draw: function() {
				count_draw += 10;
			}
		});

		gl.update();
		strictEqual(count_update, 6, "update() should call 2 object with update method");
		strictEqual(count_draw, 0, "draw() object methods shouldn't be called with gl.update()");
		count_update = count_draw = 0;
		gl.draw();
		strictEqual(count_draw, 11, "draw() should call 2 object with draw method");
		strictEqual(count_update, 0, "update() object method shouldn't be called with gl.update()");
	});

});
