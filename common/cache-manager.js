/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of cache-manager software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in cache-manager License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
const { getUserDataPath, readJsonSync, makeDirSync, writeFileSync, copyFile, rmdirSync, unzip, isOutOfStorage, deleteFileSync, readDir } = window.fsUtils;

var checkNextPeriod = false;
var writeCacheFileList = null;
var deleteFile = null;
var suffix = 0;
const REGEX = /^https?:\/\/.*/;

var cacheManager = {

    cacheDir: 'gamecaches',

    cachedFileName: 'cacheList.json',

    // whether or not cache asset into user's storage space
    cacheEnabled: true,

    // whether or not auto clear cache when storage ran out
    autoClear: true,

    // cache one per cycle
    cacheInterval: 500,

    deleteInterval: 500,

    writeFileInterval: 1000,

    // whether or not storage space has run out
    outOfStorage: false,

    tempFiles: null,

    cachedFiles: null,

    cachedFilesDirty: false,

    cacheQueue: [],

    allCacheList: [],

    deleteQueue: [],

    allDeleteList: [],

    version: '1.1',

    getCache (url) {
        return this.cachedFiles.has(url) ? this.cachedFiles.get(url).url : '';
    },

    getTemp (url) {
        return this.tempFiles.has(url) ? this.tempFiles.get(url) : '';
    },

    init () {
        this.cacheDir = getUserDataPath() + '/' + this.cacheDir;
        var cacheFilePath = this.cacheDir + '/' + this.cachedFileName;
        var result = readJsonSync(cacheFilePath);
        if (result instanceof Error || !result.version || result.version !== this.version || cc.js.isEmptyObject(result.files)) {
            rmdirSync(this.cacheDir, true);
            this.cachedFiles = new cc.AssetManager.Cache();
            makeDirSync(this.cacheDir, true);
            writeFileSync(cacheFilePath, JSON.stringify({ files: this.cachedFiles._map, version: this.version, deleteQueue: this.deleteQueue }), 'utf8');
        }
        else {
            this.cachedFiles = new cc.AssetManager.Cache(result.files);
            this.deleteQueue = result.deleteQueue;
            if (this.deleteQueue.length > 0) {
                this._startDeleteQueue();
            }
        }
        this.tempFiles = new cc.AssetManager.Cache();
    },

    updateLastTime (url) {
        if (this.cachedFiles.has(url)) {
            var cache = this.cachedFiles.get(url);
            cache.lastTime = Date.now();
        }
    },

    _write () {
        clearTimeout(writeCacheFileList);
        writeCacheFileList = null;
        const cacheQueue = this.cacheQueue.concat(this.allCacheList.slice(3));
        const deleteQueue = this.deleteQueue.concat(this.allDeleteList.slice(3))
        const content = JSON.stringify({ files: this.cachedFiles._map, version: this.version, deleteQueue, cacheQueue });
        let result = writeFileSync(this.cacheDir + '/' + this.cachedFileName, content, 'utf8');
        if (result instanceof Error) {
            // if write file failed, just delete cacheList.json so that everything will be cleaned on next startup
            deleteFileSync(this.cacheDir + '/' + this.cachedFileName);
            result = writeFileSync(this.cacheDir + '/' + this.cachedFileName, content, 'utf8');
            this.autoClear && this.clearLRU();
        }

        if (result instanceof Error) {
            // 
            this.deleteQueue = deleteQueue;
            this.allDeleteList.splice(0, 3);
            this.cachedFilesDirty = true;
        } else {
            this.cacheQueue = cacheQueue;
            this.deleteQueue = deleteQueue;
            this.allCacheList.splice(0, 3);
            this.allDeleteList.splice(0, 3);
            this.cachedFilesDirty = false;
        }
    },

    writeCacheFile () {
        if (!writeCacheFileList) {
            writeCacheFileList = setTimeout(this._write.bind(this), this.writeFileInterval);
        }
    },

    _cache () {
        checkNextPeriod = false;
        var self = this;
        const cacheItem = this.cacheQueue.shift();
        if (!cacheItem) return;
        var { id, srcUrl, cacheBundleRoot, localPath } = item;
            
        function callback (err) {
            if (err)  {
                if (isOutOfStorage(err.message)) {
                    self.outOfStorage = true;
                    self.allCacheList.push(item);
                    return;
                }
            } else {
                self.cachedFiles.add(id, { bundle: cacheBundleRoot, url: localPath, lastTime: Date.now() });
                self.cachedFilesDirty = true;
            }
        }
        copyFile(srcUrl, `${this.cacheDir}/${cacheBundleRoot ? cacheBundleRoot + '/' : ''}${localPath}`, callback);
    },

    cacheFile (id, srcUrl, cacheEnabled, cacheBundleRoot) {
        cacheEnabled = cacheEnabled !== undefined ? cacheEnabled : this.cacheEnabled;
        if (!cacheEnabled || this.allCacheList.find(x => x.id === id) || this.cachedFiles.has(id)) return;

        this.allCacheList.push({ id, srcUrl, cacheBundleRoot, localPath: `${Date.now()}${suffix++}${cc.path.extname(id)}` });
    },

    update (dt) {
        if (this.allCacheList.length > 0 || this.allDeleteList.length > 0 || this.cachedFilesDirty) this.writeCacheFile();
        this._startCacheQueue();
        this._startDeleteQueue();
        if (this.outOfStorage && this.autoClear && this.allDeleteList.length === 0) {
            this.clearLRU();
        }
    },

    _startCacheQueue () {
        if (!checkNextPeriod && !this.outOfStorage && this.cacheQueue.length > 0) {
            checkNextPeriod = true;
            setTimeout(this._cache.bind(this), this.cacheInterval);
        }
    },

    clearCache () {
        rmdirSync(this.cacheDir, true);
        this.cachedFiles = new cc.AssetManager.Cache();
        makeDirSync(this.cacheDir, true);
        this.outOfStorage = false;
        this._write();
        cc.assetManager.bundles.forEach(bundle => {
            if (REGEX.test(bundle.base)) this.makeBundleFolder(bundle.name);
        });
    },

    clearLRU () {
        var caches = [];
        this.cachedFiles.forEach(function (val, key) {
            if (val.bundle === 'internal') return;
            if (self._isZipFile(key) && cc.assetManager.bundles.find(bundle => bundle.base.indexOf(val.url) !== -1)) return;
            caches.push({ originUrl: key, url: val.url, lastTime: val.lastTime });
        });
        caches.sort(function (a, b) {
            return a.lastTime - b.lastTime;
        });
        caches.length = Math.floor(this.cachedFiles.count / 3);
        if (caches.length === 0) {
            return;
        }
        for (var i = 0, l = caches.length; i < l; i++) {
            delete caches[i].lastTime;
            this.cachedFiles.remove(caches[i].originUrl);
        }
        this.allDeleteList.push(...caches);
    },

    _deferredDelete () {
        deleteFile = null;
        var item = this.deleteQueue.pop();
        this.allDeleteList.pop();
        if (!item) return;
        if (this._isZipFile(item.originUrl)) {
            rmdirSync(item.url, true);
        }
        else {
            deleteFileSync(item.url);
        }
        this.outOfStorage = false;
    },

    _startDeleteQueue () {
        if (!deleteFile && this.deleteQueue.length > 0) {
            deleteFile = setTimeout(this._deferredDelete.bind(this), this.deleteInterval);
        }
    },

    removeCache (url) {
        if (this.cachedFiles.has(url)) {
            var path = this.cachedFiles.remove(url).url;
            this.allDeleteList.push({ originUrl: url, url: path });
        }
    },

    _deleteFileCB () {
        this.outOfStorage = false;
    },

    makeBundleFolder (bundleName) {
        makeDirSync(this.cacheDir + '/' + bundleName, true);
    },

    unzipAndCacheBundle (id, zipFilePath, cacheBundleRoot, onComplete) {
        let time = Date.now().toString();
        let targetPath = `${this.cacheDir}/${cacheBundleRoot}/${time}${suffix++}`;
        let self = this;
        makeDirSync(targetPath, true);
        this.cachedFiles.forEach(function (val, key) {
            // remove old zip directory
            if (val.bundle === cacheBundleRoot && self._isZipFile(key)) self.removeCache(key);
        });
        unzip(zipFilePath, targetPath, function (err) {
            if (err) {
                rmdirSync(targetPath, true);
                if (isOutOfStorage(err.message)) {
                    self.outOfStorage = true;
                }
                onComplete && onComplete(err);
                return;
            }
            self.cachedFiles.add(id, { bundle: cacheBundleRoot, url: targetPath, lastTime: time });
            self.writeCacheFile();
            onComplete && onComplete(null, targetPath);
        });
    },

    _isZipFile (url) {
        return url.slice(-4) === '.zip';
    },
};

cc.assetManager.cacheManager = module.exports = cacheManager;