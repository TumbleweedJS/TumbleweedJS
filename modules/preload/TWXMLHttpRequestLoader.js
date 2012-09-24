/**
 @module Preload
 @namespace Preload
 */

var TW = TW || {};
TW.Preload = TW.Preload || {};

TW.Preload.XMLHttpRequestLoader = function() {

	/**
	 * @class XMLHttpRequestLoader
	 * @param file
	 * @constructor
	 */
	function XMLHttpRequestLoader(file) {
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

		// The manifest item we are loading
		this._item = file;

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

		this._createXHR(file);
	}

	/**
	 * Begin the load.
	 * @method load
	 */
	XMLHttpRequestLoader.prototype.load = function() {
		if (this._request == null) {
			this.handleError();
			return;
		}

		//Setup timeout if we're not using XHR2
		if (this._xhrLevel == 1) {
			this._loadTimeOutTimeout = setTimeout(proxy(this.handleTimeout, this), TW.Preload.TIMEOUT_TIME);
		}

		//Events
		this._request.onloadstart = proxy(this.handleLoadStart, this);
		this._request.onprogress = proxy(this.handleProgress, this);
		this._request.onabort = proxy(this.handleAbort, this);
		this._request.onerror = proxy(this.handleError, this);
		this._request.ontimeout = proxy(this.handleTimeout, this);

		//LM: Firefox does not get onload. Chrome gets both. Might need onload for other things.
		this._request.onload = proxy(this.handleLoad, this);
		this._request.onreadystatechange = proxy(this.handleReadyStateChange, this);

		try { // Sometimes we get back 404s immediately, particularly when there is a cross origin request.
			this._request.send();
		} catch (error) {
			this._sendError({source: error});
		}
	};
	/**
	 * Get a reference to the manifest item that is loaded by this loader.
	 * @method getItem
	 * @return {Object} The manifest item
	 */
	XMLHttpRequestLoader.prototype.getItem = function() {
		return this._item;
	};

	XMLHttpRequestLoader.prototype.getResult = function() {
		//[SB] When loading XML IE9 does not return .response, instead it returns responseXML.xml
		try {
			return this._request.responseText;
		} catch (error) {
		}
		return this._request.response;
	};

	/**
	 * Determine if a specific type should be loaded as a binary file
	 * @method isBinary
	 * @param type The type to check
	 * @private
	 */
	XMLHttpRequestLoader.prototype.isBinary = function(type) {
		switch (type) {
			case this.IMAGE:
			case this.SOUND:
				return true;
			default:
				return false;
		}
	};

	XMLHttpRequestLoader.prototype.handleProgress = function(event) {
		if (event.loaded > 0 && event.total == 0) {
			return; // Sometimes we get no "total", so just ignore the progress event.
		}
		this._sendProgress({loaded: event.loaded, total: event.total});
	};

	XMLHttpRequestLoader.prototype.handleLoadStart = function() {
		clearTimeout(this._loadTimeOutTimeout);
		this._sendLoadStart();
	};

	XMLHttpRequestLoader.prototype.handleAbort = function() {
		this._clean();
		this._sendError();
	};

	XMLHttpRequestLoader.prototype.handleError = function() {
		this._clean();
		this._sendError();
	};

	XMLHttpRequestLoader.prototype.handleReadyStateChange = function() {
		if (this._request.readyState == 4) {
			this.handleLoad();
		}
	};

	XMLHttpRequestLoader.prototype._checkError = function() {
		//LM: Probably need additional handlers here.
		var status = parseInt(this._request.status);

		switch (status) {
			case 404:   // Not Found
			case 0:     // Not Loaded
				return false;
		}

		//wdg:: added check for this._hasTextResponse() ... Android  2.2 uses it.
		return this._hasResponse() || this._hasTextResponse() || this._hasXMLResponse();
	};

	/*
	 Validate the response (we need to try/catch some of these, nicer to break them into functions.
	 */
	XMLHttpRequestLoader.prototype._hasResponse = function() {
		return this._request.response != null;
	};

	XMLHttpRequestLoader.prototype._hasTextResponse = function() {
		try {
			return this._request.responseText != null;
		} catch (e) {
			return false;
		}
	};

	XMLHttpRequestLoader.prototype._hasXMLResponse = function() {
		try {
			return this._request.responseXML != null;
		} catch (e) {
			return false;
		}
	};

	XMLHttpRequestLoader.prototype.handleLoad = function(event) {
		if (this.loaded) {
			return;
		}
		this.loaded = true;

		if (!this._checkError()) {
			this.handleError();
			return;
		}

		this._clean();
		this._sendComplete();
	};

	XMLHttpRequestLoader.prototype.handleTimeout = function() {
		this._clean();
		this._sendError();
	};

	XMLHttpRequestLoader.prototype._createXHR = function(item) {
		this._xhrLevel = 1;

		if (window.ArrayBuffer) {
			this._xhrLevel = 2;
		}

		// Old IE versions use a different approach
		if (window.XMLHttpRequest) {
			this._request = new XMLHttpRequest();
		} else {
			try {
				this._request = new ActiveXObject("MSXML2.XMLHTTXMLHttpRequestLoader.prototype.3.0");
			} catch (ex) {
				return null;
			}
		}

		//IE9 doesn't support .overrideMimeType(), so we need to check for it.
		if (item.type == TW.Preload.TEXT && this._request.overrideMimeType) {
			this._request.overrideMimeType('text/plain; charset=x-user-defined');
		}

		this._request.open('GET', item.src, true);

		if (this.isBinary(item.type)) {
			this._request.responseType = 'arraybuffer';
		}
		return true;
	};

	XMLHttpRequestLoader.prototype._clean = function() {
		clearTimeout(this._loadTimeOutTimeout);

		var req = this._request;
		req.onloadstart = null;
		req.onprogress = null;
		req.onabort = null;
		req.onerror = null;
		req.onload = null;
		req.ontimeout = null;
		req.onloadend = null;
		req.onreadystatechange = null;

		clearInterval(this._checkLoadInterval);
	};

	//Callback proxies
	XMLHttpRequestLoader.prototype._sendLoadStart = function(value) {
		if (this.onLoadStart) {
			this.onLoadStart({target: this});
		}
	};

	XMLHttpRequestLoader.prototype._sendProgress = function(value) {
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

	XMLHttpRequestLoader.prototype._sendFileProgress = function(event) {
		if (this.onFileProgress) {
			event.target = this;
			this.onFileProgress(event);
		}
	};

	XMLHttpRequestLoader.prototype._sendComplete = function() {
		if (this.onComplete) {
			this.onComplete({target: this});
		}
	};

	XMLHttpRequestLoader.prototype._sendFileComplete = function(event) {
		if (this.onFileLoad) {
			event.target = this;
			this.onFileLoad(event);
		}
	};

	XMLHttpRequestLoader.prototype._sendError = function(event) {
		if (this.onError) {
			if (event == null) {
				event = {};
			}
			event.target = this;
			this.onError(event);
		}
	};

	return XMLHttpRequestLoader;
}();