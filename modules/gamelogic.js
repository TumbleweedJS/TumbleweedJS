/**
 * This module contain all classes relating to time management and
 * scheduling actions by object or group objects.
 *
 * The {{#crossLink "GameLogic.Gameloop"}}Gameloop{{/crossLink}} class is the first brick for make a new game,
 * Playing and pausing the game easily.
 *
 * FOr more advanced usage, the {{#crossLink "GameLogic.GameState"}}GameState{{/crossLink}} and
 * {{#crossLink "GameLogic.GameStateStack"}}GameStateStack{{/crossLink}} classes provides an useful implementation
 * of the pattern GameState.
 *
 * @module GameLogic
 * @main
 */


var TW = TW || {};

define([
	       './gamelogic/Gameloop',
	       './gamelogic/GameStateStack',
	       './gamelogic/GameState'
       ], function() {
	return TW.Gameloop;
});

