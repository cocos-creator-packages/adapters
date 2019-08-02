function adaptView (viewProto) {
    Object.assign(viewProto, {
        _adjustViewportMeta () {
            // minigame not support
        },
    
        setRealPixelResolution (width, height, resolutionPolicy) {
            // Reset the resolution size and policy
            this.setDesignResolutionSize(width, height, resolutionPolicy);
        },
    
        enableAutoFullScreen: function(enabled) {
            cc.warn('cc.view.enableAutoFullScreen() is not supported on minigame platform.');
        },
    });
}

module.exports = adaptView;