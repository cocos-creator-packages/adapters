/****************************************************************************
 Copyright (c) 2017 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
var ID = 'SwanDownloader';
const swanFsUtils = require('./swan-fs-utils');

const REGEX = /^\w+:\/\/.*/;
const isSubContext = (cc.sys.platform === cc.sys.BAIDU_GAME_SUB);

var packageFiles = null;
var cachedFiles = null;
var writeCacheFileList = null;
var cacheQueue = null;
var checkNextPeriod = false;
var errTest = /the maximum size of the file storage/;

var _newAssets = {};
var SwanDownloader = window.SwanDownloader = function () {
    this.id = ID;
    this.async = true;
    this.pipeline = null;
    this.REMOTE_SERVER_ROOT = '';
    this.SUBCONTEXT_ROOT = '';
};
SwanDownloader.ID = ID;

SwanDownloader.prototype.init = function () {
    if (!isSubContext) {
        this.cacheDir = swan.env.USER_DATA_PATH + '/gamecaches';
        this.cachedFileName = 'cacheList.json';
        // whether or not cache asset into user's storage space
        this.cacheAsset = true;
        // cache one per cycle
        this.cachePeriod = 100;
        // whether or not storage space is run out of
        this.outOfStorage = false;

        this.writeFilePeriod = 1000;

        cacheQueue = {};
        packageFiles = {};

        var cacheFilePath = this.cacheDir + '/' + this.cachedFileName;
        cachedFiles = swanFsUtils.readJsonSync(cacheFilePath);
        if (cachedFiles instanceof Error) {
            cachedFiles = {};
            swanFsUtils.makeDirSync(this.cacheDir, true);
            swanFsUtils.writeFileSync(cacheFilePath, JSON.stringify(cachedFiles), 'utf8');
        }
    }
};

SwanDownloader.prototype.handle = function (item, callback) {

    if (item.type === 'js') {
        return null;
    }
    if (item.type === 'uuid') {
        var result = cc.Pipeline.Downloader.PackDownloader.load(item, callback);
        // handled by PackDownloader
        if (result !== undefined) {
            // null result
            if (!!result) {
                return result;
            }
            else {
                return;
            }
        }
    }

    if (isSubContext) {
        // if swan.getFileSystemManager is undefined, need to skip
        if (REGEX.test(item.url)) {
            return null;
        }

        item.url = this.SUBCONTEXT_ROOT + '/' + item.url;
        if (swanFsUtils.checkFsValid()) return null;

        handleItem(item, callback);
        return;
    }

    function seek (inPackage) {
        if (inPackage) {
            handleItem(item, callback);
        }
        else {
            readFromLocal(item, callback);
        }
    }

    if (item.url in packageFiles) {
        seek(packageFiles[item.url]);
    }
    else {
        swanFsUtils.exists(item.url, function (existance) {
            packageFiles[item.url] = existance;
            seek(existance);
        });
    }
};

SwanDownloader.prototype.cleanOldAssets = function () {
    cc.warn('swanDownloader.cleanOldAssets has been deprecated, please use swanDownloader.cleanOldCaches instead!');
    return this.cleanOldCaches();
};

SwanDownloader.prototype.cleanOldCaches = function () {
    this.cleanAllCaches(_newAssets, function (err) {
        if (err) {
            cc.warn(err);
        }
        else {
            for (var path in _newAssets) {
                cc.log('reserve local file: ' + path);
            }
            cc.log('Clean old Assets successfully!');
        }
    });
};

function handleItem (item, callback) {
    if (item.type && !shouldReadFile(item.type)) {
        callback(null, null);
    }
    else {
        readFile(item, callback);
    }
}

SwanDownloader.prototype.getCacheName = function (filePath) {
    var cacheUrlReg = /\//g;
    return filePath.replace(cacheUrlReg, '-');
};

SwanDownloader.prototype.getCachedFileList = function () {
    return cachedFiles;
};

SwanDownloader.prototype.cleanCache = function (filePath) {
    if (filePath in cachedFiles) {
        var self = this;
        delete cachedFiles[filePath];
        swanFsUtils.writeFileSync(this.cacheDir + '/' + this.cachedFileName, JSON.stringify(cachedFiles), 'utf8');
        swanFsUtils.deleteFile(this.cacheDir + '/' + filePath, function (err) {
            if (!err) self.outOfStorage = false;
        });
    }
};

SwanDownloader.prototype.cleanAllAssets = function () {
    cc.warn('swanDownloader.cleanAllAssets has been deprecated, please use cleanAllCaches instead!');
    this.cleanAllCaches(null, function (err) {
        if (err) cc.error(err.message);
    });
};

