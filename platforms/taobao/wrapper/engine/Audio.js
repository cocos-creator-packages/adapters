const Audio = cc._Audio;

if (Audio) {
    Object.assign(Audio.prototype, {
        _createElement () {
            let url = this._src._nativeAsset;
            // Reuse dom audio element
            if (!this._element) {
                this._element = __globalAdapter.createInnerAudioContext();
            }
            this._element.src = url;
        },
    });
}
