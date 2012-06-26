function TWSoundChannel(src, max) {
    this.init(src, max);
}

var p = TWSoundChannel.prototype = {

    sounds: null,

    src:null,
    max:0,

    volume:1,

    allSoundsReady:null,

    allSoundsReadyHandler:null,

    init:function (src, max) {
        this.allSoundsReadyHandler = proxy(this.handleAllSoundsReady, this);

        this.src = src;
        this.max = max;
        this.sounds = new Array();
        this.add(max);
    },

    add:function (max) {

        while (this.sounds.length < max) {
            this.sounds.push(new TWSound(this.src));
        }
    },

    load:function () {

        for (var i = 0; i < this.sounds.length; ++i) {
            var sound = this.sounds[i];
            if (i == 0)
                sound.onReady = this.allSoundsReadyHandler;
            sound.load(0, 0, 1);
        }
    },

    getPlayableSound:function () {

        for (var i = 0; i < this.sounds.length; ++i) {
            var sound = this.sounds[i];
            if (sound.playState != AUDIO_PLAYED)
                return this.sounds[i];
        }
        this.sounds[0].stop();
        return this.sounds[0];
    },

    handleAllSoundsReady:function (sound) {
        if (this.allSoundsReady != null) {
            this.allSoundsReady();
        }
    },

    tellAllSounds:function (command, value) {

        for (var i = this.sounds.length - 1; i >= 0; --i) {
            var sound = this.sounds[i];
            switch (command) {
                case "pause":
                    sound.pause();
                    break;
                case "resume":
                    sound.resume();
                    break;
                case "setVolume":
                    sound.setVolume(value);
                    break;
                case "mute":
                    sound.mute(value);
                    break;
                case "stop":
                    sound.stop();
                    break;
            }
        }
    },

    setMute:function (isMuted) {
        return this.tellAllSounds("mute", isMuted);
    },

    pause:function () {
        return this.tellAllSounds("pause", null);
    },

    resume:function () {
        return this.tellAllSounds("resume", null);
    },

    stop:function () {
        return this.tellAllSounds("stop", null);
    },

    setMasterVolume:function (value) {
        this.tellAllSounds("setVolume", value);
    }
};