SwanDownloader.prototype.cleanAllCaches = function (exclude, callback) {
    exclude = exclude || {};
    var self = this;
    var result = swanFsUtils.readDir(self.cacheDir, function (err, list) {
        if (err) {
            callback && callback(err);
            return;
        }
        var toDelete = [];
        for (var i = 0, l = list.length; i < l; i ++) {
            var path = list[i];
            if (path === self.cachedFileName) continue;
            if (path in exclude) continue;
            if (path in cacheQueue) {
                delete cacheQueue[path];
                continue;
            }
            delete cachedFiles[path];
            toDelete.push(path);
        }
        swanFsUtils.writeFileSync(self.cacheDir + '/' + self.cachedFileName, JSON.stringify(cachedFiles), 'utf8');
        var count = 0;
        for (var i = 0, l = toDelete.length; i < l; i ++) {
            swanFsUtils.deleteFile(self.cacheDir + '/' + toDelete[i], function (err) {
                if (!err) self.outOfStorage = false;
                count++;
                if (count === l) callback && callback(null);
            })
        }
    });
    if (result) callback(result);
};

var swanDownloader = window.swanDownloader = new SwanDownloader();

function registerFailHandler (item, cachePath) {
    var queue = cc.LoadingItems.getQueue(item);
    queue.addListener(item.id, function (item) {
        if (item.error) {
            if (item.url in cacheQueue) {
                delete cacheQueue[item.url];
            }
            else {
                swanDownloader.cleanCache(cachePath);
            }
        }
    });
}

function readFile (item, callback) {
    var url = item.url;
    var func = swanFsUtils.readText;
    if (getFileType(item.type) === FileType.BIN) func = swanFsUtils.readArrayBuffer;
    var result = func(url, function (err, data) {
        if (err) {
            callback(err);
            return;
        }
        if (data) {
            item.states[cc.loader.downloader.id] = cc.Pipeline.ItemState.COMPLETE;
            callback(null, data);
        }
        else {
            callback(new Error("Empty file: " + url));
        }
    });
    if (result) callback(result);
}

function readFromLocal (item, callback) {
    var result = swanFsUtils.checkFsValid();
    if (result) {
        callback(result);
        return;
    }

    var cachedPath = swanDownloader.getCacheName(item.url);
    var localPath = swanDownloader.cacheDir + '/' + cachedPath;

    if (cachedPath in cachedFiles) {
        // cache new asset
        _newAssets[cachedPath] = true;
        item.url = localPath;
        registerFailHandler(item, cachedPath);
        handleItem(item, callback);
    }
    else {
        if (!swanDownloader.REMOTE_SERVER_ROOT) {
            callback(null, null);
            return;
        }

        downloadRemoteFile(item, callback);
    }
}

function cacheFile (url, isCopy, cachePath) {
    cacheQueue[url] = { isCopy, cachePath };

    if (!checkNextPeriod) {
        checkNextPeriod = true;
        function cache () {
            checkNextPeriod = false;
            for (var srcUrl in cacheQueue) {
                if (!swanDownloader.outOfStorage) {
                    var item = cacheQueue[srcUrl]
                    var localPath = swanDownloader.cacheDir + '/' + item.cachePath;
                    var func = swanFsUtils.copyFile;
                    if (!item.isCopy) func = swanFsUtils.downloadFile; 
                    func(srcUrl, localPath, function (err) {
                        if (err)  {
                            errTest.test(err.message) && (swanDownloader.outOfStorage = true);
                            return;
                        }
                        cachedFiles[item.cachePath] = 1;
                        writeCacheFile();
                    });
                    delete cacheQueue[srcUrl];
                }
                if (!cc.js.isEmptyObject(cacheQueue) && !checkNextPeriod) {
                    checkNextPeriod = true;
                    setTimeout(cache, swanDownloader.cachePeriod);
                }
                return;
            }
        };
        setTimeout(cache, swanDownloader.cachePeriod);
    }
}

function downloadRemoteFile (item, callback) {
    // Download from remote server
    var relatUrl = item.url;

    // filter protocol url (E.g: https:// or http:// or ftp://)
    if (REGEX.test(relatUrl)) {
        callback(null, null);
        return;
    }

    var remoteUrl = swanDownloader.REMOTE_SERVER_ROOT + '/' + relatUrl;
    item.url = remoteUrl;
    var cachePath = swanDownloader.getCacheName(relatUrl);
    if (cc.sys.os === cc.sys.OS_ANDROID && item.type && getFileType(item.type) === FileType.IMAGE) {
        if (swanDownloader.cacheAsset) {
            cacheFile(remoteUrl, false, cachePath);
            registerFailHandler(item, cachePath);
        }
        callback(null, null);
    }
    else {
        swanFsUtils.downloadFile(remoteUrl, undefined, function (err, path) {
            if (err) {
                callback(err, null);
                return;
            }
            item.url = path;
            if (swanDownloader.cacheAsset) {
                cacheFile(path, true, cachePath);
                registerFailHandler(item, cachePath);
            }
            handleItem(item, callback);
        });
    }
    
}

