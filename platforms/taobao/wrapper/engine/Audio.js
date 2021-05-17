const Audio = cc._Audio;

if (Audio) {
    Object.assign(Audio.prototype, {
        getCurrentTime () {
            if (this._element) {
                // innerAudioContext.currentTime is not supported on Taobao platform.
                return this._element.currentTime ? this._element.currentTime : 0;
            } else {
                return 0;
            }
        },
        
        getDuration: function () {
            if (this._element) {
                // innerAudioContext.duration is not supported on Taobao platform.
                return this._element.duration ? this._element.duration : 1;
            } else {
                return 0;
            }
        },
    });
}
