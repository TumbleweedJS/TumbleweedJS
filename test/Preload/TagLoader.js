
define(['TW/Preload/TagLoader'], function(TagLoader) {

	module("TagLoader");

	test("get a 404 file", function() {
		var loader = new TagLoader("fileNotFound.jpg", "image");
		ok(true, 'TagLoader created');
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

	test("get a script", function() {
		var loader = new TagLoader("script.js", "script");
		stop();
		expect(2);

		loader.on('error', function() {
			ok(false, 'error event');
			start();
		});

		loader.on('complete', function() {
			ok(true, 'complete event. Script is already loaded.');
			start();
		});

		loader.load();
	});

	test("get an image file", function() {
		var loader = new TagLoader("blank.png", "image");
		stop();
		expect(2);

		loader.on('error', function() {
			ok(false, 'error event');
			start();
		});

		loader.on('complete', function(_, result) {
			ok(true, 'complete event');

			equal(result.width, 4, 'check image is OK');
			document.body.appendChild(result);
			start();
		});

		loader.load();
	});


	/*
	This test don't pass with PhantomJS ... and i don't know why :(

	test("get a CSS file", function() {
		var loader = new TagLoader("style.css", "css");
		stop();

		loader.on('error', function() {
			ok(false, 'error event');
			start();
		});

		loader.on('complete', function() {
			ok(true, 'complete event');
			start();
		});

		loader.load();
	});
	*/
});
