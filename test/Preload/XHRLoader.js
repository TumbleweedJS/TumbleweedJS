
define(['TW/Preload/XHRLoader'], function(XHRLoader) {

	module("XHRLoader");

	test("Simple text file get", function() {
		var loader = new XHRLoader("file.txt");
		ok(true, 'XHR created');
		stop();

		loader.on('error', function() {
			ok(false, 'error event');
			start();
		});

		loader.on('complete', function(_, result) {

			equal(result, loader.getResult(), "result is passed in argument.");
			equal(loader.getResult(), "This is a file.", "content file is correct.");
			equal(loader.loaded, true, "loader.loaded should be true");

			start();
		});

		loader.load();
	});

	test("get a 404 file", function() {
		var loader = new XHRLoader("fileNotFound.txt");
		ok(true, 'XHR created');
		stop();

		loader.on('error', function() {
			ok(true, 'error', "404 Error expected");
			equal(loader.loaded, false, "loader.loaded should be false");
			start();
		});

		loader.on('complete', function() {
			ok(false, 'complete event');
			start();
		});

		loader.load();
	});

	test("get a XML file", function() {
		var loader = new XHRLoader("file.xml", "xml");
		ok(true, 'XHR created');
		stop();

		loader.on('error', function() {
			ok(false, 'error event');
			start();
		});

		loader.on('complete', function(_, result) {
			ok(true, 'complete event');

			equal(result.nodeName, '#document', "the result is a XML Document object.");

			var xml = result.getElementsByTagName('xml');

			ok(xml[0].childNodes.item(0).nodeValue === "content", "result is valid.");
			equal(loader.loaded, true, "loader.loaded should be true");
			start();
		});

		loader.load();
	});

	test("get a script", function() {
		var loader = new XHRLoader("script.js", "script");
		stop();
		expect(2);

		loader.on('error', function() {
			ok(false, 'error event');
			start();
		});

		loader.on('complete', function(_, result) {
			ok(true, 'complete event');

			document.body.appendChild(result);
			start();
		});

		loader.load();
	});

	test("get a HTML file", function() {
		var loader = new XHRLoader("file.html", "html");
		stop();

		loader.on('error', function() {
			ok(false, 'error event');
			start();
		});

		loader.on('complete', function(_, result) {
			ok(true, 'complete event');
			var fixture = document.getElementById('qunit-fixture');
			fixture.appendChild(result);
			equal(document.getElementById('myDiv').id, 'myDiv', "#myDiv is added to the DOM");
			start();
		});

		loader.load();
	});

	test("check order of events", function() {
		var loader  = new XHRLoader("file.html", "html");
		stop();

		loader.on('error', function() {
			ok(false, 'error event');
			start();
		});

		var isLoaded = false;
		loader.on('complete', function(_, result) {
			isLoaded = true;
			ok(true, 'complete event');
			start();
		});

		loader.on('progress', function() {
			ok(!isLoaded, 'progress event should be emited before complete event');
		});

		loader.load();
	});

});
