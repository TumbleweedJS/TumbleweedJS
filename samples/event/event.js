/**
 * Created with JetBrains WebStorm.
 * User: Olousouzian
 * Date: 6/11/12
 * Time: 10:06 AM
 * To change this template use File | Settings | File Templates.
 */

window.onload = function() {

	var mouseEvents = new TW.Event.MouseInput();

	var keyboardEvents = new TW.Event.KeyboardInput();

	var inputMapper = new TW.Event.InputMapper();

	var eventCombination = new TW.Event.EventCombination(keyboardEvents);

	mouseEvents.contextMenuActive = false;

	eventCombination.addCombination("ATTACK_COMBO", ["KEY_A", "KEY_Z", "KEY_E"]);
	eventCombination.addCombination("ATTACK_COMBO2", ["KEY_S", "KEY_Z"]);

	eventCombination.addListener("ATTACK_COMBO", [{event:"KEY_A", value:true}, {event:"KEY_Z", value:true}, {event:"KEY_E", value:true}], function(event, new_value, object) {
		console.log("ATTACK_COMBO");
		console.log("");
	});

	eventCombination.addListener("ATTACK_COMBO2", [{event:"KEY_S", value:true}, {event:"KEY_Z", value:true}], function(event, new_value, object) {
		console.log("ATTACK_COMBO2");
		console.log("");
	});
/*
	mouseEvents.addListener("MOUSE_MOVE", function(event, new_value, object) {
		console.log(new_value);
	});

	mouseEvents.addListener("MOUSE_MOVE", {x: 500, y: 500}, function(event, new_value, object) {
		console.log("Ca marche !");
	});
*/
	/*
	inputMapper.addEvent("ATTACK");

	inputMapper.addEvent("MOVE_UP");
	inputMapper.addEvent("MOVE_DOWN");
	inputMapper.addEvent("MOVE_LEFT");
	inputMapper.addEvent("MOVE_RIGHT");

	inputMapper.bindEvent("MOVE_UP", "KEY_Z", keyboardEvents);

	mouseEvents.addListener("MOUSE_BUTTON_RIGHT", TW.Event.MouseInput.BUTTON_PRESSED, function(event, new_value, object) {
		alert("Ca marche !");
	});

	keyboardEvents.addListener("KEY_B", function(event, new_value, object) {
		inputMapper.bindListen("ATTACK", mouseEvents);
	});
	keyboardEvents.addListener("KEY_C", function(event, new_value, object) {
		inputMapper.stopBindListen();
	});

	inputMapper.addListener(
		function(event, new_value, object) {
			console.log(event);
			console.log(new_value);
			console.log("");
		});

	console.log(inputMapper.getRealEvent("ATTACK"));
	console.log(inputMapper.getNoMappedEvents());
	*/


};
