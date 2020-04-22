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
            let self = this;
            this._src && this._src._ensureLoaded(function () {
                self._element.seek(num);
            });
        },

        stop () {
            let self = this;
            this._src && this._src._ensureLoaded(function () {
                // HACK: some platforms won't set currentTime to 0 when stop audio
                self._element.seek(0);
                self._element.stop();
                self._unbindEnded();
                self.emit('stop');
                self._state = Audio.State.STOPPED;
            });
        },

        _bindEnded () {
            let elem = this._element;
            if (elem) {
              elem.onEnded && elem.onEnded(this._onended);
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