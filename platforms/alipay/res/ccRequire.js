let moduleMap = {
    // build modules
};

window.__cocos_require__ = function (moduleName) {
    let func = moduleMap[moduleName];
    func && func();
};