if (cc && cc.LabelComponent) {
    // const gfx = cc.gfx;
    const Label = cc.LabelComponent;
    const isDevTool = window.navigator && (/AlipayIDE/.test(window.navigator.userAgent));

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
    // Object.assign(Label.prototype, {
    //     setMaterial(index, material) {
    //         cc.RenderComponent.prototype.setMaterial.call(this, index, material);

    //         // init blend factor
    //         let dstBlendFactor = cc.macro.BlendFactor.ONE_MINUS_SRC_ALPHA;
    //         let srcBlendFactor;
    //         if (!(isDevTool || this.font instanceof cc.BitmapFont)) {
    //             // Premultiplied alpha on runtime
    //             srcBlendFactor = cc.macro.BlendFactor.ONE;
    //         }
    //         else {
    //             srcBlendFactor = cc.macro.BlendFactor.SRC_ALPHA;
    //         }

    //         // set blend func
    //         material.effect.setBlend(
    //             true,
    //             gfx.BLEND_FUNC_ADD,
    //             srcBlendFactor, dstBlendFactor,
    //             gfx.BLEND_FUNC_ADD,
    //             srcBlendFactor, dstBlendFactor,
    //         );

    //         material.setDirty(true);
    //     },
    // });
}
