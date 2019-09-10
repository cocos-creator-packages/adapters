let loadedSubPackages = {};

cc.loader.downloader.loadSubpackage = function (name, completeCallback) {
    // Not support for now on Alipay platform
    if (loadedSubPackages[name] !== true) {
        require(`../../../subpackages/${name}/index.js`);
        loadedSubPackages[name] = true;
    }
    completeCallback && completeCallback();
};