if (cc && cc.Label) {
    const gfx = cc.gfx;
    const Label = cc.Label;
    const globalAdapter = __globalAdapter;
    // shared label canvas
    if (!globalAdapter.isSubContext) {
        let _sharedLabelCanvas = document.createElement('canvas');
        let _sharedLabelCanvasCtx = _sharedLabelCanvas.getContext('2d');
        let canvasData = {
            canvas: _sharedLabelCanvas,
            context: _sharedLabelCanvasCtx,
        };
        cc.game.on(cc.game.EVENT_ENGINE_INITED, function () {
            Object.assign(Label._canvasPool, {
                get() {
                    return canvasData;
                },
    
                put() {
                    // do nothing
                }
            });
        });
    }
}