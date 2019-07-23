const Audio = cc.Audio;

if (Audio) {
    Object.assign(Audio.prototype, {
        _createElement () {
            let elem = this._src._nativeAsset;
            // Reuse dom audio element
            if (!this._element) {
                this._element = wx.createInnerAudioContext();
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
        
        // adapt some special operations on web platform
        _touchToPlay () { },
        _forceUpdatingState () { },
    });
  
    if (cc.sys.os === cc.sys.OS_ANDROID) {
        Audio.prototype.stop = function () {
            if (!this._element) return;
            // 由于 web 端没有 stop 接口，是通过 pause + currentTime = 0 的方式进行 stop 的
            // 但是在微信小游戏安卓平台上，pause 后是无法设置 currentTime 为 0 的，从而进行适配
            this._element.currentTime = 0;
            this._element.stop();
            this._unbindEnded();
            this.emit('stop');
            this._state = cc.Audio.State.STOPPED;
        };
    }
}
