var _frameRate = 60;
const game = cc.game;
const renderer = cc.renderer;
const inputManager = _cc.inputManager;

Object.assign(game, {
    setFrameRate (frameRate) {
        _frameRate = frameRate;
        if (wx.setPreferredFramesPerSecond) {
            wx.setPreferredFramesPerSecond(frameRate);
        }
        else {
            if (this._intervalId) {
                window.cancelAnimFrame(this._intervalId);
            }
            this._intervalId = 0;
            this._paused = true;
            this._setAnimFrame();
            this._runMainLoop();
        }
    },

    _setAnimFrame () {
        this._lastTime = performance.now();
        this._frameTime = 1000 / _frameRate;
    
        if (_frameRate !== 60 && _frameRate !== 30) {
            window.requestAnimFrame = this._stTime;
            window.cancelAnimFrame = this._ctTime;
        }
        else {
            window.requestAnimFrame = window.requestAnimationFrame || this._stTime;
            window.cancelAnimFrame = window.cancelAnimationFrame || this._ctTime;
        }
    },

    getFrameRate () {
        return _frameRate;
    },

    _runMainLoop () {
        var self = this, callback, config = self.config,
            director = cc.director,
            skip = true;
    
        cc.debug.setDisplayStats(config.showFPS);
    
        callback = function () {
            if (!self._paused) {
                self._intervalId = window.requestAnimFrame(callback);
                if (_frameRate === 30) {
                    if (skip = !skip) {
                        return;
                    }
                }
                director.mainLoop();
            }
        };
    
        self._intervalId = window.requestAnimFrame(callback);
        self._paused = false;
    },

    end () { },  // wechat game platform not support this api

    _initRenderer () {
        // Avoid setup to be called twice.
        if (this._rendererInitialized) return;

        let localCanvas, localContainer;

        this.container = localContainer = document.createElement("DIV");
        this.frame = localContainer.parentNode === document.body ? document.documentElement : localContainer.parentNode;
        if (cc.sys.browserType === cc.sys.BROWSER_TYPE_WECHAT_GAME_SUB) {
            localCanvas = window.sharedCanvas || wx.getSharedCanvas();
        }
        else {
            localCanvas = canvas;
        }
        this.canvas = localCanvas;

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

        if (cc.sys.browserType !== cc.sys.BROWSER_TYPE_WECHAT_GAME_SUB) {
            wx.onShow && wx.onShow(onShown);
            wx.onAudioInterruptionEnd && wx.onAudioInterruptionEnd(onShown);
            wx.onHide && wx.onHide(onHidden);
            wx.onAudioInterruptionBegin && wx.onAudioInterruptionBegin(onHidden);
        }

        this.on(game.EVENT_HIDE, function () {
            game.pause();
        });
        this.on(game.EVENT_SHOW, function () {
            game.resume();
        });
    },
});

//  Small game in the screen log
var offset = 100;
var once = true;
wx.onError && wx.onError(function (info) {
    if (!once) {
        return;
    }
    once = false;
    var env = wx.getSystemInfoSync();
    if (!env) {
        return;
    }
    var root = cc.Canvas.instance.node;
    if (!root) {
        return;
    }
    var node = new cc.Node();
    node.color = cc.Color.BLACK;
    node.parent = root;

    var label = node.addComponent(cc.Label);
    node.height = root.height - offset;
    node.width = root.width - offset;
    label.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
    label.verticalAlign = cc.Label.VerticalAlign.TOP;
    label.fontSize = 24;
    label.overflow = cc.Label.Overflow.SHRINK;

    label.string = '请截屏发送以下信息反馈给游戏开发者（Please send this screen shot to the game developer）\n';
    label.string += 'Device: ' + env.brand + ' ' + env.model + '\n' + 'System: ' + env.system + '\n' + 'Platform: WeChat ' + env.version + '\n' + 'Engine: Cocos Creator v' + window.CocosEngine + '\n' + 'Error:\n' + info.message;

    cc.director.pause();

    node.once('touchend', function () {
        node.destroy();
        setTimeout(function () {
            cc.director.resume();
        }, 1000)
    })
});