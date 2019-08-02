const systemInfo = require('../common/engine/globalAdapter/BaseSystemInfo');
let _env = null;
let adaptSysFunc = systemInfo.adaptSys;

Object.assign(systemInfo, {
    // Overrider init interface
    init (cb) {
        if (swan.getOpenDataContext) {
            _env = __globalAdapter.getSystemInfoSync();
            swan.getOpenDataContext().postMessage({
                fromAdapter: true,
                event: 'main-context-info',
                sysInfo: _env,
                innerWidth: window.innerWidth,
                innerHeight: window.innerHeight,
                devicePixelRatio: window.devicePixelRatio,
            });
            cb && cb();
        }
        else {
            swan.onMessage(function (data) {
                if (data.fromAdapter) {
                    if (data.event === 'main-context-info') {
                        _env = data.sysInfo;
                        Object.defineProperty(window, 'innerWidth', {
                            enumerable: true,
                            get () {
                                return data.innerWidth;
                            },
                        });
                        Object.defineProperty(window, 'innerHeight', {
                            enumerable: true,
                            get () {
                                return data.innerHeight;
                            },
                        });
                        Object.defineProperty(window, 'devicePixelRatio', {
                            enumerable: true,
                            get () {
                                return data.devicePixelRatio;
                            },
                        });
                        
                        cb && cb();
                    }
                }
            });
        }
    },

    // Extend adaptSys interface
    adaptSys (sys) {
        adaptSysFunc.call(this, sys, _env);
        // baidugame subdomain
        if (!swan.getOpenDataContext) {
            sys.platform = sys.BAIDU_GAME_SUB;
            sys.browserType = sys.BROWSER_TYPE_BAIDU_GAME_SUB;
        }
        else {
            sys.platform = sys.BAIDU_GAME;
            sys.browserType = sys.BROWSER_TYPE_BAIDU_GAME;
        }

        sys.glExtension = function (name) {
            if (name === 'OES_texture_float') {
                return false;
            }
            return !!cc.renderer.device.ext(name);
        };
    }
});

__globalAdapter.init = systemInfo.init;
__globalAdapter.adaptSys = systemInfo.adaptSys;