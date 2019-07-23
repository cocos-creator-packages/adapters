const sys = cc.sys;
const mgr = _cc && _cc.inputManager;
const canvasPosition = {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight
};

if (mgr) {
    Object.assign(mgr, {
        _updateCanvasBoundingRect () {},
        
        registerSystemEvent (element) {
            if(this._isRegisterEvent) return;
    
            this._glView = cc.view;
            let self = this;
    
            //register touch event
            let _touchEventsMap = {
                onTouchStart: this.handleTouchesBegin,
                onTouchMove: this.handleTouchesMove,
                onTouchEnd: this.handleTouchesEnd,
                onTouchCancel: this.handleTouchesCancel,
            };
    
            let registerTouchEvent = function (eventName) {
                let handler = _touchEventsMap[eventName];
                swan[eventName](function (event) {
                    if (!event.changedTouches) return;
                    handler.call(self, self.getTouchesByEvent(event, canvasPosition));
                });
            };
    
            for (let eventName in _touchEventsMap) {
                registerTouchEvent(eventName);
            }
    
            this._isRegisterEvent = true;
        },
    });
}