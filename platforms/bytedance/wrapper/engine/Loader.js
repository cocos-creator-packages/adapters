let loadedSubPackages = {};

cc.loader.downloader.loadSubpackage = function (name, progressCallback, completeCallback) {
    if (!completeCallback && progressCallback) {
        completeCallback = progressCallback;
        progressCallback = null;
    }
    // Not support for now on ByteDance platform
    if (loadedSubPackages[name] !== true) {
        require(`../../../subpackages/${name}/index.js`);
        loadedSubPackages[name] = true;
    }
    completeCallback && completeCallback();
};