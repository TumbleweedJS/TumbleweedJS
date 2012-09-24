/**
 @module Preload
 @namespace Preload
 */

var TW = TW || {};
TW.Preload = TW.Preload || {};

/**
 By default, JavaScript methods do not maintain scope, so passing a method as a callback will result in the
 method getting called in the scope of the caller. Using a proxy ensures that the method gets called in the
 correct scope. All internal callbacks use this approach.

 @property proxy
 @type function
 **/
proxy = function(method, scope) {
	return function() {
		return method.apply(scope, arguments);
	};
};

/**
 * The preload type for image files, usually png, gif, or jpg/jpeg
 * @property IMAGE
 * @type String
 * @default image
 * @static
 */
TW.Preload.IMAGE = "image";

/* The preload type for SVG files.
 * @property SVG
 * @type String
 * @default svg
 * @static
 */
TW.Preload.SVG = "svg";

/**
 * The preload type for sound files, usually mp3, ogg, or wav.
 * @property SOUND
 * @type String
 * @default sound
 * @static
 */
TW.Preload.SOUND = "sound";

/**
 * The preload type for json files, usually with the "json" file extension.
 * @property JSON
 * @type String
 * @default json
 * @static
 */
TW.Preload.JSON = "json";

/**
 * The preload type for css files.
 * @property CSS
 * @type String
 * @default css
 * @static
 */
TW.Preload.CSS = "css";

/**
 * The preload type for xml files.
 * @property XML
 * @type String
 * @default xml
 * @static
 */
TW.Preload.XML = "xml";

/**
 * The preload type for text files, which is also the default file type if the type can not be determined.
 * @property TEXT
 * @type String
 * @default text
 * @static
 */
TW.Preload.TEXT = "text";

/**
 * Time in millseconds to assume a load has failed.
 * @property TIMEOUT_TIME
 * @type Number
 * @default 8000
 * @static
 */
TW.Preload.TIMEOUT_TIME = 8000;

