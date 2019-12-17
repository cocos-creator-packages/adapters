require('./src/settings');
require('adapter-js-path');
__globalAdapter.init();
require(window._CCSettings.debug ? 'cocos2d-js.js' : 'cocos2d-js-min.js');
__globalAdapter.adaptEngine();
require('./ccRequire');

// Introduce Cocos Service here
require('./boot');  // TODO: move to common

// Adjust devicePixelRatio
cc.view._maxPixelRatio = 4;

// downloader polyfill
window.miDownloader = remoteDownloader;
// handle remote downloader
remoteDownloader.REMOTE_SERVER_ROOT = "";
remoteDownloader.SUBCONTEXT_ROOT = "";
var pipeBeforeDownloader = cc.loader.subPackPipe || cc.loader.md5Pipe || cc.loader.assetLoader;
cc.loader.insertPipeAfter(pipeBeforeDownloader, remoteDownloader);

// Release Image objects after uploaded gl texture
cc.macro.CLEANUP_IMAGE_CACHE = true;

remoteDownloader.init();
window.boot();