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
const { getUserDataPath, readJsonSync, makeDirSync, writeFileSync, copyFile, rmdirSync, unzip, isOutOfStorage, deleteFileSync } = window.fsUtils;

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

    waitForCacheList: [],

    deleteQueue: [],

    waitForDeleteList: [],

    version: '1.1',

    getCache (url) {
        if (this.cachedFiles.has(url)) {
            const item = this.cachedFiles.get(url);
            this._getCachePath(item.bundle, item.localPath);
        } else {
            return '';
        }
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
            writeFileSync(cacheFilePath, JSON.stringify({ files: this.cachedFiles._map, version: this.version, deleteList: [], cacheQueue: [] }), 'utf8');
        }
        else {
            this.cachedFiles = new cc.AssetManager.Cache(result.files);
            this.waitForDeleteList = result.deleteList;
            this.waitForDeleteList.push(...result.cacheQueue);
        }
        this.tempFiles = new cc.AssetManager.Cache();
        setInterval(this.update.bind(this), 100);
    },

    updateLastTime (url) {
        if (this.cachedFiles.has(url)) {
            this.cachedFiles.get(url).lastTime = Date.now();
            this.cachedFilesDirty = true;
        }
    },

    _write () {
        clearTimeout(writeCacheFileList);
        writeCacheFileList = null;
        
        const cacheQueue = this.cacheQueue;
        if (cacheQueue.length === 0) {
            cacheQueue = cacheQueue.concat(this.waitForCacheList.slice(3));
        }

        const content = JSON.stringify({ 
            files: this.cachedFiles._map, 
            version: this.version, 
            deleteList: this.waitForDeleteList, 
            cacheQueue: cacheQueue.map(x => { return { bundle: x.bundle, localPath: x.localPath, isZip: this._isZipFile(x.id) }})
        });

        const cacheListFile = this.cacheDir + '/' + this.cachedFileName;
        let result = writeFileSync(cacheListFile, content, 'utf8');
        if (result instanceof Error) {
            // if write file failed, just delete cacheList.json so that everything will be cleaned on next startup
            deleteFileSync(cacheListFile);
            result = writeFileSync(cacheListFile, content, 'utf8');
            this.outOfStorage = true;
        }

        this.deleteQueue = this.waitForDeleteList.slice(3);
        if (result instanceof Error) {
            this.cachedFilesDirty = true;
        } else {
            this.cacheQueue = cacheQueue;
            this.waitForCacheList.splice(0, 3);
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
        if (this.cacheQueue.length === 0) return;
        var { id, srcUrl, bundle, localPath } = this.cacheQueue[0];
            
        function callback (err) {
            if (err)  {
                if (isOutOfStorage(err.message)) {
                    self.outOfStorage = true;
                    return;
                }
            } else {
                // if has old version cache, should remove it.
                self.removeCache(id);
                self.cacheQueue.shift();
                self.cachedFiles.add(id, { bundle, localPath, lastTime: Date.now() });
                self.cachedFilesDirty = true;
            }
        }
        copyFile(srcUrl, `${this.cacheDir}/${bundle ? bundle + '/' : ''}${localPath}`, callback);
    },

    cacheFile (id, srcUrl, cacheEnabled, bundle) {
        cacheEnabled = cacheEnabled !== undefined ? cacheEnabled : this.cacheEnabled;
        if (!cacheEnabled) return;
        this.waitForCacheList.push({ id, srcUrl, bundle: bundle || '', localPath: `${Date.now()}${suffix++}${cc.path.extname(id)}` });
    },

    _getCachePath (bundle, localPath) {
        return `${this.cacheDir}/${bundle ? bundle + '/' : ''}${localPath}`;
    },

    update () {
        if (this.waitForCacheList.length > 0 || this.waitForDeleteList.length > 0 || this.cachedFilesDirty) this.writeCacheFile();
        this._startCacheQueue();
        this._startDeleteQueue();
        if (this.outOfStorage && this.autoClear && this.waitForDeleteList.length === 0) {
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
            caches.push({ originUrl: key, lastTime: val.lastTime });
        });
        caches.sort(function (a, b) {
            return a.lastTime - b.lastTime;
        });
        caches.length = Math.floor(this.cachedFiles.count / 3);
        for (var i = 0, l = caches.length; i < l; i++) {
            this.removeCache(caches[i].originUrl);
        }
    },

    _deferredDelete () {
        deleteFile = null;
        var item = this.deleteQueue.shift();
        if (!item) return;
        if (item.isZip) {
            rmdirSync(item.url, true);
        }
        else {
            deleteFileSync(item.url);
        }
        this.outOfStorage = false;
        this.waitForDeleteList.shift();
        this.cachedFilesDirty = true;
    },

    _startDeleteQueue () {
        if (!deleteFile && this.deleteQueue.length > 0) {
            deleteFile = setTimeout(this._deferredDelete.bind(this), this.deleteInterval);
        }
    },

    removeCache (url) {
        if (this.cachedFiles.has(url)) {
            const { localPath, bundle } = this.cachedFiles.remove(url);
            this.waitForDeleteList.push({ isZip: this._isZipFile(url), localPath, bundle });
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