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
    
    cc.assetManager.init({ 
        bundleVers: settings.bundleVers,
        subpackages: settings.subpackages,
        remoteBundles: settings.remoteBundles
     });

    let { RESOURCES, INTERNAL, MAIN, START_SCENE } = cc.AssetManager.BuiltinBundleName;
    let bundleRoot = [INTERNAL, MAIN];
    settings.hasStartSceneBundle && bundleRoot.push(START_SCENE);
    settings.hasResourcesBundle && bundleRoot.push(RESOURCES);
    
    var count = 0;
    function cb (err) {
        if (err) return console.error(err.message, err.stack);
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
        let bundleName = bundleRoot[i];
        cc.assetManager.loadBundle(`${fsUtils.subpackages[bundleName] ? 'subpackages/' : (fsUtils.remoteBundles[bundleName] ? REMOTE_SERVER_ROOT + 'remote/' : 'assets/')}${bundleName}`, cb);
    }
};