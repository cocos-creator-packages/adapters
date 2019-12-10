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
    // Introduce Cocos Service here
    require('./main');
    require('./libs/common/remote-downloader');
    require('./libs/wrapper/engine');

    // Adjust devicePixelRatio
    cc.view._maxPixelRatio = 4;

    // downloader polyfill
    window.wxDownloader = remoteDownloader;
    // handle remote downloader
    remoteDownloader.REMOTE_SERVER_ROOT = "";
    remoteDownloader.SUBCONTEXT_ROOT = "";
    var pipeBeforeDownloader = cc.loader.subPackPipe || cc.loader.md5Pipe || cc.loader.assetLoader;
    cc.loader.insertPipeAfter(pipeBeforeDownloader, remoteDownloader);

    if (cc.sys.platform === cc.sys.WECHAT_GAME_SUB) {
        var SUBDOMAIN_DATA = require('src/subdomain.json.js');
        cc.game.once(cc.game.EVENT_ENGINE_INITED, function () {
            cc.Pipeline.Downloader.PackDownloader._doPreload("SUBDOMAIN_DATA", SUBDOMAIN_DATA);
        });

        require('./libs/wrapper/sub-context-adapter');
    }
    else {
        // Release Image objects after uploaded gl texture
        cc.macro.CLEANUP_IMAGE_CACHE = true;
    }

    remoteDownloader.init();
    window.boot();
});