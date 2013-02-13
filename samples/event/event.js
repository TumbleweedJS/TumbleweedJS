window.onload = function() {

	var mouseEvents = new TW.Event.MouseInput();

	var window = new TW.Graphic.Window(document.getElementById("eventCanvas"));
	var rect = new TW.Graphic.Rect({zIndex: 1});

	rect.setFillColor('#00FF00');

	rect.x = 200;
	rect.y = 50;
	rect.width = 10;
	rect.height = 10;

	window.addChild(rect);
	window.draw();

	mouseEvents.contextMenuActive = false;

	mouseEvents.addListener("MOUSE_MOVE", function(event, new_value, object) {
		rect.setPosition(new_value.x, new_value.y);
		rect.draw();
		console.log(new_value);
	});

	var list = document.getElementById('list');

	list.rows[0].onclick = function() {
		alert(this.rowIndex);
	};

};
