/**
 * @module Preload
 * @namespace Preload
 */

var TW = TW || {};
define(['../Utils/inherit', '../Event/EventProvider', '../Utils/Polyfills'], function(inherit, EventProvider) {

	TW.Preload = TW.Preload || {};

	/**
	 * TagLoader is a loader using HTML tags. It hides differences between each tags and keep one way
	 * to load all types of elements.
	 *
	 * For each request, yuo are assured than a `complete` or `error` event is called, only one time.
	 *
	 * The resulting tag is availlable even before the loading was done.
	 *
	 * TagLoader support many objects types:
	 *
	 *  - `"image"`
	 *  an `<img>` HTML tag is returned.
	 *  - `"sound"`
	 *  an `<audio>` HTML tag is created and returned.
	 *  - `"script"`
	 *  A HTML script element is returned, and can be added to the DOM.
	 *  **Note: Scripts are called automatically, before the complete event.
	 *  For loading the script whithout execute it, you should use
	 *  the {{#crossLink "Preload.XHRLoader"}}XHRLoader{{/crossLink}} class**
	 *  - `"css"`
	 *  A link tag is created and returned.
	 *  **Note: style tags are inserted automatically in the DOM, before the complete event.
	 *  For loading the script whithout insert it to the DOM, you should use
	 *  the {{#crossLink "Preload.XHRLoader"}}XHRLoader{{/crossLink}} class**
	 *
	 *
	 * @class TagLoader
	 * @param {String|String[]} path Url to the remote file.
	 *   You can pass many urls in an array. In this case, the first compatible url is used (useful for audio loading).
	 * @param {String} [type="text"] type of the ressource.
	 * @extends Event.EventProvider
	 * @constructor
	 */
	function TagLoader(path, type) {

		EventProvider.call(this);

		/**
		 * Determine if this loader has completed already.
		 * @property loaded
		 * @type Boolean
		 * @default false
		 */
		this.loaded = false;

		/**
		 * Type given to constructor.
		 *
		 * @property {String} type
		 */
		this.type = type;

		/**
		 * URL of the ressource
		 *
		 * @property {String|String[]} _path
		 * @private
		 */
		this._path = path;

		var tag;
		switch(type) {
			case 'image':
				tag = document.createElement('img');
				break;
			case 'svg':
				tag = document.createElement('TODO');//TODO: implémenter le bon format !!!
				break;
			case 'sound':
				tag = document.createElement('audio');
				tag.preload = 'auto';
				break;
			case 'css':
				tag = document.createElement('link');
				tag.rel = "stylesheet";
				tag.type = "text/css";
				break;
			case 'script':
				tag = document.createElement('script');
				tag.type = 'text/javascript';
				break;

			default:
				throw "Type not supported: " + type;
		}

		/**
		 * HTML tag
		 *
		 * @property {HTMLElement} _tag
		 * @private
		 */
		this._tag = tag;

		/**
		 * Event called when the loading is fully done.
		 *
		 * @event complete
		 * @param {HTMLElement} result the HTMLElement object resulting
		 */

		/**
		 * Event called when an error occurs.
		 * The download is stopped after error.
		 *
		 * @event error
		 * @param {*} error object describling the error. It's generally an Error or an Event object.
		 */
	}

	inherit(TagLoader, EventProvider);


	/**
	 * Start the laoding of the ressource.
	 * @method load
	 */
	TagLoader.prototype.load = function() {
		this._tag.onload = function() {
			this.loaded = true;
			this.emit('complete', this._tag);
		}.bind(this);

		this._tag.onerror = this.emit.bind(this, 'error');

		switch (this.type) {
			case "css":
				this._tag.href = this._path instanceof Array ? this._path[0] : this._path;
				break;
			case "sound":
				this._tag.addEventListener('canplaythrough', function() {
					this.loaded = true;
					this.emit('complete', this._tag);
				}.bind(this));

				if (this._path instanceof Array) {
					for (var i = 0; i < this._path.length; i++) {
						var source = document.createElement('source');
						source.src = this._path[i];
						this._tag.appendChild(source);
					}
				} else {
					this._tag.src = this._path;
				}
				this._tag.load();
				break;
			default:
				this._tag.src = this._path;
		}

		if (this.type === "css" || this.type === "script" || this.type === "audio") {
			document.head.appendChild(this._tag);
		}
	};

	/**
	 * Return the tag corresponding to the ressource.
	 * Note that the tag can be used before the ressource was fully loaded.
	 * Images will be displayed automatically when the loading is completed.
	 *
	 * @method getResult
	 * @return {HTMLElement}
	 */
	TagLoader.prototype.getResult = function() {
		return this._tag;
	};

	TW.Preload.TagLoader = TagLoader;
	return TagLoader;
});
