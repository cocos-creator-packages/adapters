const Audio = cc._Audio;

if (Audio) {
    Object.assign(Audio.prototype, {
        play () {
            this._src && this._src._ensureLoaded(() => {
                // marked as playing so it will playOnLoad
                this._state = Audio.State.PLAYING;
                // TODO: move to audio event listeners
                this._bindEnded();
                // audio can't play before being loaded
                this._element._audio.play().catch(() => {
                    let onCanplayCb = () => {
                        this._element.offCanplay(onCanplayCb);
                        this._element.play();
                    }
                    this._element.onCanplay(onCanplayCb);
                });
            });
        },
    });
}