const AudioPlayer = cc.internal.AudioPlayer;
const { PlayingState, AudioType } = cc.AudioClip;

cc.AudioClip.prototype._getPlayer = function (clip) {
    this._loadMode = AudioType.JSB_AUDIO;
    return AudioPlayerMini;
};

class AudioPlayerMini extends AudioPlayer {
    constructor (info) {
        super(info);
        this._startTime = 0;
        this._offset = 0;
        this._volume = 1;
        this._loop = false;
        this._oneShoting = false;
        this._audio = info.nativeAudio;

        this._audio.onPlay(() => { // synchronous callback
            if (this._state === PlayingState.PLAYING) { return; }
            this._state = PlayingState.PLAYING;
            this._startTime = performance.now();
            this._clip.emit('started');
        });
        this._audio.onPause(() => {
            if (this._state === PlayingState.STOPPED) { return; }
            this._state = PlayingState.STOPPED;
            this._offset += performance.now() - this._startTime;
        });
        this._audio.onStop(() => {
            this._offset = 0;
            if (this._state === PlayingState.STOPPED) { return; }
            this._state = PlayingState.STOPPED;
        });
        this._audio.onEnded(() => {
            if (this._state === PlayingState.STOPPED) { return; }
            this._state = PlayingState.STOPPED;
            this._offset = 0;
            this._clip.emit('ended');
        });
        this._audio.onError(function (res) { return console.error(res.errMsg);});
    }

    play () {
        if (!this._audio || this._state === PlayingState.PLAYING) { return; }
        if (this._blocking) { this._interrupted = true; return; }
        if (this._oneShoting) {
            this._audio.volume = this._volume;
            this._audio.loop = this._loop;
            this._oneShoting = false;
        }
        // delay eval here to yield uniform behavior with other platforms
        cc.director.once(cc.Director.EVENT_AFTER_UPDATE, this._audio.play, this._audio);
    }

    pause () {
        if (!this._audio) { return; }
        if (this._state !== PlayingState.PLAYING) {
            cc.director.off(cc.Director.EVENT_AFTER_UPDATE, this._audio.play, this._audio);
        } else {
            this._audio.pause();
        }
    }

    stop () {
        if (!this._audio) { return; }
        if (this._state !== PlayingState.PLAYING) {
            cc.director.off(cc.Director.EVENT_AFTER_UPDATE, this._audio.play, this._audio);
        } else {
            this._audio.stop();
        }
    }

    playOneShot (volume) {
        /* InnerAudioContext doesn't support multiple playback at the
           same time so here we fall back to re-start style approach */
        if (volume === undefined) { volume = 1; }
        if (!this._audio) { return; }
        this._offset = 0;
        this._audio.stop();
        this._oneShoting = true;
        this._audio.loop = false;
        this._audio.volume = volume;
        this._audio.play();
    }

    getCurrentTime () {
        if (this._state !== PlayingState.PLAYING) { return this._offset / 1000; }
        let current = (performance.now() - this._startTime + this._offset) / 1000;
        if (current > this._duration) {
            if (!this._loop) return 0;
            current -= this._duration; this._startTime += this._duration * 1000;
        }
        return current;
    }

    setCurrentTime (val) {
        if (!this._audio) { return; }
        this._offset = cc.math.clamp(val, 0, this._duration) * 1000;
        this._startTime = performance.now();
        this._audio.seek(val);
    }

    getVolume () {
        return this._volume;
    }

    setVolume (val, immediate) {
        this._volume = val;
        if (this._audio) { this._audio.volume = val; }
    }

    getLoop () {
        return this._loop;
    }

    setLoop (val) {
        this._loop = val;
        if (this._audio) { this._audio.loop = val; }
    }

    destroy () {
        if (this._audio) { this._audio.destroy(); }
        super.destroy();
    }
}
