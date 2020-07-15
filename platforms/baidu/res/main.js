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
    
    var isSubContext = (cc.sys.platform === cc.sys.BAIDU_GAME_SUB);

    var option = {
        id: 'GameCanvas',
        debugMode: settings.debug ? cc.debug.DebugMode.INFO : cc.debug.DebugMode.ERROR,
        showFPS: !isSubContext && settings.debug,
        frameRate: 60,
        groupList: settings.groupList,
        collisionMatrix: settings.collisionMatrix,
    }

    cc.assetManager.init({ 
        bundleVers: settings.bundleVers, 
        subpackages: settings.subpackages, 
        remoteBundles: settings.remoteBundles,
        server: settings.server,
        subContextRoot: settings.subContextRoot
    });

    let { RESOURCES, INTERNAL, MAIN, START_SCENE } = cc.AssetManager.BuiltinBundleName;
    let bundleRoot = [INTERNAL];
    settings.hasResourcesBundle && bundleRoot.push(RESOURCES);
    settings.hasStartSceneBundle && bundleRoot.push(MAIN);
    
    var count = 0;
    function cb (err) {
        if (err) return console.error(err.message, err.stack);
        count++;
        if (count === bundleRoot.length + 1) {
            cc.assetManager.loadBundle(settings.hasStartSceneBundle ? START_SCENE : MAIN, cb);
        }
        else if (count === bundleRoot.length + 2) {
            cc.game.run(option, onStart);
        }
    }

    // load plugins
    cc.assetManager.loadScript(settings.jsList.map(function (x) { return 'src/' + x;}), cb);

    // load bundles
    for (let i = 0; i < bundleRoot.length; i++) {
        cc.assetManager.loadBundle(bundleRoot[i], cb);
    }
};