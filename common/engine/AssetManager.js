const cacheManager = require('../cache-manager');
const { fs, downloadFile, readText, readArrayBuffer, readJson, loadSubpackage, getUserDataPath } = window.fsUtils;

const REGEX = /^\w+:\/\/.*/;

const downloader = cc.assetManager.downloader;
const presets = cc.assetManager.presets;
const isSubDomain = __globalAdapter.isSubContext;
downloader.maxConcurrency = 8;
downloader.maxRequestsPerFrame = 64;
presets['scene'].maxConcurrency = 10;
presets['scene'].maxRequestsPerFrame = 64;

let SUBCONTEXT_ROOT, REMOTE_SERVER_ROOT;
let subpackages = {}, remoteBundles = {};

function downloadScript (url, options, onComplete) {
    if (typeof options === 'function') {
        onComplete = options;
        options = null;
    }
    if (REGEX.test(url)) {
        onComplete && onComplete(new Error('Can not load remote scripts'));
    }
    else {
        __cocos_require__(url);
        onComplete && onComplete(null);
    }
}

function handleZip (url, options, onComplete) {
    let cachedUnzip = cacheManager.cachedFiles.get(url);
    if (cachedUnzip) {
        cacheManager.updateLastTime(url);
        onComplete && onComplete(null, cachedUnzip.url);
    }
    else if (REGEX.test(url)) {
        downloadFile(url, null, options.header, options.onFileProgress, function (err, downloadedZipPath) {
            if (err) {
                onComplete && onComplete(err);
                return;
            }
            cacheManager.unzipAndCacheBundle(url, downloadedZipPath, options.__cacheBundleRoot__, onComplete);
        });
    }
    else {
        cacheManager.unzipAndCacheBundle(url, url, options.__cacheBundleRoot__, onComplete);
    }
}

function downloadDomAudio (url, options, onComplete) {
    if (typeof options === 'function') {
        onComplete = options;
        options = null;
    }
    
    var dom = document.createElement('audio');
    dom.src = url;
    
    // HACK: wechat does not callback when load large number of assets
    onComplete && onComplete(null, dom);
}

function readFile(filePath, options, onComplete) {
    switch (options.responseType) {
        case 'json': 
            readJson(filePath, onComplete);
            break;
        case 'arraybuffer':
            readArrayBuffer(filePath, onComplete);
            break;
        default:
            readText(filePath, onComplete);
            break;
    }
}

function download (url, func, options, onFileProgress, onComplete) {
    var result = transformUrl(url, options);
    if (result.inLocal) {
        func(result.url, options, onComplete);
    }
    else if (result.inCache) {
        cacheManager.updateLastTime(url);
        func(result.url, options, function (err, data) {
            if (err) {
                cacheManager.removeCache(url);
            }
            onComplete(err, data);
        });
    }
    else {
        downloadFile(url, null, options.header, onFileProgress, function (err, path) {
            if (err) {
                onComplete(err, null);
                return;
            }
            func(path, options, function (err, data) {
                if (!err) {
                    cacheManager.tempFiles.add(url, path);
                    cacheManager.cacheFile(url, path, options.cacheEnabled, options.__cacheBundleRoot__, true);
                }
                onComplete(err, data);
            });
        });
    }
}

var downloadJson = !isSubDomain ? function (url, options, onComplete) {
    options.responseType = "json";
    download(url, readFile, options, options.onFileProgress, onComplete);
} : function (url, options, onComplete) {
    var { url } = transformUrl(url, options);
    var content = require('../' + cc.path.changeExtname(url, '.js'));
    onComplete && onComplete(null, content);
}

var loadFont = !isSubDomain ? function (url, options, onComplete) {
    var fontFamily = __globalAdapter.loadFont(url);
    onComplete(null, fontFamily || 'Arial');
} : function (url, options, onComplete) {
    onComplete(null, 'Arial');
}

function downloadArrayBuffer (url, options, onComplete) {
    options.responseType = "arraybuffer";
    download(url, readFile, options, options.onFileProgress, onComplete);
}

