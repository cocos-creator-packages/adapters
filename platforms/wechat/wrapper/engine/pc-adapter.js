const env = wx.getSystemInfoSync();
const inputMgr = cc.internal.inputManager;
const eventMgr = cc.internal.eventManager;
const EventKeyboard = cc.Event.EventKeyboard;
const EventMouse = cc.Event.EventMouse;

function adaptKeyboadEvent () {
    // map from CCMacro
    const key2keyCode = {
        Backspace: 8,
        Tab: 9,
        Enter: 13,
        Shift: 16,
        Control: 17,
        Alt: 18,
        // pause: 19,
        CapsLock: 20,
        Escape: 27,
        Space: 32,
        PageUp: 33,
        PageDown: 34,
        End: 35,
        Home: 36,
        ArrowLeft: 37,
        ArrowUp: 38,
        ArrowRight: 39,
        ArrowDown: 40,
        Insert: 45,
        Delete: 46,
        0: 48,
        1: 49,
        2: 50,
        3: 51,
        4: 52,
        5: 53,
        6: 54,
        7: 55,
        8: 56,
        9: 57,
        a: 65,
        b: 66,
        c: 67,
        d: 68,
        e: 69,
        f: 70,
        g: 71,
        h: 72,
        i: 73,
        j: 74,
        k: 75,
        l: 76,
        m: 77,
        n: 78,
        o: 79,
        p: 80,
        q: 81,
        r: 82,
        s: 83,
        t: 84,
        u: 85,
        v: 86,
        w: 87,
        x: 88,
        y: 89,
        z: 90,
        // num0: 96,
        // num1: 97,
        // num2: 98,
        // num3: 99,
        // num4: 100,
        // num5: 101,
        // num6: 102,
        // num7: 103,
        // num8: 104,
        // num9: 105,
        '*': 106,
        '+': 107,
        '-': 109,
        // 'numdel': 110,
        '/': 111,
        F1: 112,
        F2: 113,
        F3: 114,
        F4: 115,
        F5: 116,
        F6: 117,
        F7: 118,
        F8: 119,
        F9: 120,
        F10: 121,
        F11: 122,
        F12: 123,
        NumLock: 144,
        ScrollLock: 145,
        ';': 186,
        '=': 187,
        ',': 188,
        '.': 190,
        '`': 192,
        '[': 219,
        '\\': 220,
        ']': 221,
        '"': 222,
    };
    wx.onKeyDown(res => eventMgr.dispatchEvent(new EventKeyboard(key2keyCode[res.key] || 0, true)));
    wx.onKeyUp(res => eventMgr.dispatchEvent(new EventKeyboard(key2keyCode[res.key] || 0, false)));
}

function adaptMouseEvent () {
    let canvasRect = {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
    };
    function registerMouseEvent (funcName, engineEventType, handler) {
        wx[funcName](res => {
            let mouseEvent = inputMgr.getMouseEvent(res, canvasRect, engineEventType);
            mouseEvent.setButton(res.button || 0);
            handler(res, mouseEvent);
            eventMgr.dispatchEvent(mouseEvent);
        });
    }
    registerMouseEvent('onMouseDown', EventMouse.DOWN, function (res, mouseEvent) {
        inputMgr._mousePressed = true;
        inputMgr.handleTouchesBegin([inputMgr.getTouchByXY(res.x, res.y, canvasRect)]);
    });
    registerMouseEvent('onMouseUp', EventMouse.UP, function (res, mouseEvent) {
        inputMgr._mousePressed = false;
        inputMgr.handleTouchesEnd([inputMgr.getTouchByXY(res.x, res.y, canvasRect)]);
    });
    registerMouseEvent('onMouseMove', EventMouse.MOVE, function (res, mouseEvent) {
        inputMgr.handleTouchesMove([inputMgr.getTouchByXY(res.x, res.y, canvasRect)]);
        if (!inputMgr._mousePressed) {
            mouseEvent.setButton(null);
        }
    });
    registerMouseEvent('onWheel', EventMouse.SCROLL, function (res, mouseEvent) {
        mouseEvent.setScrollData(0, -res.deltaY);
    });
}

(function () {
    // TODO: add mac
    if (env.platform !== 'windows') {
        return;
    }
    inputMgr.registerSystemEvent = function () {
        if (this._isRegisterEvent) {
            return;
        }
        this._glView = cc.view;
        adaptKeyboadEvent();
        adaptMouseEvent();
        this._isRegisterEvent = true;
    };
})();
