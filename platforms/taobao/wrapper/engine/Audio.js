const Audio = cc._Audio;
const sys = cc.sys;

const originalPlay = Audio.prototype.play;
const originalSetCurrentTime = Audio.prototype.setCurrentTime;
const originalStop = Audio.prototype.stop;

if (Audio) {
    Object.assign(Audio.prototype, {
        _currentTime: 0,
        _hasPlayed: false,

        _createElement () {
            let url = this._src._nativeAsset;
            // Reuse dom audio element
            if (!this._element) {
                this._element = __globalAdapter.createInnerAudioContext();
            }
            this._element.src = url;
        },

        play () {
            this._hasPlayed = true;
            originalPlay.call(this);
            if (sys.os === sys.OS_ANDROID && this._currentTime !== 0 && this._element) {
                this._element.seek(this._currentTime);
                this._currentTime = 0;  // clear currentTime cache
            }
        },

        stop () {
            // HACK: on Android, can't call stop before first playing
            if (sys.os === sys.OS_ANDROID) {
                if (!this._hasPlayed){
                    return;
                }
                originalStop.call(this);
            }
            // HACK: fix audio seeking on iOS end
            else {
                let self = this;
                this._src && this._src._ensureLoaded(function () {
                    // should not seek on iOS end
                    // self._element.seek(0);
                    self._element.stop();
                    self._unbindEnded();
                    self.emit('stop');
                    self._state = Audio.State.STOPPED;
                });
            }
        },

        setCurrentTime (num) {
            // HACK: on Android, cannot call seek before playing
            if (sys.os === sys.OS_ANDROID && this._element && this._element.paused) {
                this._currentTime = num;
            } else {
                originalSetCurrentTime.call(this, num);
            }
        },
    });
}
