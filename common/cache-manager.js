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
const { getUserDataPath, readJsonSync, makeDirSync, writeFileSync, copyFile, rmdirSync, unzip, isOutOfStorage, deleteFileSync, statSync, getUserSpaceSize } = window.fsUtils;

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

    writeFileInterval: 2000,

    // whether or not storage space has run out
    outOfStorage: false,

    tempFiles: null,

    cachedFiles: null,

    cachedFilesDirty: false,

    cacheQueue: [],

    waitForCacheList: [],

    deleteQueue: [],

    unzipQueue: [],

    waitForDeleteList: [],

    version: '2.0',

    cachedSize: 0,

    autoClearThreshold: 0.7,

    startupTime: 0,

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
        this.startupTime = Date.now();
        var cacheFilePath = this.cacheDir + '/' + this.cachedFileName;
        var result = readJsonSync(cacheFilePath);
        if (result instanceof Error || !result.version || result.version !== this.version || cc.js.isEmptyObject(result.files)) {
            this.clearCache();
        }
        else {
            this.cachedFiles = new cc.AssetManager.Cache(result.files);
            this.cachedFiles.forEach(x => {
                this.cachedSize += x.size || 0;
            });
            this.waitForDeleteList = result.deleteList;
            // remove the cache task uncompleted last time
            this.waitForDeleteList.push(...result.cacheQueue);
            this.waitForDeleteList.push(...result.unzipQueue);
            this.cachedFilesDirty = true;
        }
        this.tempFiles = new cc.AssetManager.Cache();
        console.log('Init Cache Manager. vers: ' + this.version);
        setInterval(this.update.bind(this), 30);
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

        const cacheCount = Math.ceil(this.writeFileInterval / this.cacheInterval);
        
        const cacheQueue = this.cacheQueue;
        if (cacheQueue.length === 0) {
            cacheQueue = cacheQueue.concat(this.waitForCacheList.slice(cacheCount));
        }

        const content = JSON.stringify({ 
            files: this.cachedFiles._map, 
            version: this.version, 
            deleteList: this.deleteQueue.concat(this.waitForDeleteList), 
            cacheQueue: cacheQueue.map(x => { return { bundle: x.bundle, localPath: x.localPath, isZip: false }}),
            unzipQueue: this.unzipQueue
        });

        const cacheListFile = this.cacheDir + '/' + this.cachedFileName;
        let result = writeFileSync(cacheListFile, content, 'utf8');
        if (result instanceof Error) {
            this.outOfStorage = true;
            // if write file failed, just delete cacheList.json so that everything will be cleaned on next startup
            deleteFileSync(cacheListFile);
            result = writeFileSync(cacheListFile, content, 'utf8');
        }

        this.deleteQueue = this.deleteQueue.concat(this.waitForDeleteList.splice(0, Math.ceil(this.writeFileInterval / this.deleteInterval)));
        if (result instanceof Error) {
            this.cachedFilesDirty = true;
        } else {
            this.cacheQueue = cacheQueue;
            this.waitForCacheList.splice(0, cacheCount);
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
        let self = this;
        if (this.cacheQueue.length === 0) return;
        let { id, srcUrl, bundle, localPath } = this.cacheQueue[0];
        let path = this._getCachePath(bundle, localPath);
            
        function callback (err) {
            if (err)  {
                if (isOutOfStorage(err.message)) {
                    self.outOfStorage = true;
                    return;
                }
            } else {
                let stat = statSync(path);
                if (stat instanceof Error) {
                    deleteFileSync(path);
                }
                else {
                    // if has old version cache, should remove it.
                    self.removeCache(id);
                    self.cacheQueue.shift();
                    // convert to KB
                    let size = (stat.size || 0) / 1024;
                    self.cachedFiles.add(id, { bundle, localPath, lastTime: Date.now(), size });
                    self.cachedSize += size;
                    self.cachedFilesDirty = true;
                }
            }
        }
        copyFile(srcUrl, path, callback);
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

        // trigger auto clear when cachedSize exceeded auto clear threshold
        if ((this.outOfStorage || this.cachedSize > this.autoClearThreshold * getUserSpaceSize())
            && this.autoClear 
            && this.waitForDeleteList.length === 0) 
        {
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
        this.deleteQueue = [];
        this.waitForDeleteList = [];
        makeDirSync(this.cacheDir, true);
        this.outOfStorage = false;
        this.cachedFilesDirty = true;
        cc.assetManager.bundles.forEach(bundle => {
            if (REGEX.test(bundle.base)) this.makeBundleFolder(bundle.name);
        });
    },

    clearLRU () {
        var caches = [];
        this.cachedFiles.forEach(function (val, key) {
            // DO NOT remove the asset used by this time
            if (val.lastTime >= this.startupTime) return;
            caches.push({ originUrl: key, lastTime: val.lastTime });
        });
        caches.sort(function (a, b) {
            return a.lastTime - b.lastTime;
        });
        caches.length = Math.floor(this.cachedFiles.count / 2);
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
        this.cachedFilesDirty = true;
    },

    _startDeleteQueue () {
        if (!deleteFile && this.deleteQueue.length > 0) {
            deleteFile = setTimeout(this._deferredDelete.bind(this), this.deleteInterval);
        }
    },

    removeCache (url) {
        if (this.cachedFiles.has(url)) {
            const { localPath, bundle, size } = this.cachedFiles.remove(url);
            this.cachedSize -= size;
            this.waitForDeleteList.push({ isZip: this._isZipFile(url), localPath, bundle });
        }
    },

    _deleteFileCB () {
        this.outOfStorage = false;
    },

    makeBundleFolder (bundleName) {
        makeDirSync(this.cacheDir + '/' + bundleName, true);
    },

    unzipAndCacheBundle (id, zipFilePath, bundle, size, onComplete) {
        let time = Date.now();
        let localPath = `${time}${suffix++}`;
        let self = this;
        makeDirSync(this._getCachePath(bundle, localPath), true);
        const unzipTask = { bundle, isZip: true, localPath };
        this.unzipQueue.push(unzipTask);
        this._write();
        unzip(zipFilePath, this._getCachePath(bundle, localPath), function (err) {
            if (err) {
                rmdirSync(targetPath, true);
                if (isOutOfStorage(err.message)) {
                    self.outOfStorage = true;
                }
                onComplete && onComplete(err);
                return;
            }
            cc.js.fastRemove(self.unzipQueue, unzipTask);
            self.cachedFiles.add(id, { bundle, localPath, lastTime: time, size });
            self.cachedSize += size;
            self.cachedFilesDirty = true;
            onComplete && onComplete(null, targetPath);
        });
    },

    _isZipFile (url) {
        return url.slice(-4) === '.zip';
    },
};

cc.assetManager.cacheManager = module.exports = cacheManager;