Object.assign(cc.game, {
    setFrameRate (frameRate) {
        // neither my.setPreferredFramesPerSecond() nor window.setTimeout simulating is supported.
        console.warn('cc.game.setFrameRate() is not supported on Alipay platform.');
    },
});