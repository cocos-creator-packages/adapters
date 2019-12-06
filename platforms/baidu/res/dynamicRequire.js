let moduleMap = {
    // build modules
};

GameGlobal.$require = function (moduleName) {
    let func = moduleMap[moduleName];
    func && func();
};