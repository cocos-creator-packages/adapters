const inputManager = _cc.inputManager;
const canvasPosition = {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight
};

Object.assign(inputManager, {
    _updateCanvasBoundingRect () {},
    
    registerSystemEvent (element) {
        if(this._isRegisterEvent) return;

        this._glView = cc.view;
        let self = this;

        //register touch event
        let _touchEventsMap = {
            'touchstart': this.handleTouchesBegin,
            'touchmove': this.handleTouchesMove,
            'touchend': this.handleTouchesEnd,
            'touchcancel': this.handleTouchesCancel,
        };

        let registerTouchEvent = function (eventName) {
            let handler = _touchEventsMap[eventName];
            element.addEventListener(eventName, (function(event) {
                if (!event.changedTouches) return;
                handler.call(self, self.getTouchesByEvent(event, canvasPosition));
                event.stopPropagation();
                // event.preventDefault();  // Canvas is treated as passive on XiaoMi
            }), false);
        };

        for (let eventName in _touchEventsMap) {
            registerTouchEvent(eventName);
        }

        this._isRegisterEvent = true;
    },
});