function downloadText (url, options, onComplete) {
    options.responseType = "text";
    download(url, readFile, options, options.onFileProgress, onComplete);
}

function downloadAudio (url, options, onComplete) {
    download(url, downloadDomAudio, options, options.onFileProgress, onComplete);
}

function downloadVideo (url, options, onComplete) {
    download(url, function (url, options, onComplete) { onComplete(null, url); }, options, options.onFileProgress, onComplete);
}

function downloadFont (url, options, onComplete) {
    download(url, loadFont, options, options.onFileProgress, onComplete);
}

function downloadImage (url, options, onComplete) {
    download(url, downloader.downloadDomImage, options, options.onFileProgress, onComplete);
}

function subdomainDownloadImage (url, options, onComplete) {
    var { url } = transformUrl(url, options);
    downloader.downloadDomImage(url, options, onComplete);
}

function downloadImageInAndroid (url, options, onComplete) {
    var result = transformUrl(url, options);
    if (result.inLocal) {
        downloader.downloadDomImage(result.url, options, onComplete);
    }
    else if (result.inCache) {
        cacheManager.updateLastTime(url)
        downloader.downloadDomImage(result.url, options, onComplete);
    }
    else {
        downloader.downloadDomImage(url, options, function (err, img) {
            if (!err) {
                cacheManager.cacheFile(url, url, options.cacheEnabled, options.__cacheBundleRoot__, false);
            }
            onComplete(err, img);
        });
    }
}

function downloadBundle (nameOrUrl, options, onComplete) {
    let bundleName = cc.path.basename(nameOrUrl);
    var version = options.version || cc.assetManager.downloader.bundleVers[bundleName];

    if (subpackages[bundleName]) {
        var config = `subpackages/${bundleName}/config.${version ? version + '.' : ''}json`;
        loadSubpackage(bundleName, options.onFileProgress, function (err) {
            if (err) {
                onComplete(err, null);
                return;
            }
            downloadJson(config, options, function (err, data) {
                data && (data.base = `subpackages/${bundleName}/`);
                onComplete(err, data);
            });
        });
    }
    else {
        let js, url;
        if (REGEX.test(nameOrUrl)) {
            url = nameOrUrl;
            js = `src/scripts/${bundleName}/index.js`;
            cacheManager.makeBundleFolder(bundleName);
        }
        else {
            if (remoteBundles[bundleName]) {
                url = `${REMOTE_SERVER_ROOT}remote/${bundleName}`;
                js = `src/scripts/${bundleName}/index.js`;
                cacheManager.makeBundleFolder(bundleName);
            }
            else {
                url = `assets/${bundleName}`;
                js = `assets/${bundleName}/index.js`;
            }
        }
        __cocos_require__(js);
        options.cacheEnabled = true;
        options.__cacheBundleRoot__ = bundleName;
        var config = `${url}/config.${version ? version + '.' : ''}json`;
        downloadJson(config, options, function (err, data) {
            if (err) {
                onComplete && onComplete(err);
                return;
            }
            if (data.isZip) {
                let zipVersion = data.zipVersion;
                let zipUrl = `${url}/res.${zipVersion ? zipVersion + '.' : ''}zip`;
                handleZip(zipUrl, options, function (err, unzipPath) {
                    if (err) {
                        onComplete && onComplete(err);
                        return;
                    }
                    data.base = unzipPath + '/res/';
                    // PATCH: for android alipay version before v10.1.95 (v10.1.95 included)
                    // to remove in the future
                    let sys = cc.sys;
                    if (sys.platform === sys.ALIPAY_GAME && sys.os === sys.OS_ANDROID) {
                        let resPath = unzipPath + 'res/';
                        if (fs.accessSync({path: resPath})) {
                            data.base = resPath;
                        }
                    }
                    onComplete && onComplete(null, data);
                });
            }
            else {
                data.base = url + '/';
                onComplete && onComplete(null, data);
            }
        });
    }
};

