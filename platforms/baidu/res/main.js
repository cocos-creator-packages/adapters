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

    var bundledScript = settings.debug ? 'src/project.dev.js' : 'src/project.js';
    if (jsList) {
        jsList = jsList.map(function (x) {
            return 'src/' + x;
        });
        jsList.push(bundledScript);
    }
    else {
        jsList = [bundledScript];
    }

    var isSubContext = (cc.sys.platform === cc.sys.BAIDU_GAME_SUB);

    var option = {
        id: 'GameCanvas',
        scenes: settings.scenes,
        debugMode: settings.debug ? cc.debug.DebugMode.INFO : cc.debug.DebugMode.ERROR,
        showFPS: !isSubContext && settings.debug,
        frameRate: 60,
        jsList: jsList,
        groupList: settings.groupList,
        collisionMatrix: settings.collisionMatrix,
    }

    cc.assetManager.init();
    var resourcesRoot = 'assets/resources';
    var internalRoot = 'assets/internal';
    var scenesRoot = 'assets/scenes';
    if (REMOTE_SERVER_ROOT) {
        resourcesRoot = REMOTE_SERVER_ROOT + '/' + resourcesRoot;
        internalRoot = REMOTE_SERVER_ROOT + '/' + internalRoot;
        scenesRoot = REMOTE_SERVER_ROOT + '/' + scenesRoot;
    }
    var count = 0;
    function cb (err) {
        if (!err) count++;
        if (count === 3) {
            cc.game.run(option, onStart);
        }
    }
    cc.assetManager.loadBundle(internalRoot, {ver: settings.internalVer},  cb);
    cc.assetManager.loadBundle(resourcesRoot, {ver: settings.resourcesVer}, cb);
    cc.assetManager.loadBundle(scenesRoot, {ver: settings.scenesVer}, cb);
};