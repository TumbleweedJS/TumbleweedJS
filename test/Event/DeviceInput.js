
define(['TW/Event/DeviceInput'], function(DeviceInput) {

	module("DeviceInput");

	test("synchro state values", function() {
		var device = new DeviceInput();
		device.states = [
			"state1"
		];

		device.on('state1', function(event, data) {
			deepEqual(device.get(event), data);
		});

		expect(8);

		device.emit('state1', true);
		strictEqual(device.get('state1'), true);
		device.emit('state1', 4);
		strictEqual(device.get('state1'), 4);
		device.emit('state1', false);
		strictEqual(device.get('state1'), false);
		device.emit('state1', null);
		strictEqual(device.get('state1'), null);
	});

	test("enable and disable simple test", function() {
		var device = new DeviceInput();
		device.states = [
			"state1"
		];

		device.on('state1', function(event, data) {
			deepEqual(device.get(event), data);
		});

		device.any(function(event, data) {
			deepEqual(device.get(event), data);
		});

		expect(8);

		strictEqual(device.enabled, true);
		device.emit('state1', 2);
		strictEqual(device.get('state1'), 2);
		device.enable(false);
		device.emit('state1', 5);
		strictEqual(device.get('state1'), 2);
		device.emit('state1', 2);
		device.enable(true);
		device.emit('state1', 5);
		strictEqual(device.get('state1'), 5);

	});

	test("correcting events with enable/disable.", function() {
		var device = new DeviceInput();
		device.states = [
			"state1"
		];

		device.on('state1', function(eevnt, data) {
			ok(data === "OK 1" || data  === "OK 2" || data === "OK 3");
		});

		expect(3);
		device.emit('state1', "OK 1");
		device.enable(false);
		device.emit('state1', "Not OK");
		//should not be called because disabled.
		device.emit('state1', "OK 1");
		device.enable(true);
		device.emit('state1', "OK 2");
		device.enable(false);
		device.emit('state1', "OK 3");
		device.enable(true);
	});
});
