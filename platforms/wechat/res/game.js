require('./libs/wrapper/builtin/index');
window.DOMParser = require('./libs/common/xmldom/dom-parser').DOMParser;
require('./libs/common/engine/globalAdapter/index');
require('./libs/wrapper/unify');
require('./libs/wrapper/systemInfo');
// Ensure getting the system info in open data context
window.__globalAdapter.init(function () {
    require('./src/settings');
    // Will be replaced with cocos2d-js path in editor
    require('cocos2d-js-path');
    require('./libs/common/engine/index');
    require('./main');

    // Adjust devicePixelRatio
    cc.view._maxPixelRatio = 4;
    
    // handle remote downloader
    window.REMOTE_SERVER_ROOT = "";
    window.SUBCONTEXT_ROOT = "";

    if (cc.sys.platform === cc.sys.WECHAT_GAME_SUB) {
        require('./libs/wrapper/sub-context-adapter');
    }
    else {
        // Release Image objects after uploaded gl texture
        cc.macro.CLEANUP_IMAGE_CACHE = true;
    }
    window.boot();
});