const adapter = window.__globalAdapter;
const env = tt.getSystemInfoSync();
let adaptSysFunc = adapter.adaptSys;

Object.assign(adapter, {
    // Extend adaptSys interface
    adaptSys (sys) {
        adaptSysFunc.call(this, sys);
        // TODO: add mac platform
        if (env.platform === 'windows') {
            sys.isMobile = false;
            sys.os = sys.OS_WINDOWS;
        }
        else if (env.platform === 'devtools') {
            let system = env.system.toLowerCase();
            if (system.indexOf('android') > -1) {
                sys.os = sys.OS_ANDROID;
            }

            else if (system.indexOf('ios') > -1) {
                sys.os = sys.OS_IOS;
            }
        }
        if (!tt.getOpenDataContext) {
            sys.platform = sys.BYTEDANCE_GAME_SUB;
        }
        else {
            sys.platform = sys.BYTEDANCE_GAME;
        }
        sys.browserType = sys.BROWSER_TYPE_MINIGAME;

        sys.glExtension = function (name) {
            if (name === 'OES_texture_float') {
                return false;
            }
            return !!cc.renderer.device.ext(name);
        };
    },
});