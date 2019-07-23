cc.loader.downloader.loadSubpackage = function (name, completeCallback) {
    wx.loadSubpackage({
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
    var url = '../../' + item.url;
    require(url);
    callback(null, item.url);
}

function loadFont (item) {
    var url = item.url;
    var fontFamily = wx.loadFont(url);
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
    dom.src = item.url;

    callback(null, dom);
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

function downloadWebp (item, callback) {
    if (!cc.sys.capabilities.webp) {
        return new Error(cc.debug.getError(4929, item.url));
    }
    return downloadImage(item, callback);
}

cc.loader.downloader.addHandlers({
    js : downloadScript,

    // Audio
    mp3 : downloadAudio,
    ogg : downloadAudio,
    wav : downloadAudio,
    m4a : downloadAudio,

    // Image
    png : downloadImage,
    jpg : downloadImage,
    bmp : downloadImage,
    jpeg : downloadImage,
    gif : downloadImage,
    ico : downloadImage,
    tiff : downloadImage,
    image : downloadImage,
    webp : downloadWebp,
});

cc.loader.loader.addHandlers({
    // Font
    font: loadFont,
    eot: loadFont,
    ttf: loadFont,
    woff: loadFont,
    svg: loadFont,
    ttc: loadFont,

    // Images
    png : loadImage,
    jpg : loadImage,
    bmp : loadImage,
    jpeg : loadImage,
    gif : loadImage,
    ico : loadImage,
    tiff : loadImage,
    webp : loadImage,
    image : loadImage,
});
