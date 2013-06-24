
define(['TW/Preload/Loader'], function(Loader) {

	module("Loader");

	test("load 2 files and get() access", function() {
		var loader = new Loader();
		expect(6);
		stop();

		loader.loadFile("file.txt");
		loader.loadFile({ src: "file.xml", type: "xml" });

		loader.on('error', function() {
			ok(false, 'error event');
			start();
		});
		loader.on('fileComplete', function() {
			ok(true, 'file complete event');
		});
		loader.on('complete', function() {
			ok(true, "complete event");
			start();

			equal(loader.get('file.txt'), 'This is a file.', 'check get() txt file');
			notEqual(loader.get('file.xml').getElementsByTagName('xml'), null, 'check get() xml file');
			equal(loader.get('file.html'), null, 'get() file not loaded');
		});


		loader.start();
	});

	test("load many files with id", function() {
		var loader = new Loader();
		expect(12);
		stop();


		/*
		on doit passer:
		 - id
		 - src
		 - type
		 - group
		 */
		loader.loadFile("file.txt");
		loader.loadManyFiles([{id: 'test', src: "file.xml" , type: "xml"},
		                     {id: 'test2', src: "file.xml", type: "xml"}]);

		loader.on('error', function() {
			ok(false, 'error event');
		});

		loader.on('fileComplete', function(_, data) {
			switch(data.id) {
				case 'test':
				case 'test2':
					equal(data.src, 'file.xml', "check data.src on fileComplete event");
					equal(data.type, 'xml', "check data.type on fileComplete event");
					strictEqual(data.result, loader.get(data.id), 'get() is the same as data.result');
					break;
				case 'file.txt':
					equal(data.src, data.id, "id should be src by default");
					equal(data.type, 'text', "type text by default");
					break;
				default:
					ok(false, "fileComplete event: unknow file.");
			}
		});

		loader.on('complete', function() {
			start();
			ok(true, "complete event");

			equal(loader.get('file.txt'), 'This is a file.', 'check get() txt file');
			notEqual(loader.get('test').getElementsByTagName('xml'), null, 'check get() xml file with test id');
			equal(loader.get('file.xml'), null, 'get() file.xml should not return the file.');
		});


		loader.start();
	});

	test("check all event during a loading", function() {
		var loader = new Loader();
		stop();

		loader.loadFile("file.txt");

		loader.on('error', function() {
			ok(false, 'error event');
		});

		var order = 1;
		var fileOrder = 1;

		loader.on('start', function() {
			equal(order, 1, "first event should be start");
			order++;
		});

		loader.on('progress', function() {
			equal(order, 2, "progress should be emited between start event and complete event");
		});

		loader.on('complete', function() {
			equal(order, 2, "complete event should be emited after a start event");
			equal(fileOrder, 3, "all fileXXX events should be emited before the complete event");
			order++;
			start();
		});


		loader.on('fileStart', function(_, data) {
			equal(fileOrder, 1, "first file event should be fileStart");
			fileOrder++;
		});

		loader.on('fileProgress', function(_, data) {
			equal(order, 2, "fileProgress should be emited between fileStart event and fileComplete event");
			notEqual(data.progress, null, "we have access to progress status");
		});

		loader.on('fileComplete', function(_, data) {
			equal(order, 2, "fileComplete event should be emited after a fileStart event");
			notEqual(data.result, null, "result is defined");
			fileOrder++;
		});

		loader.start();
	});

	test("progress event with many files", function() {
		var loader = new Loader();
		expect(2);
		stop();

		//With only one connexion, all files should be loaded separately.
		loader.maxConnexions = 1;
		loader.loadManyFiles([{id: 'test', src: "file.xml" , type: "xml"},
		                      {id: '2', src: "blank.png", type: "image"},
		                      {src: "file.xml", type: "xml"}]);

		loader.on('error', function() {
			ok(false, 'error event');
		});

		var fileLoaded = 0;
		var last = 0;
		loader.on('fileComplete', function(_, data) {
			fileLoaded++;
		});

		loader.on('progress', function(_, progress) {
			if (last === fileLoaded) {
				return;
			}
			if (fileLoaded === 1) {
				equal(progress, 33, "progress should be at 33% when 1 of 3 files are loaded.");
			}
			if (fileLoaded === 2) {
				equal(progress, 66, "progress should be at 66% when 2 of 3 files are loaded.");
			}
			last = fileLoaded;
		});

		loader.on('complete', function() {
			start();
		});

		loader.start();
	});

	test("load some bad files", function() {

		var loader = new Loader();
		expect(6);
		stop();

		loader.loadManyFiles([{id: 'realFile', src: "file.xml" , type: "xml"},
		                      {id: 'badFile', src: "badURL.xml"},
		                      {src: "file.xml", type: "xml"}]);


		loader.on('error', function(error) {
			notEqual(error, null, "error event should receive the error.");
		});

		loader.on('fileComplete', function(_, item) {
			notEqual(item.id, 'badFile', 'the 2 files other than "badFile" should load.');
		});
		loader.on('fileError', function(_, item) {
			equal(item.id, 'badFile', 'an error should be emited for the file "badFile"');
			notEqual(item.error, null, "error is defined");
		});

		loader.on('complete', function() {
			ok(true, "Loading is over.");
			start();
		});
		loader.start();
	});

	test("test with group feature", function() {
		var loader = new Loader();
		expect(8);
		stop();

		loader.loadManyFiles([{ id: 'file1', src: "file.xml" , type: "xml"},
		                      { id: 'file2', src: "file.txt"},
		                      { id: 'file3', src: "file.xml", type: "xml"}], 'groupA');
		loader.loadManyFiles([{ id: 'file4', src: "file.xml" , type: "xml"},
		                      { id: 'file5', src: "file.txt"},
		                      { id: 'file6', src: "file.xml", type: "xml"}],
		                     'groupB');
		loader.loadFile('file.html', 'groupA');

		notEqual(loader.getGroup('groupA'), null, 'getGroup can return group A');
		equal(loader.getGroup('groupC'), null, 'getGroup can\'t return group C wich doesn\'t exist');

		loader.on('error', function() {
			ok(false, 'error event');
		});

		loader.on('groupComplete', function(_, group) {
			equal(group.nbFileLoaded, group.items.length, "nbFileLoaded on group is equal to the number of items");
		});

		loader.on('complete', function() {
			var groupA = loader.getGroup('groupA');
			var groupB = loader.getGroup('groupB');

			equal(groupA.items.length, 4, 'groupA has 4 items');
			equal(groupB.items.length, 3, 'groupB has 3 items');

			equal(groupA.status, "completed", "groupA is completed");
			equal(groupB.status, "completed", "groupB is completed");
			start();
		});
		loader.start();
	});

	test("progress events with 2 groups", function() {
		var loader = new Loader();
		expect(7);
		stop();

		loader.maxConnexions = 1;
		loader.loadManyFiles([{ id: 'file1', src: "file.xml" , type: "xml"},
		                      { id: 'file2', src: "file.txt"}], 'groupA');
		loader.loadManyFiles([{ id: 'file3', src: "file.xml" , type: "xml"},
		                      { id: 'file4', src: "file.txt"}],
		                     'groupB');
		loader.on('error', function() {
			ok(false, 'error event');
		});


		var filesCompleted = 0;
		var lastEvent = 0;
		loader.on('fileComplete', function(_, i) {
			filesCompleted++;
		});

		loader.on('groupProgress', function(_, group) {
			if (filesCompleted === lastEvent) {
				return;
			}
			if (filesCompleted === 1) {
				equal(group.name, 'groupA', 'first file loaded: group A is updated');
				ok(group.progress >= 50, 'group A should be 50% loaded (or more)');
			}
			if (filesCompleted === 3) {
				equal(group.name, 'groupB', '3 files loaded: group B is updated');
				ok(group.progress >= 50, 'group B should be 50% loaded (or more)');
				equal(group.status, "started", 'group B status is "started"');
				equal(loader.getGroup('groupA').progress, 100, 'At this moment, groupA is 100% loaded.');
			}
			lastEvent = filesCompleted;
		});

		loader.on('groupComplete', function(_, group) {
			if (group.name === "groupA") {
				equal(filesCompleted, 2, 'first group is completed with 2 files loaded');
			}
		});

		loader.on('complete', function() {
			start();
		});
		loader.start();
	});

});
