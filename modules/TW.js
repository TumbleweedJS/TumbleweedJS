
var TW = TW || {};

if (typeof window.define === "function" && window.define.amd) {

	define(['collision',
	        'event',
	        'gameloop',
	        'graphic',
	        'math',
	        'preload',
	        'audio',
	        'utils'
		   ], function(a) {
			   return TW;
		   });
}