TW.Preload.Preload = function() {
	/**
	 Preload class is object utility for preload different file format.

	 @class Preload
	 @constructor
	 @param {String} src The source of channel separated with '|' for multi-format.
	 */
	function Preload() {

		/**
		 * The next preload queue to process when this one is complete.
		 * @property next
		 * @type Preload
		 * @default null
		 */
		this.next = null;

		//Protected properties
		this.typeHandlers = null;
		this.extensionHandlers = null;

		this._maxConnections = 1;

		this._numItems = 0;
		this._numItemsLoaded = 0;
		this._targetProgress = 0;
		this._paused = false;
		this._currentLoads = [];
		this._loadQueue = [];
		this._loadedItemsById = {};
		this._loadedItemsBySrc = {};
		this.typeHandlers = {};
		this.extensionHandlers = {};
		this._loadStartWasDispatched = false;

		/**
		 * Determine if this loader has completed already.
		 * @property loaded
		 * @type Boolean
		 * @default false
		 */
		this.loaded = false;

		/**
		 * The current load progress (percentage) for this item.
		 * @property progress
		 * @type Number
		 * @default 0
		 */
		this.progress = 0;

		//Callbacks
		/**
		 * The callback to fire when progress changes.
		 * @event onProgress
		 */
		this.onProgress = null;

		/**
		 * The callback to fire when a load starts.
		 * @event onLoadStart
		 */
		this.onLoadStart = null;

		/**
		 * The callback to fire when a file completes.
		 * @event onFileLoad
		 */
		this.onFileLoad = null;

		/**
		 * The callback to fire when a file progress changes.
		 * @event onFileProgress
		 */
		this.onFileProgress = null;

		/**
		 * The callback to fire when all loading is complete.
		 * @event onComplete
		 */
		this.onComplete = null;

		/**
		 * The callback to fire when the loader encounters an error. If the error was encountered
		 * by a file, the event will contain the required file data, but the target will be the loader.
		 * @event onError
		 */
		this.onError = null;
	}

	//Callback proxies
	Preload.prototype._sendLoadStart = function(value) {
		if (this.onLoadStart) {
			this.onLoadStart({target: this});
		}
	};

	Preload.prototype._sendProgress = function(value) {
		var event;
		if (value instanceof Number) {
			this.progress = value;
			event = {loaded: this.progress, total: 1};
		} else {
			event = value;
			this.progress = value.loaded / value.total;
			if (isNaN(this.progress) || this.progress == Infinity) {
				this.progress = 0;
			}
		}
		event.target = this;
		if (this.onProgress) {
			this.onProgress(event);
		}
	};

	Preload.prototype._sendFileProgress = function(event) {
		if (this.onFileProgress) {
			event.target = this;
			this.onFileProgress(event);
		}
	};

	Preload.prototype._sendComplete = function() {
		if (this.onComplete) {
			this.onComplete({target: this});
		}
	};

	Preload.prototype._sendFileComplete = function(event) {
		if (this.onFileLoad) {
			event.target = this;
			this.onFileLoad(event);
		}
	};

	Preload.prototype._sendError = function(event) {
		if (this.onError) {
			if (event == null) {
				event = {};
			}
			event.target = this;
			this.onError(event);
		}
	};

	/**
	 * Set the maximum number of concurrent connections.
	 * @method setMaxConnections
	 * @param {Number} value The number of concurrent loads to allow. By default, only a single connection is open at any time.
	 * Note that browsers and servers may have a built-in maximum number of open connections
	 */
	Preload.prototype.setMaxConnections = function(value) {
		this._maxConnections = value;
		if (!this._paused) {
			this._loadNext();
		}
	};

	/**
	 * Load a single file. Note that calling loadFile appends to the current queue, so it can be used multiple times to
	 * add files. Use <b>loadManifest()</b> to add multiple files at onces. To clear the queue first use the <b>close()</b> method.
	 * @method loadFile
	 * @param {Object | String} file The file object or path to load. A file can be either
	 * <ol>
	 *     <li>a path to a resource (string). Note that this kind of load item will be
	 *     converted to an object (next item) in the background.</li>
	 *     <li>OR an object that contains:<ul>
	 *         <li>src: The source of the file that is being loaded. This property is <b>required</b>. The source can either be a string (recommended), or an HTML tag.</li>
	 *         <li>type: The type of file that will be loaded (image, sound, json, etc).
	 *         Preload does auto-detection of types using the extension. Supported types are defined on Preload, such as Preload.IMAGE.
	 *         It is recommended that a type is specified when a non-standard file URI (such as a php script) us used.</li>
	 *         <li>id: A string indentifier which can be used to reference the loaded object.</li>
	 *         <li>data: An arbitrary data object, which is included with the loaded object</li>
	 *     </ul>
	 * </ol>
	 * @param {Boolean} loadNow Kick off an immediate load (true) or wait for a load call (false). The default value is true. If the queue is paused, and this value
	 * is true, the queue will resume.
	 */
	Preload.prototype.loadFile = function(file, loadNow) {
		if (file == null) {
			this._sendError({text: "File is null."});
			return;
		}
		this._addItem(file);

		if (loadNow !== false) {
			this.setPaused(false);
		}
	};

	/**
	 * Load a manifest. This is a shortcut method to load a group of files. To load a single file, use the loadFile method.
	 * Note that calling loadManifest appends to the current queue, so it can be used multiple times to add files. To clear
	 * the queue first, use the <b>close()</b> method.
	 * @method loadManifest
	 * @param {Array} manifest The list of files to load. Each file can be either
	 * <ol>
	 *     <li>a path to a resource (string). Note that this kind of load item will be
	 *     converted to an object (next item) in the background.</li>
	 *     <li>OR an object that contains:<ul>
	 *         <li>src: The source of the file that is being loaded. This property is <b>required</b>.
	 *         The source can either be a string (recommended), or an HTML tag. </li>
	 *         <li>type: The type of file that will be loaded (image, sound, json, etc).
	 *         Preload does auto-detection of types using the extension. Supported types are defined on Preload, such as Preload.IMAGE.
	 *         It is recommended that a type is specified when a non-standard file URI (such as a php script) us used.</li>
	 *         <li>id: A string indentifier which can be used to reference the loaded object.</li>
	 *         <li>data: An arbitrary data object, which is included with the loaded object</li>
	 *     </ul>
	 * </ol>
	 * @param {Boolean} loadNow Kick off an immediate load (true) or wait for a load call (false). The default value is true. If the queue is paused, and this value
	 * is true, the queue will resume.
	 */
	Preload.prototype.loadManifest = function(manifest, loadNow) {
		var data;

		if (manifest instanceof Array) {
			if (manifest.length == 0) {
				this._sendError({text: "Manifest is empty."});
				return;
			}
			data = manifest;
		} else {
			if (manifest == null) {
				this._sendError({text: "Manifest is null."});
				return;
			}
			data = [manifest];
		}

		for (var i = 0, l = data.length; i < l; i++) {
			this._addItem(data[i], false);
		}

		if (loadNow !== false) {
			this._loadNext();
		}
	};

	/**
	 * Begin loading the queued items.
	 * @method load
	 */
	Preload.prototype.load = function() {
		this.setPaused(false);
	};

	/**
	 * Lookup a loaded item using either the "id" or "src" that was specified when loading it.
	 * @method getResult
	 * @param {String} value The "id" or "src" of the loaded item.
	 * @return {Object} A result object containing the contents of the object that was initially requested using loadFile or loadManifest, including:
	 * <ol>
	 *     <li>src: The source of the file that was requested.</li>
	 *     <li>type: The type of file that was loaded. If it was not specified, this is auto-detected by Preload using the file extension.</li>
	 *     <li>id: The id of the loaded object. If it was not specified, the ID will be the same as the "src" property.</li>
	 *     <li>data: Any arbitrary data that was specified, otherwise it will be undefined.
	 *     <li>result: The loaded object. Preload provides usable tag elements when possible:<ul>
	 *          <li>An HTMLImageElement tag (&lt;image /&gt;) for images</li>
	 *          <li>An HTMLAudioElement tag (&lt;audio &gt;) for audio</li>
	 *          <li>A script tag for JavaScript (&lt;script&gt;&lt;/script&gt;)</li>
	 *          <li>A style tag for CSS (&lt;style&gt;&lt;/style&gt;)</li>
	 *          <li>Raw text for JSON or any other kind of loaded item</li>
	 *     </ul></li>
	 * </ol>
	 * This object is also returned via the "onFileLoad" callback, although a "target" will be included, which is a reference to the Preload instance.
	 */
	Preload.prototype.getResult = function(value) {
		return this._loadedItemsById[value] || this._loadedItemsBySrc[value];
	};

	/**
	 * Pause or resume the current load. The active item will not cancel, but the next
	 * items in the queue will not be processed.
	 * @method setPaused
	 * @param {Boolean} value Whether the queue should be paused or not.
	 */
	Preload.prototype.setPaused = function(value) {
		this._paused = value;
		if (!this._paused) {
			this._loadNext();
		}
	};

	/**
	 * Close the active queue. Closing a queue completely empties the queue, and prevents any remaining items from starting to
	 * download. Note that currently there any active loads will remain open, and events may be processed.<br/><br/>
	 * To stop and restart a queue, use the <b>setPaused(true|false)</b> method instead.
	 * @method close
	 */
	Preload.prototype.close = function() {
		while (this._currentLoads.length) {
			this._currentLoads.pop().cancel();
		}
		this._currentLoads = [];
		this._scriptOrder = [];
		this._loadedScripts = [];
	};


	//Protected Methods
	Preload.prototype._addItem = function(item) {
		var loadItem = this._createLoadItem(item);
		if (loadItem != null) {
			this._loadQueue.push(loadItem);

			this._numItems++;
			this._updateProgress();
		}
	};

	Preload.prototype._loadNext = function() {
		if (this._paused) {
			return;
		}

		if (!this._loadStartWasDispatched) {
			this._sendLoadStart();
			this._loadStartWasDispatched = true;
		}

		if (this._numItems == this._numItemsLoaded) {
			this.loaded = true;
			this._sendComplete();
			if (this.next && this.next.load) {
				//LM: Do we need to apply here?
				this.next.load.apply(this.next);
			}
		}

		while (this._loadQueue.length && this._currentLoads.length < this._maxConnections) {
			var loadItem = this._loadQueue.shift();
			this._loadItem(loadItem);
		}
	};

	Preload.prototype._loadItem = function(item) {
		item.onProgress = proxy(this._handleProgress, this);
		item.onComplete = proxy(this._handleFileComplete, this);
		item.onError = proxy(this._handleFileError, this);

		this._currentLoads.push(item);

		item.load();
	};

	Preload.prototype._handleFileError = function(event) {
		var loader = event.target;

		var resultData = this._createResultData(loader.getItem());
		this._numItemsLoaded++;
		this._updateProgress();

		this._sendError(resultData);

		if (!this.stopOnError) {
			this._removeLoadItem(loader);
			this._loadNext();
		}
	};

	Preload.prototype._createResultData = function(item) {
		var resultData = {id: item.id, result: null, data: item.data, type: item.type, src: item.src};
		this._loadedItemsById[item.id] = resultData;
		this._loadedItemsBySrc[item.src] = resultData;
		return resultData;
	};

	Preload.prototype._handleFileComplete = function(event) {
		var loader = event.target;
		var item = loader.getItem();
		var resultData = this._createResultData(item);

		this._removeLoadItem(loader);

		if (loader instanceof TW.Preload.XMLHttpRequestLoader) {
			resultData.result = this._createResult(item, loader.getResult());
		}

		switch (item.type) {
			case TW.Preload.IMAGE: //LM: Consider moving this to XHRLoader
				if (loader instanceof TW.Preload.XMLHttpRequestLoader) {
					var _this = this; // Use closure workaround to maintain reference to item/result
					resultData.result.onload = function(event) {
						_this._handleFileTagComplete(item, resultData);
					};
					return;
				}
				break;
		}

		this._handleFileTagComplete(item, resultData);
	};

	Preload.prototype._handleFileTagComplete = function(item, resultData) {
		this._numItemsLoaded++;

		if (item.completeHandler) {
			item.completeHandler(resultData);
		}

		this._updateProgress();
		this._sendFileComplete(resultData);

		this._loadNext();
	};

	Preload.prototype._removeLoadItem = function(loader) {
		var l = this._currentLoads.length;
		for (var i = 0; i < l; i++) {
			if (this._currentLoads[i] == loader) {
				this._currentLoads.splice(i, 1);
				break;
			}
		}
	};

	Preload.prototype._createResult = function(item, data) {
		var tag = null;
		var resultData;
		switch (item.type) {
			case TW.Preload.IMAGE:
				tag = this._createImage();
				break;
			case TW.Preload.SOUND:
				tag = item.tag || this._createAudio();
				break;
			case TW.Preload.CSS:
				tag = this._createLink();
				break;
			case TW.Preload.SVG:
				tag = this._createSVG();
				tag.appendChild(this._createXML(data, "image/svg+xml"));
				break;
			case TW.Preload.XML:
				resultData = this._createXML(data, "text/xml");
				break;
			case TW.Preload.JSON:
			case TW.Preload.TEXT:
				resultData = data;
		}

		//LM: Might not need to do this with Audio.
		if (tag) {
			if (item.type == this.CSS) {
				tag.href = item.src;
			} else if (item.type != this.SVG) {
				tag.src = item.src;
			}
			return tag;
		} else {
			return resultData;
		}
	};

	Preload.prototype._createXML = function(data, type) {
		var resultData;
		var parser;

		if (window.DOMParser) {
			parser = new DOMParser();
			resultData = parser.parseFromString(data, type);
		} else { // Internet Explorer
			parser = new ActiveXObject("Microsoft.XMLDOM");
			parser.async = false;
			parser.loadXML(data);
			resultData = parser;
		}

		return resultData;
	};

	// This is item progress!
	Preload.prototype._handleProgress = function(event) {
		var loader = event.target;
		var resultData = this._createResultData(loader.getItem());
		resultData.progress = loader.progress;
		this._sendFileProgress(resultData);
		this._updateProgress();
	};

	Preload.prototype._updateProgress = function() {
		var loaded = this._numItemsLoaded / this._numItems; // Fully Loaded Progress
		var remaining = this._numItems - this._numItemsLoaded;
		if (remaining > 0) {
			var chunk = 0;
			for (var i = 0, l = this._currentLoads.length; i < l; i++) {
				chunk += this._currentLoads[i].progress;
			}
			loaded += (chunk / remaining) * (remaining / this._numItems);
		}
		this._sendProgress({loaded: loaded, total: 1});
	};

	Preload.prototype._createLoadItem = function(loadItem) {
		var item = {};

		// Create/modify a load item
		switch (typeof(loadItem)) {
			case "string":
				item.src = loadItem;
				break;
			case "object":
				if (loadItem instanceof HTMLAudioElement) {
					item.tag = loadItem;
					item.src = item.tag.src;
					item.type = TW.Preload.SOUND;
				} else {
					item = loadItem;
				}
				break;
			default:
				break;
		}

		// Get source extension
		item.ext = this._getNameAfter(item.src, ".");
		if (!item.type) {
			item.type = this.getType(item.ext)
		}
		//If there's no id, set one now.
		if (item.id == null || item.id == "") {
			//item.id = this._getNameAfter(item.src, "/");
			item.id = item.src; //[SB] Using the full src is more robust, and more useful from a user perspective.
		}

		// Give plugins a chance to modify the loadItem
		var customHandler = this.typeHandlers[item.type] || this.extensionHandlers[item.ext];
		if (customHandler) {
			var result = customHandler(item.src, item.type, item.id, item.data);
			//Plugin will handle the load, so just ignore it.
			if (result === false) {
				return null;

				// Load as normal
			} else if (result === true) {
				// Do Nothing
				// Result is a loader class
			} else {
				if (result.src != null) {
					item.src = result.src;
				}
				if (result.id != null) {
					item.id = result.id;
				}
				if (result.tag != null && result.tag.load instanceof Function) { //Item has what we need load
					item.tag = result.tag;
				}
			}

			// Update the extension in case the type changed
			item.ext = this._getNameAfter(item.src, ".");
		}

		return new TW.Preload.XMLHttpRequestLoader(item);
	};

	Preload.prototype.getType = function(ext) {
		switch (ext) {
			case "jpeg":
			case "jpg":
			case "gif":
			case "png":
				return TW.Preload.IMAGE;
			case "ogg":
			case "mp3":
			case "wav":
				return TW.Preload.SOUND;
			case "json":
				return TW.Preload.JSON;
			case "xml":
				return TW.Preload.XML;
			case "css":
				return TW.Preload.CSS;
			case 'svg':
				return TW.Preload.SVG;
			default:
				return TW.Preload.TEXT;
		}
	};

	Preload.prototype._getNameAfter = function(path, token) {
		var dot_index = path.lastIndexOf(token);
		var last_piece = path.substr(dot_index + 1);
		var end_index = last_piece.lastIndexOf(/[\b|\?|\#|\s]/);
		return (end_index == -1) ? last_piece : last_piece.substr(0, end_index);
	};

	Preload.prototype._createImage = function() {
		return document.createElement("img");
	};

	Preload.prototype._createSVG = function() {
		var tag = document.createElement("object");
		tag.type = "image/svg+xml";
		return tag;
	};

	Preload.prototype._createAudio = function() {
		var tag = document.createElement("audio");
		tag.autoplay = false;
		tag.type = "audio/ogg";
		return tag;
	};

	Preload.prototype._createScript = function() {
		var tag = document.createElement("script");
		tag.type = "text/javascript";
		return tag;
	};

	Preload.prototype._createLink = function() {
		var tag = document.createElement("link");
		tag.type = "text/css";
		tag.rel = "stylesheet";
		return tag;
	};

	return Preload;
}();
