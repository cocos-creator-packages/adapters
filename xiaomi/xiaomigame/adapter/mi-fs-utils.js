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
var fs = qg.getFileSystemManager ? qg.getFileSystemManager() : null;

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
        success () {
            cc.log('Removed local file ' + filePath + ' successfully!');
            callback && callback(null);
        },
        fail (res) {
            console.warn(res.errMsg);
            callback && callback(new Error(res.errMsg));
        }
    });
}

function downloadFile (remoteUrl, filePath, callback) {
    qg.downloadFile({
        url: remoteUrl,
        filePath: filePath,
        success (res) {
            if (res.statusCode === 200) {
                callback && callback(null, res.tempFilePath || res.filePath);
            }
            else {
                if (res.filePath) {
                    deleteFile(res.filePath);
                }
                console.warn("Download file failed: " + remoteUrl);
                callback && callback(new Error(res.errMsg), null);
            }
        },
        fail (res) {
            console.warn(res.errMsg);
            callback && callback(new Error(res.errMsg), null);
        }
    });
}

function saveFile (srcPath, destPath, callback) {
    qg.saveFile({
        tempFilePath: srcPath,
        filePath: destPath,
        success (res) {
            cc.log('save file finished:' + destPath);
            callback && callback(null, res.savedFilePath);
        },
        fail (res) {
            cc.log('save file failed:' + res.errMsg);
            callback && callback(new Error(res.errMsg), null);
        }
    });
}

function copyFile (srcPath, destPath, callback) {
    var result = checkFsValid();
    if (result) return result;
    fs.copyFile({
        srcPath: srcPath,
        destPath: destPath,
        success () {
            cc.log('copy file finished:' + destPath);
            callback && callback(null);
        },
        fail (res) {
            cc.log('copy file failed:' + res.errMsg);
            callback && callback(new Error(res.errMsg));
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
        success () {
            callback && callback(null);
        },
        fail (res) {
            console.warn(res.errMsg);
            callback && callback(new Error(res.errMsg));
        }
    });
}

function writeFileSync (path, data, encoding) {
    var result = checkFsValid();
    if (result) return result;
    try {
        fs.writeFileSync(path, data, encoding);
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
        success (res) {
            callback && callback(null, res.data);
        },
        fail (res) {
            console.warn(res.errMsg);
            callback && callback (new Error(res.errMsg), null);
        },
    });
}

function readDir (filePath, callback) {
    var result = checkFsValid();
    if (result) {
        return result;
    }
    fs.readdir({
        dirPath: filePath,
        success (res) {
            callback && callback(null, res.files);
        },
        fail (res) {
            callback && callback(new Error(res.errMsg), null);
        },
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
        var str = fs.readFileSync(path, 'utf8');
        return JSON.parse(str);
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
        fs.mkdirSync(path, recursive);
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
        success () {
            callback && callback(true);
        },
        fail () {
            callback && callback(false);
        },
    });
}

window.miFsUtils = module.exports = {fs, checkFsValid, readDir, exists, copyFile, downloadFile, readText, readArrayBuffer, saveFile, writeFile, deleteFile, writeFileSync, readJsonSync, makeDirSync};