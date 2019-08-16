const systemInfo = require('../common/engine/globalAdapter/BaseSystemInfo');
let adaptSysFunc = systemInfo.adaptSys;

Object.assign(systemInfo, {
    // Extend adaptSys interface
    adaptSys (sys) {
        adaptSysFunc.call(this, sys);
        // baidugame subdomain
        if (!wx.getOpenDataContext) {
            sys.platform = sys.WECHAT_GAME_SUB;
          sys.browserType = sys.BROWSER_TYPE_WECHAT_GAME_SUB;
        }
        else {
          sys.platform = sys.WECHAT_GAME;
          sys.browserType = sys.BROWSER_TYPE_WECHAT_GAME;
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