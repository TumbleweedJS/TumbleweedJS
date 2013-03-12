window.onload = function() {

	var canvas = document.getElementById("eventCanvas");

	var mouseEvents = new TW.Event.MouseInput(canvas);
	var keyboardEvents = new TW.Event.KeyboardInput();

	var inputMapper = new TW.Event.InputMapper();

	var window = new TW.Graphic.Window(canvas);
	var rect = new TW.Graphic.Rect();

	rect.setFillColor('#000000');

	rect.x = 200;
	rect.y = 50;
	rect.width = 100;
	rect.height = 100;

	window.addChild(rect);
	window.draw();

	mouseEvents.contextMenuActive = false;

	mouseEvents.addListener("MOUSE_MOVE", function(event, new_value, object) {
		rect.setPosition(new_value.x - rect.width / 2, new_value.y - rect.height / 2);
		window.draw();
	});

	keyboardEvents.addListener("KEY_UP", TW.Event.KeyboardInput.KEY_PRESSED, function(event, new_value, object) {
		rect.width += 20;
		rect.height += 20;
		window.draw();
	});

	keyboardEvents.addListener("KEY_DOWN", TW.Event.KeyboardInput.KEY_PRESSED, function(event, new_value, object) {
		rect.width = (rect.width > 20) ? rect.width - 20 : 20;
		rect.height = (rect.height > 20) ? rect.height - 20 : 20;
		window.draw();
	});

	keyboardEvents.addListener("KEY_LEFT", TW.Event.KeyboardInput.KEY_PRESSED, function(event, new_value, object) {
		rect.rotate(10);
		window.draw();
	});

	keyboardEvents.addListener("KEY_RIGHT", TW.Event.KeyboardInput.KEY_PRESSED, function(event, new_value, object) {
		rect.rotate(-10);
		window.draw();
	});

	var list = document.getElementById('list');

	inputMapper.addEvent("RED");
	inputMapper.addEvent("GREEN");
	inputMapper.addEvent("BLUE");

	inputMapper.bindEvent("RED", "KEY_R", keyboardEvents);
	inputMapper.bindEvent("GREEN", "KEY_G", keyboardEvents);
	inputMapper.bindEvent("BLUE", "KEY_B", keyboardEvents);


	inputMapper.addListener("RED", TW.Event.KeyboardInput.KEY_PRESSED, function(event, new_value, object) {
		rect.setFillColor('#FF0000');
	});
	inputMapper.addListener("GREEN", TW.Event.KeyboardInput.KEY_PRESSED, function(event, new_value, object) {
		rect.setFillColor('#00FF00');
	});
	inputMapper.addListener("BLUE", TW.Event.KeyboardInput.KEY_PRESSED, function(event, new_value, object) {
		rect.setFillColor('#0000FF');
	});

	list.rows[0].onclick = function() {
		list.rows[0].cells[0].innerHTML = "?";

		inputMapper.bindListen("RED", keyboardEvents, function(event) {
			list.rows[0].cells[0].innerHTML = event;
		});
	};
	list.rows[1].onclick = function() {
		list.rows[1].cells[0].innerHTML = "?";

		inputMapper.bindListen("GREEN", keyboardEvents, function(event) {
			list.rows[1].cells[0].innerHTML = event;
		});
	};
	list.rows[2].onclick = function() {
		list.rows[2].cells[0].innerHTML = "?";

		inputMapper.bindListen("BLUE", keyboardEvents, function(event) {
			list.rows[2].cells[0].innerHTML = event;
		});
	};
};
