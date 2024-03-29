const utils = require('../../../common/utils');

if (window.__globalAdapter) {
    let globalAdapter = window.__globalAdapter;
    // SystemInfo
    let systemInfo;
    let systemInfoCached = false;
    function refreshSystemInfo(delay){
        systemInfo = tt.getSystemInfoSync();
        // refresh systemInfo, some seconds later.
        setTimeout(function () {
            systemInfo = tt.getSystemInfoSync();
            systemInfoCached = true
        }, delay || 5000);
    }
    refreshSystemInfo();

    function isLandscape () {
        return systemInfo.deviceOrientation ? (systemInfo.deviceOrientation === "landscape"): (systemInfo.screenWidth > systemInfo.screenHeight);
    }

    globalAdapter.isSubContext = (tt.getOpenDataContext === undefined);
    globalAdapter.isDevTool = (systemInfo.platform === 'devtools');
    utils.cloneMethod(globalAdapter, tt, 'getSystemInfoSync');

    // TouchEvent
    utils.cloneMethod(globalAdapter, tt, 'onTouchStart');
    utils.cloneMethod(globalAdapter, tt, 'onTouchMove');
    utils.cloneMethod(globalAdapter, tt, 'onTouchEnd');
    utils.cloneMethod(globalAdapter, tt, 'onTouchCancel');

    // Audio
    utils.cloneMethod(globalAdapter, tt, 'createInnerAudioContext');

    // AudioInterruption Evnet
    utils.cloneMethod(globalAdapter, tt, 'onAudioInterruptionEnd');
    utils.cloneMethod(globalAdapter, tt, 'onAudioInterruptionBegin');

    // Video
    utils.cloneMethod(globalAdapter, tt, 'createVideo');

    // FrameRate
    utils.cloneMethod(globalAdapter, tt, 'setPreferredFramesPerSecond');

    // Keyboard
    utils.cloneMethod(globalAdapter, tt, 'showKeyboard');
    utils.cloneMethod(globalAdapter, tt, 'hideKeyboard');
    utils.cloneMethod(globalAdapter, tt, 'updateKeyboard');
    utils.cloneMethod(globalAdapter, tt, 'onKeyboardInput');
    utils.cloneMethod(globalAdapter, tt, 'onKeyboardConfirm');
    utils.cloneMethod(globalAdapter, tt, 'onKeyboardComplete');
    utils.cloneMethod(globalAdapter, tt, 'offKeyboardInput');
    utils.cloneMethod(globalAdapter, tt, 'offKeyboardConfirm');
    utils.cloneMethod(globalAdapter, tt, 'offKeyboardComplete');

    // Message
    utils.cloneMethod(globalAdapter, tt, 'getOpenDataContext');
    utils.cloneMethod(globalAdapter, tt, 'onMessage');

    // SharedCanvas
    utils.cloneMethod(globalAdapter, tt, 'getSharedCanvas');

    // Font
    utils.cloneMethod(globalAdapter, tt, 'loadFont');

    // hide show Event
    utils.cloneMethod(globalAdapter, tt, 'onShow');
    utils.cloneMethod(globalAdapter, tt, 'onHide');

    // onError
    utils.cloneMethod(globalAdapter, tt, 'onError');
    // offError
    utils.cloneMethod(globalAdapter, tt, 'offError');

    // Accelerometer
    let isAccelerometerInit = false;
    let deviceOrientation = 1;
    if (tt.onDeviceOrientationChange) {
        tt.onDeviceOrientationChange(function (res) {
            refreshSystemInfo();

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
                tt.onAccelerometerChange && tt.onAccelerometerChange(function (res) {
                    let resClone = {};
                    let x = res.x;
                    let y = res.y;
                    if (isLandscape()) {
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
                tt.startAccelerometer && tt.startAccelerometer({
                    fail (err) {
                        console.error('start accelerometer failed', err);
                    },
                    // success () {},
                    // complete () {},
                });
            }
        },

        stopAccelerometer () {
            tt.stopAccelerometer && tt.stopAccelerometer({
                fail (err) {
                    console.error('stop accelerometer failed', err);
                },
                // success () {},
                // complete () {},
            });
        },
    });

    // safeArea
    // origin point on the top-left corner
    globalAdapter.getSafeArea = function () {
        systemInfo = systemInfoCached ? systemInfo : tt.getSystemInfoSync();

        let { top, left, bottom, right, width, height } = systemInfo.safeArea;
        // HACK: on iOS device, the orientation should mannually rotate
        if (systemInfo.platform === 'ios' && !globalAdapter.isDevTool && isLandscape()) {
            let tmpTop = top, tmpLeft = left, tmpBottom = bottom, tmpRight = right, tmpWidth = width, tmpHeight = height;
            top = tmpLeft;
            left = tmpTop;
            right = tmpRight - tmpTop;
        }
        return { top, left, bottom, right, width, height };
    }
}
