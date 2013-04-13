
define(['TW/Event/EventProvider'], function(EventProvider) {

	module("EventProvider");

	test("basic on/emit case", function() {
		var p = new EventProvider();

		p.on('event1', function(event) {
			equal(event, 'event1');
		});

		p.on('event2', function(event) {
			equal(event, 'event2');
		});

		p.any(function() {
			ok(true);
		});

		expect(5);

		p.emit('event1');
		p.emit('event2');
		p.emit('event3');
	});

	test("once test", function() {
		var p = new EventProvider();

		p.once('test1', function(event) {
			equal(event, 'test1', "p.once(): should be called only once");
		});

		p.once(null, function() {
			ok(true, "p.once(): should be called only once");
		});

		expect(2);

		p.emit('test1');
		p.emit('test2');
		p.emit('test1');

	});

	test("args callback test", function() {
		var p = new EventProvider();
		var dataTest = {
			test: 3
		};

		p.on('test1', function(event, data, provider) {
			strictEqual(p, provider);
			strictEqual(p, data);
		});

		p.once('test2', function(event, data, provider) {
			strictEqual(p, provider);
			strictEqual(data, dataTest);
		});

		p.any(function(event, data, provider) {
			strictEqual(p, provider);
			if (event === 'test3') {
				equal(data, null);
			}
		});

		expect(8);

		p.emit('test2', dataTest);
		p.emit('test1', p);
		p.emit('test3');

	});

	test("remove Callback", function() {
		var p = new EventProvider();
		var f = function() {
			ok(true, "should be called 3 times");
		};

		p.on('test1', f)
		 .on('test1', f)
		 .on('test1', f)
		 .once('test2', f);

		p.off('test1', f);

		expect(3);

		p.emit('test1')
		 .emit('test2');

		p.removeAll();

		p.emit('test1')
		 .emit('test2');
	});

	test("predicate", function() {
		var p = new EventProvider();

		p.on('test', function(event, data) {
			equal(data, 40, "called only when data === 40");
		}, function(event, data) {
			return data === 40;
		});

		expect(1);

		p.emit('test');
		p.emit('test', 35);
		p.emit('test', 40);
		p.emit('test', "40");
	});

});
