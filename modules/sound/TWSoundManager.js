TWSoundManager = {
    instances : null,

    length: 0,
    lastId: 0,
    ready: 0,

    allInstancesReady: null,

    masterVolume: 1,

    allInstancesReadyHandler: null,

    init: function() {
        this.instances = new Array();
        this.allInstancesReadyHandler = proxy(this.handleAllInstancesReady, this);
        return this;
    },

    add: function(src, max) {
        this.lastId++;
        this.instances[this.lastId] = new TWSoundChannel(src, max);
        this.length++;
        return this.lastId;
    },

    remove: function(uniqueId) {
        if (this.instances[uniqueId] == null) {
            return false;
        }
        delete this.instances[uniqueId];
        this.length--;
        return true;
    },

    get: function(uniqueId) {
        return this.instances[uniqueId];
    },

    getPlayableSound: function(uniqueId) {
        var sound = this.instances[uniqueId].getPlayableSound();
        return sound;
    },

    loadAll: function() {
        this.ready = 0;
        for ( var key in this.instances ) {
            var sounds = this.instances[key];
            sounds.allSoundsReady = this.allInstancesReadyHandler;
            sounds.load();
        }
    },

    handleAllInstancesReady: function() {
        this.ready++;

        if (this.allInstancesReady != null && this.ready == this.length) {
            this.allInstancesReady();
        }
    },

    tellAllInstances: function(command, value) {

        for ( var key in this.instances ) {
            var sounds = this.instances[key];
            switch (command) {
                case "pause":
                    sounds.pause(); break;
                case "resume":
                    sounds.resume(); break;
                case "setVolume":
                    sounds.setMasterVolume(value); break;
                case "mute":
                    sounds.setMute(value); break;
                case "stop":
                    sounds.stop(); break;
            }
        }
    },

    getMasterVolume: function() { return this.masterVolume; },

    setMute: function(isMuted) {
        return this.tellAllInstances("mute", isMuted);
    },

    pause: function() {
        return this.tellAllInstances("pause", null);
    },

    resume: function() {
        return this.tellAllInstances("resume", null);
    },

    stop: function() {
        return this.tellAllInstances("stop", null);
    },

    setMasterVolume: function(value) {
        value = (value > 1.0) ? 1.0 : value;
        value = (value < 0.0) ? 0.0 : value;

        console.log(value);

        this.masterVolume = value;
        this.tellAllInstances("setVolume", value);
    }
}