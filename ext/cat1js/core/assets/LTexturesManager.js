/// <reference path="../../Globals.ts" />
/// <reference path="../../LCommon.ts" />
/// <reference path="../data/LTexture.ts" />
var core;
(function (core) {
    var LTexturesManager = /** @class */ (function () {
        function LTexturesManager() {
            this.m_textures = {};
            this.m_batchLoadedCallback = null;
            this.m_numTexturesToLoad = 0;
            this.m_numTexturesLoaded = 0;
            this.m_isWorking = false;
        }
        LTexturesManager.prototype.loadBatch = function (imgsInfo, callback) {
            if (imgsInfo.length < 1) {
                callback();
                return;
            }
            this.m_batchLoadedCallback = callback;
            this.m_numTexturesToLoad = imgsInfo.length;
            this.m_numTexturesLoaded = 0;
            this.m_isWorking = true;
            var q;
            for (q = 0; q < imgsInfo.length; q++) {
                this._loadImage(imgsInfo[q]);
            }
        };
        LTexturesManager.prototype._loadImage = function (assetInfo) {
            var _self = this;
            this.m_textures[assetInfo.assetId] = new core.LTexture();
            this.m_textures[assetInfo.assetId].setTexAssetInfo(assetInfo);
            var _img = new Image();
            _img['assetInfo'] = assetInfo;
            _img.onload = function () {
                var _assetInfo = _img['assetInfo'];
                _self.m_textures[_assetInfo.assetId].setData(_img, gl.RGBA);
                _self.m_numTexturesLoaded++;
            };
            _img.src = assetInfo.fileName;
        };
        LTexturesManager.prototype.getTexture = function (textureId) {
            if (!this.m_textures[textureId]) {
                console.warn('LTexturesManager> texture with id ' +
                    textureId + ' does not exist');
                return null;
            }
            return this.m_textures[textureId];
        };
        LTexturesManager.prototype.update = function () {
            if (this.m_isWorking) {
                if (this.m_numTexturesToLoad == this.m_numTexturesLoaded) {
                    this.m_isWorking = false;
                    if (this.m_batchLoadedCallback) {
                        this.m_batchLoadedCallback();
                    }
                }
            }
        };
        return LTexturesManager;
    }());
    core.LTexturesManager = LTexturesManager;
})(core || (core = {}));
