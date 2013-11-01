/**
 * @module Preload
 * @namespace Preload
 */


var TW = TW || {};
define(['../Utils/inherit', '../Event/EventProvider', './XHRLoader', './TagLoader', '../Utils/Polyfills'],
       function(inherit, EventProvider, XHRLoader, TagLoader) {

	TW.Preload = TW.Preload || {};


	/**
	 *
	 * The `Loader` class can load many files and follow the progress of all loads.
	 * It provides a large set of events for getting all informations on the download progression, for all usages.
	 *
	 * 2 methods can be used for add files to load, one by one (`addFile`) or several the same time (`addManyFiles`).
	 * Each of these methods can be added more than one time.
	 *
	 * ## general events
	 *
	 * 4 global events are availlable : `start`, `progress`, 'complete' and 'error'.
	 * It concerns indicates the general progression:
	 *
	 * - The `start` event is always called, at the beggining of the first download.
	 * - The `progress` event is called regularly, with informations of the progression.
	 * - The `complete` event tells that all files are downloaded.
	 * - The `error` event is called when a file can't be loaded.
	 *
	 * Note that event if a file has an error (and is not downloaded), the `complete` event will be called.
	 *
	 * ## file events
	 *
	 * The same 4 events can be used for a file only, with the smae signification.
	 * They are `fileStart`, `fileProgress`, `fileComplete` and `fileError`.
	 *
	 * Each of theses events are sent with a reference to the concerned item.
	 * `fileStart` are always called, when the start of the file begins.
	 *
	 * So, you can keep a view on each file separately.
	 *
	 * ## group events
	 *
	 * Each file can be associated to a group, when added to the list.
	 * Like the general progress, it's possible to follow progressions from a group, with the group events.
	 * Each group event (`groupStart`, `groupProgress`, 'groupComplete` and `groupError`) is sent with a group object.
	 * This object contains usefull informations, like the number of file already loaded in the group.	 *
	 *
	 *
	 * Internally, `Loader` use {{#crossLink "Preload.XHRLoader"}}XHRLoader{{/crossLink}} and
	 * {{#crossLink "Preload.TagLoader"}}TagLoader{{/crossLink}} classes.
	 *
	 * @class Loader
	 * @constructor
	 */
	function Loader() {
		EventProvider.call(this);

		/**
		 * List of all files requested.
		 *
		 * @property {Array} _items
		 * @private
		 */
		this._items = [];

		/**
		 * List of all groups.
		 * Each group is an array containing references to each file member.
		 *
		 * @type {Array} _groups
		 * @private
		 */
		this._groups = [];

		/**
		 * List of files in load.
		 *
		 * @type {Array}
		 * @private
		 */
		this._current = [];

		/**
		 * indexof next element to start loading.
		 * @property {Number} _next
		 * @private
		 */
		this._next = 0;

		/**
		 * number of connexions simulteanously maximum.
		 *
		 * @property {Number} maxConnexions
		 */
		this.maxConnexions = 10;

		/**
		 * number of actual connexions.
		 *
		 * @property {Number}_nbConnexions
		 * @private
		 */
		this._nbConnexions = 0;

		/**
		 * status, used to know which event has already been sent.
		 *
		 * @property {String} status
		 * @private-
		 */
		this.status = "waiting";

		/**
		 * The current load progress (percentage) for this item.
		 *
		 * @property progress
		 * @type Number
		 * @default 0
		 */
		this.progress = 0;

		/**
		 * Event called when the loading start.
		 * This event is not always called (depending of the capabilities of the browser).
		 *
		 * @event start
		 */

		/**
		 * Event called regularly when the download progress.
		 *
		 * @event progress
		 * @param {Number} progress percent data loaded
		 */

		/**
		 * Event called when the loading is fully done.
		 *
		 * @event complete
		 */

		/**
		 * Event called when an error occurs. It can be an network error, a bad HTTP status or a timeout.
		 *
		 * The download is not stopped after error. Only the concerned file will be unavaillable.
		 *
		 * @event error
		 * @param {*} error object describling the error. It's generally an Error or an Event object.
		 */



		/**
		 * Event called when the loading start.
		 * This event is always called, before any other event with the same item.
		 *
		 * @event fileStart
		 * @param {Object} item
		 *   @param {String} item.id ID associated to the file. Default to `item.src`
		 *   @param {String} item.src source for downloading the file.
		 *   @param {String} [item.group=null] group associated with the file.
		 *   @param {String} item.type type of ressources.
		 *   @param {String} item.status status of this item. can be "waiting", "started" or "completed"
		 *   @param {Object} item.progress
		 *     @param {Object} item.progress.loaded size of data already loaded
		 *     @param {Object} item.progress.total total size
		 *     @param {Object} item.progress.percent percentage of data loaded (between 0 and 100)
		 *   @param {Object} item.result the object resulting.		 */

		/**
		 * Event called regularly when the download progress.
		 *
		 * @event fileProgress
		 * @param {Object} item
		 *   @param {String} item.id ID associated to the file. Default to `item.src`
		 *   @param {String} item.src source for downloading the file.
		 *   @param {String} [item.group=null] group associated with the file.
		 *   @param {String} item.type type of ressources.
		 *   @param {String} item.status status of this item. can be "waiting", "started" or "completed"
		 *   @param {Object} item.progress
		 *     @param {Object} item.progress.loaded size of data already loaded
		 *     @param {Object} item.progress.total total size
		 *     @param {Object} item.progress.percent percentage of data loaded (between 0 and 100)
		 *   @param {Object} item.result the object resulting.		 */

		/**
		 * Event called when the loading is fully done.
		 *
		 * @event fileComplete
		 * @param {Object} item
		 *   @param {String} item.id ID associated to the file. Default to `item.src`
		 *   @param {String} item.src source for downloading the file.
		 *   @param {String} [item.group=null] group associated with the file.
		 *   @param {String} item.type type of ressources.
		 *   @param {String} item.status status of this item. can be "waiting", "started" or "completed"
		 *   @param {Object} item.progress
		 *     @param {Object} item.progress.loaded size of data already loaded
		 *     @param {Object} item.progress.total total size
		 *     @param {Object} item.progress.percent percentage of data loaded (between 0 and 100)
		 *   @param {Object} item.result the object resulting.
		 */

		/**
		 * Event called when an error occurs. It can be an network error, a bad HTTP status or a timeout.
		 *
		 * The download of this file is stopped after error.
		 *
		 * @event fileError
		 * @param {Object} item
		 *   @param {String} item.id ID associated to the file. Default to `item.src`
		 *   @param {String} item.src source for downloading the file.
		 *   @param {String} [item.group=null] group associated with the file.
		 *   @param {String} item.type type of ressources.
		 *   @param {String} item.status status of this item. can be "waiting", "started" or "completed"
		 *   @param {Object} item.progress
		 *     @param {Object} item.progress.loaded size of data already loaded
		 *     @param {Object} item.progress.total total size
		 *     @param {Object} item.progress.percent percentage of data loaded (between 0 and 100)
		 *   @param {Object} item.result the object resulting.
		 *   @param {*} item.error object describling the error. It's generally an Error or an Event object.
		 */

		/**
		 * Event called when the loading of the first file of the group start.
		 * This event is not always called (depending of the capabilities of the browser).
		 *
		 * @event groupStart
		 * @param {Object} group
		 *   @param {String} group.name name of the group.
		 *   @param {Array} group.items list of all items of this group.
		 *   @param {String} group.status status of this group. can be "waiting", "started" or "completed"
		 *   @param {Number} group.progress percent data loaded
		 *   @param {Number} group.nbFileLoaded number of files fully loaded.
		 *   @param {Object} group.error last error from an member item.
		 */

		/**
		 * Event called regularly when the download of files of group progress.
		 *
		 * @event groupProgress
		 * @param {Object} group
		 *   @param {String} group.name name of the group.
		 *   @param {Array} group.items list of all items of this group.
		 *   @param {String} group.status status of this group. can be "waiting", "started" or "completed"
		 *   @param {Number} group.progress percent data loaded
		 *   @param {Number} group.nbFileLoaded number of files fully loaded.
		 *   @param {Object} group.error last error from an member item.
		 */

		/**
		 * Event called when all files of a group are fully loaded.
		 *
		 * @event groupComplete
		 * @param {Object} group
		 *   @param {String} group.name name of the group.
		 *   @param {Array} group.items list of all items of this group.
		 *   @param {String} group.status status of this group. can be "waiting", "started" or "completed"
		 *   @param {Number} group.progress percent data loaded
		 *   @param {Number} group.nbFileLoaded number of files fully loaded.
		 *   @param {Object} group.error last error from an member item.
		 */

		/**
		 * Event called when an error occurs. It can be an network error, a bad HTTP status or a timeout.
		 *
		 * Only the download of the concerned file is stopped.
		 *
		 * @event groupError
		 * @param {Object} group
		 *   @param {String} group.name name of the group.
		 *   @param {Array} group.items list of all items of this group.
		 *   @param {String} group.status status of this group. can be "waiting", "started" or "completed"
		 *   @param {Number} group.progress percent data loaded
		 *   @param {Number} group.nbFileLoaded number of files fully loaded.
		 *   @param {Object} group.error object describling the error. It's generally an Error or an Event object.
		 */
	}

	inherit(Loader, EventProvider);

	/**
	 * add a file to the load list.
	 *
	 * @method loadFile
	 * @param {Object|String} item represents a file wich will be loaded.
	 *   Many format are availlable: if `item` is a String, its considered as both the ID and the source.
	 *   @param {String} [item.id] ID associated to the file. Default to `item.src`
	 *   @param {String} item.src source for downloading the file.
	 *   @param {String} [item.group=null] group to associate with the file.
	 *   @param {String} [item.type="text"] type of ressources.
	 * @param {String} [group=null] group to associate with the file.
	 */
	Loader.prototype.loadFile = function(item, group) {
		item = this._normalizeItem(item, group);
		this._items.push(item);
		if (item.group !== null) {
			var gr = this.getGroup(item.group);
			if (gr) {
				gr.items.push(item);
			} else {
				this._groups.push({
					name: item.group,
					items: [item],
					status: "waiting",
					progress: 0,
					nbFileLoaded: 0,
					error: null
				});
			}
		}

		switch(item.type) {
			case "image":
			case "sound":
			case 'svg':
				item.loader = new TagLoader(item.src, item.type);
				item.result = item.loader.getResult();
				break;
			default:
				item.loader = new XHRLoader(item.src, item.type);
		}
	};

	/**
	 * Add many files to the loading list.
	 * When a group is passed in argument, it's associated to all files.
	 *
	 * @method loadManyFiles
	 * @param {Array} items an array of files, like described in `loadFile`'s first argument.
	 * @param {String} [group=null] group to associate with the files.
	 */
	Loader.prototype.loadManyFiles = function(items, group) {
		for (var i = 0; i < items.length; i++) {
			this.loadFile(items[i], group);
		}
	};

	/**
	 * Normalize argument given to `loadFile` or `loadManyFiles`.
	 *
	 * @method _normalizeItem
	 * @param {Object|String} item represents a file wich will be loaded.
	 *   Many format are availlable: if `item` is a String, its considered as both the ID and the source.
	 *   @param {String} [item.id] ID associated to the file. Default to `item.src`
	 *   @param {String} item.src source for downloading the file.
	 *   @param {String} [item.group=null] group to associate with the file.
	 *   @param {String} [item.type="text"] type of ressources.
	 * @param {String} [group=null] group to associate with the file.
	 * @return {Object} an item object containing all values.
	 * @private
	 */
	Loader.prototype._normalizeItem = function(item, group) {
		if (typeof item === "string") {
			return {
				id: item,
				src: item,
				group: group === undefined ? null : group,
				type: "text",
				status: "waiting",
				progress: {
					loaded: 0,
				    total: 0,
				    percent: 0
				},
				error: null,
				result: null
			};
		} else {
			return {
				id: item.id === undefined ? item.src : item.id,
				src: item.src,
				group: group === undefined ? (item.group || null) : group,
				type: item.type || "text",
				status: "waiting",
				progress: {
					loaded: 0,
					total: 0,
					percent: 0
				},
				error: null,
				result: null
			};
		}
	};

	/**
	 * Start the loading of the next item on the list.
	 *
	 * @method _startLoadItem
	 * @private
	 */
	Loader.prototype._startLoadItem = function() {
		var item = this._items[this._next];
		var group = this.getGroup(item.group);
		var loader = item.loader;

		loader.on('start', this._emitStartEvent.bind(this, item));

		loader.on('progress', function(_, progress) {
			this._emitStartEvent(item);


			item.progress.total = progress.total;
			item.progress.loaded = progress.loaded;
			item.progress.percent =  100 * progress.loaded / progress.total;
			this.emit('fileProgress', item);

			if (group) {
				group.progress = this._computeProgress(group.items);
				this.emit('groupProgress', group);
			}
			this.progress = this._computeProgress(this._items);
			this.emit('progress', this.progress);
		}.bind(this));

		loader.on('error', function(_, err) {
			item.error = err;
			this.emit('error', err);
			this.emit('fileError', item);
			if (group) {
				group.error = err;
				this.emit('groupError', group);
			}

			this._nbConnexions--;
			if (this._nbConnexions === 0 && this._next === this._items.length) {
				this.status = "completed";
				this.emit('complete');
			}
			if (this._nbConnexions < this.maxConnexions && this._next < this._items.length) {
				this._startLoadItem();
			}
		}.bind(this));

		loader.on('complete', function(_, result) {
			this._emitStartEvent(item);
			item.status = "completed";
			item.result = result;

			this.emit('fileComplete', item);
			if (group) {
				group.nbFileLoaded++;
				if (group.nbFileLoaded === group.items.length) {
					group.status = "completed";
					this.emit('groupComplete', group);
				} else {
					group.progress = this._computeProgress(group.items);
					this.emit('groupProgress', group);
				}
			}

			this._nbConnexions--;
			this.progress = this._computeProgress(this._items);
			this.emit('progress', this.progress);
			if (this._nbConnexions === 0 && this._next === this._items.length) {
				this.status = "completed";
				this.emit('complete');
			}

			if (this._nbConnexions < this.maxConnexions && this._next < this._items.length) {
				this._startLoadItem();
			}
		}.bind(this));

		this._next++;
		this._nbConnexions++;
		loader.load();
	};

	/**
	 * Compute the percentage of data loaded in a set of files.
	 *
	 * @param {Array} items list of all items in the group;
	 * @return {Number} percent of data loaded (between 0 and 100)
	 * @private
	 */
	Loader.prototype._computeProgress = function(items) {
		var length = items.length;
		var sum = 0;

		for (var i = 0; i < length; i++) {
			if (items[i].status === "completed") {
				sum += 100 / length;
			} else {
				var progress = items[i].progress;
				if (progress.total !== 0) {
					sum += (progress.loaded / progress.total) * 100 / length;
				}
			}
		}
		return Math.floor(sum);
	};

	/**
	 * check if a group is completed
	 * @param group
	 * @returns {Boolean} true if it's completed; otherwise false
	 * @private
	 */
	Loader.prototype._isGroupCompleted = function(group) {
		var length = this._groups[group].length;

		for (var i = 0; i < length; i++) {
			if (this._groups[group][i].status !== "completed") {
				return false;
			}
		}
		return true;
	};

	/**
	 * Start the download of all files.
	 *
	 * @method start
	 */
	Loader.prototype.start = function() {

		while (this._nbConnexions < this.maxConnexions && this._next < this._items.length) {
			this._startLoadItem();
		}
	};

	/**
	 * Return the object resulting
	 *
	 * @method get
	 * @param {String} id
	 * @returns {*} result loaded. its content depends of the type of item.
	 */
	Loader.prototype.get = function(id) {
		for (var i = 0; i < this._items.length; i++) {
			if (this._items[i].id === id) {
				return this._items[i].result;
			}
		}
		return null;
	};

	/**
	 * return a group object, containing a list of all item members.
	 *
	 * @method getGroup
	 * @param {String} group name of the group
	 * @return {Object} a group object like in the groupXXX events.
	 */
	Loader.prototype.getGroup = function(group) {
		for (var i = 0; i < this._groups.length; i++) {
			if (this._groups[i].name === group) {
				return this._groups[i];
			}
		}
		return null;
	};


	/**
	 * Emit a *fileStart* event and all other *start* events if needed.
	 * If event has already be sent, do nothing.
	 *
	 * @method _emitStartEvent
	 * @param {Object} item item to start
	 * @private
	 */
	Loader.prototype._emitStartEvent = function(item) {
		if (this.status === "waiting") {
			this.status = "started";
			this.emit('start');
		}
		if (item.status === "waiting") {
			item.status = "started";
			this.emit('fileStart', item);
		}
		if (item.group && this.getGroup(item.group).status === "waiting") {
			var group = this.getGroup(item.group);
			group.status = "started";
			this.emit('groupStart', group);
		}
	};

	TW.Preload.Loader = Loader;
	return Loader;
});
