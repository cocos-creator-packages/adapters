function adaptBrowserGetter (BrowserGetter) {
    BrowserGetter.init = function () {
        this.adaptationType = undefined;
        this.meta = {
            "width": "device-width"
        };
        
        this.adaptationType = cc.sys.BROWSER_TYPE_XIAOMI_GAME;
    };
    
    Object.assign(BrowserGetter, {
        availWidth () {
            return window.innerWidth;
        },

        availHeight () {
            return window.innerHeight;
        }
    });
}

module.exports = adaptBrowserGetter;