if (cc && cc.LabelComponent) {
    // const gfx = cc.gfx;
    const Label = cc.LabelComponent;
    const isDevTool = __globalAdapter.isDevTool;

    // shared label canvas
    let _sharedLabelCanvas = document.createElement('canvas');
    let _sharedLabelCanvasCtx = _sharedLabelCanvas.getContext('2d');
    let canvasData = {
        canvas: _sharedLabelCanvas,
        context: _sharedLabelCanvasCtx,
    };

    cc.game.on(cc.Game.EVENT_ENGINE_INITED, function () {
        Object.assign(Label._canvasPool, {
            get() {
                return canvasData;
            },

            put() {
                // do nothing
            }
        });
    });

    // fix ttf font black border
    Object.assign(Label.prototype, {
        _updateBlendFunc () {
            if(this._material) {
                let dstBlendFactor = cc.GFXBlendFactor.ONE_MINUS_SRC_ALPHA;
                let srcBlendFactor;
                if (!(isDevTool || this.font instanceof cc.BitmapFont)) {
                    srcBlendFactor = cc.GFXBlendFactor.ONE;
                }
                else {
                    srcBlendFactor = cc.GFXBlendFactor.SRC_ALPHA;
                }
                const target = this._blendTemplate.blendState.targets[0];
                if (target.blendDst !== dstBlendFactor || target.blendSrc !== srcBlendFactor) {
                    target.blendDst = dstBlendFactor;
                    target.blendSrc = srcBlendFactor;
                    this._blendTemplate.depthStencilState = this._material.passes[0].depthStencilState;
                    this._blendTemplate.rasterizerState = this._material.passes[0].rasterizerState;
                    this._material.overridePipelineStates(this._blendTemplate, 0);
                }
            }
        }
    });
}
