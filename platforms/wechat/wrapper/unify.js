const utils = require('./utils');

if (window.__globalAdapter) {
    let globalAdapter = window.__globalAdapter;
    // SystemInfo
    utils.cloneMethod(globalAdapter, wx, 'getSystemInfoSync');

    // TouchEvent
    utils.cloneMethod(globalAdapter, wx, 'onTouchStart');
    utils.cloneMethod(globalAdapter, wx, 'onTouchMove');
    utils.cloneMethod(globalAdapter, wx, 'onTouchEnd');
    utils.cloneMethod(globalAdapter, wx, 'onTouchCancel');

    // Audio
    utils.cloneMethod(globalAdapter, wx, 'createInnerAudioContext');

    // FrameRate
    utils.cloneMethod(globalAdapter, wx, 'setPreferredFramesPerSecond');

    // Keyboard
    utils.cloneMethod(globalAdapter, wx, 'showKeyboard');
    utils.cloneMethod(globalAdapter, wx, 'hideKeyboard');
    utils.cloneMethod(globalAdapter, wx, 'updateKeyboard');
    utils.cloneMethod(globalAdapter, wx, 'onKeyboardInput');
    utils.cloneMethod(globalAdapter, wx, 'onKeyboardConfirm');
    utils.cloneMethod(globalAdapter, wx, 'onKeyboardComplete');
    utils.cloneMethod(globalAdapter, wx, 'offKeyboardInput');
    utils.cloneMethod(globalAdapter, wx, 'offKeyboardConfirm');
    utils.cloneMethod(globalAdapter, wx, 'offKeyboardComplete');

    // Message
    utils.cloneMethod(globalAdapter, wx, 'getOpenDataContext');
    utils.cloneMethod(globalAdapter, wx, 'onMessage');

    // Subpackage
    utils.cloneMethod(globalAdapter, wx, 'loadSubpackage');

    // SharedCanvas
    utils.cloneMethod(globalAdapter, wx, 'getSharedCanvas');

    // Font
    utils.cloneMethod(globalAdapter, wx, 'loadFont');

    // hide show Event
    utils.cloneMethod(globalAdapter, wx, 'onShow');
    utils.cloneMethod(globalAdapter, wx, 'onHide');

    // Accelerometer
    let isAccelerometerInit = false;
    let deviceOrientation = 1;
    let systemInfo = wx.getSystemInfoSync();
    let windowWidth = systemInfo.windowWidth;
    let windowHeight = systemInfo.windowHeight;
    let isLandscape = windowWidth > windowHeight;
    if (wx.onDeviceOrientationChange) {
        wx.onDeviceOrientationChange(function (res) {
            if (res.value === 'landscape') {
            deviceOrientation = 1;
            }
            else if (res.value === 'landscapeReverse') {
            deviceOrientation = -1;
            }
        });
    }
    Object.assign(globalAdapter, {
        startAccelerometer (cb) {
            if (!isAccelerometerInit) {
                isAccelerometerInit = true;
                wx.onAccelerometerChange && wx.onAccelerometerChange(function (res) {
                    let resClone = {};
                    let x = res.x;
                    let y = res.y;
                    if (isLandscape) {
                        let tmp = x;
                        x = -y;
                        y = tmp;
                    }
                    
                    resClone.x = x * deviceOrientation;
                    resClone.y = y * deviceOrientation;
                    resClone.z = res.z;
                    cb && cb(resClone);
                });
            }
            else {
                wx.startAccelerometer && wx.startAccelerometer({
                    fail (err) {
                        console.error('start accelerometer failed', err);
                    },
                    // success () {},
                    // complete () {},
                });
            }
        },

        stopAccelerometer () {
            wx.stopAccelerometer && wx.stopAccelerometer({
                fail (err) {
                    console.error('stop accelerometer failed', err);
                },
                // success () {},
                // complete () {},
            });
        },
    });
}