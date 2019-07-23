let sys = require('./SystemInfo');

window.__globalAdapter = {
    init: sys.init,
    
    adaptSys: sys.adaptSys,

    adaptBrowserGetter: require('./BrowserGetter'),

    adaptView: require('./View'),

    adaptContainerStrategy: require('./ContainerStrategy'),
};