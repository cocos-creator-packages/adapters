function adaptBrowserGetter (BrowserGetter) {
    BrowserGetter.init = function () {
        this.adaptationType = undefined;
        this.meta = {
            "width": "device-width"
        };
        
        this.adaptationType = cc.sys.browserType;
    };

    if (__globalAdapter.isSubContext) {
        let sharedCanvas = window.sharedCanvas || __globalAdapter.getSharedCanvas();
        Object.assign(BrowserGetter, {
            availWidth () {
                return sharedCanvas.width;
            },

            availHeight () {
                return sharedCanvas.height;
            }
        });
    }
    else {
        Object.assign(BrowserGetter, {
            availWidth () {
                return window.innerWidth;
            },

            availHeight () {
                return window.innerHeight;
            }
        });    
    }
}

module.exports = adaptBrowserGetter;