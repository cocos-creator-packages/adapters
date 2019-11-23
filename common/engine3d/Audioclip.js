const AudioClip = cc.AudioClip;
const AudioPlayerMini = cc.AudioPlayer;

if(AudioClip && AudioPlayerMini) {
    Object.assign(AudioClip.prototype, {
        set _nativeAsset (clip) {
            this._audio = clip;
            if (clip) {
                ctor = AudioPlayerMini;
                this._loadMode = AudioType.MINI_GAME_AUDIO;
                this._player = new ctor({ clip, duration: this._duration, eventTarget: this });
                this.loaded = true;
                this.emit('load');
            } else {
                this._player = null;
                this._loadMode = AudioType.UNKNOWN_AUDIO;
                this._duration = 0;
                this.loaded = false;
            }
        },
    });
}