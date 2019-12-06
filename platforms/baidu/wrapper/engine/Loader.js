function downloadScript (item, callback, isAsync) {
    // BAIDU can't support dynamic require well
    $require(item.url);
    callback(null, item.url);
}
cc.loader.downloader.addHandlers({
    js : downloadScript,
});