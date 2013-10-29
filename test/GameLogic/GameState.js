
define(['TW/GameLogic/GameState'], function(State) {

	module("GameState");

	test("add simple functions", function() {
		var state = new State();
		var a = false, b = false;

		state.addObject(function() {
			a = !a;
		});
		state.addObject(function() {
			b = !b;
		});

		strictEqual(a, false, 'var a should be false before any update');
		strictEqual(b, false, 'var b should be false before any update');

		state.update();

		strictEqual(a, true, 'first callback object should have been called with update().');
		strictEqual(b, true, 'second callback object should have been called with update().');

		state.draw();
		strictEqual(a, true, "callback object shouldn't be called with draw().");
		strictEqual(b, true, "callback object shouldn't be called with draw().");
	});

	test("add objects with update and/or draw method.", function() {
		var state = new State();
		var count_update = 0, count_draw = 0;

		//test with empty object.
		state.addObject({});
		state.addObject({
			             update: function() {
				             count_update++;
			             },
			             draw: function() {
				             count_draw++;
			             }
		             });
		state.addObject({
			             update: function() {
				             count_update += 5;
			             }
		             });
		state.addObject({
			             draw: function() {
				             count_draw += 10;
			             }
		             });

		state.update();
		strictEqual(count_update, 6, "update() should call 2 object with update method");
		strictEqual(count_draw, 0, "draw() object methods shouldn't be called with state.update()");
		count_update = count_draw = 0;
		state.draw();
		strictEqual(count_draw, 11, "draw() should call 2 object with draw method");
		strictEqual(count_update, 0, "update() object method shouldn't be called with state.update()");
	});

	test("transfer params to update and draw method", function() {
		var state = new State();
		var model = {
			update_expect:  undefined,
			draw_expect:  undefined,
			update: function(arg) {
				strictEqual(this.update_expect, arg, "update called with expected arg");
			},
			draw: function(arg) {
				strictEqual(this.draw_expect, arg, "draw called with expected arg");
			}
		};
		var obj1 = {}, obj2 = {};

		obj1.prototype = obj2.prototype = model;
		state.addObject(obj1);
		state.addObject(obj2);

		expect(8);

		state.update();
		state.draw();
		model.draw_expect = true;
		model.update_expect = 35;

		state.update(true);
		state.draw(35);
	});

	test("check all events", function() {
		var state = new State();
		var event_expected = null;

		function check(event) {
			strictEqual(event_expected, event, "event " + event_expected + " should be fired");
		}

		state.on('draw', check);
		state.on('update', check);
		state.on('sleep', check);
		state.on('wakeUp', check);
		state.on('delete', check);

		expect(5);

		event_expected = 'draw';
		state.draw();
		event_expected = 'update';
		state.update();
		event_expected = 'sleep';
		state.sleep();
		event_expected = 'wakeUp';
		state.wakeUp();
		event_expected = 'delete';
		state.delete();
	});
});
