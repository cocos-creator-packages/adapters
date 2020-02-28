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

    // jsList
    var jsList = settings.jsList;

    if (jsList) {
        jsList = jsList.map(function (x) {
            return 'src/' + x;
        });
    }

    var isSubContext = (cc.sys.platform === cc.sys.BAIDU_GAME_SUB);

    var option = {
        id: 'GameCanvas',
        debugMode: settings.debug ? cc.debug.DebugMode.INFO : cc.debug.DebugMode.ERROR,
        showFPS: !isSubContext && settings.debug,
        frameRate: 60,
        jsList: jsList,
        groupList: settings.groupList,
        collisionMatrix: settings.collisionMatrix,
    }

    cc.assetManager.init({ bundleVers: settings.bundleVers });

    let { RESOURCES, INTERNAL, MAIN } = cc.AssetManager.BuiltinBundle;
    let bundleRoot = [RESOURCES, INTERNAL, MAIN];
    
    var count = 0;
    function cb (err) {
        if (err) {
            console.error(err);
            return;
        }
        count++;
        if (count === bundleRoot.length) {
            cc.game.run(option, onStart);
        }
    }
    for (let i = 0; i < bundleRoot.length; i++) {
        cc.assetManager.loadBundle(REMOTE_SERVER_ROOT + '/assets/' + bundleRoot[i], cb);
    }
};