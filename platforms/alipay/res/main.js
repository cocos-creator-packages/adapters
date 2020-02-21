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

    var option = {
        id: 'GameCanvas',
        debugMode: settings.debug ? cc.debug.DebugMode.INFO : cc.debug.DebugMode.ERROR,
        showFPS: settings.debug,
        frameRate: 60,
        jsList: jsList,
        groupList: settings.groupList,
        collisionMatrix: settings.collisionMatrix,
    }

    cc.assetManager.init({ bundleVers: settings.bundleVers });

    var resourcesRoot = REMOTE_SERVER_ROOT + '/assets/resources';
    var internalRoot = REMOTE_SERVER_ROOT + '/assets/internal';
    var mainRoot = REMOTE_SERVER_ROOT + '/assets/main';
    var count = 0;
    function cb (err) {
        if (!err) count++;
        if (count === 3) {
            cc.game.run(option, onStart);
        }
    }
    cc.assetManager.loadBundle(internalRoot,  cb);
    cc.assetManager.loadBundle(resourcesRoot, cb);
    cc.assetManager.loadBundle(mainRoot, cb);
};