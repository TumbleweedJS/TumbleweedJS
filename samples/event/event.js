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

	mouseEvents.contextMenuActive = false;

	inputMapper.addEvent("ATTACK");

	inputMapper.addEvent("MOVE_UP");
	inputMapper.addEvent("MOVE_DOWN");
	inputMapper.addEvent("MOVE_LEFT");
	inputMapper.addEvent("MOVE_RIGHT");

	inputMapper.bindEvent("MOVE_UP", "KEY_Z", keyboardEvents);

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
};
