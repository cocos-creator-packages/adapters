cc.loader.downloader.loadSubpackage = function(name, completeCallback) {
    wx.loadSubpackage({
        name: name,
        success: function() {
            Promise.all(packageModuleIds.map((id) => {
                return ccEnv.imp(id);
            })).then(() => {
                if (completeCallback) { completeCallback(); }
            }).catch((error) => {
                console.error(error);
                if (completeCallback) { completeCallback(new Error(`Failed to load subpackage ${name}`)); }
            });
        },
        fail: function() {
            if (completeCallback) { completeCallback(new Error(`Failed to load subpackage ${name}`)); }
        },
    });
};

function downloadScript (item, callback, isAsync) {
    var url = '../../../' + item.url;
    require(url);
    callback(null, item.url);
}

function loadFont (item) {
    var url = item.url;
    var fontFamily = __globalAdapter.loadFont(url);
    return fontFamily || 'Arial';
}

function loadImage (item) {
    var loadByDeserializedAsset = (item._owner instanceof cc.Asset);
    if (loadByDeserializedAsset) {
        // already has cc.Asset
        return null;
    }

    var image = item.content;

    // load cc.ImageAsset
    var rawUrl = item.rawUrl;
    var imageAsset = item.imageAsset || new ImageAsset();
    imageAsset._uuid = item.uuid;
    imageAsset.url = rawUrl;
    imageAsset._setRawAsset(rawUrl, false);
    imageAsset._nativeAsset = image;
    return imageAsset;
}

function downloadImage (item, callback, isCrossOrigin) {
    if (isCrossOrigin === undefined) {
        isCrossOrigin = true;
    }

    var url = item.url;
    var img = new Image();
    if (isCrossOrigin && window.location.protocol !== 'file:') {
        img.crossOrigin = 'anonymous';
    }
    else {
        img.crossOrigin = null;
    }

    function loadCallback () {
        img.removeEventListener('load', loadCallback);
        img.removeEventListener('error', errorCallback);

        img.id = item.id;
        callback(null, img);
    }
    function errorCallback () {
        img.removeEventListener('load', loadCallback);
        img.removeEventListener('error', errorCallback);

        // Retry without crossOrigin mark if crossOrigin loading fails
        // Do not retry if protocol is https, even if the image is loaded, cross origin image isn't renderable.
        if (window.location.protocol !== 'https:' && img.crossOrigin && img.crossOrigin.toLowerCase() === 'anonymous') {
            downloadImage(item, callback, false);
        }
        else {
            callback(new Error(cc.debug.getError(4930, url)));
        }
    }

    img.addEventListener('load', loadCallback);
    img.addEventListener('error', errorCallback);
    img.src = url;
}

function downloadAudio (item, callback) {
    if (cc.sys.__audioSupport.format.length === 0) {
        return new Error(debug.getError(4927));
    }

    loadMiniAudio(item, callback);
}

const AudioPlayerMini = require('./AudioPlayer');

function loadMiniAudio (item, callback) {
    const clip = __globalAdapter.createInnerAudioContext();
    clip.src = item.url;
    item._owner._getPlayer = function (clip) {
        let ctor = AudioPlayerMini;
        this._loadMode = 2;
        return ctor;
    };
    clip.onCanplay(() => callback(null, clip));
}

cc.loader.downloader.addHandlers({
    js : downloadScript,
    png : downloadImage,
    jpg : downloadImage,
    bmp : downloadImage,
    jpeg : downloadImage,
    gif : downloadImage,
    ico : downloadImage,
    tiff : downloadImage,
    webp : downloadImage,
    image : downloadImage,

    // Audio
    mp3 : downloadAudio,
    ogg : downloadAudio,
    wav : downloadAudio,
    m4a : downloadAudio,
});

cc.loader.loader.addHandlers({

    // Images
    png: loadImage,
    jpg: loadImage,
    bmp: loadImage,
    jpeg: loadImage,
    gif: loadImage,
    ico: loadImage,
    tiff: loadImage,
    webp: loadImage,
    image: loadImage,

    // Font
    font: loadFont,
    eot: loadFont,
    ttf: loadFont,
    woff: loadFont,
    svg: loadFont,
    ttc: loadFont,
});
