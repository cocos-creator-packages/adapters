const adapter = window.__globalAdapter;
let adaptSysFunc = adapter.adaptSys;

//taobao IDE language   ("Chinese")
//taobao phone language (Andrond: "cn", iPad: 'zh_CN')
const languageMap = {
    Ch: "zh",
    cn: "zh",
    zh: "zh",
};

Object.assign(adapter, {
    // Extend adaptSys interface
    adaptSys (sys) {
        adaptSysFunc.call(this, sys);
        sys.platform = sys.TAOBAO_MINIGAME;
        sys.language = languageMap[sys.language] || sys.language;

        // move to common if other platforms support
        sys.getSafeAreaRect = function () {
            let view = cc.view;
            let safeArea = adapter.getSafeArea();
            let screenSize = view.getFrameSize(); // Get leftBottom and rightTop point in UI coordinates
            let leftBottom = new cc.Vec2(safeArea.left, safeArea.bottom);
            let rightTop = new cc.Vec2(safeArea.right, safeArea.top); // Returns the real location in view.
            let relatedPos = {
                left: 0,
                top: 0,
                width: screenSize.width,
                height: screenSize.height
            };
            view.convertToLocationInView(leftBottom.x, leftBottom.y, relatedPos, leftBottom);
            view.convertToLocationInView(rightTop.x, rightTop.y, relatedPos, rightTop); // convert view point to design resolution size
            view._convertPointWithScale(leftBottom);
            view._convertPointWithScale(rightTop);
            return cc.rect(leftBottom.x, leftBottom.y, rightTop.x - leftBottom.x, rightTop.y - leftBottom.y);
        };
    },
});