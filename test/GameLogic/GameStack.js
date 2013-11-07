
define(['TW/GameLogic/GameState', 'TW/GameLogic/GameStack'], function(State, Stack) {

	module("GameStack and GameState");


	test("update/draw with only one state", function() {
		var stack = new Stack();
		var state = new State();

		stack.push(state);

		expect(5);

		state.once('draw', function(_, arg) {
			strictEqual(arg, "---context---", 'state.draw() should be called with the context.');
		});
		state.once('update', function(_, arg) {
			strictEqual(arg, 57, "state.draw() should be called with an argument");
		});

		stack.update(57);
		stack.draw("---context---");

		state.once('draw', function(_, arg) {
			strictEqual(arg, null, "draw can also be called without args");
		});
		state.once('update', function(_, arg) {
			strictEqual(arg, undefined, "update can also be called without args");
		});

		stack.draw();
		stack.update();

		stack.draw_context = '#context';
		state.once('draw', function(_, arg) {
			strictEqual(arg, '#context', 'draw context is set to stack.draw_context attribute');
		});
		stack.draw();
	});

	test("update/draw calls with multi-states", function() {
		var stack = new Stack();
		var state1 = new State();
		var state2 = new State();
		var current = 0;

		state1.on('draw', function() {
			strictEqual(current, 1, 'draw state 1');
		});
		state1.on('update', function() {
			strictEqual(current, 1, 'update state 1');
		});
		state2.on('draw', function() {
			strictEqual(current, 2, 'draw state 2');
		});
		state2.on('update', function() {
			strictEqual(current, 2, 'update state 2');
		});

		expect(6);

		stack.push(state1);
		current = 1;
		stack.update();
		stack.draw();
		stack.push(state2);
		current = 2;
		stack.update();
		stack.draw();
		stack.pop();
		current = 1;
		stack.update();
		stack.draw();
	});

	test("sleep/wakeUp and dispose events", function() {
		var stack = new Stack();
		var state1 = new State();
		var state2 = new State();
		var i = 0;

		state1.on('init', function() {
			strictEqual(i, 0, 'state1 pushed.');
		});
		state2.on('init', function() {
			strictEqual(i, 1, 'state2 pushed.');
		});
		state1.on('sleep', function() {
			strictEqual(i, 1, 'state1 go sleep.');
		});
		state2.on('sleep', function() {
			ok(false, "state2 should never sleep.");
		});
		state1.on('wakeUp', function() {
			strictEqual(i, 3, 'state1 wake up.');
		});
		state2.on('wakeUp', function() {
			ok(false, 'state 2 should never wake up.');
		});
		state1.on('dispose', function() {
			strictEqual(i, 4, 'state1 is deleted.');
		});
		state2.on('dispose', function() {
			strictEqual(i, 2, 'state 2 is deleted.');
			i++;
		});

		expect(6);

		stack.push(state1);

		//sleep 1
		i++;
		stack.push(state2);

		//wakeUp 1 + dispose 2
		i++;
		stack.pop();

		//dispose 1
		i++;
		stack.pop();
	});

	test("change isTransparent and isModal attributes", function() {

		var stack = new Stack();
		var state1 = new State();
		var state2 = new State();
		state1.next = state2;
		var state3 = new State();
		state2.next = state3;
		var current = null;

		var check = function(event, _, emitter) {

			var id = emitter === state1 ? 1 : (emitter === state2 ? 2 : 3);

			ok(emitter === current ||
			   (event === 'update' && !emitter.next.isModal) ||
			   (event === 'draw' && emitter.next.isTransparent),
		       "call to " + event + " event from state " + id);
		};

		state1.on('draw', check).on('update', check);
		state2.on('draw', check).on('update', check);
		state3.on('draw', check).on('update', check);

		expect(13);

		stack.push(state1);
		stack.push(state2);
		current = state2;
		stack.update();     //state2
		stack.draw();       //state2

		state2.isTransparent = true;
		stack.update();     //state2
		stack.draw();       //state1 + state2

		state3.isTransparent = true;
		state3.isModal = false;
		stack.push(state3);
		current = state3;
		stack.update();     //state2 + state3
		stack.draw();       //state1 + state2 + state3

		state3.isTransparent = false;
		stack.update();     //state2 + state3
		stack.draw();       //state3
	});

	test("test link() method", function() {

		var stack = new Stack();
		var state1 = new State();
		var state2 = new State();

		function State3(val) {
			strictEqual(val, 7, 'check arg for State3');
		}
		State3.prototype = new State();
		function State4() {}
		State4.prototype = new State();

		var state3 = new State3(7);
		var id = 0;

		state1.on('update', function() {
			strictEqual(id, 1, 'Update from state 1');
		});
		state2.on('update', function() {
			strictEqual(id, 2, 'Update from state 2');
		});
		state3.on('update', function() {
			strictEqual(id, 3, 'Update from state 3');
		});

		stack.link(state1, function(arg) {
			strictEqual(arg, 27, 'pop() arg are transmited to link callback.');
			id = 2;
			return state2;
		});
		stack.link(state2, function(arg) {
			strictEqual(arg, 28, 'pop() arg are transmited to link callback.');
			id = 3;
			return state3;
		});
		stack.link(State3, function(arg) {
			strictEqual(arg, "pop3", "State3 instances use this link");
			return new State4();
		});
		stack.link(State4, State3);


		expect(8);

		stack.push(state1);
		stack.pop(27);// --> 2
		stack.update();
		stack.pop(28);// --> 3
		id = 3;
		stack.update();
		stack.pop("pop3");// --> 4
		ok(true, 'State4 are linked to new State3 !');
		stack.pop(7);// --> 3
	});

	test("test the shared zone with get() and set() methods", function() {
		var stack = new Stack();

		strictEqual(stack.get('key'), null, "default shared object are null.");
		stack.set("key", 77);
		strictEqual(stack.get('key'), 77, "object `key` are set to 77.");
		stack.set("key", 66);
		strictEqual(stack.get('key'), 66, "object `key` are now set to 77.");
		strictEqual(stack.get('bad_key'), null, "object `bad_key` don't exists.");
	});
});
