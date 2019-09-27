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

var fsUtils = {

    fs,

    getUserDataPath () {
        return my.env.USER_DATA_PATH;
    },
    
    checkFsValid () {
        if (!fs) {
            console.warn('can not get the file system!');
            return false;
        }
        return true;
    },
    
    deleteFile (filePath, onComplete) {
        fs.unlink({
            filePath: filePath,
            success: function () {
                onComplete && onComplete(null);
            },
            fail: function (res) {
                cc.warn('Delete file failed: ' + res.errorMessage);
                onComplete && onComplete(new Error(res.errorMessage));
            }
        });
    },
    
    downloadFile (remoteUrl, filePath, header, onComplete) {
        var options = {
            url: remoteUrl,
            success: function (res) {
                if (!filePath) {
                    onComplete && onComplete(null, res.apFilePath);
                }
                else {
                    fsUtils.saveFile(res.apFilePath, filePath, onComplete);
                }
            },
            fail: function (res) {
                cc.warn('Download file failed: ' + res.errorMessage);
                onComplete && onComplete(new Error(res.errorMessage), null);
            }
        }
        if (header) options.header = header;
        return my.downloadFile(options);
    },
    
    saveFile (srcPath, destPath, onComplete) {
        my.saveFile({
            tempFilePath: srcPath,
            filePath: destPath,
            success: function (res) {
                onComplete && onComplete(null, res.savedFilePath);
            },
            fail: function (res) {
                cc.warn('Save file failed: ' + res.errorMessage);
                onComplete && onComplete(new Error(res.errorMessage), null);
            }
        });
    },
    
    copyFile (srcPath, destPath, onComplete) {
        fs.copyFile({
            srcPath: srcPath,
            destPath: destPath,
            success: function () {
                onComplete && onComplete(null);
            },
            fail: function (res) {
                cc.warn('Copy file failed: ' + res.errorMessage);
                onComplete && onComplete(new Error(res.errorMessage));
            }
        });
    },
    
    writeFile (path, data, encoding, onComplete) {
        fs.writeFile({
            filePath: path,
            encoding: encoding,
            data: data,
            success: function () {
                onComplete && onComplete(null);
            },
            fail: function (res) {
                cc.warn('Write file failed: ' + res.errorMessage);
                onComplete && onComplete(new Error(res.errorMessage));
            }
        });
    },
    
    writeFileSync (path, data, encoding) {
        try {
            fs.writeFileSync({
                filePath: path,
                data: data,
                encoding: encoding,
            });
            return null;
        }
        catch (e) {
            cc.warn('Write file failed: ' + e.message);
            return new Error(e.message);
        }
    },
    
    readFile (filePath, encoding, onComplete) {
        fs.readFile({
            filePath: filePath,
            encoding: encoding,
            success: function (res) {
                onComplete && onComplete(null, res.data);
            },
            fail: function (res) {
                cc.warn('Read file failed: ' + res.errorMessage);
                onComplete && onComplete (new Error(res.errorMessage), null);
            }
        });
    },
    
    readDir (filePath, onComplete) {
        fs.readdir({
            dirPath: filePath,
            success: function (res) {
                onComplete && onComplete(null, res.files);
            },
            fail: function (res) {
                cc.warn('Read directory failed: ' + res.errorMessage);
                onComplete && onComplete(new Error(res.errorMessage), null);
            }
        });
    },
    
    readText (filePath, onComplete) {
        fsUtils.readFile(filePath, 'utf8', onComplete);
    },
    
    readArrayBuffer (filePath, onComplete) {
        fsUtils.readFile(filePath, '', onComplete);
    },
    
    readJson (filePath, onComplete) {
        fsUtils.readFile(filePath, 'utf8', function (err, text) {
            var out = null;
            if (!err) {
                try {
                    out = JSON.parse(text);
                }
                catch (e) {
                    cc.warn('Read json failed: ' + e.message);
                    err = new Error(e.message);
                }
            }
            onComplete && onComplete(err, out);
        });
    },

    readJsonSync (path) {
        try {
            var res = fs.readFileSync({
                filePath: path,
                encoding: 'utf8',
            });
            return JSON.parse(res.data);
        }
        catch (e) {
            cc.warn('Read json failed: ' + e.message);
            return new Error(e.message);
        }
    },
    
    makeDirSync (path, recursive) {
        try {
            fs.mkdirSync({
                dirPath: path,
                recursive: recursive,
            });
            return null;
        }
        catch (e) {
            cc.warn('Make directory failed: ' + e.message);
            return new Error(e.message);
        }
    },

    rmdirSync (dirPath, recursive) {
        try {
            fs.rmdirSync({ dirPath, recursive });
        }
        catch (e) {
            cc.warn('rm directory failed: ' + e.message);
            return new Error(e.message);
        }
    },
    
    exists (filePath, onComplete) {
        fs.access({
            path: filePath,
            success: function () {
                onComplete && onComplete(true);
            },
            fail: function () {
                onComplete && onComplete(false);
            }
        });
    },

    loadSubpackage (name, onProgress, onComplete) {
        throw new Error('xiaomi does not support loadSubpackage');
    }
};

cc.assetManager.fsUtils = module.exports = fsUtils;