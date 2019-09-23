cc.loader.downloader.loadSubpackage = function (name, completeCallback) {
    __globalAdapter.loadSubpackage({
        name: name,
        success: function () {
            if (completeCallback) completeCallback();
        },
        fail: function () {
            if (completeCallback) completeCallback(new Error(`Failed to load subpackage ${name}`));
        }
    })
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

    // load cc.Texture2D
    var rawUrl = item.rawUrl;
    var tex = item.texture || new cc.Texture2D();
    tex._uuid = item.uuid;
    tex.url = rawUrl;
    tex._setRawAsset(rawUrl, false);
    tex._nativeAsset = image;
    return tex;
}

function downloadAudio (item, callback) {
    if (cc.sys.__audioSupport.format.length === 0) {
        return new Error(debug.getError(4927));
    }

    var dom = document.createElement('audio');
    dom.addEventListener('load', function () {
        callback(null, dom);
    });
    dom.addEventListener('error', function () {
        callback(new Error('load audio failed ' + item.url), null);
    });
    dom.src = item.url;
}

function downloadVideo (item, callback) {
    callback(null, item.url);
}

function loadVideo (item, callback) {
    callback(null, item.url);
}

cc.loader.downloader.addHandlers({
    js : downloadScript,

    pvr: cc.loader.downloader.extMap.png,
    etc: cc.loader.downloader.extMap.png,

    // Audio
    mp3 : downloadAudio,
    ogg : downloadAudio,
    wav : downloadAudio,
    m4a : downloadAudio,

    // Video
    mp4: downloadVideo,
    avi: downloadVideo,
    mov: downloadVideo,
    mpg: downloadVideo,
    mpeg: downloadVideo,
    rm: downloadVideo,
    rmvb: downloadVideo,
});

cc.loader.loader.addHandlers({
    // Video
    mp4: loadVideo,
    avi: loadVideo,
    mov: loadVideo,
    mpg: loadVideo,
    mpeg: loadVideo,
    rm: loadVideo,
    rmvb: loadVideo,

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

    pvr: cc.loader.loader.extMap.png,
    etc: cc.loader.loader.extMap.png,

    // Font
    font: loadFont,
    eot: loadFont,
    ttf: loadFont,
    woff: loadFont,
    svg: loadFont,
    ttc: loadFont,
});
