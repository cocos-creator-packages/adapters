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
            let dstBlendFactor = cc.gfx.BlendFactor.ONE_MINUS_SRC_ALPHA;
            let srcBlendFactor;
            if (!(isDevTool || this.font instanceof cc.BitmapFont)) {
                srcBlendFactor = cc.gfx.BlendFactor.ONE;
            }
            else {
                srcBlendFactor = cc.gfx.BlendFactor.SRC_ALPHA;
            }

            let mat = this.getMaterial(0);
            const target = this._blendTemplate.blendState.targets[0];

            if ((this._uiMaterialIns !== null && this._uiMatInsDirty) ||
                (target.blendDst !== dstBlendFactor || target.blendSrc !== srcBlendFactor)) {
                mat = this.getUIMaterialInstance();
                target.blendDst = dstBlendFactor;
                target.blendSrc = srcBlendFactor;
                mat.overridePipelineStates(this._blendTemplate, 0);
            }

            return mat || this.getUIRenderMaterial();
        }
    });
}
