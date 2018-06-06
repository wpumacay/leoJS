/// <reference path="../../Globals.ts" />
/// <reference path="LTexturesManager.ts" />
/// <reference path="LShadersManager.ts" />
/// <reference path="LModelsManager.ts" />
/// <reference path="LTextAssetsManager.ts" />
var core;
(function (core) {
    var LAssetsManager = /** @class */ (function () {
        function LAssetsManager() {
            this.m_texturesManager = new core.LTexturesManager();
            this.m_shadersManager = new core.LShadersManager();
            this.m_modelsManager = new core.LModelsManager();
            this.m_textAssetsManager = new core.LTextAssetsManager();
        }
        LAssetsManager.create = function () {
            if (!LAssetsManager.INSTANCE) {
                LAssetsManager.INSTANCE = new LAssetsManager();
            }
            return LAssetsManager.INSTANCE;
        };
        LAssetsManager.release = function () {
            // TODO: Release children here
            LAssetsManager.INSTANCE = null;
        };
        LAssetsManager.prototype.update = function () {
            this.m_texturesManager.update();
            this.m_shadersManager.update();
            this.m_modelsManager.update();
            this.m_textAssetsManager.update();
        };
        LAssetsManager.prototype.loadTextures = function (imgsInfo, texturesCallback) {
            this.m_texturesManager.loadBatch(imgsInfo, texturesCallback);
        };
        LAssetsManager.prototype.getTexture = function (textureId) {
            return this.m_texturesManager.getTexture(textureId);
        };
        LAssetsManager.prototype.loadShaders = function (shadersInfo, shadersCallback) {
            this.m_shadersManager.loadBatch(shadersInfo, shadersCallback);
        };
        LAssetsManager.prototype.getShader = function (shaderId) {
            return this.m_shadersManager.getShader(shaderId);
        };
        LAssetsManager.prototype.loadModels = function (modelsInfo, modelsCallback) {
            this.m_modelsManager.loadBatch(modelsInfo, modelsCallback);
        };
        LAssetsManager.prototype.getModel = function (modelId) {
            return this.m_modelsManager.getModel(modelId);
        };
        LAssetsManager.prototype.loadTextAssets = function (textAssetsInfo, textAssetsCallback) {
            this.m_textAssetsManager.loadBatch(textAssetsInfo, textAssetsCallback);
        };
        LAssetsManager.prototype.getTextAsset = function (textId) {
            return this.m_textAssetsManager.getTextAsset(textId);
        };
        LAssetsManager.INSTANCE = null;
        return LAssetsManager;
    }());
    core.LAssetsManager = LAssetsManager;
})(core || (core = {}));
