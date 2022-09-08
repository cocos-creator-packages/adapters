const game = cc.game;
const EventTarget = cc.EventTarget;

const State = {
    ERROR: -1,
    INITIALZING: 0,
    PLAYING: 1,
    PAUSED: 2,
    STOPPED: 3,
}

function Audio (url, serializedDuration) {
    this._nativeAudio = my.createInnerAudioContext();
    this._et = new EventTarget();
    this.loadPromise = this.setSrc(url);
    const nativeAudio = this._nativeAudio;
    this._serializedDuration = serializedDuration;
    this.reset();
    // BUG: access duration invokes onEnded callback.
    // this.loadPromise.then(() => {
    //     this._duration = nativeAudio.duration;
    // });
    this._duration = 1;
    this._onShow = () => {
        if (this._blocked) {
            this._nativeAudio.play();
        }
        this._blocked = false;
    };
    this._onHide = () => {
        if (this.getState() === State.PLAYING) {
            this._nativeAudio.pause();
            this._blocked = true;
        }
    };
    nativeAudio.onCanplay(() => { this._et.emit('load'); });
    nativeAudio.onError((err) => { this._et.emit('error', err); });
    nativeAudio.onEnded(() => {
        this.finishCB && this.finishCB();
        this._state = State.INITIALZING;
        this._et.emit('ended');
    });
    nativeAudio.onStop(() => { this._et.emit('stop'); });
    // nativeAudio.onTimeUpdate(() => { this._currentTime = nativeAudio.currentTime; });  // BUG: onTimeUpdate not working
    game.on(game.EVENT_SHOW, this._onShow);
    game.on(game.EVENT_HIDE, this._onHide);
}

Audio.State = State;

Object.assign(Audio.prototype, {

    reset () {
        this.id = -1;
        this.finishCB = null;  // For audioEngine custom ended callback.
        this._state = State.INITIALZING;
        this._loop = false;
        this._currentTime = 0;
        this._volume = 1;
        this._blocked = false;

        this.offLoad();
        this.offError();
        this.offEnded();
        this.offStop();
    },

    destroy () {
        this.reset();
        game.off(game.EVENT_SHOW, this._onShow);
        game.off(game.EVENT_HIDE, this._onHide);
        // offCanplay offOnError offStop offEnded is not supported for now.

        this._nativeAudio.destroy();
        this._nativeAudio = null;
    },

    getSrc () { return this._src; },
    setSrc (path) { 
        if (this._src === path) {
            return;
        }
        this.reset();
        const nativeAudio = this._nativeAudio;
        const loadPromise = new Promise((resolve, reject) => {
            let done = false;
            // HACK: onCanplay callback not working on Taobao.
            let timer = setTimeout(() => {
                if (done) { return; }
                cc.warn('Timeout to load audio');
                done = true;
                resolve(nativeAudio);
            }, 3000);
            this.onLoad(() => {
                if (done) { return; }
                clearTimeout(timer);
                done = true;
                resolve(nativeAudio);
            });
            this.onError((err) => {
                if (done) { return; }
                clearTimeout(timer);
                done = true;
                reject(err);
            });
            nativeAudio.src = url;
        });
        this._nativeAudio.src = path;
        this._src = path;
        return loadPromise;
    },
    getState () { return this._state; },
    getDuration () { return this._serializedDuration ? this._serializedDuration : this._duration; },
    // getCurrentTime () { return this._currentTime; },  // onTimeUpdate not working...
    getCurrentTime () { return this._nativeAudio.currentTime; },
    seek (val) {
        if (this._currentTime === val) {
            return;
        }
        this.loadPromise.then(() => {
            this._nativeAudio.seek(val);
            this._currentTime = val;
        });
    },
    getLoop () { return this._loop; },
    setLoop (val) {
        if (this._loop === val) {
            return;
        }
        this.loadPromise.then(() => {
            this.nativeAudio.loop = val;
            this._loop = val;
        });
    },
    getVolume () { return this._volume; },
    setVolume (val) {
        if (this._volume === val) {
            return;
        }
        this.loadPromise.then(() => {
            this.nativeAudio.volume = val;
            this._volume = val;
        });
    },

    play () {
        if (this.getState() !== State.PLAYING) {
            this._nativeAudio.play();
            this._state = State.PLAYING;
        }
    },
    resume () {
        if (this.getState() === State.PAUSED) {
            this._nativeAudio.play();
            this._state = State.PLAYING;
        }
    },
    pause () {
        if (this.getState() === State.PLAYING) {
            this._nativeAudio.pause();
            this._state = State.PAUSED;
        }
    },
    stop () {
        this._nativeAudio.stop();
        this._state = State.STOPPED;
    },

    onLoad (cb) { this._et.on('load', cb); },
    offLoad (cb = undefined) { this._et.off('load', cb); },
    onError (cb) { this._et.on('error', cb); },
    offError (cb = undefined) { this._et.off('error', cb); },
    onEnded (cb) { this._et.on('ended', cb); },
    offEnded (cb = undefined) { this._et.off('ended', cb); },
    onStop (cb) { this._et.on('stop', cb); },
    offStop (cb = undefined) { this._et.off('stop', cb); },
});

module.exports = Audio;