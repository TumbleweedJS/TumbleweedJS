/**
 * This module contain all classes relating to time management and
 * scheduling actions by object or group objects.
 *
 * The {{#crossLink "GameLogic.Gameloop"}}{{/crossLink}} class is the first brick for make a new game,
 * Playing and pausing the game easily.
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

