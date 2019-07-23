function adaptBrowserGetter (BrowserGetter) {
    const isSubContext = (cc.sys.platform === cc.sys.BAIDU_GAME_SUB);

    BrowserGetter.init = function () {
        this.adaptationType = undefined;
        this.meta = {
            "width": "device-width"
        };

        if (isSubContext) {
            this.adaptationType = cc.sys.BROWSER_TYPE_BAIDU_GAME_SUB;
        }
        else {
            this.adaptationType = cc.sys.BROWSER_TYPE_BAIDU_GAME;
        }
    };

    if (isSubContext) {
        let sharedCanvas = window.sharedCanvas || swan.getSharedCanvas();
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