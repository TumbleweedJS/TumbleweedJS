window.onload = function() {
	var canvas = document.getElementById("my_canvas");
	var context = canvas.getContext("2d");
	var my_hudTester = new HUDTester(context);
	
	document.getElementById("HUD_validate").onclick = function (evt) {
	my_hudTester.addElementToHUD();
	};
	window.onkeydown = function (evt) { 
	my_hudTester.getKeyDown(evt); 
	};
	my_hudTester.draw(context);
};