let loadedSubPackages = {};

cc.loader.downloader.loadSubpackage = function (name, completeCallback) {
    // Not support for now on Alipay platform
    if (loadedSubPackages[name] !== true) {
        require(`../../../subpackages/${name}/index.js`);
        loadedSubPackages[name] = true;
    }
    completeCallback && completeCallback();
};

function downloadAudio (item, callback) {
    if (cc.sys.__audioSupport.format.length === 0) {
        return new Error(debug.getError(4927));
    }

    let audio = my.createInnerAudioContext();
    audio.onCanPlay(() => {
      callback(null, audio);
    });
    audio.onError(() => {
      callback(new Error('load audio failed ' + item.url), null);
    });
    audio.src = item.url;
}

// FIX audio downlaod error on Alipay iOS 10.1.78
if (cc.sys.os === cc.sys.OS_IOS) {
    cc.loader.downloader.addHandlers({
        // Audio
        mp3 : downloadAudio,
        ogg : downloadAudio,
        wav : downloadAudio,
        m4a : downloadAudio,
    });
}