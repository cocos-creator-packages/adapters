const Audio = cc.Audio;

if (Audio) {
    Object.assign(Audio.prototype, {
        _createElement () {
            let elem = this._src._nativeAsset;
            // Reuse dom audio element
            if (!this._element) {
                this._element = __globalAdapter.createInnerAudioContext();
            }
            this._element.src = elem.src;
        },

        destroy () {
            if (this._element) {
                this._element.destroy();
                this._element = null;
            }
        },

        setCurrentTime (num) {
            if (!this._element) {
                this._nextTime = num;
                return;
            }
            this._nextTime = 0;
            this._element.seek(num);
        },

        stop () {
            if (!this._element) return;
            // HACK: some platforms won't set currentTime to 0 when stop audio
            this._element.seek(0);
            this._element.stop();
            this._unbindEnded();
            this.emit('stop');
            this._state = Audio.State.STOPPED;
        },

        _bindEnded (callback) {
            callback = callback || this._onended;
            let elem = this._element;
            if (elem) {
              elem.onEnded && elem.onEnded(callback);
            }
        },

        _unbindEnded () {
            let elem = this._element;
            if (elem) {
              elem.offEnded && elem.offEnded();
            }
        },

        // adapt some special operations on web platform
        _touchToPlay () { },
        _forceUpdatingState () { },
    });
}