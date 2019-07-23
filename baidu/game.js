require('./libs/adapter/builtin/index.js.js.js');
require('./libs/adapter/engine/globalAdapter/index.js.js.js');
window.__globalAdapter.init(function () {
    var Parser = require('./libs/xmldom/dom-parser.js.js.js');
    window.DOMParser = Parser.DOMParser;
    require('./src/settings.js.js.js');
    let settings = window._CCSettings;
    require('./main.js.js.js');
    require(settings.debug ? 'cocos2d-js.js' : 'cocos2d-js-min.js');
    require('./libs/adapter/engine/index.js.js.js');
    require('./libs/swan-downloader');

    swanDownloader.REMOTE_SERVER_ROOT = "";
    swanDownloader.SUBCONTEXT_ROOT = "";
    var pipeBeforeDownloader = cc.loader.subPackPipe || cc.loader.md5Pipe || cc.loader.assetLoader;
    cc.loader.insertPipeAfter(pipeBeforeDownloader, swanDownloader);

    if (cc.sys.browserType === cc.sys.BROWSER_TYPE_BAIDU_GAME_SUB) {
        var _BAIDU_SUBDOMAIN_DATA = require('src/subdomain.json.js');
        cc.game.once(cc.game.EVENT_ENGINE_INITED, function () {
            cc.Pipeline.Downloader.PackDownloader._doPreload("BAIDU_SUBDOMAIN", _BAIDU_SUBDOMAIN_DATA);
        });

        require('./libs/sub-context-adapter.js.js.js');
    }
    else {
        // Release Image objects after uploaded gl texture
        cc.macro.CLEANUP_IMAGE_CACHE = true;
    }

    swanDownloader.init();
    window.boot();
});