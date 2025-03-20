const utils = require('../../../common/utils');

if (window.__globalAdapter) {
    let globalAdapter = window.__globalAdapter;
    // SystemInfo
    globalAdapter.isSubContext = false;  // sub context not supported
    globalAdapter.isDevTool = my.isIDE;
    utils.cloneMethod(globalAdapter, my, 'getSystemInfoSync');
    // TouchEvent
    utils.cloneMethod(globalAdapter, my, 'onTouchStart');
    utils.cloneMethod(globalAdapter, my, 'onTouchMove');
    utils.cloneMethod(globalAdapter, my, 'onTouchEnd');
    utils.cloneMethod(globalAdapter, my, 'onTouchCancel');

    // Audio
    globalAdapter.createInnerAudioContext = function () {
        let audio = my.createInnerAudioContext();
        if (my.getSystemInfoSync().platform === 'iOS') {
            let currentTime = 0;
            let originalSeek = audio.seek;
            audio.seek = function (time) {
                // need to access audio.paused in the next tick
                setTimeout(() => {
                    if (audio.paused) {
                        currentTime = time;
                    } else {
                        originalSeek.call(audio, time);
                    }
                }, 50);
            };

            let originalPlay = audio.play;
            audio.play = function () {
                if (currentTime !== 0) {
                    audio.seek(currentTime);
                    currentTime = 0; // clear cached currentTime
                }
                originalPlay.call(audio);
            };
        }
        return audio;
    };


    let windowInfo;
    let windowInfoCached = false;
    function refreshWindowInfo(delay){
        windowInfo = my.getWindowInfoSync();
        // refresh windowInfo, some seconds later.
        setTimeout(function () {
            windowInfo = my.getWindowInfoSync();
            windowInfoCached = true
        }, delay || 5000);
    }
    refreshWindowInfo();

    if (my.onWindowResize) {
        my.onWindowResize(function () {
            refreshWindowInfo();
            window.dispatchEvent('resize');
        });
    }

    // safeArea
    // origin point on the top-left corner
    globalAdapter.getSafeArea = function () {
        windowInfo = windowInfoCached ? windowInfo : my.getWindowInfoSync();
        if (typeof windowInfo.safeArea !== 'undefined') {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return windowInfo.safeArea;
        }

        console.warn('getSafeArea is not supported on this platform');
        return {
            top: 0,
            left: 0,
            bottom: windowInfo.windowHeight,
            right: windowInfo.windowWidth,
            width: windowInfo.windowWidth,
            height: windowInfo.windowHeight,
        };
    }

    // FrameRate
    // utils.cloneMethod(globalAdapter, my, 'setPreferredFramesPerSecond');

    // Keyboard
    globalAdapter.showKeyboard = () => console.warn('showKeyboard not supported.');
    globalAdapter.hideKeyboard = () => console.warn('hideKeyboard not supported.');
    globalAdapter.updateKeyboard = () => console.warn('updateKeyboard not supported.');
    globalAdapter.onKeyboardInput = () => console.warn('onKeyboardInput not supported.');
    globalAdapter.onKeyboardConfirm = () => console.warn('onKeyboardConfirm not supported.');
    globalAdapter.onKeyboardComplete = () => console.warn('onKeyboardComplete not supported.');
    globalAdapter.offKeyboardInput = () => console.warn('offKeyboardInput not supported.');
    globalAdapter.offKeyboardConfirm = () => console.warn('offKeyboardConfirm not supported.');
    globalAdapter.offKeyboardComplete = () => console.warn('offKeyboardComplete not supported.');

    // Message
    utils.cloneMethod(globalAdapter, my, 'getOpenDataContext');
    utils.cloneMethod(globalAdapter, my, 'onMessage');

    // SharedCanvas
    utils.cloneMethod(globalAdapter, my, 'getSharedCanvas');

    // Font
    globalAdapter.loadFont = function (url) {
        // my.loadFont crash when url is not in user data path
        return "Arial";
    };

    // hide show Event
    utils.cloneMethod(globalAdapter, my, 'onShow');
    utils.cloneMethod(globalAdapter, my, 'onHide');

    // Accelerometer
    let accelerometerCallback = null;
    let windowWidth = windowInfo.windowWidth;
    let windowHeight = windowInfo.windowHeight;
    let isLandscape = windowWidth > windowHeight;
    function accelerometerChangeCallback (res, cb) {
        let resClone = {};

        let x = res.x;
        let y = res.y;

        if (isLandscape) {
            let tmp = x;
            x = -y;
            y = tmp;
        }

        resClone.x = x;
        resClone.y = y;
        resClone.z = res.z;
        accelerometerCallback && accelerometerCallback(resClone);
    }
    Object.assign(globalAdapter, {
        startAccelerometer (cb) {
            accelerometerCallback = cb;
            my.onAccelerometerChange && my.onAccelerometerChange(accelerometerChangeCallback);
        },

        stopAccelerometer () {
            my.offAccelerometerChange && my.offAccelerometerChange(accelerometerChangeCallback);
        },
    });
}