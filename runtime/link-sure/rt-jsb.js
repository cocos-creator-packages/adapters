/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
'use strict';

if (!jsb.fileUtils) {
    jsb.fileUtils = {
        getStringFromFile: function (url) {
            const result = qg.readFileSync && qg.readFileSync({
                uri: url,
                encoding: 'utf8'
            });

            return result && result.text;
        },

        getDataFromFile: function (url) {
            const result = qg.readFileSync && qg.readFileSync({
                uri: url,
                encoding: 'binary'
            });

            return result && result.text;
        },

        getWritablePath: function () {
            // return `${rt.env.USER_DATA_PATH}/`;
            return 'internal://files/'
        },

        writeToFile: function (map, url) {
            var str = JSON.stringify(map);
            const result = qg.writeFileSync && qg.writeFileSync({
                uri: url,
                encoding: 'utf8',
                text: str
            });

            if (result !== 'success') {
                throw new Error('writeToFile fail');
            }
        },

        getValueMapFromFile: function (url) {
            var map_object = {};
            var read = qg.readFileSync && qg.readFileSync({
                uri: url,
                encoding: 'utf8'
            });
            if (!read || !read.text) {
                return map_object;
            }

            try {
                map_object = JSON.parse(read.text);
            } catch (error) {

            }

            return map_object;
        },
    };
}

if (!jsb.saveImageData) {
    if (qg.saveImageTempSync && qg.copyFileSync) {
        jsb.saveImageData = function (data, width, height, filePath) {
            var index = filePath.lastIndexOf(".");
            if (index === -1) {
                return false;
            }
            var fileType = filePath.substr(index + 1);
            var tempFilePath = qg.saveImageTempSync({
                'data': data,
                'width': width,
                'height': height,
                'fileType': fileType,
            });
            if (tempFilePath === '') {
                return false;
            }
            var savedFilePath = qg.copyFileSync({
                srcUri: tempFilePath,
                dstUri: filePath
            });
            if (savedFilePath === filePath) {
                return true;
            }
            return false;
        }
    } else {
        jsb.saveImageData = function (data, width, height, filePath) {
            // 旧版本不支持该方法
        }
    }
}

if (!jsb.setPreferredFramesPerSecond) {
    jsb.setPreferredFramesPerSecond = function (fps) {
        qg.setPreferredFramesPerSecond(fps);
    }
}

if (jsb.device) {
    let _tempGravitySenceArray = undefined;

    jsb.device.setAccelerometerEnabled = function (enabled) {
        if ((_tempGravitySenceArray !== undefined) === enabled) {
            return;
        }
        if (!enabled) {
            qg.unsubscribeAccelerometer();
            _tempGravitySenceArray = undefined;
            return;
        }
        _tempGravitySenceArray = new Array(6).fill(0);
        qg.subscribeAccelerometer({
            callback: function (obj) {

            _tempGravitySenceArray[3] = obj.x;
            _tempGravitySenceArray[4] = obj.y;
            _tempGravitySenceArray[5] = obj.z;

            let windowWidth = window.innerWidth;
            let windowHeight = window.innerHeight;
            let gravityFactor = 1.0;
            //landscape view
            if (windowHeight < windowWidth) {
                let tmp = _tempGravitySenceArray[3];
                _tempGravitySenceArray[3] = _tempGravitySenceArray[4];
                _tempGravitySenceArray[4] = tmp;
                _tempGravitySenceArray[3] *= -gravityFactor;
                _tempGravitySenceArray[4] *= gravityFactor;
            }
            else {
                _tempGravitySenceArray[3] *= -gravityFactor;
                _tempGravitySenceArray[4] *= -gravityFactor;
            }
        }})
    }

    jsb.device.getDeviceMotionValue = function () {
        if (_tempGravitySenceArray === undefined) {
            return undefined;
        }
        return _tempGravitySenceArray.slice();
    }

    // cause this function have bug at vivo
    jsb.device.setMotionInterval = function (interval) {
    }
}

