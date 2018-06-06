/// <reference path="../LCommon.ts" />
var core;
(function (core) {
    var LApplicationData = /** @class */ (function () {
        function LApplicationData(assetsList, shadersList, modelsList, textAssetsList) {
            this.assets = assetsList;
            this.shaders = shadersList;
            this.models = modelsList;
            this.textAssets = textAssetsList;
        }
        return LApplicationData;
    }());
    core.LApplicationData = LApplicationData;
})(core || (core = {}));
