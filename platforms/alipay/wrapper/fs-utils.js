/****************************************************************************
 Copyright (c) 2017-2019 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
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
var fs = my.getFileSystemManager ? my.getFileSystemManager() : null;

function getUserDataPath () {
    return my.env.USER_DATA_PATH;
}

function checkFsValid () {
    if (!fs) {
        console.warn('can not get the file system!');
        return new Error('file system does not exist!');
    }
    return null;
}

function deleteFile (filePath, callback) {
    var result = checkFsValid();
    if (result) return result;
    fs.unlink({
        filePath: filePath,
        success: function () {
            console.log('Removed local file ' + filePath + ' successfully!');
            callback && callback(null);
        },
        fail: function (res) {
            console.error('unlink file failed', res);
            callback && callback(new Error(res.errorMessage));
        }
    });
}

function downloadFile (remoteUrl, filePath, callback) {
    my.downloadFile({
        url: remoteUrl,
        filePath: filePath,
        success: function (res) {
            callback && callback(null, res.apFilePath);
        },
        fail: function (res) {
            console.error('download file failed', res);
            callback && callback(new Error(res.errorMessage), null);
        }
    });
}

function saveFile (srcPath, destPath, callback) {
    my.saveFile({
        tempFilePath: srcPath,
        filePath: destPath,
        success: function (res) {
            console.log('save file finished:' + destPath);
            callback && callback(null, res.savedFilePath);
        },
        fail: function (res) {
            console.error('save file failed', res);
            callback && callback(new Error(res.errorMessage), null);
        }
    });
}

function copyFile (srcPath, destPath, callback) {
    var result = checkFsValid();
    if (result) return result;
    fs.copyFile({
        srcPath: srcPath,
        destPath: destPath,
        success: function () {
            console.log('copy file finished:' + destPath);
            callback && callback(null);
        },
        fail: function (res) {
            console.error('copy file failed', res);
            callback && callback(new Error(res.errorMessage));
        }
    });
}

function writeFile (path, data, encoding, callback) {
    var result = checkFsValid();
    if (result) return result;
    fs.writeFile({
        filePath: path,
        encoding: encoding,
        data: data,
        success: callback ? function () {
            callback(null);
        } : undefined,
        fail: function (res) {
            console.error('write file failed', res);
            callback && callback(new Error(res.errorMessage));
        }
    });
}

function writeFileSync (path, data, encoding) {
    var result = checkFsValid();
    if (result) return result;
    try {
        fs.writeFileSync({
            filePath: path,
            data: data,
            encoding: encoding,
        });
        return null;
    }
    catch (e) {
        console.warn(e.message);
        return new Error(e.message);
    }
}

function readFile (filePath, encoding, callback) {
    var result = checkFsValid();
    if (result) return result;
    fs.readFile({
        filePath: filePath,
        encoding: encoding,
        success: callback ? function (res) {
            callback(null, res.data);
        } : undefined,
        fail: function (res) {
            console.error('read file failed', res);
            callback && callback (new Error(res.errorMessage), null);
        }
    });
}

function readDir (filePath, callback) {
    var result = checkFsValid();
    if (result) {
        return result;
    }
    fs.readdir({
        dirPath: filePath,
        success: callback ? function (res) {
            callback(null, res.files);
        } : undefined,
        fail: callback ? function (res) {
            callback(new Error(res.errorMessage), null);
        } : undefined
    });
}

function readText (filePath, callback) {
    return readFile(filePath, 'utf8', callback);
}

function readArrayBuffer (filePath, callback) {
    return readFile(filePath, '', callback);
}

function readJsonSync (path) {
    var result = checkFsValid();
    if (result) return result;
    try {
        var res = fs.readFileSync({
            filePath: path,
            encoding: 'utf8',
        });
        return JSON.parse(res.data);
    }
    catch (e) {
        console.warn(e.message);
        return new Error(e.message);
    }
}

function makeDirSync (path, recursive) {
    var result = checkFsValid();
    if (result) return result;
    try {
        fs.mkdirSync({
            dirPath: path,
            recursive: recursive,
        });
        return null;
    }
    catch (e) {
        console.warn(e.message);
        return new Error(e.message);
    }
}

function exists (filePath, callback) {
    var result = checkFsValid();
    if (result) return result;
    fs.access({
        path: filePath,
        success: callback ? function () {
            callback(true);
        } : undefined,
        fail: callback ? function () {
            callback(false);
        } : undefined,
    });
}

module.exports = {fs, getUserDataPath, checkFsValid, readDir, exists, copyFile, downloadFile, readText, readArrayBuffer, saveFile, writeFile, deleteFile, writeFileSync, readJsonSync, makeDirSync};