
define(['TW/Event/DeviceInput', 'TW/Event/InputMapper'], function(DeviceInput, InputMapper) {

	module("InputMapper");

	test("bind event", function() {
		var mapper = new InputMapper();
		var input = new DeviceInput();
		input.states = ['1', '2', '3', 'A'];

		mapper.addEvent('A');
		mapper.addEvent('B');
		mapper.addEvent('C');

		mapper.bindEvent('A', '1', input);
		mapper.bindEvent('B', '2', input);

		mapper.any(function(event, data) {
			equal(event, data);
		});

		expect(2);

		input.emit('1', 'A');
		input.emit('2', 'B');
		input.emit('3', 'C');
		input.emit('A', 'bad trigger');
	});

	test("rm bind event", function() {
		var mapper = new InputMapper();
		var input = new DeviceInput();
		input.states = ['1', '2', '3'];

		mapper.addEvent('A');
		mapper.addEvent('B');
		mapper.addEvent('C');
		mapper.addEvent('D');

		mapper.bindEvent('A', '1', input);
		mapper.bindEvent('B', '2', input);

		mapper.any(function(event, data) {
			equal(event, data);
		});

		expect(2);

		mapper.rmEvent('A');
		input.emit('1', 'A');
		input.emit('2', 'B');
		mapper.rmEvent('B');
		mapper.rmEvent('D');
		input.emit('2', 'B');

		deepEqual(mapper.states, ['C']);
	});

	test("getRealEvent()", function() {
		var mapper = new InputMapper();
		var input = new DeviceInput();
		input.states = ['1', '2', '3', 'A'];

		mapper.addEvent('A');
		mapper.addEvent('B');
		mapper.addEvent('C');
		mapper.addEvent('D');

		equal(mapper.getRealEvent('A'), null);
		equal(mapper.getRealEvent('B'), null);
		equal(mapper.getRealEvent('X'), null);

		mapper.bindEvent('A', '1', input);
		mapper.bindEvent('B', 'A', input);

		equal(mapper.getRealEvent('A'), '1');
		equal(mapper.getRealEvent('B'), 'A');
		equal(mapper.getRealEvent('X'), null);

		mapper.rmEvent('B');
		equal(mapper.getRealEvent('A'), '1');
		equal(mapper.getRealEvent('B'), null);
		equal(mapper.getRealEvent('X'), null);
	});

	test("getNoMappedEvents()", function() {
		var mapper = new InputMapper();
		var input = new DeviceInput();
		input.states = ['1', '2', '3', 'A'];

		deepEqual(mapper.getNoMappedEvents(), [], "there are not yet event to bind.");

		mapper.addEvent('A');
		mapper.addEvent('B');
		mapper.addEvent('C');
		mapper.addEvent('D');

		deepEqual(mapper.getNoMappedEvents(), ['A', 'B', 'C', 'D'], "all events are not mapped.");

		mapper.bindEvent('A', '1', input);
		mapper.bindEvent('B', 'A', input);

		deepEqual(mapper.getNoMappedEvents(), ['C', 'D']);
		mapper.rmEvent('A');
		mapper.rmEvent('D');
		deepEqual(mapper.getNoMappedEvents(), ['C']);

	});

	test("getConflicts()", function() {
		var mapper = new InputMapper();
		var input = new DeviceInput();
		input.states = ['1', '2', '3'];

		mapper.addEvent('A');
		mapper.addEvent('B');
		mapper.addEvent('C');
		mapper.addEvent('D');

		deepEqual(mapper.getConflicts(), [], "no conflict when event are not yet bound.");

		mapper.bindEvent('A', '1', input);
		mapper.bindEvent('B', '3', input);

		deepEqual(mapper.getConflicts(), [], "two events bounds, still no conflict");

		mapper.bindEvent('A', '2', input);
		mapper.bindEvent('C', '3', input);

		deepEqual(mapper.getConflicts(), [{
                inputEvent: '3',
		        outputEvent: ['B', 'C'],
				inputProvider: input
            }], "conflict: expected 1 -> A and A -> C");
	});

	test("use of allowMultiInput", function() {
		var mapper = new InputMapper();
		var input = new DeviceInput();
		input.states = ['1', '2', '3', '4'];

		expect(4);
		equal(mapper.allowMultiInput, false, "allowMultiInput set to false by default");

		mapper.bindEvent('A', '1', input);
		mapper.bindEvent('A', '2', input);

		mapper.on('A', function(event, data) {
			equal(data, '2', "the second bindEvent should override the first one.");
		});

		input.emit('1', '1');
		input.emit('2', '2');

		mapper.allowMultiInput = true;

		mapper.bindEvent('B', '3', input);
		mapper.bindEvent('B', '4', input);

		mapper.on('B', function() {
			ok(true, "allowMultiInput = true: this assert should be called twice.");
		});

		input.emit('3');
		input.emit('4');

	});
});
