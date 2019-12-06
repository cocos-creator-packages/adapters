require('adapter-js-path');
__globalAdapter.init();
require('cocos2d-js-path');
__globalAdapter.adaptEngine();

require('./src/settings');
// Introduce Cocos Service here
require('./main');  // TODO: move to common

// Adjust devicePixelRatio
cc.view._maxPixelRatio = 4;

// downloader polyfill
window.myDownloader = remoteDownloader;
// handle remote downloader
remoteDownloader.REMOTE_SERVER_ROOT = "";
remoteDownloader.SUBCONTEXT_ROOT = "";
var pipeBeforeDownloader = cc.loader.subPackPipe || cc.loader.md5Pipe || cc.loader.assetLoader;
cc.loader.insertPipeAfter(pipeBeforeDownloader, remoteDownloader);

// Release Image objects after uploaded gl texture
cc.macro.CLEANUP_IMAGE_CACHE = true;

remoteDownloader.init();
window.boot();