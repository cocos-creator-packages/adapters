var _frameRate = 60;
const inputManager = _cc.inputManager;
const renderer = cc.renderer;
const game = cc.game;

Object.assign(game, {
    setFrameRate (frameRate) {
        _frameRate = frameRate;
        qg.setPreferredFramesPerSecond(frameRate);
    },

    getFrameRate () {
        return _frameRate;
    },

    _runMainLoop () {
        var self = this, callback, config = self.config,
            director = cc.director,
            skip = true, frameRate = config.frameRate;
    
        cc.debug.setDisplayStats(config.showFPS);
    
        callback = function () {
            if (!self._paused) {
                self._intervalId = window.requestAnimFrame(callback);
                director.mainLoop();
            }
        };
    
        self._intervalId = window.requestAnimFrame(callback);
        self._paused = false;
    },

    end () {},

    _initRenderer () {
        // Avoid setup to be called twice.
        if (this._rendererInitialized) return;

        let localCanvas = this.canvas = canvas;

        this.container = document.createElement("DIV");
        this.frame = this.container.parentNode === document.body ? document.documentElement : this.container.parentNode;

        this._determineRenderType();
        // WebGL context created successfully
        if (this.renderType === this.RENDER_TYPE_WEBGL) {
            var opts = {
                'stencil': true,
                // MSAA is causing serious performance dropdown on some browsers.
                'antialias': cc.macro.ENABLE_WEBGL_ANTIALIAS,
                'alpha': cc.macro.ENABLE_TRANSPARENT_CANVAS,
                'preserveDrawingBuffer': false,
            };
            renderer.initWebGL(localCanvas, opts);
            this._renderContext = renderer.device._gl;
            
            // Enable dynamic atlas manager by default
            if (!cc.macro.CLEANUP_IMAGE_CACHE && dynamicAtlasManager) {
                dynamicAtlasManager.enabled = true;
            }
        }
        if (!this._renderContext) {
            this.renderType = this.RENDER_TYPE_CANVAS;
            // Could be ignored by module settings
            renderer.initCanvas(localCanvas);
            this._renderContext = renderer.device._ctx;
        }

        this._rendererInitialized = true;
    },

    _initEvents () {
        // register system events
        if (this.config.registerSystemEvent) {
            inputManager.registerSystemEvent(this.canvas);
        }

        function onHidden () {
            game.emit(game.EVENT_HIDE);
        }

        function onShown (res) {
            game.emit(game.EVENT_SHOW, res);
        }

        qg.onShow && qg.onShow(onShown);
        qg.onHide && qg.onHide(onHidden);

        this.on(game.EVENT_HIDE, function () {
            game.pause();
        });
        this.on(game.EVENT_SHOW, function () {
            game.resume();
        });
    },
});