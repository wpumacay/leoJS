/// <reference path="../../Globals.ts" />
/// <reference path="../../LCommon.ts" />
var core;
(function (core) {
    var LTextAssetsManager = /** @class */ (function () {
        function LTextAssetsManager() {
            this.m_textAssets = {};
            this.m_batchLoadedCallback = null;
            this.m_isWorking = false;
        }
        LTextAssetsManager.prototype.getTextAsset = function (textId) {
            if (!this.m_textAssets[textId]) {
                console.warn('LTextAssetsManager> text with id ' +
                    textId + ' does not exist');
                return null;
            }
            return this.m_textAssets[textId];
        };
        LTextAssetsManager.prototype.loadBatch = function (textAssetsInfo, callback) {
            if (textAssetsInfo.length < 1) {
                callback();
                return;
            }
            this.m_batchLoadedCallback = callback;
            this.m_isWorking = true;
            for (var i = 0; i < textAssetsInfo.length; i++) {
                this._loadTextAsset(textAssetsInfo[i]);
            }
        };
        LTextAssetsManager.prototype._loadTextAsset = function (textAssetInfo) {
            var _self = this;
            this.m_textAssets[textAssetInfo.textId] = null;
            var _xhttp = new XMLHttpRequest();
            _xhttp['textAssetInfo'] = textAssetInfo;
            _xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    _self.m_textAssets[this['textAssetInfo']['textId']] = this.responseText;
                }
            };
            _xhttp.open('GET', textAssetInfo.filename, true);
            _xhttp.send();
        };
        LTextAssetsManager.prototype.update = function () {
            if (this.m_isWorking) {
                var _finishedLoading = true;
                var _key = void 0;
                for (_key in this.m_textAssets) {
                    if (this.m_textAssets[_key] == null) {
                        // Model still not loaded
                        _finishedLoading = false;
                    }
                }
                if (_finishedLoading) {
                    this.m_isWorking = false;
                    if (this.m_batchLoadedCallback) {
                        this.m_batchLoadedCallback();
                    }
                }
            }
        };
        return LTextAssetsManager;
    }());
    core.LTextAssetsManager = LTextAssetsManager;
})(core || (core = {}));
