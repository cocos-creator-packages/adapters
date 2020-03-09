let loadedSubPackages = {};

cc.loader.downloader.loadSubpackage = function (name, progressCallback, completeCallback) {
    if (!completeCallback && progressCallback) {
        completeCallback = progressCallback;
        progressCallback = null;
    }
    // Not support for now on Alipay platform
    if (loadedSubPackages[name] !== true) {
        require(`../../../subpackages/${name}/index.js`);
        loadedSubPackages[name] = true;
    }
    completeCallback && completeCallback();
};

function downloadAudio (item, callback) {
    if (cc.sys.__audioSupport.format.length === 0) {
        return new Error(cc.debug.getError(4927));
    }

    let audio = my.createInnerAudioContext();
    audio.src = item.url;
    callback(null, audio);
}

// FIX audio downlaod error on Alipay iOS 10.1.78
if (!__globalAdapter.isDevTool && cc.sys.os === cc.sys.OS_IOS) {
    cc.loader.downloader.addHandlers({
        // Audio
        mp3 : downloadAudio,
        ogg : downloadAudio,
        wav : downloadAudio,
        m4a : downloadAudio,
    });
}