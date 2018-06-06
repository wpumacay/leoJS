/// <reference path="../engine3d/debug/LDebugSystem.ts" />
/// <reference path="assets/LAssetsManager.ts" />
/// <reference path="renderer/LMasterRenderer.ts" />
/// <reference path="scene/LScene.ts" />
/// <reference path="LInputHandler.ts" />
/// <reference path="LApplicationData.ts" />
var core;
(function (core) {
    core.MAX_DELTA = 50;
    var LApplication = /** @class */ (function () {
        function LApplication(canvas, glContext, appConfigData, initializationCallback, updateCallback) {
            LApplication.INSTANCE = this;
            this.canvas = canvas;
            this.canvas.width = this.canvas.clientWidth;
            this.canvas.height = this.canvas.clientHeight;
            this.gl = glContext;
            this.m_appWidth = this.canvas.width;
            this.m_appHeight = this.canvas.height;
            this.m_currentScene = null;
            this.m_scenes = {};
            this.m_masterRenderer = null;
            window.onresize = this.onResize;
            this.m_userResizeCallback = null;
            // initialize
            this.gl.viewport(0, 0, this.m_appWidth, this.m_appHeight);
            this.gl.clearColor(0.1, 0.1, 0.1, 1.0);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.m_isReady = false;
            this.m_hasLoadedShaders = false;
            this.m_hasLoadedTextures = false;
            this.m_hasLoadedModels = false;
            this.m_hasLoadedTextAssets = false;
            this.m_initializationCallback = initializationCallback;
            this.m_updateCallback = updateCallback;
            this.m_assetsManager = core.LAssetsManager.create();
            this.m_assetsManager.loadTextures(appConfigData.assets, this.onTexturesLoaded);
            this.m_assetsManager.loadShaders(appConfigData.shaders, this.onShadersLoaded);
            this.m_assetsManager.loadModels(appConfigData.models, this.onModelsLoaded);
            this.m_assetsManager.loadTextAssets(appConfigData.textAssets, this.onTextAssetsLoaded);
            this.m_tBef = Date.now();
            this.m_tNow = Date.now();
            this.m_tDelta = core.MAX_DELTA;
            core.LInputHandler.init(canvas);
            requestAnimationFrame(this.onTick);
        }
        LApplication.prototype._initialize = function () {
            this.m_masterRenderer = new core.LMasterRenderer();
            engine3d.DebugSystem.init();
            this.m_initializationCallback();
        };
        LApplication.prototype.addScene = function (scene) {
            if (this.m_scenes[scene.id()]) {
                console.warn('LApplication> there already exists a scene with id: ' +
                    scene.id());
                return;
            }
            if (!this.m_currentScene) {
                this.m_currentScene = scene;
            }
            this.m_scenes[scene.id()] = scene;
        };
        LApplication.prototype.changeToScene = function (sceneId) {
            if (!this.m_scenes[sceneId]) {
                console.warn('LApplication> there is no camera with id: ' + sceneId);
                return;
            }
            this.m_currentScene = this.m_scenes[sceneId];
        };
        LApplication.prototype.getScene = function (sceneId) {
            if (!this.m_scenes[sceneId]) {
                console.warn('LApplication> there is no camera with id: ' + sceneId);
                return null;
            }
            return this.m_scenes[sceneId];
        };
        LApplication.prototype.getCurrentScene = function () {
            return this.m_currentScene;
        };
        LApplication.prototype.addUserResizeCallback = function (callback) {
            this.m_userResizeCallback = callback;
        };
        LApplication.prototype.onTick = function () {
            var _self = LApplication.INSTANCE;
            requestAnimationFrame(_self.onTick);
            _self.m_tNow = Date.now();
            _self.m_tDelta = _self.m_tNow - _self.m_tBef;
            _self.m_tBef = _self.m_tNow;
            _self.m_tDelta = (_self.m_tDelta > core.MAX_DELTA) ? core.MAX_DELTA : _self.m_tDelta;
            _self.m_assetsManager.update();
            if (!_self.m_isReady) {
                if (_self.m_hasLoadedShaders &&
                    _self.m_hasLoadedTextures &&
                    _self.m_hasLoadedModels &&
                    _self.m_hasLoadedTextAssets) {
                    _self._initialize();
                    _self.m_isReady = true;
                }
                return;
            }
            _self.update(_self.m_tDelta);
            _self.render();
        };
        LApplication.prototype.update = function (dt) {
            this.m_assetsManager.update();
            if (this.m_updateCallback) {
                this.m_updateCallback(dt);
            }
            if (this.m_currentScene) {
                this.m_currentScene.update(dt);
            }
        };
        LApplication.prototype.render = function () {
            this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
            if (this.m_currentScene) {
                engine3d.DebugSystem.begin(this.m_currentScene.getCurrentCamera().getViewMatrix(), this.m_currentScene.getCurrentCamera().getProjectionMatrix());
                engine3d.DebugSystem.render();
                this.m_masterRenderer.begin(this.m_currentScene);
                this.m_masterRenderer.render(this.m_currentScene);
                this.m_masterRenderer.end();
            }
        };
        LApplication.prototype.onResize = function () {
            var _self = LApplication.INSTANCE;
            if (_self.m_appWidth == _self.canvas.clientWidth &&
                _self.m_appHeight == _self.canvas.clientHeight) {
                return;
            }
            _self.canvas.width = _self.canvas.clientWidth;
            _self.canvas.height = _self.canvas.clientHeight;
            _self.m_appWidth = _self.canvas.width;
            _self.m_appHeight = _self.canvas.height;
            gl.viewport(0, 0, _self.m_appWidth, _self.m_appHeight);
            var _key;
            for (_key in _self.m_scenes) {
                _self.m_scenes[_key].onResize(_self.m_appWidth, _self.m_appHeight);
            }
            if (_self.m_userResizeCallback) {
                _self.m_userResizeCallback(_self.m_appWidth, _self.m_appHeight);
            }
        };
        LApplication.prototype.onShadersLoaded = function () {
            console.info('LApplication> finished loading shaders');
            var _self = LApplication.INSTANCE;
            _self.m_hasLoadedShaders = true;
        };
        LApplication.prototype.onTexturesLoaded = function () {
            console.info('LApplication> finished loading textures');
            var _self = LApplication.INSTANCE;
            _self.m_hasLoadedTextures = true;
        };
        LApplication.prototype.onModelsLoaded = function () {
            console.info('LApplication> finished loading models');
            var _self = LApplication.INSTANCE;
            _self.m_hasLoadedModels = true;
        };
        LApplication.prototype.onTextAssetsLoaded = function () {
            console.info('LApplication> finished loading text assets');
            var _self = LApplication.INSTANCE;
            _self.m_hasLoadedTextAssets = true;
        };
        LApplication.prototype.isReady = function () { return this.m_isReady; };
        LApplication.prototype.width = function () { return this.m_appWidth; };
        LApplication.prototype.height = function () { return this.m_appHeight; };
        return LApplication;
    }());
    core.LApplication = LApplication;
    ;
})(core || (core = {}));
