const parser = cc.assetManager.parser;
const downloader = cc.assetManager.downloader;

function doNothing (url, options, onComplete) {
    onComplete(null, url);
}

downloader.downloadDomAudio = doNothing;

downloader.register({
    // Audio
    '.mp3' : doNothing,
    '.ogg' : doNothing,
    '.wav' : doNothing,
    '.m4a' : doNothing,
});

parser.register({
    // Audio
    '.mp3' : doNothing,
    '.ogg' : doNothing,
    '.wav' : doNothing,
    '.m4a' : doNothing,
});
