const systemInfo = require('../common/engine3d/globalAdapter/BaseSystemInfo');
const env = wx.getSystemInfoSync();
let adaptSysFunc = systemInfo.adaptSys;

Object.assign(systemInfo, {
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
        // wechatgame subdomain
        if (!wx.getOpenDataContext) {
            sys.platform = sys.WECHAT_GAME_SUB;
        }
        else {
          sys.platform = sys.WECHAT_GAME;
        }
    }
});

__globalAdapter.init = systemInfo.init;
__globalAdapter.adaptSys = systemInfo.adaptSys;