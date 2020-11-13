cc.game.restart = function () {
};

qg && qg.onHide(function (data) {
    cc.game.emit(cc.Game.EVENT_HIDE);
});

qg && qg.onShow(function () {
    cc.game.emit(cc.Game.EVENT_SHOW);
});

qg && qg.onWindowResize && qg.onWindowResize(function () {
    // Since the initialization of the creator engine may not take place until after the onWindowResize call,
    // you need to determine whether the canvas already exists before you can call the setCanvasSize method
    cc.game.canvas && cc.view.setCanvasSize(window.innerWidth, window.innerHeight);
});
