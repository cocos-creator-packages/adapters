require('./ccRequire');
require('adapter-js-path');
__globalAdapter.init();
require('cocos2d-js-path');
require('physics-js-path');
__globalAdapter.adaptEngine();

require('./src/settings');
// Introduce Cocos Service here
require('./main');  // TODO: move to common

// Adjust devicePixelRatio
cc.view._maxPixelRatio = 4;

// Release Image objects after uploaded gl texture
cc.macro.CLEANUP_IMAGE_CACHE = true;

window.boot();