function writeCacheFile () {
    function write () {
        writeCacheFileList = null; 
        swanFsUtils.writeFile(swanDownloader.cacheDir + '/' + swanDownloader.cachedFileName, JSON.stringify(cachedFiles), 'utf8');
    }
    !writeCacheFileList && (writeCacheFileList = setTimeout(write, swanDownloader.writeFilePeriod));
}

function shouldReadFile (type) {
    return getFileType(type) >= FileType.LOADABLE_MIN;
}

function getFileType (type) {
    return (map[type] || FileType.DEFAULT);
}

var FileType = {
    'IMAGE': 1,
    'FONT': 2,
    'AUDIO': 3,
    'SCRIPT': 4,
    'TEXT': 5,
    'BIN': 6,
    'DEFAULT': 7,
    'LOADABLE_MIN': 5
};

var map = {
    // JS
    'js' : FileType.SCRIPT,

    // Images
    'png' : FileType.IMAGE,
    'jpg' : FileType.IMAGE,
    'bmp' : FileType.IMAGE,
    'jpeg' : FileType.IMAGE,
    'gif' : FileType.IMAGE,
    'ico' : FileType.IMAGE,
    'tiff' : FileType.IMAGE,
    'webp' : FileType.IMAGE,
    'image' : FileType.IMAGE,

    // Audio
    'mp3' : FileType.AUDIO,
    'ogg' : FileType.AUDIO,
    'wav' : FileType.AUDIO,
    'm4a' : FileType.AUDIO,

    // Txt
    'txt' : FileType.TEXT,
    'xml' : FileType.TEXT,
    'vsh' : FileType.TEXT,
    'fsh' : FileType.TEXT,
    'atlas' : FileType.TEXT,

    'tmx' : FileType.TEXT,
    'tsx' : FileType.TEXT,

    'json' : FileType.TEXT,
    'ExportJson' : FileType.TEXT,
    'plist' : FileType.TEXT,

    'fnt' : FileType.TEXT,

    // Font
    'font' : FileType.FONT,
    'eot' : FileType.FONT,
    'ttf' : FileType.FONT,
    'woff' : FileType.FONT,
    'svg' : FileType.FONT,
    'ttc' : FileType.FONT,

    // Binary
    'binary' : FileType.BIN,
    'dbbin' : FileType.BIN,
    'bin': FileType.BIN,
    'pvr': FileType.BIN,
    'pkm': FileType.BIN
};
// function downloadRemoteTextFile (item, callback) {
//     // Download from remote server
//     var relatUrl = item.url;
//     var remoteUrl = swanDownloader.REMOTE_SERVER_ROOT + '/' + relatUrl;
//     item.url = remoteUrl;
//     swan.request({
//         url: remoteUrl,
//         success: function(res) {
//             if (res.data) {
//                 if (res.statusCode === 200 || res.statusCode === 0) {
//                     var data = res.data;
//                     item.states[cc.loader.downloader.ID] = cc.Pipeline.ItemState.COMPLETE;
//                     if (data) {
//                         if (typeof data !== 'string' && !(data instanceof ArrayBuffer)) {
//                             // Should we check if item.type is json ? If not, loader behavior could be different
//                             item.states[cc.loader.loader.ID] = cc.Pipeline.ItemState.COMPLETE;
//                             callback(null, data);
//                             data = JSON.stringify(data);
//                         }
//                         else {
//                             callback(null, data);
//                         }
//                     }

//                     // Save to local path
//                     var localPath = swan.env.USER_DATA_PATH + '/' + relatUrl;
//                     // Should recursively mkdir first
//                     fs.writeFile({
//                         filePath: localPath,
//                         data: data,
//                         encoding: 'utf8',
//                         success: function (res) {
//                             cc.log('Write file to ' + res.savedFilePath + ' successfully!');
//                         },
//                         fail: function (res) {
//                             // undone implementation
//                         }
//                     });
//                 } else {
//                     cc.warn("Download text file failed: " + remoteUrl);
//                     callback({
//                         status:0, 
//                         errorMessage: res && res.errMsg ? res.errMsg : "Download text file failed: " + remoteUrl
//                     });
//                 }
//             }
//         },
//         fail: function (res) {
//             // Continue to try download with downloader, most probably will also fail
//             callback(null, null);
//         }
//     });
// }
