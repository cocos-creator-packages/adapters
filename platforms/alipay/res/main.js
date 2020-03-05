window.boot = function () {
    var settings = window._CCSettings;
    window._CCSettings = undefined;

    var onStart = function () {

        cc.view.enableRetina(true);
        cc.view.resizeWithBrowserSize(true);

        var launchScene = settings.launchScene;

        // load scene
        cc.director.loadScene(launchScene, null,
            function () {
                console.log('Success to load scene: ' + launchScene);
            }
        );
    };

    var option = {
        id: 'GameCanvas',
        debugMode: settings.debug ? cc.debug.DebugMode.INFO : cc.debug.DebugMode.ERROR,
        showFPS: settings.debug,
        frameRate: 60,
        groupList: settings.groupList,
        collisionMatrix: settings.collisionMatrix,
    }

    cc.assetManager.init({ bundleVers: settings.bundleVers });

    let { RESOURCES, INTERNAL, MAIN } = cc.AssetManager.BuiltinBundle;
    let bundleRoot = [RESOURCES, INTERNAL, MAIN];
    
    var count = 0;
    function cb (err) {
        if (err) return console.error(err);
        count++;
        if (count === bundleRoot.length + 1) {
            cc.game.run(option, onStart);
        }
    }

    // load plugins
    cc.assetManager.loadScript(settings.jsList.map(function (x) { return 'src/' + x;}), cb);

    if (REMOTE_SERVER_ROOT && !REMOTE_SERVER_ROOT.endsWith('/')) REMOTE_SERVER_ROOT += '/';

    // load bundles
    for (let i = 0; i < bundleRoot.length; i++) {
        cc.assetManager.loadBundle(REMOTE_SERVER_ROOT + 'assets/' + bundleRoot[i], cb);
    }
};