require('./libs/wrapper/builtin');
window.DOMParser = require('./libs/common/xmldom/dom-parser').DOMParser;
require('./libs/common/engine/globalAdapter');
require('./libs/wrapper/unify');
require('./libs/wrapper/systemInfo');
// Ensure getting the system info in open data context
window.__globalAdapter.init(function () {
    require('./src/settings');
    require(window._CCSettings.debug ? 'cocos2d-js' : 'cocos2d-js-min');
    require('./libs/common/engine');
    require('./main');
    require('./libs/common/remote-downloader');

    // Adjust devicePixelRatio
    cc.view._maxPixelRatio = 4;

    // handle remote downloader
    remoteDownloader.REMOTE_SERVER_ROOT = "";
    remoteDownloader.SUBCONTEXT_ROOT = "";
    var pipeBeforeDownloader = cc.loader.subPackPipe || cc.loader.md5Pipe || cc.loader.assetLoader;
    cc.loader.insertPipeAfter(pipeBeforeDownloader, remoteDownloader);

    // Release Image objects after uploaded gl texture
    cc.macro.CLEANUP_IMAGE_CACHE = true;

    remoteDownloader.init();
    window.boot();
});