downloadImage = isSubDomain ? subdomainDownloadImage : (cc.sys.os === cc.sys.OS_ANDROID ? downloadImageInAndroid : downloadImage);
downloader.downloadDomAudio = downloadDomAudio;
downloader.downloadScript = downloadScript;

downloader.register({
    '.js' : downloadScript,

    // Audio
    '.mp3' : downloadAudio,
    '.ogg' : downloadAudio,
    '.wav' : downloadAudio,
    '.m4a' : downloadAudio,

    // Image
    '.png' : downloadImage,
    '.jpg' : downloadImage,
    '.bmp' : downloadImage,
    '.jpeg' : downloadImage,
    '.gif' : downloadImage,
    '.ico' : downloadImage,
    '.tiff' : downloadImage,
    '.image' : downloadImage,
    '.webp' : downloadImage,
    '.pvr': downloadArrayBuffer,
    '.pkm': downloadArrayBuffer,

    '.font': downloadFont,
    '.eot': downloadFont,
    '.ttf': downloadFont,
    '.woff': downloadFont,
    '.svg': downloadFont,
    '.ttc': downloadFont,

    // Txt
    '.txt' : downloadText,
    '.xml' : downloadText,
    '.vsh' : downloadText,
    '.fsh' : downloadText,
    '.atlas' : downloadText,

    '.tmx' : downloadText,
    '.tsx' : downloadText,

    '.json' : downloadJson,
    '.ExportJson' : downloadJson,
    '.plist' : downloadText,

    '.fnt' : downloadText,

    '.binary' : downloadArrayBuffer,
    '.bin': downloadArrayBuffer,
    '.dbbin': downloadArrayBuffer,
    '.skel': downloadArrayBuffer,

    '.mp4': downloadVideo,
    '.avi': downloadVideo,
    '.mov': downloadVideo,
    '.mpg': downloadVideo,
    '.mpeg': downloadVideo,
    '.rm': downloadVideo,
    '.rmvb': downloadVideo,

    'bundle': downloadBundle,

    'default': downloadText,
});

var transformUrl = !isSubDomain ? function (url, options) {
    var inLocal = false;
    var inCache = false;
    var isInUserDataPath = url.startsWith(getUserDataPath());
    if (isInUserDataPath) {
        inLocal = true;
    }
    else if (REGEX.test(url)) {
        if (!options.reload) {
            var cache = cacheManager.cachedFiles.get(url);
            if (cache) {
                inCache = true;
                url = cache.url;
            }
            else {
                var tempUrl = cacheManager.tempFiles.get(url);
                if (tempUrl) { 
                    inLocal = true;
                    url = tempUrl;
                }
            }
        }
    }
    else {
        inLocal = true;
    }
    return { url, inLocal, inCache };
} : function (url, options) {
    if (!REGEX.test(url)) {
        url = SUBCONTEXT_ROOT + '/' + url;
    }
    return { url };
}

if (!isSubDomain) {
    cc.assetManager.transformPipeline.append(function (task) {
        var input = task.output = task.input;
        for (var i = 0, l = input.length; i < l; i++) {
            var item = input[i];
            var options = item.options;
            if (!item.config) {
                options.cacheEnabled = options.cacheEnabled !== undefined ? options.cacheEnabled : false;
            }
            else {
                options.__cacheBundleRoot__ = item.config.name;
            }
        }
    });

    var originInit = cc.assetManager.init;
    cc.assetManager.init = function (options) {
        originInit.call(cc.assetManager, options);
        options.subpackages && options.subpackages.forEach(x => subpackages[x] = 'subpackages/' + x);
        options.remoteBundles && options.remoteBundles.forEach(x => remoteBundles[x] = true);
        REMOTE_SERVER_ROOT = options.server || '';
        if (REMOTE_SERVER_ROOT && !REMOTE_SERVER_ROOT.endsWith('/')) REMOTE_SERVER_ROOT += '/';
        cacheManager.init();
    };
}
else {
    var originInit = cc.assetManager.init;
    cc.assetManager.init = function (options) {
        originInit.call(cc.assetManager, options);
        SUBCONTEXT_ROOT = options.subContextRoot || '';
    };
}

