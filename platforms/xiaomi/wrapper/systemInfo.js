const systemInfo = require('../common/engine/globalAdapter/BaseSystemInfo');
let adaptSysFunc = systemInfo.adaptSys;

Object.assign(systemInfo, {
    // Extend adaptSys interface
    adaptSys (sys) {
        adaptSysFunc.call(this, sys);
        sys.platform = sys.XIAOMI_GAME;
        sys.browserType = sys.BROWSER_TYPE_XIAOMI_GAME;
    }
});

__globalAdapter.init = systemInfo.init;
__globalAdapter.adaptSys = systemInfo.adaptSys;