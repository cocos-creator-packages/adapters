const AudioPlayer = cc.AudioPlayer;

const PlayingState = {
    INITIALIZING: 0,
    PLAYING: 1,
    STOPPED: 2,
};

class AudioPlayerMini extends AudioPlayer {
    _startTime = 0;
    _offset = 0;
    _volume = 1;
    _loop = false;
    _oneShoting = false;

    constructor (info) {
        super(info);
        this._audio = info.clip;
        // [HACK] volume property doesn't work on some devices during the first playthrough
        this._audio.play();
        this._audio.stop();

        this._audio.onPlay(function () {
            if (this._state === PlayingState.PLAYING) { return; }
            this._state = PlayingState.PLAYING;
            this._startTime = performance.now();
            this._eventTarget.emit('started');
        });
        this._audio.onPause(function () {
            if (this._state === PlayingState.STOPPED) { return; }
            this._state = PlayingState.STOPPED;
            this._offset += performance.now() - this._startTime;
        });
        this._audio.onStop(function () {
            if (this._state === PlayingState.STOPPED) { return; }
            this._state = PlayingState.STOPPED;
            this._offset = 0;
            if (this._oneShoting) {
                this._audio.volume = this._volume;
                this._audio.loop = this._loop;
                this._oneShoting = false;
            }
        });
        this._audio.onEnded(function () {
            if (this._state === PlayingState.STOPPED) { return; }
            this._state = PlayingState.STOPPED;
            this._offset = 0;
            this._eventTarget.emit('ended');
            if (this._oneShoting) {
                this._audio.volume = this._volume;
                this._audio.loop = this._loop;
                this._oneShoting = false;
            }
        });
        this._audio.onError(function (res) { return console.error(res.errMsg);});
    }

    play () {
        if (!this._audio || this._state === PlayingState.PLAYING) { return; }
        if (this._blocking) { this._interrupted = true; return; }
        this._audio.play();
    }

    pause () {
        if (!this._audio || this._state !== PlayingState.PLAYING) { return; }
        this._audio.pause();
    }

    stop () {
        if (!this._audio) { return; }
        this._audio.stop();
    }

    playOneShot (volume) {
        /* InnerAudioContext doesn't support multiple playback at the
           same time so here we fall back to re-start style approach */
        if (volume === undefined) { volume = 1; }
        if (!this._audio) { return; }
        this._offset = 0;
        this._oneShoting = true;
        this._audio.stop();
        this._audio.loop = false;
        this._audio.volume = volume;
        this._audio.play();
    }

    getCurrentTime () {
        if (this._state !== PlayingState.PLAYING) { return this._offset / 1000; }
        let current = (performance.now() - this._startTime + this._offset) / 1000;
        if (current > this._duration) { current -= this._duration; this._startTime += this._duration * 1000; }
        return current;
    }

    setCurrentTime (val) {
        if (!this._audio) { return; }
        this._offset = clamp(val, 0, this._duration) * 1000;
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
        __globalAdapter.offAudioInterruptionBegin(this._onHide);
        __globalAdapter.offAudioInterruptionEnd(this._onShow);
        super.destroy();
    }
}

module.exports = AudioPlayerMini;
