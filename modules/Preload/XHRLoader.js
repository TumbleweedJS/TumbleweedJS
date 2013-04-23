/**
 * @module Preload
 * @namespace Preload
 */

var TW = TW || {};
define(['../Utils/inherit', '../Event/EventProvider', '../Utils/Polyfills'], function(inherit, EventProvider) {

	TW.Preload = TW.Preload || {};

	/**
	 * A XMLHttpRequest wrapper for a greater ease of use.
	 *
	 * XHRLoader hides differences between browsers and assures a better support of XHR2 features.
	 * XHRLoader will call an ajax request for loading a ressource, and keep you informed of the progress of loading,
	 * by using events.
	 *
	 * For each request, yuo are assured than a `complete` or `error` event is called, only one time.
	 * `start` and `progress` events gives you ore details during the process.
	 *
	 *
	 * XHRLoader support many objects types:
	 *
	 *  - `"text"`
	 *  Basic text format. It's the default format
	 *  - `"xml"`
	 *  An XML DOM object is returned.
	 *  - `"script"`
	 *  A HTML script element is returned, and can be added to the DOM.
	 *  It is called immediatly after being added to the DOM.
	 *  - `"css"`
	 *  A link tag is created and returned. Its effects act when you add it to the DOM.
	 *  - `"html"`
	 *  return a div html element contaings all HTML code loaded from XHR request.
	 *  If you don't want your elements to be wrapped in a div tag, you can use the `firstChild` property.
	 *
	 * @class XHRLoader
	 * @param path Url to the remote file
	 * @param {String} [type="text"] type of the ressource.
	 * @constructor
	 */
	function XHRLoader(path, type) {

		EventProvider.call(this);

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

		/**
		 * Time (in ms) before we wait the download start.
		 * Throw an error event when time is expired.
		 *
		 * @property {Number} timeout
		 */
		this.timeout = 8000;

		/**
		 * Type given to constructor.
		 *
		 * @property {String} type
		 */
		this.type = type;

		/**
		 *
		 * @property _result
		 * @private
		 */
		this._result = null;

		/**
		 * Handler from `setTimeout` for timeout failback event.
		 *
		 * @property _timeoutHandler
		 */
		this._timeoutHandler = null;

		/**
		 * Event called when the loading start.
		 * This event is not always called (depending of the capabilities of the browser).
		 *
		 * @event start
		 */

		/**
		 * Event called regularly when the download progress.
		 * This event is not always called (depending of the capabilities of the browser).
		 *
		 * @event progress
		 * @param TODO
		 */

		/**
		 * Event called when the loading is fully done.
		 *
		 * @event complete
		 * @param {*} result the object resulting
		 */

		/**
		 * Event called when an error occurs. It can be an network error, a bad HTTP status or a timeout.
		 *
		 * The download is stopped after error.
		 *
		 * @event error
		 * @param {*} error object describling the error. It's generally an Error or an Event object.
		 */

		this._createXHR(path, type || "text");
	}

	inherit(XHRLoader, EventProvider);

	/**
	 * Begin the load.
	 *
	 * @method load
	 */
	XHRLoader.prototype.load = function() {
		if (this._request === null) {
			this._handleError(new Error('XMLHttpRequest is not supported by the browser'));
			return;
		}

		if (this.ontimeout === undefined) {
			this._timeoutHandler = setTimeout(this._handleError.bind(this, new Error("Timeout")), this.timeout);
		} else {
			this._request.timeout = this.timeout;
			this._request.ontimeout = this._handleError.bind(this);
		}

		//Events
		this._request.onloadstart = this._handleLoadStart.bind(this);
		this._request.onprogress = this._handleProgress.bind(this);
		this._request.onabort = this._handleError.bind(this);


		if (this._request.onload !== undefined) {
			this._request.onload = this._handleLoad.bind(this);
		} else {
			this._request.onreadystatechange = function() {
				if (this._request.readyState === 4) {
					this._handleLoad();
				}
			}.bind(this);
		}

		//XHR.send() can throw an Error. Sometimes we have an error event, or a exception, or both
		//errorDelayed assures the XHRLoader error event will be called only once.
		var errorDelayed = null;
		this._request.onerror = function(error) {
			errorDelayed = error || true;
		};
		try {
			this._request.send();
		} catch (error) {
			errorDelayed = error;
		}
		if (errorDelayed !== null) {
			this._handleError(errorDelayed);
		}

		this._request.onerror = this._handleError.bind(this);
	};

	/**
	 * Return the result.
	 * The format depends on the type indicated.
	 *
	 * @method getResult
	 */
	XHRLoader.prototype.getResult = function() {
		return this._result;
	};

	/**
	 * Transform the data received from the XHR object,
	 * into appropriate result.
	 *
	 * @method _getResult
	 * @return {*} result
	 */
	XHRLoader.prototype._getResult = function() {
		var result = null;

		if (this._isXML(this.type)) {
			if (this._request.responseXML !== null) {
				result = this._request.responseXML;
			} else if(typeof DOMParser !== "undefined") {
				result = (new DOMParser()).parseFromString(this._request.responseText, 'text/xml');
			} else {
				this._handleError(new Error('XML format not supported by this browser'));
				return null;
			}
		}

		if (result === null) {
			result = this._request.responseText;
		}

		var tag;
		switch(this.type) {
			case 'xml':
				return result;
			case 'image':
			case 'svg':
			case 'sound':
			case 'binary':
			case 'json':
				//TODO: implement later.
				return null;
			case 'css':
				tag = document.createElement("link");
				tag.rel = "stylesheet";
				tag.type = "text/css";
				tag.text = result;
				return tag;
			case 'script':
				tag = document.createElement("script");
				tag.type = 'text/javascript';
				tag.text = result;
				return tag;
			case 'html':
				tag = document.createElement("div");
				tag.innerHTML = result;
				return tag;
			default:
				return result;
		}
	};


	/**
	 * Called when a progress event is fired.
	 *
	 * @param event
	 */
	XHRLoader.prototype._handleProgress = function(event) {

		if (event instanceof Number) {
			this.progress = event;
			event = {
				loaded: this.progress,
				total: 1
			};
		} else {
			if (event.lengthComputable && event.total !== 0) {
				this.progress = event.loaded / event.total;
				if (this.progress > 1) {
					this.progress = 1;
				}
			}
			if (isNaN(this.progress) || this.progress === Infinity) {
				this.progress = 0;
			}
		}
		this.emit('progress', event);
	};

	/**
	 * Called when a startLoad event is fired
	 *
	 * @param event
	 */
	XHRLoader.prototype._handleLoadStart = function(event) {
		clearTimeout(this._timeoutHandler);
		this._timeoutHandler = null;
		this.emit('start', event);
	};

	/**
	 * Catch an error, abort or timeout.
	 *
	 * @param event
	 * @private
	 */
	XHRLoader.prototype._handleError = function(event) {
		this._clean();
		this.emit('error', event);
	};

	/**
	 * Called when the load is done.
	 *
	 * @method _handleLoad
	 */
	XHRLoader.prototype._handleLoad = function() {
		if (this.loaded) {
			return;
		}

		var status = parseInt(this._request.status, 10);

		if (status !== 200 && status !== 0) {
			this._handleError(new Error("Bad Status"));
			return;
		}

		this.loaded = true;
		this._result = this._getResult();
		if (this._result !== null) {
			this._clean();
			this.emit('complete', this._result);
		}
	};


	/**
	 * Create a new XMLHttpRequest and configure it.
	 *
	 * @param {String} path url of the remote file
	 * @param {String} type file type.
	 * @private
	 */
	XHRLoader.prototype._createXHR = function(path, type) {

		if (window.XMLHttpRequest) {
			this._request = new XMLHttpRequest();
		} else {
			try {
				/*global ActiveXObject */
				this._request = new ActiveXObject("MSXML2.XMLHTTP.3.0");
			} catch (ex) {
				return;
			}
		}

		this._request.open('GET', path, true);

		if (this._isBinary(type)) {
			this._setBinaryMode();
		}
		if (this._isXML(type)) {
			this._setXMLMode();
		}
	};


	/**
	 * Determine if a specific type should be loaded as a binary file
	 *
	 * @method _isBinary
	 * @param {String} type The type to check
	 * @return {Boolean} `true` if binary; otherwise `false`
	 * @private
	 */
	XHRLoader.prototype._isBinary = function(type) {
		switch (type) {
			case "image":
			case "sound":
			case "binary":
				return true;
			default:
				return false;
		}
	};

	/**
	 * Set the XHR object to accept binary mode if possible.
	 *
	 * @method _setBinaryMode
	 * @private
	 */
	XHRLoader.prototype._setBinaryMode = function() {
		if (this._request.responseType !== undefined) {
			this._request.responseType = 'arraybuffer';
		} else if (this._request.overrideMimeType) { //IE9
			this._request.overrideMimeType('text/plain; charset=x-user-defined');
		} else {
			//TODO ?
		}
	};

	/**
	 * Determine if a specific type should be loaded as a XML file.
	 *
	 * @method _isXML
	 * @param {String} type The type to check
	 * @return {Boolean} `true` if xml; otherwise `false`
	 * @private
	 */
	XHRLoader.prototype._isXML = function(type) {
		switch (type) {
			case "xml":
			case "svg":
				return true;
			default:
				return false;
		}
	};

	/**
	 * Set the XHR object to accept XML content.
	 *
	 * @method _setXMLMode
	 * @private
	 */
	XHRLoader.prototype._setXMLMode = function() {
		if (this._request.overrideMimeType) {
			if (this.type === "svg") {
				this._request.overrideMimeType('application/svg+xml');
			} else {
				this._request.overrideMimeType('application/xml');
			}
		}
	};

	/**
	 * Clean the XHR object by removing all callbacks.
	 *
	 * @method _clean
	 * @private
	 */
	XHRLoader.prototype._clean = function() {
		clearTimeout(this._timeoutHandler);

		var req = this._request;
		req.onloadstart = null;
		req.onprogress = null;
		req.onabort = null;
		req.onerror = null;
		req.onload = null;
		req.ontimeout = null;
		req.onloadend = null;
		req.onreadystatechange = null;
	};

	TW.Preload.XHRLoader = XHRLoader;
	return XHRLoader;
});
