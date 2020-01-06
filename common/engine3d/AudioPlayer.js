const AudioPlayer = cc.internal.AudioPlayer;
const { PlayingState, AudioType } = cc.AudioClip;

cc.AudioClip.prototype._getPlayer = function (clip) {
    this._loadMode = AudioType.JSB_AUDIO;
    return AudioPlayerWX;
};

export class AudioPlayerWX extends AudioPlayer {
    _startTime = 0;
    _offset = 0;
    _volume = 1;
    _loop = false;
    _oneShoting = false;

    constructor (info) {
        super(info);
        this._audio = info.clip;

        this._audio.onPlay(() => {
            if (this._state === PlayingState.PLAYING) { return; }
            this._state = PlayingState.PLAYING;
            this._startTime = performance.now();
            this._eventTarget.emit('started');
        });
        this._audio.onPause(() => {
            if (this._state === PlayingState.STOPPED) { return; }
            this._state = PlayingState.STOPPED;
            this._offset += performance.now() - this._startTime;
        });
        this._audio.onStop(() => {
            if (this._state === PlayingState.STOPPED) { return; }
            this._state = PlayingState.STOPPED;
            this._offset = 0;
        });
        this._audio.onEnded(() => {
            if (this._state === PlayingState.STOPPED) { return; }
            this._state = PlayingState.STOPPED;
            this._offset = 0;
            this._eventTarget.emit('ended');
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
        this._audio.loop = false;
        this._audio.volume = volume;
        // stop and play immediately could run into issues on iOS
        if (this._state === PlayingState.PLAYING) { this._audio.seek(0); }
        else { this._audio.play(); }
    }

    getCurrentTime () {
        if (this._state !== PlayingState.PLAYING) { return this._offset / 1000; }
        let current = (performance.now() - this._startTime + this._offset) / 1000;
        if (current > this._duration) { current -= this._duration; this._startTime += this._duration * 1000; }
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
