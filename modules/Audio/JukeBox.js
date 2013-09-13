/**
 * @module Audio
 * @namespace Audio
 */

var TW = TW || {};
define(['../Event/EventProvider', '../Utils/inherit'], function (EventProvider, inherit) {

    TW.Audio = TW.Audio || {};

    TW.Audio.JukeBox_ERROR = "error";
    TW.Audio.JukeBox_STOPPED = "stopped";
    TW.Audio.JukeBox_PLAYING = "playing";
    TW.Audio.JukeBox_PAUSED = "paused";

    function JukeBox() {
        this._sounds = [];
        this._ids = [];
        this._current = 0;
        this.status = TW.Audio.JukeBox_STOPPED;
        this.loop = false;
        this.actif_loop = false;
        this.random = false;
        this._volume = 100;
        this._is_muted = false;
        EventProvider.call(this);
    }

    inherit(JukeBox, EventProvider);

    JukeBox.prototype.play = function(id) {
        if (this._sounds.length === 0) {
            return ;
        }
        if (id !== null && typeof(id) !== 'undefined') {
            for (var i = 0; i < this._ids.length; i++) {
                if (this._ids[i] === id) {
                    if (this.status == TW.Audio.JukeBox_PLAYING) {
                        this._sounds[this._current].stop();
                    }
                    this._current = i;
                    break;
                }
            }
        }
        if (this._current >= this._sounds.length) {
            this.stop();
            return ;
        }
        this._setVolumeOfCurrent();
        this._sounds[this._current].play();
        this.status = TW.Audio.JukeBox_PLAYING;
    };

    JukeBox.prototype.pause = function() {
        if (this._sounds.length === 0) {
            return ;
        }
        for (var i = 0; i < this._sounds.length; i++) {
            this._sounds[i].pause();
        }
        this.status = TW.Audio.JukeBox_PAUSED;
    };

    JukeBox.prototype.stop = function() {
        this.status = TW.Audio.JukeBox_STOPPED;
        if (this._sounds.length === 0) {
            return ;
        }
        for (var i = 0; i < this._sounds.length; i++) {
            this._sounds[i].stop();
        }
    };

    JukeBox.prototype.add = function(id, sound) {
        if (sound !== null && typeof(sound) !== 'undefined') {
            this._ids.push(id);
            this._sounds.push(sound);
            sound.on("stop", this._handleSoundStopped.bind(this));
        }
    };

    JukeBox.prototype.rm = function(id) {
        for (var i = 0; i < this._ids.length; i++) {
            if (this._ids[i] === id) {
                if (i === this._current) {
                    this.stop();
                }
                this._sounds[i].off("stop", this._handleSoundStopped.bind(this));
                this._ids.splice(i, 1);
                this._sounds.splice(i, 1);
                break ;
            }
        }
    };

    JukeBox.prototype.get = function(id) {
        for (var i = 0; i < this._ids.length; i++) {
            if (this._ids[i] === id) {
                return this._sounds[i];
            }
        }
        return false;
    };

    JukeBox.prototype.getCurrent = function() {
        if (this._sounds.length === 0 || this._current >= this._sounds.length) {
            return false;
        }
        return this._sounds[this._current];
    };

    JukeBox.prototype._setVolumeOfCurrent = function() {
        if (this.status === TW.Audio.JukeBox_PLAYING && this.current < this._sounds.length) {
            this._sounds[this._current].mute(this._is_muted);
            this._sounds[this._current].setVolume(this._volume);
        }
    };

    JukeBox.prototype._handleSoundStopped = function(event, data, provider) {
        this.next();
    };

    JukeBox.prototype.next = function() {
        if (this._sounds.length === 0) {
            return;
        }
        if (this.actif_loop) {
            this.play();
        }
        else {
            if (this.random) {
                this._play_random();
                if (this.status === TW.Audio.JukeBox_PLAYING) {
                    this.emit("next_track", this._ids[this._current]);
                }
            }
            else if ((this._current + 1) >= this._sounds.length && !this.loop) {
                this.emit("stop", this._ids[this._current]);
                this._current = 0;
                this.stop();
            }
            else {
                this._current = (this._current + 1 >= this._sounds.length) ? 0 : this._current + 1;
                this.play();
                if (this.status === TW.Audio.JukeBox_PLAYING) {
                    this.emit("next_track", this._ids[this._current]);
                }
            }
        }
    };

    JukeBox.prototype._play_random = function() {
        this._current = Math.floor(Math.random() * (this._sounds.length));
        console.log("Random is : " + this._current);
        this.play();
    };

    JukeBox.prototype.getVolume = function() {
        return this._volume;
    };

    JukeBox.prototype.setVolume = function(volume) {
        volume = (volume > 100) ? 100: volume;
        volume = (volume < 0) ? 0 : volume;
        this._volume = volume;
        this._setVolumeOfCurrent();
    };

    JukeBox.prototype.mute = function(is_muted) {
        if (is_muted === null || typeof(is_muted) === 'undefined') {
            is_muted = true;
        }
        this._is_muted = is_muted;
        this._setVolumeOfCurrent();
    };

    JukeBox.prototype.isMuted = function() {
        return this._is_muted;
    };

    TW.Audio.JukeBox = JukeBox;
    return JukeBox;
});
