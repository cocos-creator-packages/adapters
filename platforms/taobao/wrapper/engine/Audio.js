const game = cc.game;
const EventTarget = cc.EventTarget;

const State = {
    ERROR: -1,
    INITIALZING: 0,
    PLAYING: 1,
    PAUSED: 2,
    STOPPED: 3,
}

function Audio (nativeAudio, loadPromise) {
    this._nativeAudio = nativeAudio;
    this._src = '';
    this._et = new EventTarget();
    this.reset();
    loadPromise.then(() => {
        this._duration = nativeAudio.duration;
    });
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
    // HACK: the onEnded callback strangely executes before playing...
    setTimeout(() => {
        nativeAudio.onEnded(() => {
            this.finishCB && this.finishCB();
            this._state = State.INITIALZING;
            this._et.emit('ended');
        });
    }, 100);
    nativeAudio.onStop(() => { this._et.emit('stop'); });
    nativeAudio.onTimeUpdate(() => { this._currentTime = nativeAudio.currentTime; });
    game.on(game.EVENT_SHOW, this._onShow);
    game.on(game.EVENT_HIDE, this._onHide);
}

Audio.State = State;

Audio.loadNative = function (url) {
    const nativeAudio = my.createInnerAudioContext();
    const loadPromise = new Promise((resolve, reject) => {
        let done = false;
        // HACK: onCanplay callback not working on Taobao.
        let timer = setTimeout(() => {
            if (done) { return; }
            cc.warn('Timeout to load audio');
            done = true;
            resolve(nativeAudio);
        }, 3000);
        nativeAudio.onCanplay(() => {
            if (done) { return; }
            clearTimeout(timer);
            done = true;
            resolve(nativeAudio);
        });
        nativeAudio.onError((err) => {
            if (done) { return; }
            clearTimeout(timer);
            done = true;
            reject(err);
        });
        nativeAudio.src = url;
    });
    return { nativeAudio, loadPromise };
};

Audio.load = function (url) {
    const { nativeAudio, loadPromise } = Audio.loadNative(url);
    const audio = new Audio(nativeAudio, loadPromise);
    return { audio, loadPromise };
};

Object.assign(Audio.prototype, {

    reset () {
        this.id = -1;
        this.finishCB = null;  // For audioEngine custom ended callback.
        this._state = State.INITIALZING;
        this._loop = false;
        this._currentTime = 0;
        this._volume = 1;
        this._blocked = false;
    },

    destroy () {
        game.off(game.EVENT_SHOW, this._onShow);
        game.off(game.EVENT_HIDE, this._onHide);
        // offStop offEnded is not supported for now.
        this._nativeAudio.destroy();
        this._nativeAudio = null;
    },

    getSrc () { return this._src; },
    setSrc (path) { 
        if (this._src === path) {
            return;
        }
        this._nativeAudio.src = path;
        this._src = path;
    },
    getState () { return this._state; },
    getDuration () { return this._duration; },
    // getCurrentTime () { return this._currentTime; },  // onTimeUpdate not working...
    getCurrentTime () { return this._nativeAudio.currentTime; },
    seek (val) {
        if (this._currentTime === val) {
            return;
        }
        this._nativeAudio.seek(val);
        this._currentTime = val;
    },
    getLoop () { return this._loop; },
    setLoop (val) {
        if (this._loop === val) {
            return;
        }
        this.nativeAudio.loop = val;
        this._loop = val;
    },
    getVolume () { return this._volume; },
    setVolume (val) {
        if (this._volume === val) {
            return;
        }
        this.nativeAudio.volume = val;
        this._volume = val;
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

    onEnded (cb) { this._et.on('ended', cb); },
    offEnded (cb = undefined) { this._et.off('ended', cb); },
    onStop (cb) { this._et.on('stop', cb); },
    offStop (cb = undefined) { this._et.off('stop', cb); },
});

module.exports = Audio;